import { Suspense } from "react";
import { ScanClient } from "@/components/scan-client";

export const metadata = { title: "AI市場を作成中", robots: { index: false, follow: false } };

export default function ScanPage() {
  return <Suspense fallback={<main className="scan-page"><div className="error-page"><p>診断を準備しています。</p></div></main>}><ScanClient /></Suspense>;
}
