import { Suspense } from "react";
import { CompetitorMovers } from "@/components/competitor-movers";
import { WatchClientV4 } from "@/components/watch-client-v4";

export default function WatchPage() {
  return <Suspense fallback={<div className="full-loading">Watchを読み込んでいます。</div>}><WatchClientV4 /><CompetitorMovers /></Suspense>;
}
