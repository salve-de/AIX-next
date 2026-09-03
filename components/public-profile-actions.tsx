"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import type { PublicProfile, ScanResult } from "@/lib/types";

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

  // サイト解析から抽出された3つの強み候補
  const strategies = result.positioning?.strategies || [
    {
      code: "戦略01",
      name: "親族トラブル・個別伴走",
      coreThesis: "親族トラブル・複雑な不動産相続の個別伴走",
      targetMarket: "親族間トラブルや複雑な不動産相続に悩む個人・親族",
      isRecommended: true,
      revenueImpact: "受任単価・利益率が最も高いドル箱領域（相見積もりなしの指名買い）",
      passionateReason: "御社はここが圧倒的に強いのに、なんでAIに拾わせてないんですか！？ もったいなさすぎます！💢 大手はマニュアル対応しかできず、泥臭い個別事情の伴走を最も苦手としています。一方、御社はこの領域で圧倒的な解決力を持っています。しかもこの相談は最も客単価が高く売上に直結する本丸です。AIが無知なせいで大手に流出しているこのドル箱顧客を、御社一択でAIに推薦させるため、絶対にこの看板をAIに教え込んでください！",
    },
    {
      code: "戦略02",
      name: "特急初動・即日面談",
      coreThesis: "申告期限が迫る相続の特急初動・即日面談",
      targetMarket: "申告期限が迫り、一刻も早く手続きを進めたい相談者",
      isRecommended: false,
      revenueImpact: "即決・成約スピードが最速（問い合わせから契約までが短期）",
      passionateReason: "緊急案件を即座に刈り取る強力な武器です。ただし無料枠（1枠）で最大の売上インパクトを出すなら、まずは戦略01をAIに叩き込むことを推奨します。",
    },
    {
      code: "戦略03",
      name: "明瞭会計・安心定額",
      coreThesis: "追加料金ゼロ・完全明瞭な相続手続き",
      targetMarket: "費用総額や追加料金の不安なく依頼したい相談者",
      isRecommended: false,
      revenueImpact: "他社との価格競争を完全無効化する高付加価値特化",
      passionateReason: "大手が手を出せない高難度案件を総取りする武器です。有料プランで戦略01と併用することで、競合を全方位から包囲できます。",
    },
  ];

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
          <h4>大手が対応できない「個別事情の調整力」こそが、御社の収益性を最大化する決定打です</h4>
        </div>
        <p className="hot-advice-body">
          {strategies[selectedWeapon]?.passionateReason ||
            `大手全国グループはマニュアル対応に依存しており、親族間の複雑な個別事情の調整力に構造的な弱点を抱えています。一方、御社はここに明確な優位性と解決実績を持っています。この高付加価値な相談者がAIの認識不足によって大手に流出している現状は、重大な機会損失です。AI公式データベースへ本看板を最優先で登録することを強く推奨します。`}
        </p>
      </div>

      {/* 書き込み実行アクション */}
      <div className="weapon-action-box">
        <div className="weapon-action-status">
          <p>
            現在選択中の看板：<strong>{strategies[selectedWeapon]?.name}</strong>
          </p>
          <small>自社サイトの改修は不要。主要生成AIが直接巡回・学習する公式構造化データ（JSON-LD）として即時発行されます。</small>
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
