import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";
import { format, addDays } from "date-fns";

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
}

async function getBookingsForDate(date: string): Promise<string> {
  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select("*, service:services(name)")
    .eq("booking_date", date)
    .neq("status", "cancelled")
    .order("booking_time");

  if (error || !bookings?.length) {
    return `Записей на ${date} нет.`;
  }

  const lines = bookings.map((b) => {
    const tg = b.client_telegram ? ` | TG: ${b.client_telegram}` : "";
    return `${b.booking_time} — ${b.client_name} (${b.client_phone}${tg})\n  ${b.service?.name || "Услуга"}, ${b.duration_minutes} мин. [ID: ${b.id.slice(0, 8)}]`;
  });

  return `<b>Записи на ${date}:</b>\n\n${lines.join("\n\n")}`;
}

async function handleCommand(
  chatId: string,
  text: string
): Promise<string> {
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  if (text === "/today" || text === "/today@*") {
    return getBookingsForDate(today);
  }

  if (text === "/tomorrow" || text === "/tomorrow@*") {
    return getBookingsForDate(tomorrow);
  }

  if (text.startsWith("/bookings")) {
    const parts = text.split(" ");
    const date = parts[1] || today;
    return getBookingsForDate(date);
  }

  if (text.startsWith("/cancel")) {
    const parts = text.split(" ");
    const idPrefix = parts[1];
    if (!idPrefix) {
      return "Использование: /cancel [id]\nID можно узнать из команды /today или /bookings";
    }

    const { data: bookings } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .neq("status", "cancelled");

    const booking = bookings?.find((b) => b.id.startsWith(idPrefix));
    if (!booking) {
      return `Запись с ID ${idPrefix}... не найдена.`;
    }

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", booking.id);

    if (error) {
      return "Ошибка при отмене записи.";
    }

    return `Запись отменена:\n${booking.booking_date} ${booking.booking_time} — ${booking.client_name}`;
  }

  if (text === "/help" || text === "/start") {
    return (
      "<b>Команды:</b>\n\n" +
      "/today — записи на сегодня\n" +
      "/tomorrow — записи на завтра\n" +
      "/bookings [дата] — записи на дату (YYYY-MM-DD)\n" +
      "/cancel [id] — отменить запись\n" +
      "/help — эта справка"
    );
  }

  return 'Неизвестная команда. Введите /help для справки.';
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();
    const message = update.message;

    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);

    // Only respond to admins
    if (ADMIN_CHAT_ID) {
      const adminIds = ADMIN_CHAT_ID.split(",").map((id) => id.trim());
      if (!adminIds.includes(chatId)) {
        return NextResponse.json({ ok: true });
      }
    }

    const reply = await handleCommand(chatId, message.text.trim());
    await sendTelegramMessage(chatId, reply);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
