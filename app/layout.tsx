import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ux-refinement.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — AI shortlist intelligence for B2B", template: "%s | AIX" },
  description: "会社URLだけで、AIの購入候補に入る質問、競合、Citation、不足Evidenceを調べて継続追跡します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", title: "AIX — AI比較で候補から外れる理由を特定", description: "AIが競合を選び、自社を候補外にしたBuyer PromptとEvidence差を調べます。", url: "/" },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#08121d", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
