import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./rovan-brand.css";

const title = "Rovan（ロヴァン）— AI上の候補落ち・誤情報・競合変化を監視";
const description = "購入前の重要な質問をOpenAI・Gemini・Perplexityで観測し、候補落ち、AIの説明と公式情報の明確な食い違い、競合・参照元の変化を監視。問題時は修正案まで整理します。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | Rovan" },
  description,
  applicationName: BRAND.name,
  openGraph: { siteName: BRAND.name, type: "website", locale: "ja_JP", title, description, url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="alternate" type="application/json" href="/ai-index.json" title="Rovanの公開情報" /><link rel="alternate" type="text/plain" href="/llms.txt" title="RovanのAI向け公開情報" /></head><body>{children}<StructuredData /></body></html>;
}
