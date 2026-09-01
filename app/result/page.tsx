import { Suspense } from "react";
import { ResultClient } from "@/components/result-client";

export default function ResultPage() {
  return <Suspense fallback={<div className="full-loading">診断結果を読み込んでいます。</div>}><ResultClient /></Suspense>;
}
