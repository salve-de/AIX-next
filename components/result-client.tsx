"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sampleResult } from "@/lib/sample-data";
import type { LostPrompt, Observation, ProviderName, ScanRecord, ScanResult } from "@/lib/types";

function providerLabel(provider: ProviderName) {
  return provider === "openai" ? "ChatGPT / OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function confidenceLabel(value: number) {
  return value >= .8 ? "高" : value >= .6 ? "中" : "低";
}

function questionGap(result: ScanResult, loss: LostPrompt) {
  return result.evidenceGaps.find((gap) => gap.relatedPromptIds.includes(loss.promptId))?.label || "公開情報の差を確認";
}

function ResultQuestionRow({ result, loss }: { result: ScanResult; loss: LostPrompt }) {
  return <div className="ux2-question-row">
    <div><strong>「{loss.prompt}」</strong></div>
    <div><span className="ux2-status-lost">候補外</span></div>
    <div><strong>{loss.winner || "特定できず"}</strong></div>
    <div><small>{questionGap(result, loss)}</small></div>
  </div>;
}

export function ResultClient() {
  const params = useSearchParams();
  const router = useRouter();
  const sample = params.get("sample") === "1";
  const scanId = params.get("id");
  const [result, setResult] = useState<ScanResult | null>(sample ? sampleResult : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [monitorBusy, setMonitorBusy] = useState(false);

  useEffect(() => {
    if (sample) return;
    if (!scanId) {
      setError("診断IDがありません。");
      setLoading(false);
      return;
    }
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

  async function startMonitoring(event: FormEvent) {
    event.preventDefault();
    if (sample) {
      router.push("/watch?sample=1");
      return;
    }
    if (!scanId) return;
    setMonitorBusy(true);
    setError("");
    try {
      const response = await fetch("/api/watch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scanId, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "継続モニタリングを開始できませんでした。");
      router.push(`/watch?token=${encodeURIComponent(data.token)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "継続モニタリングを開始できませんでした。");
    } finally {
      setMonitorBusy(false);
    }
  }

  if (loading) return <div className="full-loading">診断結果を読み込んでいます。</div>;
  if (!result) return <main className="empty-page"><h1>診断結果を表示できません。</h1><p>{error}</p><Link className="button button-dark" href="/">URL入力へ戻る</Link></main>;

  if (!result.successfulObservations) return <main className="ux2-report-page">
    <SiteHeader compact />
    <section className="ux2-partial"><div className="shell">
      <div className="ux2-partial-card">
        <p className="ux2-label">診断は途中まで完了しました</p>
        <h1>会社と市場は確認できましたが、AI回答を取得できませんでした。</h1>
        <p>{result.discovery.brandName} / {result.discovery.market}。順位・候補外質問・競合比較は、AI回答を取得できた場合だけ表示します。</p>
        <div className="ux2-partial-actions"><Link className="button button-dark" href="/">別のURLを診断</Link><Link className="button" href="/result?sample=1">完成したサンプルを見る</Link><Link className="ux2-link" href="/methodology">測定条件を確認</Link></div>
        {result.warnings.length ? <ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : null}
      </div>
    </div></section>
    <SiteFooter />
  </main>;

  const topCompetitor = result.competitors[0];
  const primaryLoss = result.lostPrompts[0];
  const primaryGap = result.evidenceGaps[0];
  const firstAction = result.actions[0];
  const shortlistedPromptCount = Math.max(0, result.panel.promptCount - result.lostPrompts.length);
  const visibleLosses = result.lostPrompts.slice(0, 3);
  const remainingLosses = result.lostPrompts.slice(3);

  return <main className="ux2-report-page">
    <SiteHeader compact />

    <section className="ux2-report-top"><div className="shell">
      <div className="ux2-report-breadcrumb">
        <span>{sample ? "架空サンプル" : "診断結果"} · {result.discovery.brandName}</span>
        <div className="ux2-report-tools"><button className="ux2-report-tool" type="button" onClick={() => window.print()}>印刷 / PDF保存</button><Link className="ux2-report-tool" href="/#scan">別の会社を診断</Link></div>
      </div>
      <div className="ux2-report-summary">
        <article className="ux2-summary-main">
          <p className="ux2-label">診断サマリー</p>
          <h1>{result.marketSize}社中<b>{result.marketPosition}位</b>。<br />{result.lostPrompts.length} / {result.panel.promptCount}の比較質問で候補外です。</h1>
          <p>買い手がAIで会社を比較する場面のうち、今回の測定で自社が候補に入ったのは{shortlistedPromptCount}問でした。</p>
          <div className="ux2-summary-kpis">
            <article><small>候補入り</small><strong>{shortlistedPromptCount} / {result.panel.promptCount}</strong></article>
            <article><small>候補外</small><strong>{result.lostPrompts.length} / {result.panel.promptCount}</strong></article>
            <article><small>首位競合</small><strong>{topCompetitor?.name || "—"}</strong></article>
          </div>
        </article>
        <aside className="ux2-next-action" id="action">
          <small>まず直すこと</small>
          <h2>{firstAction?.title || primaryGap?.label || "改善点を確認中"}</h2>
          <p>{firstAction?.rationale || primaryGap?.whyItMatters || "今回の比較結果から、優先度の高い情報差を確認します。"}</p>
          <div className="ux2-action-meta"><span>{firstAction?.relatedPromptCount || primaryGap?.relatedPromptCount || 0}の比較質問に関連</span><span>対象: {firstAction?.target || "自社サイト"}</span></div>
          <Link className="button button-dark" href="#watch">改善後を無料で確認 <ArrowIcon /></Link>
        </aside>
      </div>
      <div className="ux2-report-meta"><span>{result.discovery.market}</span><span>比較質問 {result.panel.promptCount}件</span><span>ChatGPT / Gemini / Perplexity</span><span>測定完了 {result.successfulObservations}/{result.scheduledObservations}</span><span>{formatDate(result.measuredAt)}</span></div>
    </div></section>

    <nav className="ux2-report-nav" aria-label="診断レポート"><div className="shell"><a href="#questions">比較質問</a><a href="#competitors">競合</a><a href="#gaps">情報差</a><a href="#action">改善</a><a href="#watch">再測定</a><a href="#details">測定詳細</a></div></nav>

    <section className="ux2-report-section white" id="questions"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">重要な比較質問</p><h2>どの質問で候補から外れているか。</h2><p>まず影響が大きい質問だけを確認します。件数は顧客数ではなく、今回測定した比較質問の数です。</p></div><small>候補外 {result.lostPrompts.length} / {result.panel.promptCount}</small></div>
      <div className="ux2-question-table"><div className="ux2-question-row header"><div>比較質問</div><div>自社</div><div>最も選ばれた競合</div><div>主な情報差</div></div>{visibleLosses.map((loss) => <ResultQuestionRow key={loss.promptId} result={result} loss={loss} />)}</div>
      {remainingLosses.length ? <details className="ux2-spec-details"><summary>残り{remainingLosses.length}件を見る</summary><div className="ux2-question-table">{remainingLosses.map((loss) => <ResultQuestionRow key={loss.promptId} result={result} loss={loss} />)}</div></details> : null}
    </div></section>

    <section className="ux2-report-section" id="competitors"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">競合比較</p><h2>同じAI回答で、誰が先に候補に入っているか。</h2><p>成功したAI回答に登場した回数を同じ分母で比較します。</p></div></div>
      <div className="ux2-competitor-list">
        <div className="ux2-competitor-table">{result.competitors.slice(0, 6).map((competitor, index) => <div key={competitor.name}><span>{index + 1}</span><strong>{competitor.name}</strong><div className="ux2-bar"><i style={{ width: `${competitor.coverage}%` }} /></div><span>{competitor.recommendedCount}/{result.successfulObservations}</span></div>)}<div className="own"><span>{result.marketPosition}</span><strong>{result.discovery.brandName}</strong><div className="ux2-bar"><i style={{ width: `${result.recommendationCoverage}%` }} /></div><span>{result.ownRecommendationCount}/{result.successfulObservations}</span></div></div>
        <aside className="ux2-competitor-focus"><small>最も重要な候補外質問</small><h3>「{primaryLoss?.prompt || "候補外質問なし"}」</h3><p>{primaryLoss?.summary || "今回の主要質問では候補に入っています。"}</p>{primaryLoss?.citations.length ? <ul>{primaryLoss.citations.slice(0, 4).map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer">{citation.title || citation.domain}</a></li>)}</ul> : null}</aside>
      </div>
    </div></section>

    <section className="ux2-report-section white" id="gaps"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">比較材料の差</p><h2>競合にはあり、自社では確認できない情報。</h2><p>「存在しない」と断定せず、今回の公開Web確認で見つけられなかった比較材料を優先度順に並べます。</p></div></div>
      <div className="ux2-gap-list">{result.evidenceGaps.slice(0, 4).map((gap, index) => <article className="ux2-gap-row" key={gap.id}><span className="ux2-gap-rank">{index + 1}</span><div><h3>{gap.label}</h3><p>{gap.whyItMatters}</p></div><span>{gap.competitorEvidence ? `競合: ${gap.competitorEvidence}` : "競合側の根拠を確認"}</span><strong>{gap.relatedPromptCount}質問に関連</strong></article>)}</div>
    </div></section>

    {firstAction ? <section className="ux2-report-section"><div className="shell"><div className="ux2-report-heading"><div><p className="ux2-label">最優先の改善</p><h2>全部直さず、まずこの1件。</h2><p>順位上昇を保証するものではなく、今回観測した比較材料の差から最初に検証する変更です。</p></div></div><div className="ux2-next-action"><small>最初に検証する変更</small><h2>{firstAction.title}</h2><p>{firstAction.rationale}</p><div className="ux2-action-meta"><span>{firstAction.relatedPromptCount}質問に関連</span><span>対象: {firstAction.target}</span><span>確度: {confidenceLabel(firstAction.confidence)}</span></div></div></div></section> : null}

    <section className="ux2-watch-cta" id="watch"><div className="shell ux2-watch-cta-grid"><div><p className="ux2-label">14日間無料</p><h2>直したあと、同じ質問で変化を確認する。</h2><p>候補入りが増えた質問、まだ候補外の質問、競合・引用元の変化を再測定します。無料期間から自動課金はありません。</p></div><form className="ux2-watch-form" onSubmit={startMonitoring}><label htmlFor="watch-email">会社メール</label><input id="watch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" /><button className="button button-accent" disabled={monitorBusy}>{monitorBusy ? "開始しています…" : "14日間無料で追跡"}<ArrowIcon /></button><small>カード登録不要。会社メールで結果を保存します。</small></form></div></section>

    <section className="ux2-report-section white" id="details"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">測定詳細</p><h2>必要なときだけ、AI回答と条件を確認する。</h2><p>レポートの数字から元のAI回答まで遡れます。</p></div></div>
      <div className="ux2-raw">
        {primaryLoss?.observations.map((observation: Observation) => <details key={observation.id}><summary><span>{providerLabel(observation.provider)}</span><span>{observation.ownPosition ? `自社 ${observation.ownPosition}番目` : "自社候補外"}</span></summary><pre>{observation.rawText}</pre>{observation.citations.length ? <ul>{observation.citations.map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer">{citation.title || citation.domain}</a></li>)}</ul> : null}</details>)}
        <details><summary><span>測定条件</span><span>{result.successfulObservations}/{result.scheduledObservations} 完了</span></summary><div className="ux2-change-body"><p>比較質問: {result.panel.promptCount}件 / 測定面: ChatGPT・Gemini・Perplexity / 日時: {formatDate(result.measuredAt)} / 市場認識確度: {confidenceLabel(result.discovery.confidence)}</p>{result.warnings.length ? <ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : null}<p><Link className="ux2-link" href="/methodology">測定方法を詳しく見る</Link></p></div></details>
      </div>
    </div></section>

    <a className="ux2-mobile-sticky" href="#watch">14日間無料で変化を追う</a>
    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
