"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, BotIcon, NetworkIcon, TrendIcon } from "@/components/icons";
import type { AgentAnalyticsSummary } from "@/lib/agent-analytics-store";

const sampleSummary: AgentAnalyticsSummary = {
  since: "2026-08-03T00:00:00.000Z", crawlerVisits: 142, referralVisits: 37, conversions: 5, observedValue: 420000, currency: "JPY",
  agents: [
    { agent: "OAI-SearchBot", kind: "crawler", events: 64, conversions: 0, observedValue: 0 },
    { agent: "PerplexityBot", kind: "crawler", events: 41, conversions: 0, observedValue: 0 },
    { agent: "Googlebot", kind: "crawler", events: 37, conversions: 0, observedValue: 0 },
    { agent: "ChatGPT", kind: "referral", events: 24, conversions: 4, observedValue: 360000 },
    { agent: "Perplexity", kind: "referral", events: 9, conversions: 1, observedValue: 60000 },
    { agent: "Gemini", kind: "referral", events: 4, conversions: 0, observedValue: 0 },
  ],
  pages: [
    { path: "/pricing", crawlerVisits: 23, referralVisits: 9, conversions: 2, observedValue: 180000 },
    { path: "/security", crawlerVisits: 31, referralVisits: 4, conversions: 0, observedValue: 0 },
    { path: "/case/enterprise", crawlerVisits: 28, referralVisits: 8, conversions: 2, observedValue: 180000 },
    { path: "/", crawlerVisits: 21, referralVisits: 11, conversions: 1, observedValue: 60000 },
  ],
  conversionTypes: [{ type: "demo_request", conversions: 4, observedValue: 360000 }, { type: "signup", conversions: 1, observedValue: 60000 }],
};

function money(value: number, currency: string | null) {
  if (!currency) return "—";
  try { return new Intl.NumberFormat("ja-JP", { style: "currency", currency, maximumFractionDigits: 0 }).format(value); }
  catch { return `${value.toLocaleString("ja-JP")} ${currency}`; }
}

export function AgentAnalyticsClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const legacyToken = params.get("token") || "";
  const [summary, setSummary] = useState<AgentAnalyticsSummary | null>(sample ? sampleSummary : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [key, setKey] = useState(sample ? "aix_ingest_SAMPLE_ONLY" : "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sample) return;
    const endpoint = legacyToken ? `/api/agent-analytics?token=${encodeURIComponent(legacyToken)}&days=30` : "/api/agent-analytics?days=30";
    fetch(endpoint, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Agent Analyticsを取得できませんでした。"); setSummary(data); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "取得できませんでした."))
      .finally(() => setLoading(false));
  }, [sample, legacyToken]);

  async function rotate() {
    if (sample) { setKey("aix_ingest_SAMPLE_ROTATED_KEY"); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/agent-analytics/key", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: legacyToken }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Keyを発行できませんでした。");
      setKey(data.ingestKey);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Keyを発行できませんでした."); }
    finally { setBusy(false); }
  }
  const back = sample ? "/workspace?sample=1" : "/workspace";

  return <main className="agent-page">
    <header><Link href={back}>← AIX Workspace</Link><span>OBSERVED BUSINESS LAYER</span></header>
    <section className="agent-hero"><div><p>AGENT + REFERRAL ANALYTICS</p><h1>AIが「読んだ」から、<br />AI経由で「成果が出た」まで。</h1><span>推測値ではなく、サーバー/CDN/分析基盤から送られた実イベントだけを集計します。Visibility改善がConversionを生んだとは断定しません。</span></div><NetworkIcon /></section>
    {loading ? <div className="agent-loading">実イベントを読み込んでいます。</div> : null}
    {summary ? <>
      <section className="agent-kpis"><article><BotIcon /><small>AI crawler visits</small><strong>{summary.crawlerVisits}</strong><span>実crawler event</span></article><article><ArrowIcon /><small>AI referral visits</small><strong>{summary.referralVisits}</strong><span>AI referrer event</span></article><article><TrendIcon /><small>Observed conversions</small><strong>{summary.conversions}</strong><span>送信側で記録された成果</span></article><article><TrendIcon /><small>Observed value</small><strong>{money(summary.observedValue, summary.currency)}</strong><span>{summary.currency ? "同一通貨だけを合算" : "複数通貨は合算しない"}</span></article></section>
      <section className="agent-grid"><article><header><strong>Agents / Referrers</strong><span>event / conversion / value</span></header>{summary.agents.map((item) => <div className="agent-row" key={`${item.kind}-${item.agent}`}><span className={item.kind}>{item.kind}</span><strong>{item.agent}</strong><i><b style={{ width: `${Math.min(100, item.events / Math.max(1, summary.crawlerVisits + summary.referralVisits) * 180)}%` }} /></i><em>{item.events}</em><small>{item.conversions ? `${item.conversions} conv. · ${money(item.observedValue, summary.currency)}` : ""}</small></div>)}</article><article><header><strong>Top landing pages</strong><span>crawler / referral / conversion</span></header>{summary.pages.map((page) => <div className="agent-page-row" key={page.path}><strong>{page.path}</strong><span>{page.crawlerVisits}</span><span>{page.referralVisits}</span><span>{page.conversions}</span><small>{page.observedValue ? money(page.observedValue, summary.currency) : ""}</small></div>)}</article></section>
      {summary.conversionTypes.length ? <section className="agent-setup"><div><p>OBSERVED OUTCOMES</p><h2>AI referral後に記録された成果。</h2><span>これは送信元の計測系がAI referral eventに付与した観測結果です。AIXの施策による因果効果とは表示しません。</span></div><article>{summary.conversionTypes.map((item) => <div className="agent-page-row" key={item.type}><strong>{item.type}</strong><span>{item.conversions} conversions</span><span>{money(item.observedValue, summary.currency)}</span></div>)}</article></section> : null}
    </> : null}
    <section className="agent-setup"><div><p>CONNECT REAL EVENTS</p><h2>Ingest keyを1つ発行する。</h2><span>Raw IP・氏名・メール・決済情報は不要です。User-Agent、path、referrer、statusと、任意の非PII成果ラベル・金額だけ送れます。</span></div><article><button onClick={rotate} disabled={busy}>{busy ? "発行中…" : key ? "Ingest keyを再発行" : "Ingest keyを発行"}</button>{key ? <><small>今回だけ表示</small><code>{key}</code><pre>{`POST /api/agent-analytics/ingest\nX-AIX-Ingest-Key: ${key}\n\n{\n  "events": [{\n    "occurredAt": "2026-09-02T00:00:00Z",\n    "userAgent": "Mozilla/5.0",\n    "path": "/pricing",\n    "referrer": "https://chatgpt.com/",\n    "statusCode": 200,\n    "conversion": true,\n    "conversionType": "demo_request",\n    "conversionValue": 90000,\n    "currency": "JPY"\n  }]\n}`}</pre></> : <p>接続するまでAgent Analyticsは0件のままです。AIXが訪問数・Conversion・Revenueを推測して埋めることはありません。</p>}</article></section>
    {error ? <div className="agent-error">{error}</div> : null}
  </main>;
}
