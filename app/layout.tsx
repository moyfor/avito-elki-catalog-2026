import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: "Ёлки Тут — каталог искусственных елей",
    description: "Ёлки Тут — мобильный каталог искусственных елей: актуальные высоты, цены, характеристики, реальные фото и видео в одном месте.",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Ёлки Тут — каталог искусственных елей",
      description: "Выберите модель и высоту — цены, характеристики, реальные фото и видео собраны в одном каталоге.",
      images: [{ url: "/og.png", width: 1800, height: 1005, alt: "Каталог искусственных елей" }],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
