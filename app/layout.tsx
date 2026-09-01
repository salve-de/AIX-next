import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./v3.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — AI Buyer Intelligence OS", template: "%s | AIX" },
  description: "会社URLだけで、AI Visibility、Buyer Prompt、Recommendation、Citation、競合、比較材料、Change Pack、再観測まで一つのProjectで管理します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — AIが誰を薦め、なぜ自社を外すかを一つで管理", description: "AI購買面の観測から改善・再観測までを統合するBuyer Intelligence OS。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#08121d", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
