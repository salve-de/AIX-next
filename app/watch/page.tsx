import { Suspense } from "react";
import { WatchClient } from "@/components/watch-client";

export default function WatchPage() {
  return <Suspense fallback={<div className="full-loading">推薦結果を読み込んでいます。</div>}><WatchClient /></Suspense>;
}
