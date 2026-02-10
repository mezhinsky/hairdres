import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const SITE_URL = "https://www.olgadelova.ru";
const SITE_NAME = "Парикмахер Ольга Делова";
const DESCRIPTION =
  "Парикмахер-стилист Ольга Делова. Стрижки, окрашивание, балаяж, восстановление волос. Северное Бутово, Москва. Онлайн-запись на сайте.";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Парикмахер Ольга Делова | Стрижки, окрашивание, уход — Москва",
    template: "%s | Парикмахер Ольга Делова",
  },
  description: DESCRIPTION,
  keywords: [
    "парикмахер москва",
    "парикмахер северное бутово",
    "стрижка москва",
    "окрашивание волос москва",
    "балаяж москва",
    "мелирование",
    "укладка",
    "парикмахер ольга",
    "стилист москва",
    "онлайн запись парикмахер",
  ],
  authors: [{ name: "Ольга Делова" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Парикмахер Ольга Делова — стрижки, окрашивание, уход",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Парикмахер-стилист Ольга Делова — примеры работ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Парикмахер Ольга Делова — стрижки, окрашивание, уход",
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={roboto.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
