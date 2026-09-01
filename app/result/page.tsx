import { Suspense } from "react";
import { ResultClientV3 } from "@/components/result-client-v3";

export default function ResultPage() {
  return <Suspense fallback={<div className="full-loading">診断結果を読み込んでいます。</div>}><ResultClientV3 /></Suspense>;
}
