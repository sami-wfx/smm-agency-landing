import type { Metadata, Viewport } from "next";
import "./globals.css";
import { asset } from "@/lib/asset";

const title = "TRIOCRASH — Reels-продакшн и бренд-продюсеры в Таджикистане";

export const metadata: Metadata = {
  title,
  description:
    "TRIOCRASH — команда Reels-продюсеров и бренд-продюсеров в Таджикистане. Снимаем на Sony FX30 и ведём бизнес с нуля до узнаваемости.",
  icons: { icon: asset("favicon.png") },
  openGraph: {
    title,
    description:
      "Мы не SMM-щики — мы Reels-продюсеры и бренд-продюсеры. Снимаем на Sony FX30, ведём бизнес с нуля до узнаваемости.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- app router: шрифты подключаются один раз в корневом layout */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800;900&family=Nunito:wght@500;700;800&family=JetBrains+Mono:wght@500;700&display=swap&subset=cyrillic,latin"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
