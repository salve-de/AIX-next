import { Suspense } from "react";
import { AgentAnalyticsClient } from "@/components/agent-analytics-client";

export default function AgentAnalyticsPage() {
  return <Suspense fallback={<main className="agent-loading">Agent Analyticsを読み込んでいます。</main>}><AgentAnalyticsClient /></Suspense>;
}
