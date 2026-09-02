import { Suspense } from "react";
import { WatchClientV3 } from "@/components/watch-client-v3";

export default function WatchPage() {
  return <Suspense fallback={<div className="full-loading">Watchを読み込んでいます。</div>}><WatchClientV3 /></Suspense>;
}
