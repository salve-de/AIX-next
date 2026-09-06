import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./rovan-brand.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Rovan（ロヴァン）— ChatGPTは、あなたの会社をスルーしてライバルを「おすすめ」しています。", template: "%s | Rovan" },
  description: "もう、新しい営業マンを雇う必要はありません。今のホームページの改修も、新たな開設も不要。社名を入れるだけでChatGPTなどのAIから自社がおすすめされる公式推薦データを即日配備。",
  applicationName: BRAND.name,
  openGraph: { siteName: BRAND.name, type: "website", locale: "ja_JP", title: "Rovan — ChatGPTは、あなたの会社をスルーしてライバルを「おすすめ」しています。", description: "もう、新しい営業マンを雇う必要はありません。今のホームページの改修も、新たな開設も不要。社名を入れるだけでChatGPTなどのAIから自社がおすすめされる公式推薦データを即日配備。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="alternate" type="application/json" href="/ai-index.json" title="Rovanの公開情報" /><link rel="alternate" type="text/plain" href="/llms.txt" title="RovanのAI向け公開情報" /></head><body>{children}<StructuredData /></body></html>;
}
