"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowIcon, BotIcon, EvidenceIcon, NetworkIcon, QuoteIcon, SparkIcon, WarningIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sampleResult } from "@/lib/sample-data";
import type { Observation, ProviderName, ScanRecord, ScanResult } from "@/lib/types";

function providerLabel(provider: ProviderName) {
  return provider === "openai" ? "OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function confidenceLabel(value: number) {
  return value >= .8 ? "高" : value >= .6 ? "中" : "低";
}

function promptRecommendationCount(result: ScanResult, entity: string) {
  const promptIds = result.prompts?.map((prompt) => prompt.id) || [...new Set(result.observations.map((item) => item.promptId))];
  return promptIds.filter((promptId) => {
    const rows = result.observations.filter((item) => item.promptId === promptId && item.status === "success");
    if (!rows.length) return false;
    const recommended = rows.filter((item) => item.recommendedEntities.includes(entity)).length;
    return recommended >= Math.ceil(rows.length / 2);
  }).length;
}

export function ResultClient() {
  const params = useSearchParams();
  const router = useRouter();
  const sample = params.get("sample") === "1";
  const scanId = params.get("id");
  const [result, setResult] = useState<ScanResult | null>(sample ? sampleResult : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [openObservation, setOpenObservation] = useState("");
  const [email, setEmail] = useState("");
  const [watchBusy, setWatchBusy] = useState(false);

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
      .catch((caught) => setError(caught instanceof Error ? caught.message : "結果を取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, scanId]);

  async function startWatch(event: FormEvent) {
    event.preventDefault();
    if (sample) { router.push("/watch?sample=1"); return; }
    if (!scanId) return;
    setWatchBusy(true); setError("");
    try {
      const response = await fetch("/api/watch", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scanId, email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Watchを開始できませんでした。");
      router.push(`/watch?token=${encodeURIComponent(data.token)}`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Watchを開始できませんでした。"); }
    finally { setWatchBusy(false); }
  }

  const providerHealth = useMemo(() => {
    if (!result) return [];
    return (["openai", "gemini", "perplexity"] as ProviderName[]).map((provider) => {
      const rows = result.observations.filter((item) => item.provider === provider);
      const successful = rows.filter((item) => item.status === "success");
      return { provider, successful: successful.length, total: rows.length, own: successful.filter((item) => item.ownRecommended).length };
    });
  }, [result]);

  if (loading) return <div className="full-loading">診断結果を読み込んでいます。</div>;
  if (!result) return <main className="empty-page"><h1>診断結果を表示できません。</h1><p>{error}</p><Link className="button button-dark" href="/">URL入力へ戻る</Link></main>;

  const topCompetitor = result.competitors[0];
  const primaryLoss = result.lostPrompts[0];
  const firstAction = result.actions[0];
  const hasMeasurement = result.successfulObservations > 0;
  const shortlistedPromptCount = Math.max(0, result.panel.promptCount - result.lostPrompts.length);
  const topCompetitorPromptCount = topCompetitor ? promptRecommendationCount(result, topCompetitor.name) : 0;
  const primaryWinner = primaryLoss?.winner || topCompetitor?.name || null;
  const primaryWinnerObservationCount = primaryLoss && primaryWinner
    ? primaryLoss.observations.filter((item) => item.status === "success" && item.recommendedEntities.includes(primaryWinner)).length
    : topCompetitor?.recommendedCount || 0;
  const primaryWinnerObservationTotal = primaryLoss
    ? primaryLoss.observations.filter((item) => item.status === "success").length
    : result.successfulObservations;
  const firstChoiceCount = Math.round(result.successfulObservations * result.firstChoiceRate / 100);
  const mentionCount = Math.round(result.successfulObservations * result.mentionCoverage / 100);
  const citationCount = Math.round(result.successfulObservations * result.citationCoverage / 100);

  return <main>
    <SiteHeader compact />
    <section className="result-hero">
      <div className="shell result-hero-grid">
        <div className="result-verdict">
          <div className="result-label-row"><p className="eyebrow">{sample ? "FICTIONAL SAMPLE" : "AIX MARKET SCAN"}</p><span className={`confidence confidence-${result.discovery.confidence >= .8 ? "high" : result.discovery.confidence >= .6 ? "medium" : "low"}`}>市場認識 {confidenceLabel(result.discovery.confidence)}</span></div>
          {hasMeasurement ? <><h1>{result.discovery.brandName}は、<br /><span>AI比較で{result.marketSize}社中{result.marketPosition}位。</span></h1><p>{result.panel.promptCount}の購買質問のうち、購入候補に入ったのは<strong>{shortlistedPromptCount}問</strong>でした。AI回答単位では<strong>{result.ownRecommendationCount} / {result.successfulObservations}回答</strong>で候補入りしています。</p></> : <><h1>市場は特定しました。<br /><span>AI観測は未完了です。</span></h1><p>Provider設定後に、同じBuyer PromptをOpenAI・Gemini・Perplexityで測定します。</p></>}
          <div className="measurement-meta"><span>{result.discovery.market}</span><span>{result.panel.promptCount} Buyer Prompts</span><span>OpenAI・Gemini・Perplexity</span><span>成功 {result.successfulObservations} / {result.scheduledObservations}観測</span><span>{formatDate(result.measuredAt)}</span></div>
          {result.warnings.map((warning) => <p className="warning-line" key={warning}><WarningIcon />{warning}</p>)}
        </div>
        <div className="decision-map">
          <div className="decision-query"><QuoteIcon /><div><small>BIGGEST BUYER QUESTION</small><strong>{primaryLoss?.prompt || "測定完了後に、最も重要な候補外質問を表示します。"}</strong></div></div>
          <div className="decision-engines"><span><BotIcon />OpenAI</span><span><SparkIcon />Gemini</span><span><NetworkIcon />Perplexity</span></div>
          <div className="decision-outcomes"><article className="winner"><small>最頻推薦</small><strong>{primaryWinner || "未測定"}</strong><span>{primaryWinner ? `${primaryWinnerObservationCount} / ${primaryWinnerObservationTotal}回答で候補入り` : "回答待ち"}</span></article><article className="own"><small>自社</small><strong>{result.discovery.brandName}</strong><span>{primaryLoss ? "この質問では候補外" : hasMeasurement ? `${result.ownRecommendationCount} / ${result.successfulObservations}回答で候補入り` : "未測定"}</span></article></div>
          <div className="decision-diagnosis"><EvidenceIcon /><p><small>AIX DIAGNOSIS</small><strong>{result.evidenceGaps[0]?.label || "Evidence差を解析中"}</strong></p><span>{result.evidenceGaps[0]?.relatedPromptCount || 0} prompts</span></div>
        </div>
      </div>
    </section>

    <section className="result-section shell">
      <div className="section-heading"><p className="eyebrow">BOTTOM LINE</p><h2>まず、勝敗だけを見る。</h2><p>順位とBuyer Promptの勝敗を先に確認し、その後で根拠を掘ります。</p></div>
      <div className="metric-grid"><article><small>AI比較での位置</small><strong>{hasMeasurement ? `${result.marketPosition} / ${result.marketSize}` : "—"}</strong><span>{result.discovery.market}</span></article><article className="alert"><small>候補に入った購買質問</small><strong>{shortlistedPromptCount} / {result.panel.promptCount}</strong><span>Buyer Prompt単位</span></article><article><small>首位競合の候補入り</small><strong>{topCompetitor ? `${topCompetitorPromptCount} / ${result.panel.promptCount}` : "—"}</strong><span>{topCompetitor?.name || "未特定"} · Buyer Prompt単位</span></article><article className="alert"><small>候補外になった購買質問</small><strong>{result.lostPrompts.length} / {result.panel.promptCount}</strong><span>Buyer Prompt単位</span></article></div>
      <div className="secondary-metrics"><article><small>AI回答で自社候補入り</small><strong>{result.ownRecommendationCount} / {result.successfulObservations}</strong></article><article><small>First Choice</small><strong>{firstChoiceCount} / {result.successfulObservations}</strong></article><article><small>自社への言及</small><strong>{mentionCount} / {result.successfulObservations}</strong></article><article><small>自社Citation</small><strong>{citationCount} / {result.successfulObservations}</strong></article><article><small>測定完了</small><strong>{result.successfulObservations} / {result.scheduledObservations}</strong></article></div>
      <div className="provider-health">{providerHealth.map((item) => <article key={item.provider}><div><span className={`provider-dot ${item.successful ? "ready" : "down"}`} /><strong>{providerLabel(item.provider)}</strong></div><small>成功 {item.successful}/{item.total}</small><span>自社候補入り {item.own}</span></article>)}</div>
    </section>

    <section className="result-section result-lost-section shell">
      <div className="section-heading"><p className="eyebrow">EXCLUDED BUYER PROMPTS</p><h2>候補外になった購買質問。</h2><p>{result.lostPrompts.length} / {result.panel.promptCount}問で、過半数のAI回答が自社を購入候補に入れませんでした。</p></div>
      <div className="result-lost-grid">{result.lostPrompts.slice(0, 6).map((loss, index) => <article key={loss.promptId}><header><span>{String(index + 1).padStart(2, "0")}</span><span>{loss.observations.filter((item) => item.ownRecommended).length} / {loss.observations.length}回答で自社候補入り</span></header><h3>「{loss.prompt}」</h3><footer><span><small>最頻推薦</small><strong>{loss.winner || "特定できず"}</strong></span><span><small>自社</small><strong className="lost">候補外</strong></span></footer></article>)}</div>
    </section>

    <section className="result-section result-dark"><div className="shell result-split"><div><div className="section-heading"><p className="eyebrow">COMPETITOR EVIDENCE</p><h2>同じ回答面で、<br />誰が先に選ばれたか。</h2><p>バーは成功AI回答の候補入り率です。右端は候補入り回答数 / 成功回答数を示します。</p></div><div className="rank-bars">{result.competitors.slice(0, 6).map((competitor, index) => <div key={competitor.name}><span>{index + 1}</span><strong>{competitor.name}</strong><i><b style={{ width: `${competitor.coverage}%` }} /></i><em>{competitor.recommendedCount}/{result.successfulObservations}</em></div>)}<div className="own-row"><span>{result.marketPosition || "—"}</span><strong>{result.discovery.brandName}</strong><i><b style={{ width: `${result.recommendationCoverage}%` }} /></i><em>{result.ownRecommendationCount}/{result.successfulObservations}</em></div></div></div><div className="lost-panel"><p className="eyebrow">MOST IMPORTANT LOSS</p><h3>「{primaryLoss?.prompt || "候補外質問はまだありません"}」</h3><div className="loss-outcome"><span><small>最頻推薦</small><strong>{primaryLoss?.winner || "—"}</strong></span><span><small>自社</small><strong className="lost-status">{primaryLoss ? "候補外" : "候補入り"}</strong></span></div><p>{primaryLoss?.summary || "主要な質問では候補に入っています。次回のDiscovery Panelで新しい比較場面を確認します。"}</p>{primaryLoss?.citations.length ? <ul className="citation-list">{primaryLoss.citations.slice(0, 5).map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer"><QuoteIcon />{citation.title || citation.domain}</a></li>)}</ul> : null}</div></div></section>

    <section className="result-section evidence-section"><div className="shell"><div className="section-heading"><p className="eyebrow">INFORMATION TO CONFIRM</p><h2>競合にはあり、自社では確認できないEvidence。</h2><p>「存在しない」と断定せず、公開Webから確認できなかった比較材料だけを示します。</p></div><div className="evidence-grid">{result.evidenceGaps.slice(0, 4).map((gap, index) => <article key={gap.id}><header><span>{String(index + 1).padStart(2, "0")}</span><strong>{gap.relatedPromptCount} prompts</strong></header><h3>{gap.label}</h3><p>{gap.whyItMatters}</p>{gap.competitorEvidence ? <small>競合側: {gap.competitorEvidence}</small> : null}<footer>診断確度: {confidenceLabel(gap.confidence)}</footer></article>)}</div></div></section>

    {firstAction ? <section className="result-section shell"><div className="first-action"><div><p className="eyebrow">FIRST ACTION</p><h2>今、最も優先して直すこと。</h2><h3>{firstAction.title}</h3><p>{firstAction.rationale}</p></div><aside><span>関連Prompt<strong>{firstAction.relatedPromptCount}件</strong></span><span>優先度<strong>{firstAction.priority.toUpperCase()}</strong></span><span>対象<strong>{firstAction.target}</strong></span><small>有料Watchでは、必要な事実、推奨見出し、本文、FAQ、再測定対象までChange Packとして作成します。</small></aside></div></section> : null}

    {primaryLoss ? <section className="result-section shell"><div className="section-heading"><p className="eyebrow">RAW OBSERVATIONS</p><h2>必要なら、生回答まで確認する。</h2><p>候補順と引用元をProviderごとに開いて監査できます。</p></div><div className="raw-observations">{primaryLoss.observations.map((observation: Observation) => <article key={observation.id}><button type="button" onClick={() => setOpenObservation(openObservation === observation.id ? "" : observation.id)} aria-expanded={openObservation === observation.id}><span>{providerLabel(observation.provider)}</span><strong>{observation.ownPosition ? `自社 ${observation.ownPosition}番目` : "自社候補外"}</strong><em>Run {observation.repetition}</em><ArrowIcon /></button>{openObservation === observation.id ? <div><pre>{observation.rawText}</pre>{observation.citations.length ? <ul>{observation.citations.map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer">{citation.title || citation.domain}</a></li>)}</ul> : null}</div> : null}</article>)}</div></section> : null}

    <section className="watch-cta"><div className="shell watch-cta-grid"><div><p className="eyebrow">14-DAY FREE WATCH</p><h2>この順位を、14日間無料で追跡する。</h2><p>同じBuyer Promptで順位、候補入り質問、候補外質問、競合、Citationの変化を再測定します。</p><ul><li>会社メールのみ</li><li>カード不要</li><li>無料期間から自動課金なし</li></ul></div><form onSubmit={startWatch}><label htmlFor="watch-email">会社メール</label><input id="watch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" /><button className="button button-accent" disabled={watchBusy}>{watchBusy ? "開始しています…" : "無料Watchを開始"}<ArrowIcon /></button><small>会社メールでWatchを保存します。カード登録は不要です。</small></form></div></section>
    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
