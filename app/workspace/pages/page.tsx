import { Suspense } from "react";
import { PageIntelligenceClient } from "@/components/page-intelligence-client";

export default function PageIntelligencePage() {
  return <Suspense fallback={<main className="page-intel-loading">Page Intelligenceを読み込んでいます。</main>}><PageIntelligenceClient /></Suspense>;
}
