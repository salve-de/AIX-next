import type { Metadata } from "next";
import { Suspense } from "react";
import { WatchClient } from "@/components/watch-client";

export const metadata: Metadata = { title: "継続モニタリング", robots: { index: false, follow: false, noarchive: true } };

export default function WatchPage() {
  return <Suspense fallback={<div className="full-loading">モニタリング結果を読み込んでいます。</div>}><WatchClient /></Suspense>;
}
