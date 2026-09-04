"use client";

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
 * to the customer's site and never creates an AIX public page by itself.
 */
export function PublicProfileActions({ result, sample = false }: PublicProfileActionsProps) {
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [busy, setBusy] = useState<"preview" | "">("");
  const [error, setError] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(sample);

  // サイト解析結果（ScanResult）から100%動的に抽出された3つの強み候補
  const strategies = result.positioning?.strategies || derivePositioningAdvice(result).strategies || [];

  async function preview() {
    if (sample) {
      setIsSaved(true);
      return;
    }
    setBusy("preview");
    setError("");
    try {
      const response = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scanId: result.scanId, action: "preview" }),
      });
      const payload = await response.json() as { error?: string; token?: string; profile?: ProfileShape };
      if (!response.ok) throw new Error(payload.error || "公開ページを作成できませんでした。");
      const next = profileFromPayload(payload);
      if (!next || !payload.token) throw new Error("公開ページの確認情報を取得できませんでした。");
      setProfile(next);
      setIsSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "公開ページを作成できませんでした。");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="public-profile-interactive-card" aria-label="AI公式データベースへの登録">
      <div className="profile-interactive-header">
        <span className="step-badge">【ステップ 2】自社サイト改修ゼロで、AI公式推薦パスを配備する</span>
        <h2>選定した看板を、AIが迷わず推薦するための「公認データ」としてネット上に常駐させます</h2>
        <p>
          新しい営業マンを雇う必要も、自社のホームページを改修する必要もありません。ChatGPTやGemini・Perplexityなどの主要AIが「この会社を推薦して間違いがない」と1秒で判断できる確定仕様を、AI公式推薦パスとして即座にネット上に配備します。
        </p>
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
                  AIX分析推奨：最優先選定
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

      {/* AIXからの戦略コンサルティング分析所見 */}
      <div className="aix-hot-advice-card">
        <div className="hot-advice-header">
          <span className="hot-advice-tag">戦略分析所見：看板選定の論理的根拠</span>
          <h4>大手が対応できない「{strategies[selectedWeapon]?.name || "固有の強み"}」こそが、{result.discovery.brandName || "御社"}の収益性を最大化する決定打です</h4>
        </div>
        <p className="hot-advice-body">
          {strategies[selectedWeapon]?.passionateReason ||
            `大手全国チェーンはマニュアル対応に依存しており、個別事情への柔軟な対応力に構造的な弱点を抱えています。一方、${result.discovery.brandName || "御社"}はここに明確な優位性と実績を持っています。この高付加価値な相談者がAIの認識不足によって大手に流出している現状は重大な機会損失です。AI公式データベースへ本看板を最優先で登録することを強く推奨します。`}
        </p>
      </div>

      {/* 無料枠 vs フル見守りプラン 機能格差スペック表 */}
      <div className="plan-comparison-box">
        <div className="plan-comparison-header">
          <span className="spec-table-tag">運用仕様・スペック比較</span>
          <h4>無料お試し枠 と フル常時見守りプラン の提供差</h4>
          <p>古い情報の残留トラブルを防ぐ安全設計と、AIから優先推薦されやすい環境を維持するためのスペック比較です。</p>
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
                <td><strong>AIに学習させる看板・強み</strong></td>
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
            初期制作費用をかけずに、発行された公式ページ（<code>https://aix.jp/ai/company/...</code>）をGoogleマップや名刺・SNSに記載するだけで、<strong>主要AIとユーザーの双方が正確に確認できる「公式Web拠点」</strong>としてそのままご活用いただけます。
          </p>
        </div>
      </div>

      {/* 書き込み実行アクション */}
      <div className="weapon-action-box">
        <div className="weapon-action-status">
          <p>
            現在配備する看板：<strong>{strategies[selectedWeapon]?.name}</strong>
          </p>
          <small>自社サイトの改修ゼロ。主要生成AIが直接巡回・引用できる「公認データ規格」で即日ネット上に常駐します。</small>
        </div>

        <div className="weapon-action-buttons">
          {!isSaved ? (
            <button
              type="button"
              className="button button-primary"
              onClick={() => void preview()}
              disabled={busy !== ""}
            >
              {busy === "preview" ? "配備処理中…" : "この看板をAI公式推薦パスとして配備する"} <ArrowIcon />
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
                    この「AI公式推薦パス」によって、なぜAIが御社をおすすめし始めるのか？
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
                      ChatGPTやPerplexityが好む「公認規格（Schema.org構造化データ）」で記述。AIクローラーが直接参照し、「親身な個別対応ならこの会社が適合」と確信を持って回答に引用します。
                    </p>
                  </div>
                </div>
                <p style={{ margin: "14px 0 0", fontSize: "0.76rem", color: "#64748b", lineHeight: 1.5 }}>
                  ※AIXが主要生成AIクローラーへ直接インデックスを促すため、お客様側で特別な設定やサーバー操作を行う必要は一切ありません。
                </p>
              </div>
            </div>
          )}
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </div>
      </div>

      {/* 定期見守りプランのご案内 */}
      <div className="upsell-paywall-banner">
        <div className="upsell-badge">継続的なサポート</div>
        <div className="upsell-content">
          <h3>AI回答の更新に合わせて、公式データを定期管理する</h3>
          <p>
            ChatGPTなどのAIは日々回答を更新します。定期見守りプラン（月額10,780円税込）をご利用いただくと、複数の強みを網羅的に登録し、自社がおすすめされ続けているかを毎週自動で追跡できます。
          </p>
          <div className="upsell-action">
            <a className="button button-primary" href="#watch-plan">
              定期見守りプランを詳しく見る（14日間無料試用） <ArrowIcon />
            </a>
            <small>月額 10,780円（税込） / いつでも解約可能 / クレジットカード登録不要で14日間お試し可能</small>
          </div>
        </div>
      </div>
    </section>
  );
}
