import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendTelegramMessage, answerCallbackQuery } from "@/lib/telegram";
import { format, addDays } from "date-fns";

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message?: { chat: { id: number } };
    data?: string;
  };
}

const MAIN_MENU = [
  [
    { text: "Сегодня", callback_data: "cmd_today" },
    { text: "Завтра", callback_data: "cmd_tomorrow" },
  ],
  [
    { text: "Все записи", callback_data: "cmd_bookings" },
    { text: "Помощь", callback_data: "cmd_help" },
  ],
];

async function getBookingsForDate(date: string, withCancelButtons = false) {
  const { data: bookings, error } = await supabaseAdmin
    .from("bookings")
    .select("*, service:services(name)")
    .eq("booking_date", date)
    .neq("status", "cancelled")
    .order("booking_time");

  if (error || !bookings?.length) {
    return {
      text: `Записей на ${date} нет.`,
      keyboard: [
        [{ text: "Меню", callback_data: "cmd_menu" }],
      ],
    };
  }

  const lines = bookings.map((b) => {
    const tg = b.client_telegram ? ` | TG: ${b.client_telegram}` : "";
    return `${b.booking_time} — ${b.client_name} (${b.client_phone}${tg})\n  ${b.service?.name || "Услуга"}, ${b.duration_minutes} мин.`;
  });

  const text = `<b>Записи на ${date}:</b>\n\n${lines.join("\n\n")}`;

  const keyboard = withCancelButtons
    ? [
        ...bookings.map((b) => [
          {
            text: `Отменить ${b.booking_time} — ${b.client_name}`,
            callback_data: `cancel_${b.id.slice(0, 8)}`,
          },
        ]),
        [{ text: "Меню", callback_data: "cmd_menu" }],
      ]
    : [
        [
          { text: "Отменить запись...", callback_data: `cancellist_${date}` },
          { text: "Меню", callback_data: "cmd_menu" },
        ],
      ];

  return { text, keyboard };
}

async function handleCancel(idPrefix: string) {
  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .neq("status", "cancelled");

  const booking = bookings?.find((b) => b.id.startsWith(idPrefix));
  if (!booking) {
    return {
      text: `Запись не найдена.`,
      keyboard: [[{ text: "Меню", callback_data: "cmd_menu" }]],
    };
  }

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", booking.id);

  if (error) {
    return {
      text: "Ошибка при отмене записи.",
      keyboard: [[{ text: "Меню", callback_data: "cmd_menu" }]],
    };
  }

  return {
    text: `Запись отменена:\n${booking.booking_date} ${booking.booking_time} — ${booking.client_name}`,
    keyboard: [[{ text: "Меню", callback_data: "cmd_menu" }]],
  };
}

function getHelpText() {
  return {
    text:
      "<b>Управление записями</b>\n\n" +
      "Используйте кнопки ниже или команды:\n\n" +
      "/today — записи на сегодня\n" +
      "/tomorrow — записи на завтра\n" +
      "/bookings [дата] — записи на дату\n" +
      "/cancel [id] — отменить запись",
    keyboard: MAIN_MENU,
  };
}

async function handleTextCommand(text: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  if (text === "/today") return getBookingsForDate(today);
  if (text === "/tomorrow") return getBookingsForDate(tomorrow);

  if (text.startsWith("/bookings")) {
    const date = text.split(" ")[1] || today;
    return getBookingsForDate(date);
  }

  if (text.startsWith("/cancel")) {
    const idPrefix = text.split(" ")[1];
    if (!idPrefix) {
      return {
        text: "Нажмите кнопку ниже, чтобы посмотреть записи и отменить нужную.",
        keyboard: MAIN_MENU,
      };
    }
    return handleCancel(idPrefix);
  }

  if (text === "/start" || text === "/help" || text === "/menu") {
    return getHelpText();
  }

  return {
    text: "Выберите действие:",
    keyboard: MAIN_MENU,
  };
}

async function handleCallback(data: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  if (data === "cmd_today") return getBookingsForDate(today);
  if (data === "cmd_tomorrow") return getBookingsForDate(tomorrow);
  if (data === "cmd_bookings") return getBookingsForDate(today);
  if (data === "cmd_help" || data === "cmd_menu") return getHelpText();

  if (data.startsWith("cancellist_")) {
    const date = data.replace("cancellist_", "");
    return getBookingsForDate(date, true);
  }

  if (data.startsWith("cancel_")) {
    const idPrefix = data.replace("cancel_", "");
    return handleCancel(idPrefix);
  }

  return { text: "Выберите действие:", keyboard: MAIN_MENU };
}

function isAdmin(chatId: string): boolean {
  if (!ADMIN_CHAT_ID) return true;
  const adminIds = ADMIN_CHAT_ID.split(",").map((id) => id.trim());
  return adminIds.includes(chatId);
}

export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json();

    // Handle callback queries (button presses)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = String(cb.message?.chat.id || cb.from.id);

      if (!isAdmin(chatId)) return NextResponse.json({ ok: true });

      await answerCallbackQuery(cb.id);

      if (cb.data) {
        const result = await handleCallback(cb.data);
        await sendTelegramMessage(chatId, result.text, result.keyboard);
      }

      return NextResponse.json({ ok: true });
    }

    // Handle text messages
    const message = update.message;
    if (!message?.text) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    if (!isAdmin(chatId)) return NextResponse.json({ ok: true });

    const result = await handleTextCommand(message.text.trim());
    await sendTelegramMessage(chatId, result.text, result.keyboard);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
