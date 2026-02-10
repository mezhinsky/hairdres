import https from "node:https";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

function telegramRequest(
  method: string,
  body: Record<string, unknown>
): Promise<boolean> {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${TELEGRAM_BOT_TOKEN}/${method}`,
        method: "POST",
        family: 4,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      }
    );
    req.on("error", (err) => {
      console.error("Telegram request error:", err.message);
      resolve(false);
    });
    req.write(data);
    req.end();
  });
}

export async function sendTelegramMessage(
  chatId: string,
  text: string
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("TELEGRAM_BOT_TOKEN not set, skipping message");
    return false;
  }

  return telegramRequest("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
}

export async function sendBookingNotification(booking: {
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  service_name: string;
  duration_minutes: number;
}): Promise<boolean> {
  if (!TELEGRAM_ADMIN_CHAT_ID) {
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

  return sendTelegramMessage(TELEGRAM_ADMIN_CHAT_ID, message);
}
