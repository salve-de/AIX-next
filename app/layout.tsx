import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ux-refinement.css";
import "./status-refinement.css";
import "./instant-clarity.css";
import "./value-proposition.css";
import "./product-redesign.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — ChatGPTで競合に負けている質問がわかる", template: "%s | AIX" },
  description: "会社URLだけで、ChatGPT・Gemini・Perplexity上で自社が候補外になる比較質問、代わりに選ばれる競合、不足している公開情報、まず直すべき1件を診断し、改善後の変化まで追跡します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — ChatGPTで競合に負けている質問がわかる", description: "自社が候補外になる質問、選ばれた競合、負ける理由、直す内容、改善後の変化まで会社URLから確認します。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
