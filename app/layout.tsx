import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ux-refinement.css";
import "./status-refinement.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — AI検索で、あなたの会社は何社中何位か", template: "%s | AIX" },
  description: "会社URLだけで、AI比較での順位、候補外になった購買質問、先に選ばれた競合、Citation、不足Evidence、最優先Actionを測定します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — AI検索で、あなたの会社は何社中何位か", description: "ChatGPTなどで競合が選ばれている購買質問と、自社が候補から外れる理由まで測定します。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#08121d", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
