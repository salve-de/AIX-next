"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sampleWatch } from "@/lib/sample-data";
import type { ChangePack, WatchRecord } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function comparisonLabel(watch: WatchRecord) {
  return watch.latest.panel.kind === "core" ? "固定した比較質問" : "前回と同じ比較質問";
}

function sampleChangePack(watch: WatchRecord): ChangePack {
  return {
    generatedAt: watch.latest.measuredAt,
    sourceMeasurementId: watch.latest.scanId,
    model: "fictional-sample",
    items: [{
      id: "sample-change-1",
      actionId: "action-segment-proof",
      title: "企業規模別の導入実績ページを追加",
      target: "導入事例・サービス概要",
      objective: "同規模企業の導入実績を比較材料として確認できる状態にする",
      factsUsed: [],
      proposedTitle: "従業員100〜500名企業でのNEXORA Cloud導入事例",
      proposedLead: "法務・購買部門で取引先審査を行う中規模企業向けに、導入背景・対象業務・導入期間を確認できる事例をまとめます。",
      sections: [
        { heading: "導入前の課題", body: "審査対象の増加により、Excelとメールでの確認・更新管理が分散していた背景を、確認済み事実だけで記載します。" },
        { heading: "導入範囲と運用", body: "対象部署、審査対象、標準導入期間、運用フローを比較しやすい形式で掲載します。数値は企業確認後に公開します。" },
      ],
      faq: [{ question: "従業員300名規模でも利用できますか？", answer: "確認済みの対象規模・導入条件をもとに、適用範囲を明記します。" }],
      relatedPromptIds: ["prompt_1", "prompt_2"],
      publishChecks: ["導入企業から公開許諾を取得", "導入期間と対象部署の事実確認"],
    }],
  };
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
  const [changePackBusy, setChangePackBusy] = useState(false);

  useEffect(() => {
    if (sample) return;
    if (!token) {
      setError("モニタリングURLが正しくありません。");
      setLoading(false);
      return;
    }
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "モニタリング結果を取得できませんでした。");
        setWatch(data);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "モニタリング結果を取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  const change = useMemo(() => {
    if (!watch) return null;
    const comparable = watch.baseline.panel.kind === watch.latest.panel.kind
      && watch.baseline.panel.version === watch.latest.panel.version
      && watch.baseline.panel.promptCount === watch.latest.panel.promptCount;
    const baselineLostIds = new Set(watch.baseline.lostPrompts.map((item) => item.promptId));
    const latestLostIds = new Set(watch.latest.lostPrompts.map((item) => item.promptId));
    const baselineCitations = new Set(watch.baseline.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    const latestCitations = new Set(watch.latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    return {
      comparable,
      rank: comparable ? watch.baseline.marketPosition - watch.latest.marketPosition : 0,
      baselineShortlisted: Math.max(0, watch.baseline.panel.promptCount - baselineLostIds.size),
      latestShortlisted: Math.max(0, watch.latest.panel.promptCount - latestLostIds.size),
      baselineLost: baselineLostIds.size,
      latestLost: latestLostIds.size,
      wonPrompts: watch.baseline.lostPrompts.filter((item) => !latestLostIds.has(item.promptId)),
      newlyLostPrompts: watch.latest.lostPrompts.filter((item) => !baselineLostIds.has(item.promptId)),
      newCitations: [...latestCitations].filter((url) => !baselineCitations.has(url)).length,
    };
  }, [watch]);

  async function saveEvidence(event: FormEvent, gapId: string) {
    event.preventDefault();
    if (sample || !token || !values[gapId]?.trim()) return;
    setSaving(gapId);
    setError("");
    try {
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, gapId, value: values[gapId] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存できませんでした。");
      setWatch(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "保存できませんでした。");
    } finally {
      setSaving("");
    }
  }

  async function checkout() {
    if (sample) {
      setError("サンプル画面では決済を開始しません。");
      return;
    }
    setCheckoutBusy(true);
    setError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "契約手続きを開始できませんでした。");
      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "契約手続きを開始できませんでした。");
    } finally {
      setCheckoutBusy(false);
    }
  }

  async function generateChangePack() {
    if (sample || !token) return;
    setChangePackBusy(true);
    setError("");
    try {
      const response = await fetch("/api/change-pack", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "変更原稿を作成できませんでした。");
      setWatch((current) => current ? { ...current, changePack: data.changePack } : current);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "変更原稿を作成できませんでした。");
    } finally {
      setChangePackBusy(false);
    }
  }

  if (loading) return <div className="full-loading">モニタリング結果を読み込んでいます。</div>;
  if (!watch || !change) return <main className="empty-page"><h1>モニタリング結果を表示できません。</h1><p>{error}</p><Link className="button button-dark" href="/">無料診断へ戻る</Link></main>;

  const firstAction = watch.latest.actions[0];
  const remainingLosses = watch.latest.lostPrompts.slice(0, 3);
  const pendingGapCount = watch.latest.evidenceGaps.filter((gap) => !watch.evidence.some((answer) => answer.gapId === gap.id)).length;
  const stopped = ["expired", "cancelled"].includes(watch.status);
  const visibleChangePack = watch.changePack || (sample ? sampleChangePack(watch) : null);
  const statusText = watch.status === "expired"
    ? "14日間の無料モニタリングは終了しました。自動課金はされていません。"
    : watch.status === "cancelled"
      ? "有料モニタリングは解約済みです。過去の結果は引き続き確認できます。"
      : watch.status === "past_due"
        ? "決済の確認が必要です。契約管理から支払情報を確認してください。"
        : "";
  const points = watch.history.map((item, index) => ({
    x: 44 + index * (520 / Math.max(1, watch.history.length - 1)),
    y: 170 - item.recommendationCoverage * 2.8,
  }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${Math.max(25, point.y)}`).join(" ");

  return <main className="ux2-watch-page">
    <SiteHeader compact />

    <section className="ux2-watch-top"><div className="shell">
      <div className="ux2-watch-top-row">
        <div>
          <p className="ux2-label">{sample ? "架空サンプル · 継続モニタリング" : "継続モニタリング"}</p>
          <h1>前回の改善後、<br />AI比較は {watch.baseline.marketPosition}位 → <b>{watch.latest.marketPosition}位</b>。</h1>
          <p>{comparisonLabel(watch)}で再測定。候補入り質問は {change.baselineShortlisted} → {change.latestShortlisted}。まず「何が良くなったか」と「次に何を直すか」を確認します。</p>
        </div>
        <span className="ux2-next-run">{stopped ? "測定停止" : `次回 ${formatDate(watch.nextRunAt)}`}</span>
      </div>
      <div className="ux2-watch-kpis">
        <article><small>AI比較での位置</small><strong>{watch.baseline.marketPosition}位 → <b>{watch.latest.marketPosition}位</b></strong><span>{change.comparable ? `${change.rank >= 0 ? "+" : ""}${change.rank}順位` : "新しい基準値"}</span></article>
        <article><small>候補入り質問</small><strong>{change.baselineShortlisted} → <b>{change.latestShortlisted}</b></strong><span>{watch.latest.panel.promptCount}質問</span></article>
        <article><small>候補外質問</small><strong>{change.baselineLost} → <b>{change.latestLost}</b></strong><span>{watch.latest.panel.promptCount}質問</span></article>
        <article><small>新しく候補入り</small><strong><b>+{change.wonPrompts.length}質問</b></strong><span>{change.newlyLostPrompts.length ? `新しく候補外 ${change.newlyLostPrompts.length}` : "新しい候補外なし"}</span></article>
      </div>
    </div></section>

    {statusText ? <section className="watch-status-banner"><div className="shell"><strong>{statusText}</strong></div></section> : null}

    <section className="ux2-watch-section white"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">今回の変化</p><h2>どの比較質問を取り戻したか。</h2><p>単なる作業履歴ではなく、前回は候補外だった質問が今回どう変わったかを見ます。</p></div></div>
      <div className="ux2-movement-grid">
        <article><small>新しく候補入り</small><h3>{change.wonPrompts.length ? `${change.wonPrompts.length}質問で候補入り` : "新しい候補入りは未確認"}</h3><p>{change.wonPrompts.slice(0, 2).map((item) => `「${item.prompt}」`).join(" / ") || "次回も同じ質問で変化を確認します。"}</p></article>
        <article><small>新しく候補外</small><h3>{change.newlyLostPrompts.length ? `${change.newlyLostPrompts.length}質問で候補外` : "新しい候補外なし"}</h3><p>{change.newlyLostPrompts.slice(0, 2).map((item) => `「${item.prompt}」`).join(" / ") || "今回、新たに落ちた比較質問は確認されませんでした。"}</p></article>
        <article><small>新しい引用元</small><h3>{change.newCitations}件</h3><p>自社・競合の推薦理由に使われたURLの差分です。</p></article>
      </div>
    </div></section>

    <section className="ux2-watch-section"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">まだ残っている問題</p><h2>重要な候補外質問と、次に直すこと。</h2><p>改善した箇所だけでなく、まだ比較候補に入れていない場所を次のActionへつなげます。</p></div></div>
      <div className="ux2-question-table">
        <div className="ux2-question-row header"><div>まだ候補外の比較質問</div><div>自社</div><div>最も選ばれた競合</div><div>状態</div></div>
        {remainingLosses.map((loss) => <div className="ux2-question-row" key={loss.promptId}><div><strong>「{loss.prompt}」</strong></div><div><span className="ux2-status-lost">候補外</span></div><div><strong>{loss.winner || "特定できず"}</strong></div><div><small>継続確認</small></div></div>)}
      </div>
      {firstAction ? <div className="ux2-next-action" style={{ marginTop: 16 }}><small>次に検証する変更</small><h2>{firstAction.title}</h2><p>{firstAction.rationale}</p><div className="ux2-action-meta"><span>{firstAction.relatedPromptCount}質問に関連</span><span>対象: {firstAction.target}</span></div></div> : null}
    </div></section>

    <section className="ux2-watch-section white"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">変更原稿</p><h2>「何を直す？」を、そのまま編集できる形へ。</h2><p>公開Webと企業が確認した事実だけを使い、見出し・本文・FAQ・公開前チェックまで作ります。AIXが勝手にサイトへ公開することはありません。</p></div></div>
      {visibleChangePack ? <div className="ux2-change-pack">{visibleChangePack.items.map((item) => <article className="ux2-change-item" key={item.id}>
        <header><div><small>{item.target}</small><h3>{item.title}</h3></div><span>{item.relatedPromptIds.length}質問</span></header>
        <div className="ux2-change-body"><small>提案見出し</small><strong>{item.proposedTitle}</strong>{item.proposedLead ? <p>{item.proposedLead}</p> : null}{item.sections.slice(0, 3).map((section) => <div className="ux2-change-section" key={section.heading}><b>{section.heading}</b><p>{section.body}</p></div>)}{item.faq.slice(0, 2).map((faq) => <div className="ux2-change-section" key={faq.question}><b>FAQ: {faq.question}</b><p>{faq.answer}</p></div>)}</div>
        {item.publishChecks.length ? <div className="ux2-change-checks">公開前に確認: {item.publishChecks.join(" · ")}</div> : null}
      </article>)}</div> : watch.paid ? <div className="ux2-account-card"><h2>最新測定から変更原稿を作成</h2><p>現在の候補外質問・比較材料の差・企業入力を使って、最大3件の変更ドラフトを生成します。</p><button className="button button-dark" type="button" onClick={generateChangePack} disabled={changePackBusy || watch.status !== "active"}>{changePackBusy ? "作成中…" : <>変更原稿を作成 <ArrowIcon /></>}</button></div> : <div className="ux2-account-card"><h2>AIX Monitorで利用できます</h2><p>最優先の改善を、見出し・本文・FAQ・公開前チェックまで編集可能な原稿へ変換します。サンプルでは実際の形式を確認できます。</p><Link className="button button-dark" href="/pricing">料金と内容を見る <ArrowIcon /></Link></div>}
    </div></section>

    <section className="ux2-watch-section"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">確認が必要な事実 · {pendingGapCount}</p><h2>企業にしか分からない情報を補う。</h2><p>公開Webで確認できなかった事実だけを聞きます。変更原稿を生成するときは、入力内容がOpenAIへ送信される場合があります。</p></div></div>
      <div className="ux2-evidence-list">{watch.latest.evidenceGaps.slice(0, 3).map((gap) => {
        const answer = watch.evidence.find((item) => item.gapId === gap.id);
        return <article className="ux2-evidence-card" key={gap.id}><small>{gap.relatedPromptCount}質問に関連 · {answer ? "入力済み" : "未確認"}</small><h3>{gap.label}</h3><p>{answer ? answer.value : gap.whyItMatters}</p>{answer ? null : <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={values[gap.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で入力" /><button className="button button-dark" disabled={saving === gap.id}>{saving === gap.id ? "保存中…" : "保存"}</button></form>}</article>;
      })}</div>
    </div></section>

    <section className="ux2-watch-section white"><div className="shell">
      <div className="ux2-report-heading"><div><p className="ux2-label">推移</p><h2>長期的な変化を確認する。</h2><p>Actionを確認したあとで、同条件の測定推移を補助的に見ます。</p></div></div>
      <div className="ux2-chart-card"><header><div><small>AI回答で自社が候補入り</small><strong>{watch.latest.ownRecommendationCount} / {watch.latest.successfulObservations}</strong></div><span>{watch.history.length}回の測定</span></header><div className="ux2-chart"><svg viewBox="0 0 610 210" preserveAspectRatio="none" aria-hidden="true"><path className="grid" d="M35 40H590M35 95H590M35 150H590" /><path className="line" d={path || "M44 150L566 150"} />{points.map((point, index) => <circle key={index} className={index === points.length - 1 ? "last" : ""} cx={point.x} cy={Math.max(25, point.y)} r={index === points.length - 1 ? 7 : 5} />)}</svg></div></div>
    </div></section>

    <section className="ux2-paid-cta"><div className="shell ux2-paid-grid">
      <div><p className="ux2-label">AIX MONITOR</p><h2>毎週、「何が変わった → 次に何を直す」を更新する。</h2><p>固定した比較質問を継続測定し、候補入り・候補外の差分、次のAction、変更原稿を更新します。</p>{!sample && token ? <p><Link className="ux2-link" href={`/data-rights?token=${encodeURIComponent(token)}`}>データ管理</Link></p> : null}</div>
      <aside className="ux2-paid-card"><small>月額・税別・1ブランド</small><strong>¥29,800</strong>{watch.paid && !sample ? <Link className="button button-accent" href={`/billing?token=${encodeURIComponent(token)}`}>契約を管理 <ArrowIcon /></Link> : <button className="button button-accent" type="button" onClick={checkout} disabled={checkoutBusy}>{checkoutBusy ? "準備中…" : "AIX Monitorを開始"}<ArrowIcon /></button>}<p>無料期間から自動課金されません。契約条件はCheckoutで確認できます。</p></aside>
    </div></section>

    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
