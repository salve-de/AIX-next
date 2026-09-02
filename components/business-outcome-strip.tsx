"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AgentAnalyticsSummary } from "@/lib/agent-analytics-store";

const sample: AgentAnalyticsSummary = {
  since: "2026-08-03T00:00:00.000Z",
  crawlerVisits: 142,
  referralVisits: 37,
  conversions: 5,
  observedValue: 420000,
  currency: "JPY",
  agents: [],
  pages: [],
  conversionTypes: [],
};

function valueLabel(value: number, currency: string | null) {
  if (!currency) return "—";
  try { return new Intl.NumberFormat("ja-JP", { style: "currency", currency, maximumFractionDigits: 0 }).format(value); }
  catch { return `${value.toLocaleString("ja-JP")} ${currency}`; }
}

export function BusinessOutcomeStrip() {
  const params = useSearchParams();
  const isSample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [summary, setSummary] = useState<AgentAnalyticsSummary | null>(isSample ? sample : null);
  const [connected, setConnected] = useState(isSample);

  useEffect(() => {
    if (isSample || !token) return;
    fetch(`/api/agent-analytics?token=${encodeURIComponent(token)}&days=30`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (data) { setSummary(data as AgentAnalyticsSummary); setConnected(true); } })
      .catch(() => undefined);
  }, [isSample, token]);

  const href = isSample ? "/workspace/agent-analytics?sample=1" : `/workspace/agent-analytics?token=${encodeURIComponent(token)}`;
  return <section className="business-strip">
    <div className="business-strip-head"><div><p>OBSERVED BUSINESS OUTCOMES</p><h2>Visibilityの先に、実AI流入があるか。</h2></div><Link href={href}>{connected ? "Agent Analyticsを開く" : "実イベントを接続する"} →</Link></div>
    {summary ? <div className="business-strip-grid">
      <article><small>AI crawler</small><strong>{summary.crawlerVisits}</strong><span>認識済みcrawler events</span></article>
      <article><small>AI referrals</small><strong>{summary.referralVisits}</strong><span>AI referrer events</span></article>
      <article><small>Conversions</small><strong>{summary.conversions}</strong><span>送信元でマークされた成果</span></article>
      <article><small>Observed value</small><strong>{valueLabel(summary.observedValue, summary.currency)}</strong><span>同一通貨のみ合算</span></article>
    </div> : <div className="business-strip-empty"><strong>実アクセスは未接続です。</strong><span>AIXはVisibilityから訪問数や売上を推測しません。サーバー/CDN/分析基盤の実イベントを接続するとここに表示します。</span></div>}
    <footer>AI referralとConversionの同時観測であり、AIX施策による因果的な売上増加を示すものではありません。</footer>
  </section>;
}
