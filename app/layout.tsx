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
    title: "Каталог искусственных елей | В наличии",
    description: "Каталог искусственных елей: размеры, цены и остатки.",
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: "Каталог елей",
      description: "Живые фото, цены и наличие.",
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
