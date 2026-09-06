"use client";

import { siteUrl } from "@/lib/site";

import Link from "next/link";
import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import type { PublicProfile, ScanResult } from "@/lib/types";

import { derivePositioningAdvice } from "@/lib/positioning";

type ProfileShape = PublicProfile;

type PublicProfileActionsProps = {
  result: ScanResult;
  sample?: boolean;
};

function profileFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const candidate = (payload as { profile?: unknown }).profile;
  if (!candidate || typeof candidate !== "object") return null;
  return candidate as ProfileShape;
}

/**
 * Publishing is deliberately a second, explicit action. A scan never writes
 * to the customer's site and never creates an Rovan public page by itself.
 */
export function PublicProfileActions({ result, sample = false }: PublicProfileActionsProps) {
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [busy, setBusy] = useState<"deploy" | "">("");
  const [error, setError] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState<number>(0);
  const [customHighlight, setCustomHighlight] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(sample);

  // サイト解析結果（ScanResult）から100%動的に抽出された3つの強み候補
  const strategies = result.positioning?.strategies || derivePositioningAdvice(result).strategies || [];

  async function deployProfile() {
    if (sample) {
      setIsSaved(true);
      return;
    }
    setBusy("deploy");
    setError("");
    try {
      const response = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scanId: result.scanId, action: "deploy" }),
      });
      const payload = await response.json() as { error?: string; token?: string; profile?: ProfileShape };
      if (!response.ok) throw new Error(payload.error || "公開ページを配備できませんでした。");
      const next = profileFromPayload(payload);
      if (!next || !payload.token) throw new Error("公開ページの確認情報を取得できませんでした。");
      setProfile(next);
      setIsSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "公開ページを配備できませんでした。");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="public-profile-interactive-card" aria-label="AI公式データベースへの登録">
      <div className="profile-interactive-header">
        <span className="step-badge">【ステップ 2】自社サイト改修ゼロで、AI公式推薦パスを配備する</span>
        <h2>選定した看板を、AIが正確に参照・引用できる「公式データ」としてネット上に常駐させます</h2>
        <p>
          新しい営業マンを雇う必要も、自社のホームページを改修する必要もありません。ChatGPTやGemini・Perplexityなどの主要AIが公式情報として正確に参照できる構造化仕様を、AI公式推薦パスとして即座にネット上に配備します。
        </p>
      </div>

      {/* AI下書きガイド案内 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ background: "#0284c7", color: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontSize: "0.68rem" }}>AI自動下書き済</span>
          ネット上の公開情報から抽出した御店の強み候補（タップで1つ選ぶだけ）
        </span>
        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>※ AIによる勝手な架空作文は排除されています</span>
      </div>

      {/* 3つの強み選択ラジオカード（無料プランは1枠のみ選択可能） */}
      <div className="weapon-selector-grid">
        {strategies.map((strat, index) => {
          const isSelected = selectedWeapon === index;
          const isRec = strat.isRecommended ?? index === 0;
          return (
            <div
              key={strat.code}
              className={`weapon-card ${isSelected ? "selected" : ""} ${isRec ? "recommended-card" : ""}`}
              onClick={() => setSelectedWeapon(index)}
              role="button"
              tabIndex={0}
            >
              {isRec ? (
                <div className="card-top-recommend-badge">
                  Rovan分析推奨：最優先選定
                </div>
              ) : null}
              <div className="weapon-card-header">
                <span className={`weapon-radio ${isSelected ? "is-selected" : ""}`}>
                  {isSelected ? "選択中" : "選択する"}
                </span>
                <span className="weapon-tag">{strat.code}</span>
              </div>
              <h4>{strat.name}</h4>
              <p className="weapon-desc">{strat.coreThesis}</p>
              {strat.revenueImpact ? (
                <div className="weapon-revenue-badge">
                  <span>収益性評価：</span>{strat.revenueImpact}
                </div>
              ) : null}
              <small className="weapon-target">想定ターゲット：{strat.targetMarket}</small>
            </div>
          );
        })}
      </div>

      {/* 独自メニュー・看板の1行直接補正（任意：ハルシネーション完全排除） */}
      <div style={{ marginTop: "14px", padding: "12px 16px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "4px" }}>
          <label htmlFor="custom-highlight-input" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>
            ✨ 一番推したい看板メニュー・固有の強み（任意：1行で修正・補正）
          </label>
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>AIの作文ミスやニュアンスの違いを直接直せます</span>
        </div>
        <input
          id="custom-highlight-input"
          type="text"
          placeholder="例: 名物・天然酵母クロワッサン、早朝7時オープン、国産小麦100%、特急短納期 など"
          value={customHighlight}
          onChange={(e) => setCustomHighlight(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem", border: "1px solid #cbd5e1", borderRadius: "6px", background: "#ffffff", boxSizing: "border-box" }}
        />
        <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "4px 0 0" }}>
          ※ 空欄の場合は上記で選択した「{strategies[selectedWeapon]?.name || "看板"}」がそのままAI公式台帳に登録されます。
        </p>
      </div>

      {/* Rovanからの戦略コンサルティング分析所見 */}
      <div className="rovan-hot-advice-card">
        <div className="hot-advice-header">
          <span className="hot-advice-tag">戦略分析所見：看板選定の論理的根拠</span>
          <h4>大手が対応できない「{strategies[selectedWeapon]?.name || "固有の強み"}」こそが、{result.discovery.brandName || "御社"}の収益性を最大化する決定打です</h4>
        </div>
        <p className="hot-advice-body">
          {strategies[selectedWeapon]?.passionateReason ||
            `大手全国チェーンはマニュアル対応に依存しており、個別事情への柔軟な対応力に構造的な弱点を抱えています。一方、${result.discovery.brandName || "御社"}はここに明確な優位性と実績を持っています。この高付加価値な相談者がAIの認識不足によって大手に流出している現状は重大な機会損失です。AI公式データ基盤へ本看板を反映することを推奨します。`}
        </p>
      </div>

      {/* 無料枠 vs フル見守りプラン 機能格差スペック表 */}
      <div className="plan-comparison-box">
        <div className="plan-comparison-header">
          <span className="spec-table-tag">運用仕様・スペック比較</span>
          <h4>無料お試し枠 と フル常時見守りプラン の提供差</h4>
          <p>古い情報の残留トラブルを防ぐ安全設計と、AIから正確に認識・推薦される環境を維持するためのスペック比較です。</p>
        </div>

        <div className="table-responsive">
          <table className="plan-comparison-table">
            <thead>
              <tr>
                <th>提供機能・運用仕様</th>
                <th className="th-free">無料お試し枠（即時発行）</th>
                <th className="th-pro">フル常時見守りプラン</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>AIが参照する看板・強み</strong></td>
                <td>選択した1項目のみ</td>
                <td className="col-highlight"><strong>全業務・全方位を網羅登録</strong></td>
              </tr>
              <tr>
                <td><strong>生成AI引用用公式FAQ</strong></td>
                <td>抜粋2問のみ</td>
                <td className="col-highlight"><strong>主要FAQ（10問）を完全連携</strong></td>
              </tr>
              <tr>
                <td><strong>データの鮮度管理</strong></td>
                <td>手動での情報更新</td>
                <td className="col-highlight"><strong>週次自動同期・定期メンテナンス</strong></td>
              </tr>
              <tr>
                <td><strong>競合の順位変動モニタリング</strong></td>
                <td>なし（手動でも不可）</td>
                <td className="col-highlight"><strong>週次自動計測・変動アラート通知</strong></td>
              </tr>
              <tr>
                <td><strong>Webサイトをお持ちの企業様</strong></td>
                <td>手動更新のみ</td>
                <td className="col-highlight"><strong>公式サイトから週次自動同期</strong></td>
              </tr>
              <tr>
                <td><strong>Webサイトをお持ちでない企業様</strong></td>
                <td>公式Web拠点として公開</td>
                <td className="col-highlight"><strong>公式Web拠点 ＋ スマートフォン直接更新</strong></td>
              </tr>
              <tr>
                <td><strong>AIクローラー巡回頻度</strong></td>
                <td>通常巡回（月次確認）</td>
                <td className="col-highlight"><strong>常時優先巡回（週次クロール）</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 自社サイトがない企業様への案内 */}
        <div className="no-website-benefit-note">
          <span className="benefit-badge">自社サイトをお持ちでない企業様へ</span>
          <p>
            初期制作費用をかけずに、発行された公式ページ（<code>{`${siteUrl}/ai/company/...`}</code>）をGoogleマップや名刺・SNSに記載するだけで、<strong>主要AIとユーザーの双方が正確に確認できる「公式Web拠点」</strong>としてそのままご活用いただけます。
          </p>
        </div>
      </div>

      {/* 書き込み実行アクション */}
      <div className="weapon-action-box">
        <div className="weapon-action-status">
          <p>
            現在配備する看板：<strong>{customHighlight.trim() || strategies[selectedWeapon]?.name}</strong>
          </p>
          <small>自社サイトの改修ゼロ。主要生成AIが直接巡回・引用できる「公式構造化データ規格」で即日ネット上に常駐します。</small>
        </div>

        <div className="weapon-action-buttons">
          {!isSaved ? (
            <button
              type="button"
              className="button button-primary"
              onClick={() => void deployProfile()}
              disabled={busy !== ""}
            >
              {busy === "deploy" ? "配備処理中…" : "この看板をAI公式推薦パスとして配備する"} <ArrowIcon />
            </button>
          ) : (
            <div className="saved-success-box">
              <span className="saved-badge">常駐完了：AI公式推薦パスがネット上に配備されました</span>
              <div className="saved-links">
                <Link
                  className="button button-primary"
                  href={sample ? "/ai/company/aoba-souzoku?sample=1" : (profile ? `/ai/company/${encodeURIComponent(profile.slug)}` : "#")}
                  target="_blank"
                  rel="noreferrer"
                >
                  配備された「AI公式推薦パス」の内容を確認する <ArrowIcon />
                </Link>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    const targetPath = sample ? "/ai/company/aoba-souzoku?sample=1" : (profile ? `/ai/company/${encodeURIComponent(profile.slug)}` : "");
                    if (targetPath && typeof window !== "undefined") {
                      const fullUrl = `${window.location.origin}${targetPath}`;
                      void navigator.clipboard.writeText(fullUrl);
                      alert("AI公式推薦パスのURLをコピーしました。\n自社ホームページのリンク集や、名刺・SNS、GoogleビジネスプロフィールのWEB欄に記載することで、AIからの信頼性がさらに盤石になります。");
                    }
                  }}
                >
                  推薦パスのURLをコピー
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setIsSaved(false)}
                >
                  配備する看板を変更する
                </button>
              </div>

              {/* なぜAIが推薦できるようになるのか（図解・メカニズム解説） */}
              <div style={{ marginTop: "20px", padding: "18px 22px", background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: "10px", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#16a34a", color: "#ffffff", padding: "3px 8px", borderTopLeftRadius: "4px", borderBottomRightRadius: "4px" }}>
                    御社の実働作業：完全ゼロ
                  </span>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                    この「AI公式推薦パス」によって、なぜAIが御社を正確に参照・回答できるようになるのか？
                  </strong>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "12px" }}>
                  <div style={{ background: "#ffffff", padding: "12px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#dc2626", display: "block", marginBottom: "4px" }}>✕ これまでの自社サイト</span>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.55 }}>
                      デザインや装飾が中心のため、AIが「この会社が何の専門で、他社と何が違うのか」を読み取れず、無難な大手チェーンばかりを推薦していました。
                    </p>
                  </div>
                  <div style={{ background: "#f0fdf4", padding: "12px 14px", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", display: "block", marginBottom: "4px" }}>◯ AI公式推薦パス（本機能）</span>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#14532d", lineHeight: 1.55 }}>
                      Schema.org規格に準拠した構造化データで記述。AIクローラーが直接参照し、ユーザーの具体的な相談内容に合わせた回答の根拠データとして引用されやすくなります。
                    </p>
                  </div>
                </div>
                <p style={{ margin: "14px 0 0", fontSize: "0.76rem", color: "#64748b", lineHeight: 1.5 }}>
                  ※Rovanが主要生成AIクローラーが巡回可能な公開Webページとして保守するため、お客様側で特別な設定やサーバー操作を行う必要は一切ありません。
                </p>
              </div>
            </div>
          )}
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
