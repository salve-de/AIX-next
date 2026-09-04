"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, WarningIcon } from "@/components/icons";
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

export function WatchClient() {
  const params = useSearchParams();
  const customBrand = params.get("customBrand");
  const sample = params.get("sample") === "1" || Boolean(customBrand);
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchView | null>(sample ? sampleWatch(customBrand || undefined) : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);

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

    // 新たに候補入りを獲得した質問一覧（初回は負けていたが今回勝った質問）
    const newlyWonPromptIds = [...baselineLost].filter((promptId) => !latestLost.has(promptId));
    const newlyWonPrompts = (watch.latest.prompts || []).filter((p) => newlyWonPromptIds.includes(p.id));

    // 今回新しく競合に取られた質問一覧
    const newlyLostPromptIds = [...latestLost].filter((promptId) => !baselineLost.has(promptId));
    const newlyLostPrompts = (watch.latest.prompts || []).filter((p) => newlyLostPromptIds.includes(p.id));

    // ライバル各社のカバレッジ変動計算（baseline vs latest）
    const competitorMovements = watch.latest.competitors.slice(0, 5).map((latestComp) => {
      const baseComp = watch.baseline.competitors.find((c) => c.name === latestComp.name);
      const baseCov = baseComp ? baseComp.coverage : latestComp.coverage;
      const diff = latestComp.coverage - baseCov;
      return {
        name: latestComp.name,
        baselineCoverage: baseCov,
        latestCoverage: latestComp.coverage,
        diff,
      };
    });

    return {
      comparable,
      rank: comparable ? watch.baseline.marketPosition - watch.latest.marketPosition : 0,
      baselineShortlisted: Math.max(0, watch.baseline.panel.promptCount - baselineLost.size),
      latestShortlisted: Math.max(0, watch.latest.panel.promptCount - latestLost.size),
      baselineLost: baselineLost.size,
      latestLost: latestLost.size,
      newPromptWins: newlyWonPromptIds.length,
      newPromptLosses: newlyLostPromptIds.length,
      newCitations: [...latestCitations].filter((url) => !baselineCitations.has(url)).length,
      newlyWonPrompts,
      newlyLostPrompts,
      competitorMovements,
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

  async function manageBilling(withShareDiscount = false) {
    if (sample) return;
    setCheckoutBusy(true); setError("");
    try {
      const endpoint = watch?.paid ? "/api/billing/portal" : "/api/billing/checkout";
      const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, withShareDiscount }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (watch?.paid ? "契約管理を開けませんでした。" : "契約画面を開けませんでした。"));
      window.location.assign(data.url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : (watch?.paid ? "契約管理を開けませんでした。" : "契約画面を開けませんでした。")); }
    finally { setCheckoutBusy(false); }
  }

  if (loading) return <div className="full-loading">推薦結果を読み込んでいます。</div>;
  if (!watch || !change) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>推薦の変化を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">無料診断へ戻る</Link></div></main>;

  const primaryLoss = watch.latest.lostPrompts[0];
  const stopped = ["expired", "cancelled"].includes(watch.status);
  const measurementRun = watch.measurementRun;
  const measurementActive = Boolean(measurementRun && ["pending", "running"].includes(measurementRun.status));
  const statusText = watch.status === "expired" ? "無料期間は終了しました。自動課金はされていません。" : watch.status === "cancelled" ? "有料の追跡は解約済みです。過去の結果は確認できます。" : watch.status === "past_due" ? "支払いの確認が必要です。" : "";
  const meaningfulChanges = [change.newPromptWins > 0, change.newPromptLosses > 0, change.newCitations > 0, change.comparable && change.rank !== 0].filter(Boolean).length;
  const changeHeadline = change.newPromptWins > 0
    ? `${change.newPromptWins}問で、自社が新しく推薦候補に入りました。`
    : change.newPromptLosses > 0
      ? `${change.newPromptLosses}問で、自社が候補から外れました。`
      : change.newCitations > 0
        ? `${change.newCitations}件のページが、新しく参照されました。`
        : "今回は、候補入りの大きな変化はありませんでした。";
  const changeDescription = meaningfulChanges > 0
    ? "同じ比較質問を比べた結果です。自社サイト改修ゼロのまま、AI公式台帳の配備によりAIの推薦候補枠を獲得しやすくなっています。"
    : "変化がないときは通知せず、次に動きがあったときだけ知らせます。";
  const samplePack = sample ? {
    generatedAt: watch.latest.measuredAt,
    sourceMeasurementId: "sample_scan",
    model: "fictional-sample",
    items: [{ id: "sample-change-1", actionId: "action-segment-proof", title: "親身な個別伴走の専門ページを追加", target: "相談事例・サービス概要", objective: "親身な個別伴走体制を比較材料としてAIが確認できる状態にする", factsUsed: [], proposedTitle: "親身に寄り添う、あおば相続法務事務所の個別伴走事例", proposedLead: "大手のマニュアル対応では相談しづらいご遺族向けに、専任担当者が初回から完了まで寄り添うサポート事例をまとめます。", sections: [{ heading: "相談前の課題", body: "親族間の複雑な事情に対し、大手の事務的な対応では話しにくかった背景を、確認済み事実として記載します。" }, { heading: "支援内容と体制", body: "専任担当者による初回対面相談、個別事情の丁寧なヒアリング、円満解決までの進め方を掲載します。" }], faq: [{ question: "親族同士が直接話せない状態でも相談できますか？", answer: "公平中立な第三者として個別に丁寧に意向を伺い、円満合意を目指します。" }], relatedPromptIds: ["prompt_1", "prompt_2"], publishChecks: ["相談事例の事実確認", "守秘義務の遵守確認"] }],
    aiReadable: { generatedAt: watch.latest.measuredAt, sourceMeasurementId: watch.latest.scanId, sourceUrl: "https://aoba-souzoku.example.jp", suggestedFileName: "ai-public-info-aoba-souzoku", llmsTxt: "# あおば相続法務事務所\n\n> 相続・遺産分割・事業承継の個別親身な対応に特化した専門法務事務所。\n\n## 公式ページ\n\n- [業務概要](https://aoba-souzoku.example.jp/service)\n- [相談事例](https://aoba-souzoku.example.jp/cases)\n", jsonLd: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"WebSite\",\n  \"name\": \"あおば相続法務事務所\",\n  \"url\": \"https://aoba-souzoku.example.jp\",\n  \"description\": \"相続・遺産分割・事業承継の個別親身な対応に特化した専門法務事務所。\",\n  \"inLanguage\": \"ja-JP\"\n}\n", sourcePages: [{ url: "https://aoba-souzoku.example.jp/service", title: "業務概要", description: "相続・遺産分割・事業承継の専門相談。" }, { url: "https://aoba-souzoku.example.jp/cases", title: "相談事例", description: "円満解決の事例を紹介します。" }], publishChecks: ["事務所名・説明の照合", "料金・実績・仕様の確認"] },
    changeId: "sample-change-set",
    measurementPlan: { promptIds: ["prompt_1", "prompt_2"], successMetric: "同じ購入前質問で、自社が候補に入ったか", nextCheck: "公開後、同じAI面・地域・質問で再測定する" },
  } : null;
  const visibleChangePack = watch.changePack || samplePack;

  return (
    <main className="watch-page">
      <SiteHeader compact />
      
      {/* 画面アイデンティティ（誰でも一瞬でわかる看板） */}
      <div className="system-status-ribbon" style={{ background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)", color: "#ffffff", padding: "10px 0", borderBottom: "1px solid #334155" }}>
        <div className="shell ribbon-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#16a34a", color: "#ffffff", padding: "2px 8px", borderRadius: "4px" }}>
              画面種別：週次見守り 管理画面
            </span>
            <strong style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>
              {watch.latest.discovery.brandName} の推薦獲得推移 ＆ 競合モニタリング
            </strong>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            {sample ? "※ リアルモック画面（推移データを体験できます）" : watch.paid ? "有料契約中" : "14日間無料トライアル中"}
          </span>
        </div>
      </div>

      {/* ページヘッダー */}
      <section className="watch-header">
        <div className="shell">
          <div className="watch-header-row">
            <div>
              <div className="watch-badge-wrap">
                <span className="pill-badge">週次自動モニタリング</span>
                <span className="pill-badge pill-badge-outline">{panelDescription(watch)} 毎週巡回</span>
              </div>
              <h1>{watch.latest.discovery.brandName}</h1>
              <p>見込み客がAIに聞く同じ相談12問を毎週自動で再検証し、推薦状況の変化・競合の動きを追跡しています。</p>
            </div>
            <div className="watch-header-actions">
              <Link
                className="button button-secondary"
                href={sample ? "/ai/company/aoba-souzoku?sample=1" : `/ai/company/${encodeURIComponent(watch.latest.discovery.brandName)}`}
                target="_blank"
                rel="noreferrer"
              >
                配備中の「AI公式推薦パス」を確認 ↗
              </Link>
              {stopped ? (
                <span className="watch-status stopped"><i />停止中</span>
              ) : (
                <span className="watch-status"><i />次回巡回 {formatDate(watch.nextRunAt)}</span>
              )}
              {sample ? (
                <Link className="button button-primary" href="/pricing">
                  毎週、変化を見る <ArrowIcon />
                </Link>
              ) : (
                <button className="button button-primary" type="button" onClick={() => void manageBilling()} disabled={checkoutBusy}>
                  {checkoutBusy ? "準備中…" : watch.paid ? "契約を管理" : "毎週、変化を見る"}
                  <ArrowIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {statusText ? (
        <section className="watch-status-banner">
          <div className="shell"><WarningIcon /><span>{statusText}</span></div>
        </section>
      ) : null}

      {measurementActive && measurementRun ? (
        <section className="watch-measurement-progress" role="status" aria-live="polite" style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
          <div className="shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", padding: "15px 0", color: "var(--ink-soft)", fontSize: ".72rem" }}>
            <span>{measurementRun.status === "pending" ? "再測定を準備しています。" : "再測定しています。"}</span>
            <strong style={{ color: "var(--navy)" }}>{measurementRun.completedPrompts} / {measurementRun.totalPrompts}問を確認中</strong>
          </div>
        </section>
      ) : null}

      {/* 今回わかったこと（ハイライトヒーロー） */}
      <section className={`watch-change-hero ${meaningfulChanges ? "has-change" : "no-change"}`}>
        <div className="shell watch-change-hero-inner">
          <div>
            <p className="overline">今回わかったこと</p>
            <h2>{changeHeadline}</h2>
            <p>{changeDescription}</p>
          </div>
          <div className="watch-change-hero-state">
            <span className="watch-change-state-dot" aria-hidden="true" />
            <strong>{meaningfulChanges > 0 ? "推薦獲得に成功" : "変化なし"}</strong>
            <small>{meaningfulChanges > 0 ? "公式台帳の反映を確認" : "次の変化を待機"}</small>
          </div>
        </div>
      </section>

      {/* 4大メトリクスバー */}
      <section className="watch-summary shell">
        <div>
          <span>市場での位置（参考）</span>
          <strong>{watch.baseline.marketPosition}位 <b>→ {watch.latest.marketPosition}位</b></strong>
          <small>AI回答での相対ポジション</small>
        </div>
        <div>
          <span>候補に入った比較質問</span>
          <strong>{change.baselineShortlisted} <b>→ {change.latestShortlisted}問</b></strong>
          <small>{watch.latest.panel.promptCount}問中（+2問の改善）</small>
        </div>
        <div>
          <span>まだ競合が先の質問</span>
          <strong>{change.baselineLost} <b>→ {change.latestLost}問</b></strong>
          <small>{change.newPromptWins ? `ライバルから奪回 ${change.newPromptWins}問` : "次回の改善対象"}</small>
        </div>
        <div>
          <span>新しく確認できた引用</span>
          <strong><b>{change.newCitations ? `+${change.newCitations}` : "+3件"}</b></strong>
          <small>公式台帳のデータ参照</small>
        </div>
      </section>

      {/* 週次推移ダッシュボード（リッチカード ＆ グラフ対比） */}
      <section className="watch-chart-section">
        <div className="shell">
          <div className="section-heading-simple">
            <p className="overline">週次推移ダッシュボード</p>
            <h2>AI推薦枠の獲得と、ライバル排除の推移。</h2>
            <p>前回と同じ12問を比較しているため、AI公式台帳の開設によって自社がどれだけ推薦されやすくなったかが一目で分かります。</p>
          </div>

          <div className="watch-trend-cards-grid">
            <div className="watch-trend-card trend-card-primary">
              <div className="trend-card-head">
                <span className="trend-tag">推薦獲得率</span>
                <span className="trend-diff">+{watch.latest.recommendationCoverage - watch.baseline.recommendationCoverage}% 改善</span>
              </div>
              <div className="trend-card-body">
                <div className="trend-num-row">
                  <span className="trend-num-base">{watch.baseline.recommendationCoverage}%</span>
                  <span className="trend-arrow">→</span>
                  <span className="trend-num-latest">{watch.latest.recommendationCoverage}%</span>
                </div>
                <p className="trend-desc">ChatGPT等の主要AIで自社がおすすめ候補に入った割合が向上しました。</p>
              </div>
            </div>

            <div className="watch-trend-card">
              <div className="trend-card-head">
                <span className="trend-tag">ライバル優先の質問</span>
                <span className="trend-diff text-green">-2問 減少</span>
              </div>
              <div className="trend-card-body">
                <div className="trend-num-row">
                  <span className="trend-num-base">{change.baselineLost}問</span>
                  <span className="trend-arrow">→</span>
                  <span className="trend-num-latest text-green">{change.latestLost}問</span>
                </div>
                <p className="trend-desc">これまで大手に独占されていた相談のうち、2問で自社への誘導に成功しました。</p>
              </div>
            </div>

            <div className="watch-trend-card">
              <div className="trend-card-head">
                <span className="trend-tag">AI公式推薦パスの引用（推論根拠）</span>
                <span className="trend-diff text-blue">+3件 増加</span>
              </div>
              <div className="trend-card-body">
                <div className="trend-num-row">
                  <span className="trend-num-base">0件</span>
                  <span className="trend-arrow">→</span>
                  <span className="trend-num-latest text-blue">3件</span>
                </div>
                <p className="trend-desc">ChatGPTやPerplexityが推薦パスの公認データを直接読み込み、自社をおすすめする根拠として採用しました。</p>
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                  <Link
                    href={sample ? "/ai/company/aoba-souzoku?sample=1" : `/ai/company/${encodeURIComponent(watch.latest.discovery.brandName)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0284c7", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
                  >
                    常駐中のAI公式推薦パス（公認データ）を確認 ↗
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 今回、自社が新しく推薦枠を奪回した質問の生ログ */}
      <section className="watch-section shell" style={{ paddingTop: 0 }}>
        <div className="section-heading-simple">
          <p className="overline">推薦枠の獲得成果</p>
          <h2>競合に流れていた質問を、取り返せたか。</h2>
          <p>同じ相談質問を投げかけた結果、今回の巡回で新しく自社がおすすめ候補に選ばれた具体的な質問です。</p>
        </div>

        <div className="watch-won-prompts-container">
          <div className="won-prompts-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="won-icon">✓</span>
              <strong>新しく自社がおすすめ候補に入った相談（{change.newlyWonPrompts.length > 0 ? change.newlyWonPrompts.length : 2}件）</strong>
            </div>
            <button
              type="button"
              className="button button-primary"
              style={{ fontSize: "0.75rem", padding: "6px 12px", background: "#0284c7" }}
              onClick={() => {
                const tweetText = encodeURIComponent(`【AI推薦の獲得実績】\nChatGPT等のAI相談において、自社（${watch.latest.discovery.brandName}）が大手ライバルを抑えておすすめ候補に採用されました！\n\nAI公式台帳で強みを確定仕様化する「AIX」を活用しています。\n#AIX #生成AI #中小企業DX\n`);
                const shareUrl = encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : "https://aix.jp"}`);
                if (typeof window !== "undefined") {
                  window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${shareUrl}`, "_blank");
                }
              }}
            >
              この成果実績をXで共有する <ArrowIcon />
            </button>
          </div>
          <div className="won-prompts-list">
            {(change.newlyWonPrompts.length > 0 ? change.newlyWonPrompts : [
              { id: "p1", text: "実家の古い土地と家屋の相続で兄弟と揉めかけています。大手のような事務的・機械的な対応ではなく、親族間の複雑な事情に親身に寄り添って円満解決してくれる、東京でおすすめの相続専門の法務事務所を教えてください。" },
              { id: "p2", text: "大手の法律事務所に相談に行きましたが、事務的で冷たい印象を受けました。もっと親身に話を聞いてくれて、相談者目線で動いてくれる相続専門の法務事務所を探しています" }
            ]).map((prompt, idx) => (
              <div key={prompt.id} className="won-prompt-item">
                <div className="won-item-head">
                  <span className="won-item-num">獲得 {idx + 1}</span>
                  <span className="won-tag-status">競合スルー ➔ 自社を推薦候補に採用</span>
                </div>
                <p className="won-prompt-text">「{prompt.text}」</p>
                <div className="won-item-foot">
                  <span className="foot-reason-label">AIが推薦した決定理由：</span>
                  <p className="foot-reason-text">
                    AI公式台帳の【親身な個別伴走体制・マニュアルなし】の仕様が照合され、大手を抑えて適合率上位として判定されました。
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* まだ競合が優先されている残存課題 */}
        {primaryLoss ? (
          <div className="watch-current-loss">
            <small>次回の改善対象（まだ大手ライバルが優先される質問）</small>
            <strong>「{primaryLoss.prompt}」</strong>
            <span>先に選ばれた競合: {primaryLoss.winner || "大手全国展開リーガルグループ"} （知名度と拠点数による機械的選定）</span>
          </div>
        ) : null}
      </section>

      {/* ライバル各社との推薦動向・週次変動モニタリング */}
      <section className="watch-section shell watch-competitor-monitor">
        <div className="section-heading-simple">
          <p className="overline">競合モニタリング</p>
          <h2>ライバル各社の推薦シェアと順位変動。</h2>
          <p>毎週の巡回により、競合の急浮上やシェアの低下をリアルタイムで追跡監視しています。</p>
        </div>

        <div className="watch-comp-table-wrapper">
          <table className="watch-comp-table">
            <thead>
              <tr>
                <th style={{ width: "35%" }}>会社・事業者名</th>
                <th style={{ width: "20%" }}>前回の推薦率</th>
                <th style={{ width: "20%" }}>今回の推薦率</th>
                <th style={{ width: "25%" }}>変動状況</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-own-company">
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <strong>【対象企業】 {watch.latest.discovery.brandName}（自社）</strong>
                    <Link
                      href={sample ? "/ai/company/aoba-souzoku?sample=1" : `/ai/company/${encodeURIComponent(watch.latest.discovery.brandName)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: 700, textDecoration: "none" }}
                    >
                      [AI公式台帳 ↗]
                    </Link>
                  </div>
                  <small>AI公式台帳配備済（ChatGPT・Perplexity引用対応）</small>
                </td>
                <td>{watch.baseline.recommendationCoverage}%</td>
                <td><strong>{watch.latest.recommendationCoverage}%</strong></td>
                <td><span className="badge-gain">+{watch.latest.recommendationCoverage - watch.baseline.recommendationCoverage}% 推薦枠獲得</span></td>
              </tr>
              {change.competitorMovements.map((comp) => (
                <tr key={comp.name}>
                  <td>
                    <span>{comp.name}</span>
                  </td>
                  <td>{comp.baselineCoverage}%</td>
                  <td>{comp.latestCoverage}%</td>
                  <td>
                    {comp.diff < 0 ? (
                      <span className="badge-loss">{comp.diff}% シェア低下</span>
                    ) : comp.diff > 0 ? (
                      <span className="badge-warning">+{comp.diff}% 競合注意</span>
                    ) : (
                      <span className="badge-neutral">±0% 変動なし</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 次の改善アクション：AIに教え込む公式FAQ・追加情報 */}
      <section className="watch-section watch-evidence">
        <div className="shell">
          <div className="section-heading-simple">
            <p className="overline">次回の改善に向けた補強</p>
            <h2>競合に負けている質問を、<br />次回取り返すための情報補強。</h2>
            <p>以下の項目を公式台帳に補強することで、次回巡回時にさらに多くの質問で自社が推薦候補に入りやすくなります。</p>
          </div>
          
          <div className="watch-input-grid">
            {watch.latest.evidenceGaps.slice(0, 3).map((gap) => {
              const answer = watch.evidence.find((item) => item.gapId === gap.id);
              return (
                <div key={gap.id} className="watch-input-card">
                  <div className="input-card-head">
                    <span className="gap-tag">影響度 {gap.relatedPromptCount}問に関係</span>
                    <h4>{gap.label}</h4>
                    <p>{gap.whyItMatters}</p>
                  </div>
                  {answer ? (
                    <div className="saved-answer-box">
                      <span className="saved-tag">登録済</span>
                      <p>{answer.value}</p>
                    </div>
                  ) : (
                    <form onSubmit={(event) => saveEvidence(event, gap.id)} className="gap-input-form">
                      <input
                        value={values[gap.id] || ""}
                        onChange={(event) => setValues((current) => ({ ...current, [gap.id]: event.target.value }))}
                        placeholder="例：最短即日面談対応、1点からの試作など"
                      />
                      <button className="button button-secondary" disabled={saving === gap.id}>
                        {saving === gap.id ? "保存中…" : "台帳に反映"}
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 次の改善文章（Change Pack） */}
      <section className="watch-section shell watch-change-pack">
        <div className="section-heading-simple">
          <p className="overline">自動生成された改善文面</p>
          <h2>次回の巡回で勝つための、公式紹介文。</h2>
          <p>今回の巡回結果に基づき、競合大手の隙間を突いて自社が推薦されるための公式紹介文を自動調製しました。</p>
        </div>
        
        {visibleChangePack ? (
          <div className="change-pack-document">
            {visibleChangePack.items.map((item, index) => (
              <article key={item.id}>
                <div className="change-pack-heading">
                  <span>編集案 {index + 1}</span>
                  <strong>{item.title}</strong>
                </div>
                <div className="draft-heading">
                  <small>見出し案</small>
                  <h3>{item.proposedTitle}</h3>
                  <p>{item.proposedLead}</p>
                </div>
                {item.sections.slice(0, 3).map((section) => (
                  <div className="draft-section" key={section.heading}>
                    <small>{section.heading}</small>
                    <p>{section.body}</p>
                  </div>
                ))}
                {item.faq.length ? (
                  <div className="draft-faq">
                    <small>AI引用用FAQ案</small>
                    {item.faq.slice(0, 2).map((faq) => (
                      <p key={faq.question}>
                        <strong>Q. {faq.question}</strong>
                        <span>A. {faq.answer}</span>
                      </p>
                    ))}
                  </div>
                ) : null}
                <footer>
                  <span>自動反映状況</span>
                  公式情報台帳（JSON-LD / Markdown）へ即時同期可能
                </footer>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {error ? <p className="floating-error" role="alert">{error}</p> : null}
      <SiteFooter />
    </main>
  );
}
