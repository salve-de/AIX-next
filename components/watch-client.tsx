"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, WarningIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { toPublicWatch } from "@/lib/public-dto";
import type { PublicWatch, PublicWatchMeasurementRun } from "@/lib/public-dto";
import { sampleWatch } from "@/lib/sample-data";
import { ProfileAutomationControls } from "@/components/profile-automation-controls";
import { ExecutiveReferralCard } from "@/components/executive-referral-card";
import type { PromptPanelKind } from "@/lib/types";

type WatchView = PublicWatch & { measurementRun?: PublicWatchMeasurementRun | null; publicProfileUrl?: string | null; resultUrl?: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function panelDescription(watch: { latest: { panel: { kind: PromptPanelKind } } }) {
  return watch.latest.panel.kind === "core" ? "同じ質問を固定して" : "同じ質問で";
}

export function WatchClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchView | null>(sample ? toPublicWatch(sampleWatch()) : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const profileUrl = sample ? "/ai/company/aoba-souzoku?sample=1" : watch?.publicProfileUrl;
  const profileDestination = profileUrl || watch?.resultUrl || "/";

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Watch tokenがありません。"); setLoading(false); return; }
    let cancelled = false;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as WatchView & { error?: string };
        if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。");
        if (!cancelled) {
          setWatch(data);
          if (data.maskedEmail) setNotificationEmail(data.maskedEmail);
        }
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
    const comparable = watch.takeBackShare.status === "available";
    const baselineLost = new Set(watch.baseline.lostPrompts.map((item) => item.promptId));
    const latestLost = new Set(watch.latest.lostPrompts.map((item) => item.promptId));
    const baselineCitations = new Set(watch.baseline.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
    const latestCitations = new Set(watch.latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)));

    // 新たに候補入りした質問一覧（初回は候補外だったが今回含まれた質問）
    const newlyWonPromptIds = comparable ? [...baselineLost].filter((promptId) => !latestLost.has(promptId)) : [];
    const newlyWonPrompts = (watch.latest.prompts || []).filter((p) => newlyWonPromptIds.includes(p.id));

    // 今回新しく候補外になった質問一覧
    const newlyLostPromptIds = [...latestLost].filter((promptId) => !baselineLost.has(promptId));
    const newlyLostPrompts = (watch.latest.prompts || []).filter((p) => newlyLostPromptIds.includes(p.id));

    // 比較候補のカバレッジ変動計算（baseline vs latest）
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
      baselineShortlisted: Math.max(0, watch.baseline.panel.promptCount - baselineLost.size),
      latestShortlisted: Math.max(0, watch.latest.panel.promptCount - latestLost.size),
      baselineLost: baselineLost.size,
      latestLost: latestLost.size,
      newPromptWins: newlyWonPromptIds.length,
      newPromptLosses: newlyLostPromptIds.length,
      newCitations: [...latestCitations].filter((url) => !baselineCitations.has(url)).length,
      baselineCitationCount: baselineCitations.size,
      latestCitationCount: latestCitations.size,
      newlyWonPrompts,
      newlyLostPrompts,
      competitorMovements,
      takeBackShare: watch.takeBackShare,
    };
  }, [watch]);

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

  async function saveNotificationEmail(e: FormEvent) {
    e.preventDefault();
    if (!token || sample) return;
    setSavingEmail(true);
    setEmailStatus("");
    try {
      const response = await fetch("/api/watch", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, email: notificationEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "設定に失敗しました。");
      setEmailStatus("通知先メールアドレスを保存しました。");
      setShowEmailForm(false);
      setWatch((prev) => (prev ? { ...prev, emailConfigured: Boolean(data.email), maskedEmail: data.email || null } : prev));
    } catch (caught) {
      setEmailStatus(caught instanceof Error ? caught.message : "更新できませんでした。");
    } finally {
      setSavingEmail(false);
    }
  }

  if (loading) return <div className="full-loading">AI回答の測定結果を読み込んでいます。</div>;
  if (!watch || !change) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>測定結果の変化を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">無料診断へ戻る</Link></div></main>;

  const primaryLoss = watch.latest.lostPrompts[0];
  const stopped = ["expired", "cancelled"].includes(watch.status);
  const measurementRun = watch.measurementRun;
  const measurementActive = Boolean(measurementRun && ["pending", "running"].includes(measurementRun.status));
  const statusText = watch.status === "expired" ? "無料期間は終了しました。自動課金はされていません。" : watch.status === "cancelled" ? "有料の追跡は解約済みです。過去の結果は確認できます。" : watch.status === "past_due" ? "支払いの確認が必要です。" : "";
  const meaningfulChanges = [change.newPromptWins > 0, change.newPromptLosses > 0, change.newCitations > 0, change.takeBackShare.value !== null].filter(Boolean).length;
  const changeHeadline = change.takeBackShare.value !== null
    ? `初回に他社候補が先に含まれた${change.takeBackShare.eligiblePromptCount}問のうち、${change.takeBackShare.recoveredPromptCount}問で候補入りを確認しました。`
    : change.newPromptWins > 0
    ? `${change.newPromptWins}問で、自社が新しく候補に入りました。`
    : change.newPromptLosses > 0
      ? `${change.newPromptLosses}問で、自社が候補から外れました。`
      : change.newCitations > 0
        ? `${change.newCitations}件のページが、新しく参照されました。`
        : "今回は、候補入りの大きな変化はありませんでした。";
  const changeDescription = change.takeBackShare.value !== null
    ? `${change.takeBackShare.note} 測定日時：${formatDate(watch.latest.measuredAt)}`
    : change.takeBackShare.note;
  const visibleChangePack = watch.changePack || null;

  return (
    <main className="watch-page">
      <SiteHeader compact />

      {/* 画面現在地（知的極細サブバー） */}
      <div className="report-subbar" style={{ background: "#ffffff", borderBottom: "1px solid var(--border-subtle, #e2e8f0)", padding: "8px 0", fontSize: "0.78rem" }}>
        <div className="shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted, #64748b)" }}>
            <Link href="/" style={{ color: "var(--text-muted, #64748b)", textDecoration: "none" }}>ホーム</Link>
            <span>/</span>
            <strong style={{ color: "var(--navy, #0f172a)", fontWeight: 700 }}>週次見守り 管理画面</strong>
            <span>/</span>
            <span style={{ color: "var(--text-secondary, #475569)", background: "var(--bg-surface, #f1f5f9)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.74rem" }}>
              {watch.latest.discovery.brandName}
            </span>
            {sample ? (
              <span style={{ background: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0", padding: "1px 6px", borderRadius: "3px", fontSize: "0.7rem", fontWeight: 600 }}>
                設計見本（架空データ）
              </span>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.74rem", color: "var(--text-muted, #64748b)" }}>
            <span>{sample ? "※ 推移体験用サンプル" : watch.paid ? "有料契約中" : "14日間無料トライアル中"}</span>
          </div>
        </div>
      </div>

      {/* ページヘッダー */}
      <section className="watch-header">
        <div className="shell">
          <div className="watch-header-row">
            <div>
              <div className="watch-badge-wrap">
                <span className="pill-badge">週次自動モニタリング</span>
                <span className="pill-badge pill-badge-outline">{panelDescription(watch)} 毎週再測定</span>
              </div>
              <h1>{watch.latest.discovery.brandName}</h1>
              <p>{watch.latest.panel.promptCount}問の固定パネルを同じ条件で毎週再測定し、AI回答の変化と比較候補の動きを記録しています。</p>
            </div>
            <div className="watch-header-actions">
              <Link
                className="button button-secondary"
                href={profileDestination}
                target="_blank"
                rel="noreferrer"
              >
                {profileUrl ? "公開情報参照ページを確認 ↗" : "診断結果から公開情報を確認 ↗"}
              </Link>
              {stopped ? (
                <span className="watch-status stopped"><i />停止中</span>
              ) : (
                <span className="watch-status"><i />次回測定 {formatDate(watch.nextRunAt)}</span>
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

      {/* 任意メール通知設定（防犯ベル通知枠） */}
      <section className="shell" style={{ margin: "14px auto 0" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", fontSize: "0.82rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, background: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0", padding: "2px 6px", borderRadius: "3px" }}>
              通知設定（任意）
            </span>
            {watch.emailConfigured && !showEmailForm ? (
              <span style={{ color: "#334155" }}>
                速報メール通知先: <strong style={{ color: "#0f172a" }}>{watch.maskedEmail || notificationEmail}</strong>（測定結果の変化を通知中）
              </span>
            ) : (
              <span style={{ color: "#64748b" }}>
                AI回答・参照元URL・候補入り状況に変化があった時だけ、メールでお知らせします（登録不要・いつでも解除可能）。
              </span>
            )}
            {emailStatus ? <span style={{ color: "#16a34a", fontWeight: 600 }}>{emailStatus}</span> : null}
          </div>

          {!showEmailForm ? (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#334155", padding: "5px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
            >
              {watch.emailConfigured ? "通知先を変更する" : "速報通知メールを設定する（任意） ↗"}
            </button>
          ) : (
            <form onSubmit={saveNotificationEmail} style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="you@company.jp"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                style={{ padding: "4px 8px", fontSize: "0.8rem", border: "1px solid #94a3b8", borderRadius: "4px", width: "220px" }}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={savingEmail}
                style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "5px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
              >
                {savingEmail ? "保存中…" : "保存"}
              </button>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}
              >
                閉じる
              </button>
            </form>
          )}
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
            <strong>{meaningfulChanges > 0 ? "測定結果に変化" : "大きな変化なし"}</strong>
            <small>{meaningfulChanges > 0 ? "同じ条件で差分を確認" : "次回の測定を待機"}</small>
          </div>
        </div>
      </section>

      {/* 主要メトリクス */}
      <section className="watch-summary shell">
        <div>
          <span>自社が候補に含まれた質問</span>
          <strong>{change.baselineShortlisted} <b>→ {change.latestShortlisted}問</b></strong>
          <small>{watch.latest.panel.promptCount}問中</small>
        </div>
        <div>
          <span>自社が候補外だった質問</span>
          <strong>{change.baselineLost} <b>→ {change.latestLost}問</b></strong>
          <small>{change.newPromptWins ? `前回候補外から変化 ${change.newPromptWins}問` : "候補外の質問"}</small>
        </div>
        <div>
          <span>参照元URLの件数</span>
          <strong>{change.baselineCitationCount} <b>→ {change.latestCitationCount}件</b></strong>
          <small>{change.newCitations ? `新しく確認 ${change.newCitations}件` : "取得した回答の参照元"}</small>
        </div>
        <div>
          <span>候補回復率（補助指標）</span>
          <strong><b>{change.takeBackShare.value === null ? "—" : `${change.takeBackShare.value}%`}</b></strong>
          <small>{change.takeBackShare.value === null ? change.takeBackShare.note : `${change.takeBackShare.recoveredPromptCount}/${change.takeBackShare.eligiblePromptCount}問を回復`}</small>
        </div>
      </section>

      <section className="watch-section shell" aria-label="AI顧客奪還シェア">
        <h2>AI顧客奪還シェア</h2>
        <p>固定50問で、自社が推薦候補に入った割合。実際の顧客数・市場シェアではありません。各AIの反復回答の過半数で候補入りと判定します。</p>
        {watch.northStar.status === "short-panel" ? <p>現在は{watch.latest.panel.promptCount}問の短いパネルです。有料プランの50問測定から北極星の記録を開始します。</p> : <div className="table-responsive"><table>
          <thead><tr><th scope="col">AI</th><th scope="col">候補入り／取得成功</th><th scope="col">シェア</th><th scope="col">未取得・反復不足</th><th scope="col">同条件の推移</th></tr></thead>
          <tbody>{watch.northStar.providers.map((row) => <tr key={row.provider}><th scope="row">{row.provider === "openai" ? "OpenAI" : row.provider === "gemini" ? "Gemini" : "Perplexity"}</th><td>{row.included}／{row.successful}問</td><td>{row.value === null ? "未測定" : `${row.value}%${row.missing ? "（部分観測）" : ""}`}</td><td>{row.missing}／50問</td><td>{row.comparison ? `${row.comparison.before}% → ${row.comparison.after}%（共通${row.comparison.count}問）` : "比較不可"}</td></tr>)}</tbody>
        </table></div>}
        <p>今回：{formatDate(watch.northStar.measuredAt)}{watch.northStar.baselineMeasuredAt ? `／基準：${formatDate(watch.northStar.baselineMeasuredAt)}` : ""}。条件が一致しない回答は推移に含めません。</p>
      </section>
      <ProfileAutomationControls scanId={new URL(watch.resultUrl || "/result", "https://rovan.invalid").searchParams.get("id") || watch.baseline.scanId} watchToken={token} sample={sample} />
      <ExecutiveReferralCard />
      {/* 今週の週次モニタリングタイムライン */}
      <section className="watch-section shell" style={{ marginBottom: "24px" }}>
        <div style={{ background: "#ffffff", border: "1px solid var(--border-subtle, #e2e8f0)", borderRadius: "var(--radius-card, 10px)", padding: "24px 28px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(15, 23, 42, 0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#0f172a", color: "#ffffff", padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.06em" }}>
                THIS WEEK / 週次モニタリングレポート
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.2rem", color: "#0f172a", fontWeight: 800, letterSpacing: "-0.02em" }}>
                今週の実行内容と、AI回答の変化
              </h3>
            </div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "4px 10px", borderRadius: "6px" }}>
              ✓ 自社サイトの改修は不要
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em" }}>1. 比較候補の変化</span>
              <strong style={{ display: "block", fontSize: "0.92rem", color: "#0f172a", margin: "6px 0 4px" }}>
                保存済みの前後クロール差分はありません
              </strong>
              <p style={{ margin: 0, fontSize: "0.76rem", color: "#64748b", lineHeight: 1.5 }}>
                AI回答の変化は記録します。競合Webの変更は前後クロール差分が保存された場合だけ表示します。
              </p>
            </div>

            <div style={{ background: "#f0f9ff", padding: "16px", borderRadius: "8px", border: "1px solid #bae6fd" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em" }}>2. 情報補強の実行記録</span>
              <strong style={{ display: "block", fontSize: "0.92rem", color: "#0369a1", margin: "6px 0 4px" }}>
                {watch.autoActions?.[0]?.summary || "公開プロフィールへの変更候補はありません"}
              </strong>
              <p style={{ margin: 0, fontSize: "0.76rem", color: "#0284c7", lineHeight: 1.5 }}>
                反映済みの更新と、未反映の案を区別します。自動更新を許可した範囲は週ごとの承認なしで実行します。
              </p>
            </div>

            <div style={{ background: "#f0fdf4", padding: "16px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>3. 再測定結果 ＆ 次回予定</span>
              <strong style={{ display: "block", fontSize: "0.92rem", color: "#14532d", margin: "6px 0 4px" }}>
                {watch.autoActionImpacts?.[0]?.summary || "同じ条件での再測定結果を記録しています"}
              </strong>
              <p style={{ margin: 0, fontSize: "0.76rem", color: "#166534", lineHeight: 1.5 }}>
                次週も同じパネル・条件でAI回答の変化を記録します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 月次レポート総括（MONTHLY VALUE REPORT: 期間内の実測総括） */}
      {watch.monthlyReport ? (<section className="watch-section shell" style={{ marginBottom: "36px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "24px 28px", boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#0f172a", color: "#ffffff", padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.06em" }}>
                MONTHLY VALUE REPORT / 月次レポート総括
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.25rem", color: "#0f172a" }}>
                期間内の情報補強とAI回答の変化
              </h3>
            </div>
            <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
              対象期間：{watch.monthlyReport.period}（{sample ? "表示用の固定値" : "取得できた測定値"}）
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "20px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>AI観測回数</span>
              <strong style={{ display: "block", fontSize: "1.4rem", color: "#0f172a", marginTop: "4px" }}>
                {watch.monthlyReport.aiObservationCount}回
              </strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>候補表示の変化</span>
              <strong style={{ display: "block", fontSize: "1.4rem", color: "#0f172a", marginTop: "4px" }}>
                {watch.monthlyReport.competitorChangeCount > 0 ? `${watch.monthlyReport.competitorChangeCount}件` : "未判定"}
              </strong>
              <small style={{ display: "block", marginTop: "4px", fontSize: "0.68rem", color: "#64748b" }}>前後クロール差分がある場合のみ</small>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>参照元URLの変化</span>
              <strong style={{ display: "block", fontSize: "1.4rem", color: "#0f172a", marginTop: "4px" }}>
                +{watch.monthlyReport.citationChangeCount}件
              </strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>公開反映回数（承認済み）</span>
              <strong style={{ display: "block", fontSize: "1.4rem", color: "#0f172a", marginTop: "4px" }}>
                {watch.monthlyReport.profileUpdateCount}回
              </strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>確認案の件数</span>
              <strong style={{ display: "block", fontSize: "1.4rem", color: "#0f172a", marginTop: "4px" }}>
                {watch.monthlyReport.autoActionCount}件
              </strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a" }}>観測された変化（因果は断定しません）</span>
              <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "#334155", lineHeight: 1.6 }}>
                {watch.monthlyReport.observedUpliftSummary}
              </p>
            </div>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a" }}>未確認事項と今後追跡するもの</span>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px", fontSize: "0.8rem", color: "#334155", lineHeight: 1.6 }}>
                {watch.monthlyReport.topRisks.map((risk, i) => (
                  <li key={`risk-${i}`}>{risk}</li>
                ))}
                {watch.monthlyReport.upcomingTracking.map((item, i) => (
                  <li key={`track-${i}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>) : null}

      {/* 週次推移ダッシュボード（リッチカード ＆ グラフ対比） */}
      <section className="watch-chart-section">
        <div className="shell">
          <div className="section-heading-simple">
            <p className="overline">週次推移ダッシュボード</p>
            <h2>AI回答の変化と比較候補の推移。</h2>
            <p>前回と同じ{watch.latest.panel.promptCount}問・同じ測定条件で、観測結果の変化を確認できます。</p>
          </div>

          <div className="watch-trend-cards-grid">
            <div className="watch-trend-card trend-card-primary">
              <div className="trend-card-head">
                <span className="trend-tag">候補回復率（補助指標）</span>
                <span className="trend-diff">{change.takeBackShare.value === null ? "比較不可" : `${change.takeBackShare.value}%`}</span>
              </div>
              <div className="trend-card-body">
                <div className="trend-num-row">
                  <span className="trend-num-base">{change.takeBackShare.value === null ? "—" : `${change.takeBackShare.baselineLostPromptCount}問`}</span>
                  <span className="trend-arrow">→</span>
                  <span className="trend-num-latest">{change.takeBackShare.value === null ? "—" : `${change.takeBackShare.recoveredPromptCount}問回復`}</span>
                </div>
                <p className="trend-desc">初回に他社候補が先に含まれた質問のうち、今回、自社が候補に入った割合です。実顧客数・売上のシェアではありません。</p>
              </div>
            </div>

            <div className="watch-trend-card">
              <div className="trend-card-head">
                <span className="trend-tag">自社が候補外だった質問</span>
                <span className="trend-diff text-green">{change.latestLost - change.baselineLost > 0 ? "+" : ""}{change.latestLost - change.baselineLost}問</span>
              </div>
              <div className="trend-card-body">
                <div className="trend-num-row">
                  <span className="trend-num-base">{change.baselineLost}問</span>
                  <span className="trend-arrow">→</span>
                  <span className="trend-num-latest text-green">{change.latestLost}問</span>
                </div>
                <p className="trend-desc">前回と今回で、自社が候補に含まれなかった質問の件数を比較しています。</p>
              </div>
            </div>

            <div className="watch-trend-card">
              <div className="trend-card-head">
                <span className="trend-tag">AI回答の参照元URL</span>
                <span className="trend-diff text-blue">{change.latestCitationCount - change.baselineCitationCount > 0 ? "+" : ""}{change.latestCitationCount - change.baselineCitationCount}件</span>
              </div>
              <div className="trend-card-body">
                <div className="trend-num-row">
                  <span className="trend-num-base">{change.baselineCitationCount}件</span>
                  <span className="trend-arrow">→</span>
                  <span className="trend-num-latest text-blue">{change.latestCitationCount}件</span>
                </div>
                <p className="trend-desc">AI回答に含まれた参照元URLの件数です。Rovanページの採用や推薦を示すものではありません。</p>
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
                  <Link
                    href={profileDestination}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0284c7", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
                  >
                    {profileUrl ? "公開情報参照ページを確認 ↗" : "診断結果から公開情報を確認 ↗"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 今回、自社が新しく候補に含まれた質問の記録 */}
      <section className="watch-section shell" style={{ paddingTop: 0 }}>
        <div className="section-heading-simple">
          <p className="overline">候補入りの変化</p>
          <h2>前回と今回で、候補入り状況は変わったか。</h2>
          <p>同じ質問・同じ測定条件で、今回新しく自社が候補に含まれた質問を記録しています。</p>
        </div>

        <div className="watch-won-prompts-container">
          <div className="won-prompts-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="won-icon">✓</span>
              <strong>前回候補外から今回候補に含まれた質問（{change.newlyWonPrompts.length}件）</strong>
            </div>
          </div>
          <div className="won-prompts-list">
            {change.newlyWonPrompts.length ? change.newlyWonPrompts.map((prompt, idx) => (
              <div key={prompt.id} className="won-prompt-item">
                <div className="won-item-head">
                  <span className="won-item-num">変化 {idx + 1}</span>
                  <span className="won-tag-status">前回は自社が候補外 → 今回は候補に含まれた</span>
                </div>
                <p className="won-prompt-text">「{prompt.text}」</p>
                <div className="won-item-foot">
                  <span className="foot-reason-label">今回の観測：</span>
                  <p className="foot-reason-text">
                    この質問では、今回の測定で自社が候補に含まれました。理由や因果はこの結果だけでは断定できません。
                  </p>
                </div>
              </div>
            )) : <p style={{ color: "#64748b" }}>今回、新しく候補に入った質問はありません。</p>}
          </div>
        </div>

        {/* 次回に確認する残存課題 */}
        {primaryLoss ? (
          <div className="watch-current-loss">
            <small>次回の確認対象（今回も自社が候補に入らなかった質問）</small>
            <strong>「{primaryLoss.prompt}」</strong>
            <span>今回の回答で先に含まれた候補: {primaryLoss.winner || "特定できませんでした"}</span>
          </div>
        ) : null}
      </section>

      {/* 比較候補の週次変動モニタリング */}
      <section className="watch-section shell watch-competitor-monitor">
        <div className="section-heading-simple">
          <p className="overline">回答に含まれた候補</p>
          <h2>候補入り率と、前回からの変化。</h2>
          <p>毎週の測定で、AI回答に含まれた対象企業と比較候補の変化を記録しています。実際の顧客シェアや市場順位ではありません。</p>
        </div>

        <div className="watch-comp-table-wrapper">
          <table className="watch-comp-table">
            <thead>
              <tr>
                <th style={{ width: "35%" }}>会社・事業者名</th>
                <th style={{ width: "20%" }}>前回の候補入り率</th>
                <th style={{ width: "20%" }}>今回の候補入り率</th>
                <th style={{ width: "25%" }}>変動状況</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-own-company">
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <strong>【対象企業】 {watch.latest.discovery.brandName}（自社）</strong>
                    <Link
                      href={profileDestination}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: 700, textDecoration: "none" }}
                    >
                      {profileUrl ? "[公開情報ページ ↗]" : "[診断結果 ↗]"}
                    </Link>
                  </div>
                  <small>{profileUrl ? "公開情報ページの内容を参照できます" : "公開中の情報ページはありません"}</small>
                </td>
                <td>{watch.baseline.recommendationCoverage}%</td>
                <td><strong>{watch.latest.recommendationCoverage}%</strong></td>
                <td><span className="badge-gain">{watch.latest.recommendationCoverage - watch.baseline.recommendationCoverage > 0 ? "+" : ""}{watch.latest.recommendationCoverage - watch.baseline.recommendationCoverage}%</span></td>
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
                        <span className="badge-loss">{comp.diff}% 低下</span>
                    ) : comp.diff > 0 ? (
                      <span className="badge-warning">+{comp.diff}% 候補変化</span>
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

      {/* 公開情報の不足項目 */}
      <section className="watch-section watch-evidence">
        <div className="shell">
          <div className="section-heading-simple">
            <p className="overline">公開情報の確認範囲</p>
            <h2>今回の測定で、公開情報だけでは比べにくかった項目。</h2>
            <p>参照元ページから確認できない内容は、推測や自動作文で補いません。次回も同じ基準で確認し、変化があれば記録します。</p>
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
                    <span className="saved-tag">登録済みの補足情報</span>
                      <p>{answer.value}</p>
                    </div>
                  ) : (
                    <div className="auto-inspect-box" style={{ padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0369a1", background: "#e0f2fe", padding: "2px 6px", borderRadius: "3px" }}>未掲載</span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>推測で補いません</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: "#475569", lineHeight: 1.5 }}>
                        参照元にある記載は、許可された自動更新の対象です。参照元にない実績や条件は作りません。
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 公開前の変更案（Change Pack） */}
      <section className="watch-section shell watch-change-pack">
        <div className="section-heading-simple">
          <p className="overline">公開前の変更案</p>
          <h2>参照元ページを確認するときの変更案。</h2>
          <p>今回の測定結果から、参照元ページに追加確認できる項目の案を作成します。公開プロフィールへは自動反映しません。</p>
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
                    <small>AIが読み取りやすくするためのFAQ案</small>
                    {item.faq.slice(0, 2).map((faq) => (
                      <p key={faq.question}>
                        <strong>Q. {faq.question}</strong>
                        <span>A. {faq.answer}</span>
                      </p>
                    ))}
                  </div>
                ) : null}
                <footer>
                  <span>反映状況</span>
                  公開前の確認待ち（JSON-LD / Markdown）
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
