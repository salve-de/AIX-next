import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIX — AIの推薦候補から外れる理由を見つける", template: "%s | AIX" },
  description: "会社URLだけで、AIが比較するBuyer Prompt、選ばれる競合、引用される根拠、不足Evidenceを可視化し、継続追跡します。",
  applicationName: "AIX",
  openGraph: { type: "website", locale: "ja_JP", siteName: "AIX", title: "AIX — AIの推薦候補から外れる理由を見つける", description: "AI比較で誰に・どの質問で・なぜ負けているかを無料で診断。", url: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#07101f", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
