"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowIcon, QuoteIcon } from "@/components/icons";
import { ActionList } from "@/components/action-list";
import { CitationMap } from "@/components/citation-map";
import { QuestionList } from "@/components/question-list";
import { ReportActions } from "@/components/report-actions";
import { PublicProfileActions } from "@/components/public-profile-actions";
import { InsightPanels } from "@/components/insight-panels";
import { PositioningPanel } from "@/components/positioning-panel";
import { sampleResult } from "@/lib/sample-data";
import type { Observation, ProviderName, ScanRecord, ScanResult } from "@/lib/types";

function providerLabel(provider: ProviderName) {
  return provider === "openai" ? "OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function userFacingWarning(value: string) {
  if (value.includes("市場認識") || value.includes("市場の信頼")) return "会社や市場の情報が少ないため、競合との比較は参考値です。";
  if (value.includes("Recommendation") || value.includes("観測が失敗") || value.includes("観測が未設定")) return "一部のAI回答を取得できなかったため、取得できた回答だけで結果を表示しています。";
  if (value.includes("AI Provider") || value.includes("有効な回答がありません")) return "AIの回答を取得できなかったため、今回の比較結果は表示できません。時間を置いてもう一度お試しください。";
  if (value.includes("競合候補")) return "比較できる会社を十分に見つけられませんでした。市場を確認してからもう一度お試しください。";
  return value;
}

function visibilityStatusLabel(status: "ready" | "review" | "missing") {
  return status === "ready" ? "整っています" : status === "review" ? "確認が必要" : "止まっています";
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
      if (!response.ok) throw new Error(data.error || "改善後の確認を開始できませんでした。");
      router.push(`/watch?token=${encodeURIComponent(data.token)}`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "改善後の確認を開始できませんでした。"); }
    finally { setWatchBusy(false); }
  }

  if (loading) return <div className="full-loading">診断結果を読み込んでいます。</div>;
  if (!result) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>診断結果を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">診断へ戻る</Link></div></main>;

  const topCompetitor = result.competitors[0];
  const primaryLoss = result.lostPrompts[0];
  const firstAction = result.actions[0];
  const primaryGap = result.evidenceGaps[0];
  const hasMeasurement = result.successfulObservations > 0;
  const shortlistedPromptCount = Math.max(0, result.panel.promptCount - result.lostPrompts.length);
  const primaryWinner = primaryLoss?.winner || topCompetitor?.name || null;
  const primaryPrompt = primaryLoss ? result.prompts?.find((prompt) => prompt.id === primaryLoss.promptId) : undefined;
  const citationCount = result.observations.reduce((total, item) => total + item.citations.length, 0);
  const host = (() => { try { return new URL(result.targetUrl).hostname.replace(/^www\./, ""); } catch { return result.targetUrl; } })();
  const displayWarnings = [...new Set(result.warnings.map(userFacingWarning))];
  const visibilityAudit = result.visibilityAudit;
  const priorityVisibilityCheck = visibilityAudit?.checks.find((item) => item.id === visibilityAudit.priorityCheckId);
  const actionAudience = firstAction?.audience || result.discovery.targetCustomers.slice(0, 2).join("・") || "公開ページから確認できる対象顧客";
  const actionStage = firstAction?.stage || primaryPrompt?.stage || "比較";
  const actionConcern = firstAction?.customerConcern || primaryGap?.label || "選ぶ前に確認したい情報";
  const actionPlacement = firstAction?.placement || firstAction?.target || "自社サイト";
  const actionCta = firstAction?.cta || (actionStage === "導入" ? "導入条件を確認する" : actionStage === "検討" ? "事例を確認する" : "比較材料を確認する");
  const actionMetric = firstAction?.successMetric || "同じ比較質問で自社が候補に入ったか";

  return <main className="report-page">
    <SiteHeader compact />
    <section className="report-header"><div className="shell"><div className="report-header-top"><div><p className="overline">集客機会の診断</p><h1>{result.discovery.brandName}</h1><p className="report-host">{host}</p></div><span className={sample ? "sample-badge" : "report-date"}>{sample ? "架空データの見本" : formatDate(result.measuredAt)}</span></div><p className="report-headline">{hasMeasurement ? <>比較した<strong>{result.panel.promptCount}問</strong>のうち、<br /><span>{result.lostPrompts.length}問で競合が先に選ばれました。</span></> : <>市場は確認できました。<br /><span>AI回答の測定は未完了です。</span></>}</p><div className="report-meta"><span>{result.discovery.market}</span><span>AIの回答で確認した範囲</span><span>{result.panel.promptCount}問を確認</span></div><ReportActions result={result} sample={sample} />{sample ? <p className="sample-note">画面の使い方を見るためのサンプルです。会社名・競合名・数値は実在の診断結果ではありません。</p> : null}{!sample ? displayWarnings.map((warning) => <p className="report-warning" key={warning}>{warning}</p>) : null}</div></section>

    <section className="report-summary shell"><div className="summary-copy"><p className={`overline ${primaryLoss ? "summary-urgent-label" : ""}`}>{primaryLoss ? "サイトを見る前の取りこぼし" : "今回の結果"}</p><h2>{primaryLoss ? <>AIは、<strong>{primaryWinner || "競合"}</strong>を<br />先に勧めました。</> : "AIの比較で、自社も選ばれています。"}</h2>{primaryLoss ? <p className="summary-question">「{primaryLoss.prompt}」</p> : null}<p>{primaryLoss ? `${primaryWinner || "競合"}が先に出て、${result.discovery.brandName}は候補から外れています。${primaryGap?.label ? `${primaryGap.label}を確認できなかったためです。` : "選ばれる材料を確認できなかったためです。"}この比較で、見込み客を逃している可能性があります。` : "測定した質問では、自社も候補に入っています。別の購入場面も確認できます。"}</p></div><div><div className="summary-stats"><div><span>候補に入った比較質問</span><strong>{shortlistedPromptCount} / {result.panel.promptCount}</strong></div><div><span>先に選ばれた競合</span><strong>{topCompetitor?.name || "—"}</strong></div><div><span>確認できた引用ページ</span><strong>{citationCount}件</strong></div><div><span>改善後の確認</span><strong className="summary-unconnected">同じ質問で再測定</strong></div></div><p className="summary-data-note">診断は会社名・商品名・サービス名・URLだけで完了します。変更後は同じ比較質問で確かめられます。</p></div></section>
    <section className="report-measurement shell" aria-label="測定の確かさ"><div className="section-heading-simple"><p className="overline">今回の確認範囲</p><h2>どれだけの回答を確認できたか。</h2><p>AIの回答を取得できた範囲と、同じ質問での結果を分けて表示します。</p></div><div className="report-measurement-grid"><div><small>回答を確認できた割合</small><strong>{result.measurementCompleteness}%</strong><span>{result.successfulObservations} / {result.scheduledObservations}回答</span></div><div><small>自社が最初に選ばれた割合</small><strong>{result.firstChoiceRate}%</strong><span>取得できた回答の中で</span></div><div><small>自社ページが引用された割合</small><strong>{result.citationCoverage}%</strong><span>取得できた回答の中で</span></div><div><small>同じ質問の回答の一致度</small><strong>{result.panel.repetitions > 1 ? `${result.repeatAgreement}%` : "—"}</strong><span>{result.panel.repetitions > 1 ? `${result.panel.repetitions}回測定` : "1回測定のため未算出"}</span></div></div></section>

    <section className="result-marketing-state shell" aria-label="マーケティング現在地"><div className="section-heading-simple"><p className="overline">マーケティング現在地</p><h2>顧客が比較する場面で、<br />何が起きているか。</h2><p>今回のAI回答から、候補入り・競合先行・公開情報の差を一枚にまとめています。</p></div><div className="marketing-state-metrics"><div><small>比較した質問</small><strong>{result.panel.promptCount}問</strong><span>購入前の比較</span></div><div><small>自社が候補に入った質問</small><strong>{shortlistedPromptCount}問</strong><span>今回のAI回答</span></div><div className="marketing-state-loss"><small>競合が先に選ばれた質問</small><strong>{result.lostPrompts.length}問</strong><span>取り戻す余地</span></div><div><small>確認できた引用ページ</small><strong>{citationCount}件</strong><span>公開ページの根拠</span></div></div><div className="marketing-state-details"><div><small>購入段階</small><strong>{primaryLoss ? (primaryPrompt?.stage || "比較") : "候補を探す段階"}</strong></div><div><small>顧客が知りたいこと</small><strong>{primaryGap?.label || "確認できる情報"}</strong></div><div><small>施策を置く場所</small><strong>{firstAction?.target || "公開ページ"}</strong></div><div><small>確認する指標</small><strong>{hasMeasurement ? "同じ質問で候補に入ったか" : "AI回答の測定完了後に確認"}</strong></div></div><p className="marketing-state-note">診断は会社名・商品名・サービス名・URLだけで完了します。変更後は同じ比較質問で確かめられます。</p></section>

    <InsightPanels result={result} />
    <PositioningPanel positioning={result.positioning} />

    {primaryLoss && primaryGap && firstAction ? <section className="result-action-bridge shell" aria-label="今回の結論"><div><small>候補外</small><strong>{result.lostPrompts.length}問</strong></div><span aria-hidden="true">→</span><div><small>確認できない差</small><strong>{primaryGap.label}</strong></div><span aria-hidden="true">→</span><div><small>最初に確認すること</small><strong>{firstAction.title}</strong></div><span aria-hidden="true">→</span><div><small>次に見る</small><strong>同じ質問で再測定</strong></div></section> : null}

    {firstAction ? <section className="report-first-action"><div className="shell first-action-row"><div><p className="overline">最初にやること</p><h2>{firstAction.title}</h2><p>{firstAction.rationale}</p></div><div className="first-action-aside"><span>関係する比較質問<strong>{firstAction.relatedPromptCount}件</strong></span><span>使う場所<strong>{actionPlacement}</strong></span><Link className="button button-secondary" href="#watch-start">改善案と変化を見る <ArrowIcon /></Link></div></div><div className="shell first-action-plan" aria-label="施策の見立て"><div><small>対象顧客</small><strong>{actionAudience}</strong></div><div><small>購入段階</small><strong>{actionStage}</strong></div><div><small>顧客の不安</small><strong>{actionConcern}</strong></div><div><small>案内する行動</small><strong>{actionCta}</strong></div><div><small>確かめる指標</small><strong>{actionMetric}</strong></div><p><span>今回の観測</span> {firstAction.evidenceType === "observed" ? "AI回答と公開ページから確認" : "AI回答から立てた仮説"}。公開後に同じ質問で確かめます。</p></div></section> : null}
    <ActionList actions={result.actions} />

    {visibilityAudit ? <section className="report-section report-visibility"><div className="shell"><div className="section-heading-simple"><p className="overline">集客に必要な公開情報</p><h2>競合が選ばれた理由を、<br />公開情報の差まで確認する。</h2><p>{priorityVisibilityCheck ? priorityVisibilityCheck.detail : "公開ページが読める状態か、選ぶ理由になる情報がそろっているかを確認します。"}</p></div><div className="visibility-list">{visibilityAudit.checks.map((item) => <article className={`visibility-item visibility-${item.status}`} key={item.id}><div className="visibility-item-head"><span className="visibility-dot" aria-hidden="true" /><strong>{item.title}</strong><em>{visibilityStatusLabel(item.status)}</em></div><p>{item.detail}</p><small>次にすること: {item.action}</small></article>)}</div><div className="visibility-actions"><Link className="button button-secondary" href={sample ? "/ai-info?sample=1" : "#watch-start"}>{sample ? "公開情報の下書きを見る" : "公開情報の下書きを作る"} <ArrowIcon /></Link><small>取得できた公開ページだけで作り、公開前に確認します。</small></div></div></section> : null}

    <section className="report-section report-public-profile"><div className="shell"><PublicProfileActions result={result} sample={sample} /></div></section>

    <section className="report-section shell"><div className="section-heading-simple"><p className="overline">顧客が比較する質問</p><h2>どの比較で、競合に流れているか。</h2><p>買い手がAIに聞く場面ごとに、先に選ばれた会社と、自社が候補から外れた質問を確認できます。</p></div><QuestionList result={result} /></section>

    <section className="report-section report-compare"><div className="shell"><div className="section-heading-simple"><p className="overline">市場での立ち位置（参考）</p><h2>競合が先に選ばれる比較軸を確認する。</h2><p>今回のAI回答で、各社が候補に入った回数を比べています。順位や売上を保証する数字ではありません。</p></div><div className="compare-table"><div className="compare-table-head"><span>会社</span><span>選ばれた回答</span><span>割合</span></div>{result.competitors.slice(0, 6).map((competitor, index) => <div className="compare-row" key={competitor.name}><strong><i>{index + 1}</i>{competitor.name}</strong><div className="compare-bar"><span style={{ width: `${Math.max(3, competitor.coverage)}%` }} /></div><b>{competitor.recommendedCount} / {result.successfulObservations}</b></div>)}<div className="compare-row compare-own"><strong><i>{result.marketPosition || "—"}</i>{result.discovery.brandName}</strong><div className="compare-bar"><span style={{ width: `${Math.max(3, result.recommendationCoverage)}%` }} /></div><b>{result.ownRecommendationCount} / {result.successfulObservations}</b></div></div></div></section>

    <section className="report-section shell report-evidence"><div className="section-heading-simple"><p className="overline">集客の改善機会</p><h2>競合が選ばれた理由を、<br />次のマーケティングに変える。</h2><p>競合の公開ページと比べ、自社で確認できなかった情報を、次の施策につながる形で示します。</p></div><div className="evidence-layout"><div className="evidence-main"><h3>{primaryGap?.label || "確認できる情報の差"}</h3><p>{primaryGap?.whyItMatters || "今回の結果に関係する情報差を確認できませんでした。"}</p>{primaryGap?.competitorEvidence ? <p className="evidence-competitor">競合側で確認できた内容: {primaryGap.competitorEvidence}</p> : null}</div><div className="citation-box"><h3>確認したページ</h3>{primaryLoss?.citations.length ? <ul>{primaryLoss.citations.slice(0, 5).map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer"><QuoteIcon />{citation.title || citation.domain}<span>↗</span></a></li>)}</ul> : <p>この質問では引用元を確認できませんでした。</p>}</div></div><CitationMap result={result} /></section>

    <section className="report-watch" id="watch-start"><div className="shell report-watch-inner"><div><p className="overline">改善の効果を確認</p><h2>直したあと、<br />競合から取り返せたか。</h2><p>同じ比較質問をもう一度調べ、自社が新しく候補に入ったかを確認します。14日間は無料です。</p><ul><li>会社メールだけ</li><li>カード登録なし</li><li>無料期間から自動課金なし</li></ul></div><form onSubmit={startWatch}><label htmlFor="watch-email">会社メール</label><input id="watch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" /><button className="button button-primary" disabled={watchBusy}>{watchBusy ? "準備しています…" : "変化を確認する"}<ArrowIcon /></button><small>サンプルでは入力せず、結果の例へ移動します。</small></form></div></section>

    {primaryLoss ? <section className="report-section shell report-details"><details><summary>回答の詳細と引用元を確認する</summary><div className="observation-list">{primaryLoss.observations.map((observation: Observation) => <article key={observation.id}><button type="button" onClick={() => setOpenObservation(openObservation === observation.id ? "" : observation.id)} aria-expanded={openObservation === observation.id}><span>{providerLabel(observation.provider)}</span><strong>{observation.ownPosition ? `自社 ${observation.ownPosition}番目` : "自社は候補外"}</strong><em>回答 {observation.repetition}</em><ArrowIcon /></button>{openObservation === observation.id ? <div className="observation-body">{observation.rawText ? <p>{observation.rawText}</p> : <p className="observation-safe-note">回答本文はこのリンクでは表示せず、引用元だけ確認できます。</p>}{observation.citations.length ? <ul>{observation.citations.map((citation) => <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer">{citation.title || citation.domain}</a></li>)}</ul> : null}</div> : null}</article>)}</div></details></section> : null}

    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
