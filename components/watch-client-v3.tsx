"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, BotIcon, EvidenceIcon, EyeIcon, QuoteIcon, SparkIcon, TrendIcon, TrophyIcon, WarningIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PROVIDER_LABELS, PROVIDER_ORDER } from "@/lib/provider-meta";
import { sampleWatch } from "@/lib/sample-data";
import { compareWatchRuns } from "@/lib/watch-diff";
import type { ProviderName, WatchRecord } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function pct(value: number | null) {
  if (value === null) return "—";
  return `${value >= 0 ? "+" : ""}${value}pt`;
}

export function WatchClientV3() {
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
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。");
        setWatch(data);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Watchを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  const diff = useMemo(() => watch ? compareWatchRuns(watch.baseline, watch.latest) : null, [watch]);

  async function saveEvidence(event: FormEvent, gapId: string) {
    event.preventDefault();
    const value = values[gapId]?.trim();
    if (!value) return;
    if (sample) {
      setWatch((current) => current ? ({ ...current, evidence: [...current.evidence.filter((item) => item.gapId !== gapId), { gapId, value, status: "company_asserted", updatedAt: new Date().toISOString() }] }) : current);
      setValues((current) => ({ ...current, [gapId]: "" }));
      return;
    }
    if (!token) return;
    setSaving(gapId); setError("");
    try {
      const response = await fetch("/api/evidence", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, gapId, value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存できませんでした。");
      setWatch(data);
      setValues((current) => ({ ...current, [gapId]: "" }));
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
  if (!watch || !diff) return <main className="empty-page"><h1>Watchを表示できません。</h1><p>{error}</p><Link className="button button-dark" href="/">無料診断へ戻る</Link></main>;

  const workspaceHref = sample ? "/workspace?sample=1" : `/workspace?token=${encodeURIComponent(token)}`;
  const agentHref = sample ? "/workspace/agent-analytics?sample=1" : `/workspace/agent-analytics?token=${encodeURIComponent(token)}`;
  const pendingGaps = watch.latest.evidenceGaps.filter((gap) => !watch.evidence.some((answer) => answer.gapId === gap.id));
  const topAction = watch.latest.actions[0];
  const points = watch.history.map((item, index) => ({ x: 44 + index * (520 / Math.max(1, watch.history.length - 1)), y: 170 - item.recommendationCoverage * 2.8 }));
  const path = points.map((point, index) => `${index ? "L" : "M"}${point.x} ${Math.max(25, point.y)}`).join(" ");
  const expectedProviders = watch.paid ? PROVIDER_ORDER : (["openai", "gemini", "perplexity"] as ProviderName[]);
  const surfaceRows = expectedProviders.map((provider) => {
    const scheduled = watch.latest.observations.filter((item) => item.provider === provider);
    const success = scheduled.filter((item) => item.status === "success");
    return { provider, success: success.length, scheduled: scheduled.length, ready: scheduled.length > 0 && success.length === scheduled.length };
  });
  const healthy = surfaceRows.filter((item) => item.ready).length;
  const discovery = watch.discoveryLatest;
  const customCount = watch.customPrompts?.length || 0;

  return <main className="watch-v3-root">
    <SiteHeader compact />

    <section className="watch-v3-hero">
      <div className="shell watch-v3-title-row">
        <div>
          <p className="eyebrow">WEEKLY AI BUYER BRIEF · {sample ? "FICTIONAL SAMPLE" : watch.status.toUpperCase()}</p>
          <h1>{watch.latest.discovery.brandName}の<br /><span>今週のAI購買面。</span></h1>
          <p>固定Coreだけで先週と比較し、変わったBuyer Prompt、推薦、Citation、比較材料を先に出します。</p>
        </div>
        <aside>
          <span><i className="watch-live-dot" />次回 {formatDate(watch.nextRunAt)}</span>
          <strong>{healthy}/{expectedProviders.length} AI surfaces healthy</strong>
          <small>{watch.paid ? "Founder Watch · 50 Core · 3 reps" : `14-day Watch · ${watch.latest.panel.promptCount} Core · 1 rep`}</small>
        </aside>
      </div>
    </section>

    <section className="shell watch-v3-summary">
      <div className="watch-v3-verdict">
        <p className="eyebrow">WHAT CHANGED</p>
        {diff.comparable ? <>
          <h2>{diff.newWins > diff.newLosses ? `新しく${diff.newWins}面で候補入り。` : diff.newLosses ? `${diff.newLosses}面で候補から外れた。` : "主要な推薦変化は未確認。"}</h2>
          <p>同じPrompt × 同じAI surfaceで、必要な反復数を満たした比較だけを数えています。{diff.skippedCells ? ` ${diff.skippedCells}セルは回答不足のため差分判定から除外しました。` : ""}</p>
        </> : <>
          <h2>新しいBaselineです。</h2>
          <p>Panel、反復数、AI surface構成が変わったため、以前の数値と無理に接続していません。</p>
        </>}
      </div>
      <div className="watch-v3-deltas">
        <article><EyeIcon /><small>Coverage差</small><strong>{pct(diff.coverageDelta)}</strong><span>Recommendation</span></article>
        <article><TrophyIcon /><small>新First Choice</small><strong>+{diff.newFirstChoices}</strong><span>Prompt × surface</span></article>
        <article><WarningIcon /><small>新候補外</small><strong>{diff.newLosses}</strong><span>Prompt × surface</span></article>
        <article><QuoteIcon /><small>新Citation</small><strong>{diff.newCitations.length}</strong><span>source URLs</span></article>
      </div>
    </section>

    <section className="shell watch-v3-core">
      <div className="watch-chart-card">
        <header><div><small>STABLE CORE · RECOMMENDATION COVERAGE</small><strong>{watch.latest.recommendationCoverage}%</strong></div><span>{diff.comparable ? pct(diff.coverageDelta) : "NEW BASELINE"}</span></header>
        <div className="watch-chart"><svg viewBox="0 0 610 210" preserveAspectRatio="none" aria-hidden="true"><path className="grid" d="M35 40H590M35 95H590M35 150H590" /><path className="line" d={path || "M44 150L566 150"} />{points.map((point, index) => <circle key={index} className={index === points.length - 1 ? "last" : ""} cx={point.x} cy={Math.max(25, point.y)} r={index === points.length - 1 ? 7 : 5} />)}</svg><span className="chart-baseline">Baseline {watch.baseline.recommendationCoverage}%</span><span className="chart-now">Now {watch.latest.recommendationCoverage}%</span></div>
      </div>
      <div className="watch-v3-core-kpis">
        <article><small>市場位置</small><strong>{watch.latest.marketPosition || "—"} / {watch.latest.marketSize}</strong><span>{diff.rankDelta === null ? "比較対象外" : `${diff.rankDelta >= 0 ? "+" : ""}${diff.rankDelta}順位`}</span></article>
        <article><small>First Choice</small><strong>{watch.latest.firstChoiceRate}%</strong><span>第一候補</span></article>
        <article><small>Own Citation</small><strong>{watch.latest.citationCoverage}%</strong><span>自社URL</span></article>
        <article><small>Repeat Agreement</small><strong>{watch.latest.repeatAgreement}%</strong><span>{watch.latest.panel.repetitions} reps</span></article>
        <article><small>測定完了率</small><strong>{watch.latest.measurementCompleteness}%</strong><span>{watch.latest.successfulObservations}/{watch.latest.scheduledObservations}</span></article>
        <article><small>比較材料待ち</small><strong>{pendingGaps.length}</strong><span>Need You</span></article>
      </div>
    </section>

    <section className="result-section shell">
      <div className="section-heading"><p className="eyebrow">SURFACE HEALTH</p><h2>AIごとに、測定の状態を分ける。</h2><p>失敗・未設定surfaceをブランドの負けとして数えません。</p></div>
      <div className="watch-v3-surfaces">{surfaceRows.map((row) => <article key={row.provider} className={row.ready ? "ready" : "partial"}><div><i /><strong>{PROVIDER_LABELS[row.provider]}</strong></div><span>{row.success}/{row.scheduled || 0} success</span></article>)}</div>
    </section>

    <section className="result-section watch-v3-explore">
      <div className="shell">
        <div className="section-heading"><p className="eyebrow">TRACK + DISCOVER + CUSTOM</p><h2>追跡と探索を混ぜない。</h2><p>Coreはトレンド、Discoveryは新しい購買場面、Customは御社固有の質問です。</p></div>
        <div className="watch-v3-panels">
          <article><TrendIcon /><small>STABLE CORE</small><strong>{watch.latest.panel.promptCount} prompts</strong><p>公式トレンドに使う固定Panel。</p><Link href={`${workspaceHref}&view=history`}>Core履歴を見る <ArrowIcon /></Link></article>
          <article><SparkIcon /><small>ROTATING DISCOVERY</small><strong>{discovery ? `${discovery.prompts.length} prompts` : watch.paid ? "次回生成" : "Founder機能"}</strong><p>{discovery ? `${discovery.lostPrompts.length}件の候補外テーマを探索。` : "Coreにない新しい購買場面を別Panelで探索。"}</p><Link href={workspaceHref}>Workspaceで確認 <ArrowIcon /></Link></article>
          <article><BotIcon /><small>CUSTOM PROMPTS</small><strong>{customCount}</strong><p>固有の質問を追加してもCore推移は変わりません。</p><Link href={workspaceHref}>Prompt Labを開く <ArrowIcon /></Link></article>
        </div>
      </div>
    </section>

    <section className="result-section evidence-section"><div className="shell"><div className="section-heading"><p className="eyebrow">NEED YOU · {pendingGaps.length}</p><h2>企業にしか分からない比較材料。</h2><p>AIXが公開Webで確認できない事実だけを聞きます。企業申告はverified扱いにしません。</p></div><div className="evidence-grid evidence-input-grid">{watch.latest.evidenceGaps.slice(0, 4).map((gap) => {
      const answer = watch.evidence.find((item) => item.gapId === gap.id);
      return <article key={gap.id}><header><span>{gap.relatedPromptCount} prompts</span><strong>{answer ? "入力済み" : "未確認"}</strong></header><h3>{gap.label}</h3><p>{answer ? answer.value : gap.whyItMatters}</p>{answer ? <small>{answer.status === "company_asserted" ? "企業申告" : answer.status}</small> : <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={values[gap.id] || ""} onChange={(event) => setValues((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で入力" /><button className="button button-dark" disabled={saving === gap.id}>{saving === gap.id ? "保存中…" : "非公開で保存"}<ArrowIcon /></button></form>}</article>;
    })}</div></div></section>

    <section className="result-section shell">
      <div className="watch-v3-next">
        <div><p className="eyebrow">NEXT BEST ACTION</p><h2>{topAction?.title || "今週の最優先Actionはありません。"}</h2><p>{topAction?.rationale || "CoreとDiscoveryの観測を継続します。"}</p></div>
        <aside>{topAction ? <><span>関連Prompt<strong>{topAction.relatedPromptCount}</strong></span><span>対象<strong>{topAction.target}</strong></span><Link className="button button-dark" href={`${workspaceHref}&view=actions`}>Change Packを作る <ArrowIcon /></Link></> : <Link className="button button-dark" href={workspaceHref}>Workspaceを開く <ArrowIcon /></Link>}</aside>
      </div>
    </section>

    <section className="watch-v3-workspace-band"><div className="shell"><div><p className="eyebrow">DEEP WORKSPACE</p><h2>Prompt・Citation・競合・Narrative・実行まで、全部同じProjectで。</h2></div><div><Link className="button button-light" href={workspaceHref}>統合Workspaceを開く <ArrowIcon /></Link><Link className="watch-v3-agent-link" href={agentHref}>実AI crawler / referralを見る</Link></div></div></section>

    {!watch.paid ? <section className="paid-cta"><div className="shell paid-grid"><div><p className="eyebrow">FOUNDER WATCH</p><h2>固定Coreを5 AIで追い、<br />探索・実行・再観測まで一つに。</h2><p>Core 50件をOpenAI・Gemini・Perplexity・Claude・Grokで各3回、毎週観測。Discovery 20件、Custom Prompt、Agent Analytics、Change Pack、GitHub PR / WordPress Draftまで同じProjectに含めます。</p><ul><li>50 Core + 20 Discovery</li><li>5 AI × 3 repetitions</li><li>全Raw回答・Citation・競合比較</li><li>Custom Prompt最大25件</li><li>Change Pack + 対象Prompt再測定</li><li>実AI crawler/referral ingest</li></ul></div><article><small>月額・税別・1ブランド</small><strong>¥29,800</strong><button className="button button-accent" type="button" onClick={checkout} disabled={checkoutBusy}>{checkoutBusy ? "Checkoutを準備中…" : "固定Core観測を継続する"}<ArrowIcon /></button><p>無料Watchから自動課金されません。Stripe Checkoutで契約条件を確認します。</p></article></div></section> : <section className="watch-v3-paid-active"><div className="shell"><div><p className="eyebrow">FOUNDER WATCH ACTIVE</p><h2>監視だけで終わらせず、次のActionへ。</h2></div><Link className="button button-accent" href={workspaceHref}>Workspaceで続ける <ArrowIcon /></Link></div></section>}

    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
