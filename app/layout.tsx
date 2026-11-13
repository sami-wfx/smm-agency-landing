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
      <body>{children}</body>
    </html>
  );
}
