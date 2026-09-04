import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — ChatGPTは、あなたの会社をスルーしてライバルを「おすすめ」しています。", template: "%s | AIX" },
  description: "もう、新しい営業マンを雇う必要はありません。自社サイト改修ゼロ・ブログ更新ゼロ。社名を入れるだけでChatGPTなどの生成AIから優先推薦されやすい環境を整える公式台帳を自動配備。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — ChatGPTは、あなたの会社をスルーしてライバルを「おすすめ」しています。", description: "もう、新しい営業マンを雇う必要はありません。自社サイト改修ゼロ・ブログ更新ゼロ。社名を入れるだけでChatGPTなどの生成AIから優先推薦されやすい環境を整える公式台帳を自動配備。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="alternate" type="application/json" href="/ai-index.json" title="AIXの公開情報" /><link rel="alternate" type="text/plain" href="/llms.txt" title="AIXのAI向け公開情報" /></head><body>{children}<StructuredData /></body></html>;
}
