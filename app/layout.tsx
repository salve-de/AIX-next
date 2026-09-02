import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ux-refinement.css";
import "./status-refinement.css";
import "./instant-clarity.css";
import "./value-proposition.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — ChatGPTで競合に先に選ばれる理由を診断", template: "%s | AIX" },
  description: "会社URLだけで、ChatGPT・Gemini・Perplexity上で自社が候補外になる購買質問、先に選ばれる競合、その理由、最優先の改善点を診断し、改善後の変化まで追跡します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — AI比較で競合に負けている質問を見つける", description: "買い手がAIに比較を聞く場面で、自社がどこで候補から外れ、何を直すべきか、改善後に結果が動いたかまで確認します。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#08121d", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
