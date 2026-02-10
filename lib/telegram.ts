type InlineButton = { text: string; callback_data: string };
type InlineKeyboard = InlineButton[][];

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  keyboard?: InlineKeyboard
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN not set, skipping message");
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };

  if (keyboard) {
    payload.reply_markup = { inline_keyboard: keyboard };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.text();
    if (!res.ok) console.error("Telegram API error:", res.status, data);

    return res.ok;
  } catch (error) {
    console.error("Telegram fetch error:", error);
    return false;
  }
}

export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendBookingNotification(booking: {
  client_name: string;
  client_phone: string;
  client_telegram?: string;
  booking_date: string;
  booking_time: string;
  service_name: string;
  duration_minutes: number;
}): Promise<boolean> {
  const chatIds = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!chatIds) {
    console.warn("TELEGRAM_ADMIN_CHAT_ID not set, skipping notification");
    return false;
  }

  const tgLine = booking.client_telegram
    ? `\n<b>Telegram:</b> ${booking.client_telegram}`
    : "";

  const message =
    `<b>Новая запись!</b>\n\n` +
    `<b>Клиент:</b> ${booking.client_name}\n` +
    `<b>Телефон:</b> ${booking.client_phone}` +
    tgLine +
    `\n<b>Услуга:</b> ${booking.service_name}\n` +
    `<b>Дата:</b> ${booking.booking_date}\n` +
    `<b>Время:</b> ${booking.booking_time}\n` +
    `<b>Длительность:</b> ${booking.duration_minutes} мин.`;

  const ids = chatIds.split(",").map((id) => id.trim());
  const results = await Promise.all(
    ids.map((id) => sendTelegramMessage(id, message))
  );

  return results.every(Boolean);
}
