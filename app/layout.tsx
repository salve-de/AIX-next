import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ux-refinement.css";
import "./status-refinement.css";
import "./instant-clarity.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — ChatGPTで自社は競合何社中何位か", template: "%s | AIX" },
  description: "会社URLを入れるだけで、ChatGPT・Gemini・Perplexity上の競合順位、候補外になった購買質問、代わりに選ばれる競合、その理由を診断します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — ChatGPTで自社は競合何社中何位か", description: "AIに『おすすめの会社は？』と聞かれたとき、自社が候補に入るか、誰に負けるか、その理由まで診断します。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#08121d", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
