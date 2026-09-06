import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/structured-data";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./rovan-brand.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Rovan（ロヴァン）— AI回答と公開情報を確認する", template: "%s | Rovan" },
  description: "URLまたは社名から、AI回答と参照元付きの公開情報を確認できます。自社サイトを改修せず、公開プロフィールは内容を確認してから公開します。",
  applicationName: BRAND.name,
  openGraph: { siteName: BRAND.name, type: "website", locale: "ja_JP", title: "Rovan — AI回答と公開情報を確認する", description: "URLまたは社名から、AI回答と参照元付きの公開情報を確認できます。推薦・順位・売上の改善は保証しません。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja" data-scroll-behavior="smooth"><head><link rel="alternate" type="application/json" href="/ai-index.json" title="Rovanの公開情報" /><link rel="alternate" type="text/plain" href="/llms.txt" title="RovanのAI向け公開情報" /></head><body>{children}<StructuredData /></body></html>;
}
