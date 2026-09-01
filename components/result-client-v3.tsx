"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand } from "@/components/brand";
import { buildCitationIntelligence } from "@/lib/intelligence";
import { sampleResult } from "@/lib/sample-data";
import type { Observation, ProviderName, ScanRecord, ScanResult } from "@/lib/types";

function providerLabel(provider: ProviderName) { return provider === "openai" ? "OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity"; }
function formatDate(value: string) { return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value)); }

export function ResultClientV3() {
  const params = useSearchParams();
  const router = useRouter();
  const sample = params.get("sample") === "1";
  const scanId = params.get("id") || "";
  const [result, setResult] = useState<ScanResult | null>(sample ? sampleResult : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [open, setOpen] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sample) return;
    if (!scanId) { setError("診断IDがありません。"); setLoading(false); return; }
    fetch(`/api/scans/${encodeURIComponent(scanId)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as ScanRecord & { error?: string };
        if (!response.ok) throw new Error(data.error || "診断結果を取得できませんでした。");
        if (!data.result) throw new Error(data.error || "診断はまだ完了していません。");
        setResult(data.result);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "診断結果を取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, scanId]);

  const citations = useMemo(() => result ? buildCitationIntelligence(result) : [], [result]);
  const providerHealth = useMemo(() => {
    if (!result) return [];
    return (["openai", "gemini", "perplexity"] as ProviderName[]).map((provider) => {
      const rows = result.observations.filter((item) => item.provider === provider);
      const success = rows.filter((item) => item.status === "success");
      return { provider, success: success.length, total: rows.length, own: success.filter((item) => item.ownRecommended).length };
    });
  }, [result]);

  async function startWatch(event: FormEvent) {
    event.preventDefault();
    if (sample) { router.push("/watch?sample=1"); return; }
    if (!scanId) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/watch", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scanId, email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Watchを開始できませんでした。");
      router.push(`/watch?token=${encodeURIComponent(data.token)}`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Watchを開始できませんでした。"); }
    finally { setBusy(false); }
  }

  if (loading) return <main className="workspace-loading">診断結果を読み込んでいます。</main>;
  if (!result) return <main className="workspace-loading"><strong>診断結果を表示できません。</strong><p>{error}</p><Link href="/">URL入力へ戻る</Link></main>;

  const primaryLoss = result.lostPrompts[0];
  const topCompetitor = result.competitors[0];
  const topGap = result.evidenceGaps[0];
  const firstAction = result.actions[0];
  const prompt = primaryLoss ? result.prompts.find((item) => item.id === primaryLoss.promptId) : null;
  const hasMeasurement = result.successfulObservations > 0;
  const ownedCitations = citations.filter((row) => row.kind === "owned").reduce((sum, row) => sum + row.citations, 0);

  return <main className="r3">
    <section className="r3-hero"><div className="r3-shell"><div style={{ marginBottom: 28 }}><Brand /></div><div className="r3-hero-grid"><div><p className="r3-eyebrow">{sample ? "FICTIONAL SAMPLE · AI BUYER MARKET SCAN" : "AI BUYER MARKET SCAN"}</p>{hasMeasurement ? <><h1>{result.prompts.length}の購買テーマ中、<br /><span>{result.lostPrompts.length}テーマで候補外。</span></h1><p>{result.discovery.brandName}が「見えているか」だけではなく、購入候補として選ばれたかをOpenAI・Gemini・Perplexityで観測しました。最初に、最も大きい取りこぼしと比較材料の不足を見ます。</p></> : <><h1>市場の特定は完了。<br /><span>AI観測は未完了です。</span></h1><p>Provider設定後に同じBuyer Promptを観測します。失敗回答を自社の負けとして数えることはありません。</p></>}</div><div className="r3-hero-summary"><article><small>MOST FREQUENT REPLACEMENT</small><strong>{topCompetitor?.name || primaryLoss?.winner || "未特定"}</strong><span>{topCompetitor ? `${topCompetitor.coverage}%の成功回答で候補入り` : "有効な競合観測待ち"}</span></article><article><small>TOP MISSING COMPARISON MATERIAL</small><strong>{topGap?.label || "重大な不足は未確認"}</strong><span>{topGap ? `${topGap.relatedPromptCount}件の追跡Promptと関連` : "—"}</span></article><article><small>MEASUREMENT COMPLETENESS</small><strong>{result.measurementCompleteness}%</strong><span>{result.successfulObservations}/{result.scheduledObservations} observations successful</span></article></div></div><div className="r3-meta"><span>{result.discovery.market}</span><span>{result.panel.promptCount} Buyer Prompts</span><span>{result.panel.repetitions} repetition{result.panel.repetitions === 1 ? "" : "s"}</span><span>OpenAI / Gemini / Perplexity</span><span>ja-JP · JP</span><span>{formatDate(result.measuredAt)}</span></div>{result.warnings.map((warning) => <p className="r3-warning" key={warning}>{warning}</p>)}</div></section>

    <section className="r3-section white"><div className="r3-shell"><div className="r3-head"><div><p>01 · BIGGEST BUYER LOSS</p><h2>まず、一番重要な「負けた質問」を見る。</h2></div><span>総合Scoreより、具体的な購買質問の方が「何を直すべきか」に直結します。AI別の候補結果と引用元まで同じ場所で監査できます。</span></div>{primaryLoss ? <div className="r3-loss"><article className="r3-loss-main"><header><span>PURCHASE-READY QUESTION</span><strong>{primaryLoss.winner || "競合候補"}が最頻推薦</strong></header><h3>「{primaryLoss.prompt}」</h3>{prompt?.whyTracked ? <p className="r3-why">追跡理由：{prompt.whyTracked}</p> : null}<div className="r3-engine-grid">{primaryLoss.observations.map((observation) => <article key={observation.id}><span>{providerLabel(observation.provider)}</span><strong className={observation.ownRecommended ? "r3-good" : "r3-bad"}>{observation.ownRecommended ? `自社 ${observation.ownPosition || "候補"}` : "自社候補外"}</strong><small>First: {observation.firstCandidate || "—"}</small></article>)}</div><p>{primaryLoss.summary}</p></article><aside className="r3-citations"><h3>この質問で使われたCitation</h3><ul>{primaryLoss.citations.length ? primaryLoss.citations.slice(0, 8).map((citation, index) => <li key={`${citation.url}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><a href={citation.url} target="_blank" rel="noreferrer">{citation.title || citation.domain}</a></li>) : <li><span>—</span><span>引用元は確認できませんでした。</span></li>}</ul></aside></div> : <div className="r3-loss-main"><h3>主要な候補外テーマは確認できませんでした。</h3><p>Watchでは同じCore Panelを追跡し、有料版ではDiscovery Panelで新しい購買場面を探索します。</p></div>}</div></section>

    <section className="r3-section"><div className="r3-shell"><div className="r3-head"><div><p>02 · WHY THEY WIN / NEXT ACTION</p><h2>競合との差を、比較材料と変更単位へ。</h2></div><span>「コンテンツを増やす」のような一般論ではなく、公開Webで何を確認できず、どのBuyer Promptと関係するかを先に示します。</span></div><div className="r3-gap-action"><article className="r3-gap"><header><span>比較材料（EVIDENCE）</span><strong>{topGap?.relatedPromptCount || 0} prompts</strong></header><h3>{topGap?.label || "重大な比較材料不足は未確認"}</h3><p>{topGap?.whyItMatters || "現在の公開Webから、主要比較材料を確認できています。"}</p>{topGap?.competitorEvidence ? <blockquote>競合側：{topGap.competitorEvidence}</blockquote> : null}</article><article className="r3-action"><header><span>FIRST ACTION</span><strong>{firstAction?.priority.toUpperCase() || "—"}</strong></header><h3>{firstAction?.title || "次のActionはありません"}</h3><p>{firstAction?.rationale || "同じ観測Panelを継続して変化を確認します。"}</p>{firstAction ? <button type="button" onClick={() => document.getElementById("watch-start")?.scrollIntoView({ behavior: "smooth" })}>14日WatchでChange Packまで進む</button> : null}</article></div></div></section>

    <section className="r3-section dark"><div className="r3-shell"><div className="r3-head"><div><p>03 · COMPETITIVE CONTEXT</p><h2>市場順位は、結論ではなく補助情報。</h2></div><span>無料Scanは12 Prompt・1回観測なので、精密な「世界順位」とは扱いません。同じ成功Observation上での相対的な候補入り率として見ます。</span></div><div className="r3-competitive"><div className="r3-rank-list">{result.competitors.slice(0, 6).map((competitor, index) => <div className="r3-rank-row" key={competitor.name}><span>{index + 1}</span><strong>{competitor.name}</strong><i><b style={{ width: `${competitor.coverage}%` }} /></i><em>{competitor.coverage}%</em></div>)}<div className="r3-rank-row self"><span>{result.marketPosition || "—"}</span><strong>{result.discovery.brandName}</strong><i><b style={{ width: `${result.recommendationCoverage}%` }} /></i><em>{result.recommendationCoverage}%</em></div></div><div className="r3-metrics"><article><small>Recommendation Coverage</small><strong>{result.recommendationCoverage}%</strong><span>{result.ownRecommendationCount}/{result.successfulObservations}回答</span></article><article><small>First Choice Rate</small><strong>{result.firstChoiceRate}%</strong><span>第一候補</span></article><article><small>Mention Coverage</small><strong>{result.mentionCoverage}%</strong><span>ブランド言及</span></article><article><small>Own Citation Coverage</small><strong>{result.citationCoverage}%</strong><span>{ownedCitations} citation events</span></article></div></div></div></section>

    <section className="r3-section white"><div className="r3-shell"><div className="r3-head"><div><p>04 · AUDITABLE MEASUREMENT</p><h2>細かい指標は、必要な人だけここで見る。</h2></div><span>指標はすべてPrompt、Provider、反復、Raw回答、Citationへ戻れます。Provider失敗は負けとしてカウントしません。</span></div><div className="r3-measure"><article className="r3-detail-card"><small>成功Observation</small><strong>{result.successfulObservations}</strong></article><article className="r3-detail-card"><small>予定Observation</small><strong>{result.scheduledObservations}</strong></article><article className="r3-detail-card"><small>Repeat Agreement</small><strong>{result.repeatAgreement}%</strong></article><article className="r3-detail-card"><small>市場認識Confidence</small><strong>{Math.round(result.discovery.confidence * 100)}%</strong></article><article className="r3-detail-card"><small>推定API Cost</small><strong>${result.totalCostUsd.toFixed(3)}</strong></article></div><div className="r3-provider">{providerHealth.map((item) => <article key={item.provider}><strong>{providerLabel(item.provider)}</strong><span>成功 {item.success}/{item.total} · 自社候補入り {item.own}</span></article>)}</div></div></section>

    {primaryLoss ? <section className="r3-section"><div className="r3-shell"><div className="r3-head"><div><p>05 · RAW ANSWERS</p><h2>要約を信じず、生回答を開ける。</h2></div><span>AIXの解釈だけで判断せず、実際のAI回答と候補順を確認できます。</span></div><div className="r3-raw">{primaryLoss.observations.map((observation: Observation) => <article key={observation.id}><button type="button" onClick={() => setOpen(open === observation.id ? "" : observation.id)} aria-expanded={open === observation.id}><strong>{providerLabel(observation.provider)}</strong><span>{observation.ownRecommended ? `自社 ${observation.ownPosition || "候補"}` : "自社候補外"}</span><span>Run {observation.repetition}</span><b>{open === observation.id ? "−" : "+"}</b></button>{open === observation.id ? <pre>{observation.rawText}</pre> : null}</article>)}</div></div></section> : null}

    <section className="r3-watch" id="watch-start"><div className="r3-shell r3-watch-grid"><div><p className="r3-eyebrow">14-DAY WATCH</p><h2>一回の診断を、追跡可能なBaselineへ。</h2><p>会社メールだけで30の固定Core Promptを作り直し、14日間追跡します。カード不要・自動課金なし。Watch後はVisibility、Prompt、Recommendation、Citation、競合、Evidence、Change PackをAIX Workspaceで一つに管理できます。</p></div><form onSubmit={startWatch}><label htmlFor="r3-email">会社メール</label><input id="r3-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" /><button disabled={busy}>{busy ? "Core Baselineを作成中…" : "この市場を14日間追跡する"}</button><small>無料Watchから有料契約へ自動移行しません。</small></form></div></section>
    {error ? <div className="r3-error" role="alert">{error}</div> : null}
  </main>;
}
