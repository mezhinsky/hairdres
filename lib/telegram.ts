import { execFile } from "node:child_process";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

function telegramRequest(
  method: string,
  body: Record<string, unknown>
): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
    const data = JSON.stringify(body);

    execFile(
      "curl",
      ["-4", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST",
       "-H", "Content-Type: application/json",
       "-d", data,
       "--connect-timeout", "10",
       url],
      (error, stdout) => {
        if (error) {
          console.error("Telegram curl error:", error.message);
          resolve(false);
          return;
        }
        resolve(stdout.trim() === "200");
      }
    );
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
