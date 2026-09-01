"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, EvidenceIcon, QuoteIcon, TrendIcon, WarningIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sampleWatch } from "@/lib/sample-data";
import type { WatchRecord } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
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
    const baselineWins = new Set(watch.baseline.observations.filter((item) => item.status === "success" && item.ownRecommended).map((item) => `${item.promptId}:${item.provider}`));
    const latestWins = new Set(watch.latest.observations.filter((item) => item.status === "success" && item.ownRecommended).map((item) => `${item.promptId}:${item.provider}`));
    const newWins = [...latestWins].filter((key) => !baselineWins.has(key)).length;
    const newLosses = [...baselineWins].filter((key) => !latestWins.has(key)).length;
    const baselineCitations = new Set(watch.baseline.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    const latestCitations = new Set(watch.latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    return { comparable, coverage: comparable ? watch.latest.recommendationCoverage - watch.baseline.recommendationCoverage : 0, rank: comparable ? watch.baseline.marketPosition - watch.latest.marketPosition : 0, newWins, newLosses, newCitations: [...latestCitations].filter((url) => !baselineCitations.has(url)).length };
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

  return <main>
    <SiteHeader compact />
    <section className="watch-hero"><div className="shell"><div className="watch-title-row"><div><p className="eyebrow">AIX WATCH · {sample ? "FICTIONAL SAMPLE" : watch.status.toUpperCase()}</p><h1>{watch.latest.discovery.brandName}の<br />AI shortlistを追跡中。</h1><p>同じCore Panelで、候補入り、候補外、Citation、競合差を比較します。</p></div><div className="live-pill"><i />次回測定 {formatDate(watch.nextRunAt)}</div></div></div></section>

    <section className="watch-overview shell">
      <div className="watch-chart-card"><header><div><small>RECOMMENDATION COVERAGE</small><strong>{watch.latest.recommendationCoverage}%</strong></div><span>{change.comparable ? `${change.coverage >= 0 ? "+" : ""}${change.coverage}pt since baseline` : "NEW BASELINE"}</span></header><div className="watch-chart"><svg viewBox="0 0 610 210" preserveAspectRatio="none" aria-hidden="true"><path className="grid" d="M35 40H590M35 95H590M35 150H590" /><path className="line" d={path || "M44 150L566 150"} />{points.map((point, index) => <circle key={index} className={index === points.length - 1 ? "last" : ""} cx={point.x} cy={Math.max(25, point.y)} r={index === points.length - 1 ? 7 : 5} />)}</svg><span className="chart-baseline">Baseline {watch.baseline.recommendationCoverage}%</span><span className="chart-now">Now {watch.latest.recommendationCoverage}%</span></div></div>
      <div className="watch-kpis"><article><small>市場順位</small><strong>{watch.latest.marketPosition || "—"} / {watch.latest.marketSize}</strong><span>{change.comparable ? `${change.rank >= 0 ? "+" : ""}${change.rank}順位` : "比較対象外"}</span></article><article><small>新しく候補入り</small><strong>+{change.newWins}</strong><span>AI回答</span></article><article><small>新しく候補外</small><strong>{change.newLosses}</strong><span>AI回答</span></article><article><small>新しいCitation</small><strong>{change.newCitations}</strong><span>source URLs</span></article><article><small>Repeat Agreement</small><strong>{watch.latest.repeatAgreement}%</strong><span>反復の一致度</span></article><article><small>確認が必要</small><strong>{pendingGaps.length}</strong><span>Evidence tasks</span></article></div>
    </section>

    <section className="result-section shell"><div className="section-heading"><p className="eyebrow">WHAT MOVED</p><h2>今週、変わった購買面。</h2><p>活動ログではなく、買い手が見るAI回答の変化を先に表示します。</p></div><div className="movement-grid"><article><span><TrendIcon />候補入り</span><h3>{change.newWins ? `${change.newWins}回答で新しく候補入り` : "新しい候補入りは未確認"}</h3><p>同じPromptとAI surfaceのBaselineと比較しています。</p></article><article><span><WarningIcon />候補外</span><h3>{change.newLosses ? `${change.newLosses}回答で候補から外れた` : "新しい候補外は未確認"}</h3><p>不安定なPromptはRepeat Agreementと併せて判断します。</p></article><article><span><QuoteIcon />Citation</span><h3>{change.newCitations}件の新しい引用元</h3><p>競合・自社の推薦理由に使われたURLの差分です。</p></article></div></section>

    <section className="result-section evidence-section"><div className="shell"><div className="section-heading"><p className="eyebrow">NEED YOU · {pendingGaps.length}</p><h2>企業にしか分からない事実。</h2><p>AIXが公開Webで確認できない情報だけを聞きます。入力は非公開です。</p></div><div className="evidence-grid evidence-input-grid">{watch.latest.evidenceGaps.slice(0, 4).map((gap) => {
      const answer = watch.evidence.find((item) => item.gapId === gap.id);
      return <article key={gap.id}><header><span>{gap.relatedPromptCount} prompts</span><strong>{answer ? "入力済み" : "未確認"}</strong></header><h3>{gap.label}</h3><p>{answer ? answer.value : gap.whyItMatters}</p>{answer ? <small>{answer.status}</small> : <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={values[gap.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で入力" /><button className="button button-dark" disabled={saving === gap.id}>{saving === gap.id ? "保存中…" : "非公開で保存"}<ArrowIcon /></button></form>}</article>;
    })}</div></div></section>

    <section className="result-section shell"><div className="section-heading"><p className="eyebrow">NEXT ACTIONS</p><h2>次に直す順番。</h2><p>Lost Prompt、Citation、Evidence差、実装負担から優先順位を付けます。</p></div><div className="action-list">{watch.latest.actions.slice(0, 5).map((action, index) => <article key={action.id}><span className={`priority priority-${action.priority}`}>{action.priority}</span><div><small>0{index + 1} · {action.type}</small><h3>{action.title}</h3><p>{action.rationale}</p></div><aside><strong>{action.relatedPromptCount}</strong><small>related prompts</small><em>{action.target}</em></aside></article>)}</div></section>

    <section className="paid-cta"><div className="shell paid-grid"><div><p className="eyebrow">FOUNDER WATCH</p><h2>監視を止めず、<br />次のEvidenceを更新し続ける。</h2><p>固定Core Prompt 50件を、OpenAI・Gemini・Perplexityで各3回、毎週観測します。</p><ul><li>全AI回答とCitation</li><li>Evidence Inbox</li><li>優先Action</li><li>12か月履歴</li></ul></div><article><small>月額・税別・1ブランド</small><strong>¥29,800</strong><button className="button button-accent" type="button" onClick={checkout} disabled={checkoutBusy || watch.paid}>{watch.paid ? "契約中" : checkoutBusy ? "Checkoutを準備中…" : "AIX Watchを継続する"}<ArrowIcon /></button><p>無料Watchから自動課金されません。Stripe Checkoutで契約条件を確認します。</p></article></div></section>
    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
