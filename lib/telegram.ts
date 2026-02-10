export async function sendTelegramMessage(
  chatId: string,
  text: string
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("TELEGRAM_BOT_TOKEN not set, skipping message");
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" });

  console.log("Telegram: sending to chat", chatId, "token length:", token.length);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await res.text();
    console.log("Telegram response:", res.status, data);

    return res.ok;
  } catch (error) {
    console.error("Telegram fetch error:", error);
    return false;
  }
}

export async function sendBookingNotification(booking: {
  client_name: string;
  client_phone: string;
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

  const message =
    `<b>Новая запись!</b>\n\n` +
    `<b>Клиент:</b> ${booking.client_name}\n` +
    `<b>Телефон:</b> ${booking.client_phone}\n` +
    `<b>Услуга:</b> ${booking.service_name}\n` +
    `<b>Дата:</b> ${booking.booking_date}\n` +
    `<b>Время:</b> ${booking.booking_time}\n` +
    `<b>Длительность:</b> ${booking.duration_minutes} мин.`;

  const ids = chatIds.split(",").map((id) => id.trim());
  const results = await Promise.all(
    ids.map((id) => sendTelegramMessage(id, message))
  );

  return results.every(Boolean);
}
