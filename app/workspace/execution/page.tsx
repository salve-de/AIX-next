import { Suspense } from "react";
import { ExecutionCenterClient } from "@/components/execution-center-client";

export default function ExecutionCenterPage() {
  return <Suspense fallback={<main className="execution-loading">Execution Centerを読み込んでいます。</main>}><ExecutionCenterClient /></Suspense>;
}
