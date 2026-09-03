import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — AIがあなたの会社を勧めない理由を見つける", template: "%s | AIX" },
  description: "会社名・サービス名・商品名・URLから、AIが競合を先に勧めた質問と、その理由、まず直す1か所を確認します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — AIがあなたの会社を勧めない理由を見つける", description: "AIが競合を先に勧めた質問、選ばれた理由、まず直す1か所を会社名やURLから確認します。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="alternate" type="application/json" href="/ai-index.json" title="AIXの公開情報" /><link rel="alternate" type="text/plain" href="/llms.txt" title="AIXのAI向け公開情報" /></head><body>{children}<StructuredData /></body></html>;
}
