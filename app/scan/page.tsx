import type { Metadata } from "next";
import { Suspense } from "react";
import { ScanProgress } from "@/components/scan-progress";

export const metadata: Metadata = { title: "診断先を確認", robots: { index: false, follow: false, noarchive: true } };

export default function ScanPage() {
  return <Suspense fallback={<div className="full-loading">Rovanを準備しています。</div>}><ScanProgress /></Suspense>;
}
