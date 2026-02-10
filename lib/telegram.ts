import { spawn } from "node:child_process";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

function telegramRequest(
  method: string,
  body: Record<string, unknown>
): Promise<boolean> {
  return new Promise((resolve) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
    const data = JSON.stringify(body);

    console.log("Telegram: sending to", url.replace(TELEGRAM_BOT_TOKEN!, "***"));
    const proc = spawn("/usr/bin/curl", [
      "-4", "-s", "-v", "-o", "/dev/null", "-w", "%{http_code}",
      "-X", "POST",
      "-H", "Content-Type: application/json",
      "-d", "@-",
      "--connect-timeout", "10",
      url,
    ]);

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (chunk) => (stdout += chunk));
    proc.stderr.on("data", (chunk) => (stderr += chunk));

    proc.on("close", (code) => {
      if (code !== 0) {
        console.error("Telegram curl exit code:", code, "stderr:", stderr, "url:", url.replace(TELEGRAM_BOT_TOKEN!, "BOT_TOKEN"));
        resolve(false);
        return;
      }
      resolve(stdout.trim() === "200");
    });

    proc.on("error", (err) => {
      console.error("Telegram spawn error:", err.message);
      resolve(false);
    });

    proc.stdin.write(data);
    proc.stdin.end();
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
