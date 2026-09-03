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
        <span className="step-badge">【ステップ 1】AIに教え込む価値を自分で選ぶ</span>
        <h2>AI公式データベースに書き込む「御社の最大の強み」を選択してください。</h2>
        <p>
          AIは勝手に推測してくれません。御社がAI（ChatGPT等）に最も強くアピールしたい「看板」を、下の3つから<strong>1つ選んで</strong>公式データベースへ書き込みます。
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
          <p>古い情報の残留トラブルを防ぐ安全設計と、全方位でAIの指名推薦を獲得するためのスペック比較です。</p>
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
                <td>選択した1看板のみ（単科）</td>
                <td className="col-highlight"><strong>全10業務・全方位完全網羅</strong></td>
              </tr>
              <tr>
                <td><strong>生成AI引用用公式FAQ</strong></td>
                <td>抜粋2問のみ</td>
                <td className="col-highlight"><strong>厳選10連発すべて直接注入</strong></td>
              </tr>
              <tr>
                <td><strong>有効期間（データの鮮度保証）</strong></td>
                <td>30日間（古い情報の残留防止）</td>
                <td className="col-highlight"><strong>無期限（365日常時直結・自動延長）</strong></td>
              </tr>
              <tr>
                <td><strong>ライバルの順位逆転監視</strong></td>
                <td>なし（手動でも不可）</td>
                <td className="col-highlight"><strong>毎週自動計測・緊急警報アラート</strong></td>
              </tr>
              <tr>
                <td><strong>サイトがある企業様</strong></td>
                <td>手動更新のみ</td>
                <td className="col-highlight"><strong>公式サイトから週次全自動同期</strong></td>
              </tr>
              <tr>
                <td><strong>サイトがない企業様（町工場・農家等）</strong></td>
                <td>公式Web拠点として公開</td>
                <td className="col-highlight"><strong>公式Web拠点 ＋ スマホから直接編集</strong></td>
              </tr>
              <tr>
                <td><strong>AIクローラー認証ランク</strong></td>
                <td>TRIAL（一般認可）</td>
                <td className="col-highlight"><strong>ENTERPRISE GOLD（最優先巡回）</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 自社サイトがない企業様への救済案内 */}
        <div className="no-website-benefit-note">
          <span className="benefit-badge">自社サイトをお持ちでない企業様へ</span>
          <p>
            数十万円かかるホームページ制作は不要です。発行される公式ページ（<code>https://aix.jp/ai/company/...</code>）をGoogleマップや名刺・SNSに貼るだけで、<strong>人間にもAIにも100%伝わる「世界唯一の公式Webサイト兼AI推薦データベース」</strong>としてそのままご活用いただけます。
          </p>
        </div>
      </div>

      {/* 書き込み実行アクション */}
      <div className="weapon-action-box">
        <div className="weapon-action-status">
          <p>
            現在選択中の看板：<strong>{strategies[selectedWeapon]?.name}</strong>
          </p>
          <small>自社サイトの改修は不要。主要生成AIが直接巡回・学習する公式構造化データ（JSON-LD）として即時発行されます（有効期限30日）。</small>
        </div>

        <div className="weapon-action-buttons">
          {!isSaved ? (
            <button
              type="button"
              className="button button-primary"
              onClick={() => void preview()}
              disabled={busy !== ""}
            >
              {busy === "preview" ? "登録処理中…" : "この看板をAI公式データベースに無料登録する"} <ArrowIcon />
            </button>
          ) : (
            <div className="saved-success-box">
              <span className="saved-badge">公開中：AI公式データベースへ登録完了</span>
              <div className="saved-links">
                <Link
                  className="button button-primary"
                  href={sample ? "/ai/company/aoba-souzoku?sample=1" : (profile ? `/ai/company/${encodeURIComponent(profile.slug)}` : "#")}
                  target="_blank"
                  rel="noreferrer"
                >
                  発行されたAI公式ページを確認する <ArrowIcon />
                </Link>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setIsSaved(false)}
                >
                  登録する看板を変更する
                </button>
              </div>
            </div>
          )}
          {error ? <p className="form-error" role="alert">{error}</p> : null}
        </div>
      </div>

      {/* 有料アップセル（全方位展開のご案内） */}
      <div className="upsell-paywall-banner">
        <div className="upsell-badge">全方位展開のご案内：他2領域の同時インデックス</div>
        <div className="upsell-content">
          <h3>「全3領域の看板」を一括登録し、あらゆる相談クエリから第一想起を獲得する</h3>
          <p>
            AIで検索する相談者のニーズは多角化しています。本無料枠で選定した【個別伴走】に加え、【初動即応】および【明瞭費用】の全3領域をAI公式データベースへ常時学習させ、毎週のAI推薦順位変動を追跡するには、自動見守りプラン（月額10,780円）をご活用ください。
          </p>
          <div className="upsell-action">
            <a className="button button-primary" href="#watch-plan">
              全3領域の看板を一括登録してAI推薦を監視する（14日間無料試用） <ArrowIcon />
            </a>
            <small>月額 10,780円（税込） / いつでも解約可能 / クレジットカード登録不要で14日間お試し可能</small>
          </div>
        </div>
      </div>
    </section>
  );
}
