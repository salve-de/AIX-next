import { Suspense } from "react";
import { ScanProgress } from "@/components/scan-progress";

export default function ScanPage() {
  return <Suspense fallback={<div className="full-loading">Rovanを準備しています。</div>}><ScanProgress /></Suspense>;
}
