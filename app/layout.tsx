import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./rovan-brand.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Rovan（ロヴァン）— 専門性でAIのおすすめ獲得を目指す", template: "%s | Rovan" },
  description: "大手に埋もれず、御社の専門性でAIの推薦候補へ。URLまたは社名から診断・公開情報の整備・継続測定まで、自社サイト改修なしで取り組めます。",
  applicationName: BRAND.name,
  openGraph: { siteName: BRAND.name, type: "website", locale: "ja_JP", title: "Rovan — 専門性でAIのおすすめ獲得を目指す", description: "大手に埋もれず、御社の専門性でAIの推薦候補へ。URLまたは社名から診断・公開情報の整備・継続測定まで、自社サイト改修なしで取り組めます。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="alternate" type="application/json" href="/ai-index.json" title="Rovanの公開情報" /><link rel="alternate" type="text/plain" href="/llms.txt" title="RovanのAI向け公開情報" /></head><body>{children}<StructuredData /></body></html>;
}
