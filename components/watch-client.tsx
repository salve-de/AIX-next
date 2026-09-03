"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, QuoteIcon, WarningIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { PublicWatch, PublicWatchMeasurementRun } from "@/lib/public-dto";
import { sampleWatch } from "@/lib/sample-data";
import type { PromptPanelKind } from "@/lib/types";

type WatchView = PublicWatch & { measurementRun?: PublicWatchMeasurementRun | null };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function panelDescription(watch: { latest: { panel: { kind: PromptPanelKind } } }) {
  return watch.latest.panel.kind === "core" ? "同じ質問を固定して" : "同じ質問で";
}

function downloadText(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function WatchClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchView | null>(sample ? sampleWatch() : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [changePackBusy, setChangePackBusy] = useState(false);

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Watch tokenがありません。"); setLoading(false); return; }
    let cancelled = false;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as WatchView & { error?: string };
        if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。");
        if (!cancelled) setWatch(data);
      })
      .catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : "Watchを取得できませんでした。"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [sample, token]);

  const measurementStatus = watch?.measurementRun?.status;
  useEffect(() => {
    if (sample || !token || !measurementStatus || !["pending", "running"].includes(measurementStatus)) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" });
        const data = await response.json() as WatchView & { error?: string };
        if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。");
        if (!cancelled) setWatch(data);
      } catch (caught) {
        // Keep the current result visible while a transient poll fails. The
        // next interval can recover without interrupting the measurement.
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Watchを取得できませんでした。");
      }
    };
    const interval = window.setInterval(poll, 4_000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [measurementStatus, sample, token]);

  const change = useMemo(() => {
    if (!watch) return null;
    const comparable = watch.baseline.panel.kind === watch.latest.panel.kind && watch.baseline.panel.version === watch.latest.panel.version && watch.baseline.panel.promptCount === watch.latest.panel.promptCount;
    const baselineLost = new Set(watch.baseline.lostPrompts.map((item) => item.promptId));
    const latestLost = new Set(watch.latest.lostPrompts.map((item) => item.promptId));
    const baselineCitations = new Set(watch.baseline.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    const latestCitations = new Set(watch.latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    return {
      comparable,
      rank: comparable ? watch.baseline.marketPosition - watch.latest.marketPosition : 0,
      baselineShortlisted: Math.max(0, watch.baseline.panel.promptCount - baselineLost.size),
      latestShortlisted: Math.max(0, watch.latest.panel.promptCount - latestLost.size),
      baselineLost: baselineLost.size,
      latestLost: latestLost.size,
      newPromptWins: [...baselineLost].filter((promptId) => !latestLost.has(promptId)).length,
      newPromptLosses: [...latestLost].filter((promptId) => !baselineLost.has(promptId)).length,
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

  async function manageBilling() {
    if (sample) return;
    setCheckoutBusy(true); setError("");
    try {
      const endpoint = watch?.paid ? "/api/billing/portal" : "/api/billing/checkout";
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (watch?.paid ? "契約管理を開けませんでした。" : "契約画面を開けませんでした。"));
      window.location.assign(data.url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : (watch?.paid ? "契約管理を開けませんでした。" : "契約画面を開けませんでした。")); }
    finally { setCheckoutBusy(false); }
  }

  async function generateChangePack() {
    if (sample || !token) return;
    setChangePackBusy(true); setError("");
    try {
      const response = await fetch("/api/change-pack", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "改善案を作成できませんでした。");
      setWatch((current) => current ? { ...current, changePack: data.changePack } : current);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "改善案を作成できませんでした。"); }
    finally { setChangePackBusy(false); }
  }

  if (loading) return <div className="full-loading">推薦結果を読み込んでいます。</div>;
  if (!watch || !change) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>推薦の変化を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">無料診断へ戻る</Link></div></main>;

  const pendingGaps = watch.latest.evidenceGaps.filter((gap) => !watch.evidence.some((answer) => answer.gapId === gap.id));
  const primaryLoss = watch.latest.lostPrompts[0];
  const stopped = ["expired", "cancelled"].includes(watch.status);
  const measurementRun = watch.measurementRun;
  const measurementActive = Boolean(measurementRun && ["pending", "running"].includes(measurementRun.status));
  const statusText = watch.status === "expired" ? "無料期間は終了しました。自動課金はされていません。" : watch.status === "cancelled" ? "有料の追跡は解約済みです。過去の結果は確認できます。" : watch.status === "past_due" ? "支払いの確認が必要です。" : "";
  const meaningfulChanges = [change.newPromptWins > 0, change.newPromptLosses > 0, change.newCitations > 0, change.comparable && change.rank !== 0].filter(Boolean).length;
  const changeHeadline = change.newPromptWins > 0
    ? `${change.newPromptWins}問で、自社が新しく候補に入りました。`
    : change.newPromptLosses > 0
      ? `${change.newPromptLosses}問で、自社が候補から外れました。`
      : change.newCitations > 0
        ? `${change.newCitations}件のページが、新しく参照されました。`
        : "今回は、候補入りの大きな変化はありませんでした。";
  const changeDescription = meaningfulChanges > 0
    ? "同じ比較質問を比べた結果です。変化した内容だけを確認できます。"
    : "変化がないときは通知せず、次に動きがあったときだけ知らせます。";
  const samplePack = sample ? {
    generatedAt: watch.latest.measuredAt,
    sourceMeasurementId: "sample_scan",
    model: "fictional-sample",
    items: [{ id: "sample-change-1", actionId: "action-segment-proof", title: "企業規模別の導入実績ページを追加", target: "導入事例・サービス概要", objective: "同規模企業の導入実績を比較材料として確認できる状態にする", factsUsed: [], proposedTitle: "従業員100〜500名企業でのNEXORA Cloud導入事例", proposedLead: "法務・購買部門で取引先審査を行う中規模企業向けに、導入背景・対象業務・導入期間を確認できる事例をまとめます。", sections: [{ heading: "導入前の課題", body: "審査対象の増加により、Excelとメールでの確認・更新管理が分散していた背景を、確認済み事実だけで記載します。" }, { heading: "導入範囲と運用", body: "対象部署、審査対象、標準導入期間、運用フローを比較しやすい形式で掲載します。数値は企業確認後に公開します。" }], faq: [{ question: "従業員300名規模でも利用できますか？", answer: "確認済みの対象規模・導入条件をもとに、適用範囲を明記します。" }], relatedPromptIds: ["prompt_1", "prompt_2"], publishChecks: ["導入企業から公開許諾を取得", "導入期間と対象部署の事実確認"] }],
    aiReadable: { generatedAt: watch.latest.measuredAt, sourceMeasurementId: watch.latest.scanId, sourceUrl: "https://nexora.example", suggestedFileName: "ai-public-info-nexora.example", llmsTxt: "# NEXORA Cloud\n\n> 取引先審査の情報を整理する法人向けサービス。\n\n## 公式ページ\n\n- [サービス概要](https://nexora.example/service)\n- [導入事例](https://nexora.example/cases)\n\n## 公開前に確認すること\n\n- 会社名・サービス名・説明が公開ページと一致しているか確認する。\n- 料金・実績・認証などの数値を原典と照合する。\n- 自社ドメインに掲載する権限を確認する。\n", jsonLd: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebSite\",\n  \"name\": \"NEXORA Cloud\",\n  \"url\": \"https://nexora.example\",\n  \"description\": \"取引先審査の情報を整理する法人向けサービス。\",\n  \"inLanguage\": \"ja-JP\"\n}\n", sourcePages: [{ url: "https://nexora.example/service", title: "サービス概要", description: "取引先審査の情報を整理する法人向けサービス。" }, { url: "https://nexora.example/cases", title: "導入事例", description: "導入事例を紹介します。" }], publishChecks: ["会社名・サービス名・説明を原典と照合する", "料金・実績・認証・数値を公開前に確認する", "自社ドメインへ掲載する権限と更新担当者を確認する", "ページ上の見える説明とJSON-LD・llms.txtを一致させる", "robots.txtでAI検索クローラーを意図せず拒否していないか確認する"] },
    changeId: "sample-change-set",
    measurementPlan: { promptIds: ["prompt_1", "prompt_2"], successMetric: "同じ購入前質問で、自社が候補に入ったか", nextCheck: "公開後、同じAI面・地域・質問で再測定する" },
  } : null;
  const visibleChangePack = watch.changePack || samplePack;
  const points = watch.history.map((item, index) => ({ x: 28 + index * (544 / Math.max(1, watch.history.length - 1)), y: 174 - item.recommendationCoverage * 1.45 }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${Math.max(30, point.y)}`).join(" ");

  return <main className="watch-page">
    <SiteHeader compact />
    <section className="watch-header"><div className="shell"><div className="watch-header-row"><div><p className="overline">改善の効果を確認</p><h1>{watch.latest.discovery.brandName}</h1><p>{panelDescription(watch)}再測定し、今回変わったことだけを表示します。</p></div><div className="watch-header-actions">{stopped ? <span className="watch-status stopped"><i />停止中</span> : <span className="watch-status"><i />次回 {formatDate(watch.nextRunAt)}</span>}{sample ? <Link className="button button-primary" href="/pricing">毎週、変化を見る <ArrowIcon /></Link> : <button className="button button-primary" type="button" onClick={manageBilling} disabled={checkoutBusy}>{checkoutBusy ? "準備中…" : watch.paid ? "契約を管理" : "毎週、変化を見る"}<ArrowIcon /></button>}</div></div></div></section>
    {statusText ? <section className="watch-status-banner"><div className="shell"><WarningIcon /><span>{statusText}</span></div></section> : null}
    {measurementActive && measurementRun ? <section className="watch-measurement-progress" role="status" aria-live="polite" style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)" }}><div className="shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "15px 0", color: "var(--ink-soft)", fontSize: ".72rem" }}><span>{measurementRun.status === "pending" ? "再測定を準備しています。" : "再測定しています。"}</span><strong style={{ color: "var(--navy)" }}>{measurementRun.completedPrompts} / {measurementRun.totalPrompts}問を確認中</strong></div></section> : null}

    <section className={`watch-change-hero ${meaningfulChanges ? "has-change" : "no-change"}`}><div className="shell watch-change-hero-inner"><div><p className="overline">今回わかったこと</p><h2>{changeHeadline}</h2><p>{changeDescription}</p></div><div className="watch-change-hero-state"><span className="watch-change-state-dot" aria-hidden="true" /><strong>{meaningfulChanges > 0 ? "変化あり" : "変化なし"}</strong><small>{meaningfulChanges > 0 ? "同じ条件で確認" : "次の変化を待機"}</small></div></div></section>

    <section className="watch-summary shell"><div><span>市場での位置（参考）</span><strong>{watch.baseline.marketPosition}位 <b>→ {watch.latest.marketPosition}位</b></strong><small>今回のAI回答で確認</small></div><div><span>候補に入った比較質問</span><strong>{change.baselineShortlisted} <b>→ {change.latestShortlisted}</b></strong><small>{watch.latest.panel.promptCount}問中</small></div><div><span>まだ競合が先の質問</span><strong>{change.baselineLost} <b>→ {change.latestLost}</b></strong><small>{change.newPromptWins ? `候補入り ${change.newPromptWins}問` : "今回の変化を確認"}</small></div><div><span>新しく確認できた引用</span><strong><b>{change.newCitations ? `+${change.newCitations}` : "—"}</b></strong><small>{change.newCitations ? "前回との差分" : "新しい参照なし"}</small></div></section>

    <section className="watch-chart-section"><div className="shell"><div className="section-heading-simple"><p className="overline">候補入りの変化</p><h2>自社が候補に入る割合。</h2><p>前回と同じ質問だから、競合に流れていた場面をそのまま比べられます。</p></div><div className="watch-chart-panel"><div className="watch-chart-top"><strong>自社が候補に入った割合</strong><span>前回 {watch.baseline.recommendationCoverage}%　今回 {watch.latest.recommendationCoverage}%</span></div><div className="watch-chart"><svg viewBox="0 0 600 210" preserveAspectRatio="none" aria-hidden="true"><path className="chart-grid-line" d="M20 35H580M20 105H580M20 175H580" /><path className="chart-line" d={path || "M28 174L572 174"} />{points.map((point, index) => <circle key={index} className={index === points.length - 1 ? "chart-dot latest" : "chart-dot"} cx={point.x} cy={Math.max(30, point.y)} r={index === points.length - 1 ? 7 : 5} />)}</svg></div><div className="watch-chart-legend"><span>最初 {formatDate(watch.baseline.measuredAt)}</span><span>今回 {formatDate(watch.latest.measuredAt)}</span></div></div></div></section>

    <section className="watch-section shell"><div className="section-heading-simple"><p className="overline">今回変わったこと</p><h2>競合に流れた質問を、取り返せたか。</h2><p>同じ比較質問を比べ、顧客が候補を選ぶ場面の変化だけを表示します。</p></div>{meaningfulChanges > 0 ? <div className="watch-change-list">{change.newPromptWins > 0 ? <div><span className="change-mark good">+</span><div><strong>{change.newPromptWins}問で、自社が新しく候補に入りました</strong><p>競合に流れていた比較で、今回は自社が候補に入りました。</p></div></div> : null}{change.newPromptLosses > 0 ? <div><span className="change-mark bad">−</span><div><strong>{change.newPromptLosses}問で、自社が候補から外れました</strong><p>今回から競合が先になった比較です。</p></div></div> : null}{change.newCitations > 0 ? <div><span className="change-mark neutral"><QuoteIcon /></span><div><strong>{change.newCitations}件のページが新しく参照されました</strong><p>今回のAI回答で新しく確認できた公開ページです。</p></div></div> : null}{change.comparable && change.rank !== 0 ? <div><span className={`change-mark ${change.rank > 0 ? "good" : "bad"}`}>{change.rank > 0 ? "↑" : "↓"}</span><div><strong>参考順位が{Math.abs(change.rank)}つ変わりました</strong><p>今回のAI回答で確認した比較上の変化です。</p></div></div> : null}</div> : <div className="watch-no-change"><strong>今回は、候補入りの大きな変化はありません。</strong><p>同じ質問・同じ条件で確認を続け、変化があったときだけお知らせします。</p></div>}{primaryLoss ? <div className="watch-current-loss"><small>まだ競合が先の比較</small><strong>「{primaryLoss.prompt}」</strong><span>先に選ばれた競合: {primaryLoss.winner || "特定できず"}</span></div> : null}</section>

    <section className="watch-section watch-evidence"><div className="shell"><div className="section-heading-simple"><p className="overline">追加で確認できる情報（任意）</p><h2>分かる情報があれば、<br />次の比較に反映する。</h2><p>サイトで確認できなかった内容を入力できます。入力しなくても、比較結果と変化は確認できます。</p></div><div className="watch-input-list">{watch.latest.evidenceGaps.slice(0, 4).map((gap) => { const answer = watch.evidence.find((item) => item.gapId === gap.id); return <div key={gap.id}><div><strong>{gap.label}</strong><span>{gap.relatedPromptCount}問に関係</span></div>{answer ? <p className="saved-answer">{answer.value}</p> : <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={values[gap.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で入力" /><button className="text-button" disabled={saving === gap.id}>{saving === gap.id ? "保存中…" : "保存"}</button></form>}</div>; })}{!pendingGaps.length ? <p className="empty-inline">追加する内容はありません。</p> : null}</div></div></section>

    <section className="watch-section shell watch-change-pack"><div className="section-heading-simple"><p className="overline">次の修正</p><h2>競合に負けた理由を、<br />直す文章にする。</h2><p>確認できた情報だけで、公開前の編集案を作ります。</p></div>{visibleChangePack ? <div className="change-pack-document">{visibleChangePack.items.map((item, index) => <article key={item.id}><div className="change-pack-heading"><span>編集案 {index + 1}</span><strong>{item.title}</strong></div><div className="draft-heading"><small>見出し案</small><h3>{item.proposedTitle}</h3><p>{item.proposedLead}</p></div>{item.sections.slice(0, 3).map((section) => <div className="draft-section" key={section.heading}><small>{section.heading}</small><p>{section.body}</p></div>)}{item.faq.length ? <div className="draft-faq"><small>FAQ案</small>{item.faq.slice(0, 2).map((faq) => <p key={faq.question}><strong>{faq.question}</strong><span>{faq.answer}</span></p>)}</div> : null}<footer><span>公開前に確認</span>{item.publishChecks.join(" ・ ")}</footer></article>)}</div> : watch.paid ? <div className="change-pack-empty"><h3>今回の結果から編集案を作る</h3><p>自社が外れた質問と足りない情報をもとに、最大3件の案を作ります。</p><button className="button button-secondary" type="button" onClick={generateChangePack} disabled={changePackBusy || watch.status !== "active"}>{changePackBusy ? "作成中…" : "編集案を作る"}<ArrowIcon /></button></div> : <div className="watch-locked"><div><strong>毎週の確認なら、直す文章まで作れます。</strong><p>有料プランでは、競合に負けた理由から次に直す内容を作れます。公開前に社内で確認できます。</p></div><Link className="button button-secondary" href="/pricing">料金を見る <ArrowIcon /></Link></div>}{watch.paid && visibleChangePack && !visibleChangePack.aiReadable && !sample ? <div className="change-pack-refresh"><p>AI向け公開情報の下書きを追加できます。</p><button className="button button-secondary" type="button" onClick={generateChangePack} disabled={changePackBusy || watch.status !== "active"}>{changePackBusy ? "作成中…" : "AI向け下書きを作る"}<ArrowIcon /></button></div> : null}</section>

    {visibleChangePack?.measurementPlan ? <section className="watch-section shell watch-measurement-plan"><div><p className="overline">この変更の確認方法</p><h2>公開したあと、<br />同じ質問で確かめる。</h2><p>{visibleChangePack.measurementPlan.successMetric}</p></div><div className="watch-measurement-plan-detail"><span>対象の質問<strong>{visibleChangePack.measurementPlan.promptIds.length}件</strong></span><span>次の確認<strong>{visibleChangePack.measurementPlan.nextCheck}</strong></span></div></section> : null}

    {visibleChangePack?.aiReadable ? <section className="watch-section shell watch-ai-readable"><div className="section-heading-simple"><p className="overline">AI向け公開情報</p><h2>公開ページの事実を、<br />AIにも読みやすく整える。</h2><p>実際に取得できた公開ページから下書きを作ります。内容を確認してから、自社で公開できます。</p><Link className="text-button" href={sample ? "/ai-info?sample=1" : `/ai-info?token=${encodeURIComponent(token)}`}>下書きの中身を確認する <ArrowIcon /></Link></div><div className="ai-readable-panel"><div className="ai-readable-panel-head"><div><strong>{visibleChangePack.aiReadable.sourcePages.length}ページから作成</strong><span>自動公開はしません</span></div><small>測定 {formatDate(visibleChangePack.aiReadable.generatedAt)}</small></div><div className="ai-readable-actions"><button className="button button-secondary" type="button" onClick={() => downloadText(`${visibleChangePack.aiReadable?.suggestedFileName || "ai-public-info"}.txt`, visibleChangePack.aiReadable?.llmsTxt || "", "text/plain;charset=utf-8")}>公開情報のテキストを取得</button><button className="button button-secondary" type="button" onClick={() => downloadText(`${visibleChangePack.aiReadable?.suggestedFileName || "ai-public-info"}.jsonld`, visibleChangePack.aiReadable?.jsonLd || "", "application/ld+json;charset=utf-8")}>構造化データを取得</button></div><details><summary>公開前に確認すること</summary><ul>{visibleChangePack.aiReadable.publishChecks.map((check) => <li key={check}>{check}</li>)}</ul></details></div></section> : null}

    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
