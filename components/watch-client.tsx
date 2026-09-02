"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, QuoteIcon, TrendIcon, WarningIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sampleWatch } from "@/lib/sample-data";
import type { WatchRecord } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function panelDescription(watch: WatchRecord) {
  return watch.latest.panel.kind === "core" ? "固定Core Panel" : "同じBuyer Prompt";
}

export function WatchClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Watch tokenがありません。"); setLoading(false); return; }
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。"); setWatch(data); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Watchを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  const change = useMemo(() => {
    if (!watch) return null;
    const comparable = watch.baseline.panel.kind === watch.latest.panel.kind && watch.baseline.panel.version === watch.latest.panel.version && watch.baseline.panel.promptCount === watch.latest.panel.promptCount;
    const baselineLost = new Set(watch.baseline.lostPrompts.map((item) => item.promptId));
    const latestLost = new Set(watch.latest.lostPrompts.map((item) => item.promptId));
    const baselineShortlisted = Math.max(0, watch.baseline.panel.promptCount - baselineLost.size);
    const latestShortlisted = Math.max(0, watch.latest.panel.promptCount - latestLost.size);
    const newPromptWins = [...baselineLost].filter((promptId) => !latestLost.has(promptId)).length;
    const newPromptLosses = [...latestLost].filter((promptId) => !baselineLost.has(promptId)).length;
    const baselineCitations = new Set(watch.baseline.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    const latestCitations = new Set(watch.latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    return {
      comparable,
      rank: comparable ? watch.baseline.marketPosition - watch.latest.marketPosition : 0,
      baselineShortlisted,
      latestShortlisted,
      baselineLost: baselineLost.size,
      latestLost: latestLost.size,
      newPromptWins,
      newPromptLosses,
      newCitations: [...latestCitations].filter((url) => !baselineCitations.has(url)).length,
    };
  }, [watch]);

  async function saveEvidence(event: FormEvent, gapId: string) {
    event.preventDefault();
    if (sample || !token || !values[gapId]?.trim()) return;
    setSaving(gapId); setError("");
    try {
      const response = await fetch("/api/evidence", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, gapId, value: values[gapId] }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存できませんでした。");
      setWatch(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "保存できませんでした。"); }
    finally { setSaving(""); }
  }

  async function checkout() {
    if (sample) { setError("サンプル画面では決済を開始しません。"); return; }
    setCheckoutBusy(true); setError("");
    try {
      const response = await fetch("/api/billing/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkoutを開始できませんでした。");
      window.location.assign(data.url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Checkoutを開始できませんでした。"); }
    finally { setCheckoutBusy(false); }
  }

  if (loading) return <div className="full-loading">Watchを読み込んでいます。</div>;
  if (!watch || !change) return <main className="empty-page"><h1>Watchを表示できません。</h1><p>{error}</p><Link className="button button-dark" href="/">無料診断へ戻る</Link></main>;

  const points = watch.history.map((item, index) => ({ x: 44 + index * (520 / Math.max(1, watch.history.length - 1)), y: 170 - item.recommendationCoverage * 2.8 }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${Math.max(25, point.y)}`).join(" ");
  const pendingGaps = watch.latest.evidenceGaps.filter((gap) => !watch.evidence.some((answer) => answer.gapId === gap.id));
  const stopped = ["expired", "cancelled"].includes(watch.status);
  const statusText = watch.status === "expired"
    ? "14日無料Watchは終了しました。自動課金はされていません。"
    : watch.status === "cancelled"
      ? "有料Watchは解約済みです。過去の測定結果はこの画面で確認できます。"
      : watch.status === "past_due"
        ? "決済の確認が必要です。契約管理から支払情報を確認してください。"
        : "";

  return <main>
    <SiteHeader compact />
    <section className="watch-hero"><div className="shell"><div className="watch-title-row"><div><p className="eyebrow">AIX WATCH · {sample ? "FICTIONAL SAMPLE" : watch.status.toUpperCase()}</p><h1>前回の改善は効いたか。<br />AI比較 {watch.baseline.marketPosition}位 → {watch.latest.marketPosition}位。</h1><p>{watch.latest.discovery.brandName}を{panelDescription(watch)}で再測定。候補入り質問は {change.baselineShortlisted} → {change.latestShortlisted}、候補外は {change.baselineLost} → {change.latestLost}。前回から「何が良くなり、何がまだ残っているか」を見ます。</p></div>{stopped ? <div className="live-pill stopped"><i />測定停止</div> : <div className="live-pill"><i />次回測定 {formatDate(watch.nextRunAt)}</div>}</div></div></section>

    {statusText ? <section className={`watch-status-banner watch-status-${watch.status}`}><div className="shell"><WarningIcon /><div><strong>{statusText}</strong><span>{watch.status === "expired" ? "継続する場合だけStripe Checkoutで有料Watchを開始します。" : watch.status === "past_due" ? "Watchは自動で新しい測定を行いません。" : "必要なら同じWatchを再開できます。"}</span></div></div></section> : null}

    <section className="watch-change-panel"><div className="shell"><div className="watch-change-grid"><article><small>AI比較での順位</small><strong>{watch.baseline.marketPosition}位 → <b>{watch.latest.marketPosition}位</b></strong><span>{change.comparable ? `${change.rank >= 0 ? "+" : ""}${change.rank}順位` : "新しいBaseline"}</span></article><article><small>候補に入った購買質問</small><strong>{change.baselineShortlisted} → <b>{change.latestShortlisted}</b></strong><span>{watch.latest.panel.promptCount} Buyer Prompts</span></article><article><small>候補外になった購買質問</small><strong>{change.baselineLost} → <b>{change.latestLost}</b></strong><span>{watch.latest.panel.promptCount} Buyer Prompts</span></article><article><small>新しく候補入り</small><strong><b>+{change.newPromptWins}質問</b></strong><span>{change.newPromptLosses ? `新しく候補外 ${change.newPromptLosses}質問` : "新しい候補外なし"}</span></article></div><p className="watch-change-note">{change.comparable ? "同じPanel種別・version・Prompt数だけを比較しています。順位変化だけで施策の因果を断定しません。" : "測定条件が変わったため、今回は新しいBaselineとして扱います。"}</p></div></section>

    <section className="watch-overview shell">
      <div className="watch-chart-card"><header><div><small>AI回答での自社候補入り</small><strong>{watch.latest.ownRecommendationCount} / {watch.latest.successfulObservations}</strong></div><span>週次推移</span></header><div className="watch-chart"><svg viewBox="0 0 610 210" preserveAspectRatio="none" aria-hidden="true"><path className="grid" d="M35 40H590M35 95H590M35 150H590" /><path className="line" d={path || "M44 150L566 150"} />{points.map((point, index) => <circle key={index} className={index === points.length - 1 ? "last" : ""} cx={point.x} cy={Math.max(25, point.y)} r={index === points.length - 1 ? 7 : 5} />)}</svg><span className="chart-baseline">Baseline {watch.baseline.ownRecommendationCount}/{watch.baseline.successfulObservations}</span><span className="chart-now">Now {watch.latest.ownRecommendationCount}/{watch.latest.successfulObservations}</span></div></div>
    </section>

    <section className="result-section shell"><div className="section-heading"><p className="eyebrow">WHAT MOVED</p><h2>どの比較場面を取り戻したか。</h2><p>作業履歴ではなく、同じBuyer Promptで候補入りしたかどうかの差分だけを表示します。改善が効いた可能性のある場所と、まだ候補外の場所を分けます。</p></div><div className="movement-grid"><article><span><TrendIcon />候補入り</span><h3>{change.newPromptWins ? `${change.newPromptWins}質問で新しく候補入り` : "新しい候補入りは未確認"}</h3><p>Baselineでは候補外、今回の測定では候補入りになったBuyer Promptです。</p></article><article><span><WarningIcon />候補外</span><h3>{change.newPromptLosses ? `${change.newPromptLosses}質問で新しく候補外` : "新しい候補外は未確認"}</h3><p>一時的な変化は次回測定も確認し、単発の揺れと継続変化を分けます。</p></article><article><span><QuoteIcon />Citation</span><h3>{change.newCitations}件の新しい引用元</h3><p>自社・競合の推薦理由に使われたURLの差分です。</p></article></div></section>

    <section className="result-section evidence-section"><div className="shell"><div className="section-heading"><p className="eyebrow">NEXT GAP · {pendingGaps.length}</p><h2>次に埋めるべき情報差。</h2><p>AIXが公開Webで確認できない情報だけを聞きます。企業にしか分からない事実を補うと、次のActionをより具体化できます。入力は非公開です。</p></div><div className="evidence-grid evidence-input-grid">{watch.latest.evidenceGaps.slice(0, 4).map((gap) => {
      const answer = watch.evidence.find((item) => item.gapId === gap.id);
      return <article key={gap.id}><header><span>{gap.relatedPromptCount} prompts</span><strong>{answer ? "入力済み" : "未確認"}</strong></header><h3>{gap.label}</h3><p>{answer ? answer.value : gap.whyItMatters}</p>{answer ? <small>{answer.status}</small> : <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={values[gap.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で入力" /><button className="button button-dark" disabled={saving === gap.id}>{saving === gap.id ? "保存中…" : "非公開で保存"}<ArrowIcon /></button></form>}</article>;
    })}</div></div></section>

    <section className="result-section shell"><div className="section-heading"><p className="eyebrow">NEXT ACTIONS</p><h2>次に効かせる順番。</h2><p>候補外Buyer Prompt、Citation、Evidence差、実装負担から、次に検証する変更を優先順位付けします。</p></div><div className="action-list">{watch.latest.actions.slice(0, 5).map((action, index) => <article key={action.id}><span className={`priority priority-${action.priority}`}>{action.priority}</span><div><small>0{index + 1} · {action.type}</small><h3>{action.title}</h3><p>{action.rationale}</p></div><aside><strong>{action.relatedPromptCount}</strong><small>related prompts</small><em>{action.target}</em></aside></article>)}</div></section>

    <section className="paid-cta"><div className="shell paid-grid"><div><p className="eyebrow">FOUNDER WATCH</p><h2>毎週、<br />「何が効いたか → 次に何を直すか」を回す。</h2><p>固定Core Prompt 50件を同じ条件で追跡し、改善の答え合わせと次の優先Actionを更新します。</p><ul><li>候補入り / 候補外の差分</li><li>全AI回答とCitation</li><li>Evidence Inbox</li><li>Change Packと優先Action</li><li>12か月履歴</li></ul></div><article><small>月額・税別・1ブランド</small><strong>¥29,800</strong>{watch.paid ? <Link className="button button-accent" href={`/billing?token=${encodeURIComponent(token)}`}>契約を管理 <ArrowIcon /></Link> : <button className="button button-accent" type="button" onClick={checkout} disabled={checkoutBusy}>{checkoutBusy ? "Checkoutを準備中…" : watch.status === "expired" || watch.status === "cancelled" ? "改善サイクルを毎週回す" : "このWatchを継続する"}<ArrowIcon /></button>}<p>{watch.paid ? "支払方法、請求履歴、更新、解約はStripe Customer Portalで管理します。" : "無料Watchから自動課金されません。Stripe Checkoutで契約条件を確認してから開始します。"}</p></article></div></section>
    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
