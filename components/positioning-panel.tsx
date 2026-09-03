"use client";

import { useState } from "react";
import type { PositioningAdvice, StrategyOption } from "@/lib/types";
import { ArrowIcon } from "@/components/icons";

export function PositioningPanel({ positioning }: { positioning?: PositioningAdvice }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!positioning) return null;

  const strategies: StrategyOption[] = positioning.strategies && positioning.strategies.length > 0
    ? positioning.strategies
    : [
        {
          id: "personal",
          code: "戦略 01",
          name: "個別伴走・柔軟対応型",
          targetMarket: "大手の定型マニュアル対応に不安を抱える相談者",
          coreThesis: "「マニュアル対応の大手には相談しづらい」層を受け止める、親身な個別伴走の専門駆け込み寺",
          strategicReason: "AI検索は現在、競合の規模のみを参照して機械的に推薦しています。貴社が持つ個別伴走実績をAI専用データベースに構造化して認知させることで、高確度な相談者を独占的に引き戻すことが可能です。",
          competitorAnalysis: [
            { name: "競合大手", gap: "画一的なマニュアル処理が中心で個別事情への寄り添いが手薄", differentiation: "マニュアルなし。個別事情を丁寧に聞き取る個別伴走体制" },
          ],
          deliverables: {
            profile: { label: "公式プロフィール（SNS・ポータル）", text: "親身な個別伴走相談窓口。個別相談受付中。" },
            website: { label: "Webサイト・コラム掲載用", text: "私たちが個別伴走にこだわる理由と具体的な進め方を解説します。" },
            brief: { label: "相談案内・配布用サマリー", text: "1件1件の背景に寄り添う専門相談所です。" },
          },
        },
      ];

  const current = strategies[selectedIndex] || strategies[0];

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // コピー不可環境では何もしない
    }
  }

  return (
    <section className="positioning-section shell" aria-label="ポジショニング診断および戦略提言">
      {/* 1. 客観的ファクト・機会損失分析（コンサルティング・サマリー） */}
      <div className="audit-executive-summary">
        <div className="audit-summary-header">
          <span className="audit-label">市場観測結果</span>
          <h3>AI検索における商談機会：競合他社への流出が確認されました</h3>
        </div>
        <p className="audit-summary-desc">
          購入・相談直前の比較質問において、AI検索（ChatGPT等）は競合他社を優先して推薦しています。貴社が培ってきた実績や専門性自体には問題ありませんが、<strong>「AIが認識可能な構造化された客観的ファクト」がWeb上に存在しないこと</strong>が、推薦対象から外れている直接の構造的要因です。
        </p>
      </div>

      {/* 2. ポジショニング戦略の選定軸 */}
      <div className="section-heading-simple" style={{ textAlign: "left", margin: "32px 0 16px" }}>
        <p className="overline">推奨戦略の選択</p>
        <h2>AIに認識させる「貴社独自のポジショニング」を選択してください。</h2>
        <p>AI検索のアルゴリズムは、単なる知名度ではなく「明確な比較軸」を持つ企業を優先します。貴社の事業方針や得意領域に合わせて、AI専用データベースに学習させる発信軸を決定してください。</p>
      </div>

      {/* 3つの戦略タブ（サイト解析から動的生成） */}
      <div className="strategy-selector-tabs" role="tablist" aria-label="戦略方針の選択">
        {strategies.map((item, index) => {
          const isActive = selectedIndex === index;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              key={item.id || index}
              className={`strategy-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="tab-badge">{item.code}</span>
              <strong>{item.name}</strong>
              <small>{item.targetMarket}</small>
            </button>
          );
        })}
      </div>

      {/* 選択された戦略の核（Core Thesis） */}
      <div className="winning-angle-card" style={{ marginTop: "24px" }}>
        <div className="winning-angle-badge">AIに学習させる独自の看板（提供価値）</div>
        <h3>{current.coreThesis}</h3>
        <p className="winning-angle-summary">{current.strategicReason}</p>
      </div>

      {/* 競合他社との構造的差別化分析 */}
      <div className="competitor-weakness-block">
        <h3>競合大手に対する構造的差別化ポイント</h3>
        <p className="block-desc">AI検索エンジンが「なぜ貴社を優先すべきか」を論理的に判定するための客観的優位性です。</p>
        <div className="weakness-grid">
          {current.competitorAnalysis.map((item) => (
            <article className="weakness-card" key={item.name}>
              <div className="weakness-card-head">
                <span className="competitor-tag">{item.name}</span>
                <strong className="competitor-gap">競合の課題: {item.gap}</strong>
              </div>
              <div className="our-advantage-box">
                <span className="advantage-label">貴社が提示する優位性：</span>
                <p>{item.differentiation}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 成果物：すぐに公式展開できるテキスト群 */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <div>
            <h3>公式チャネル向け展開案（実務用成果物）</h3>
            <p className="block-desc">選定した戦略軸に合わせて整合させた公式プロフィール・Webコンテンツ・配布資料の下書きです。</p>
          </div>
        </div>

        <div className="actionable-messages-list">
          {(["profile", "website", "brief"] as const).map((key) => {
            const item = current.deliverables[key];
            return (
              <article className="actionable-message-card" key={key}>
                <div className="actionable-card-header">
                  <div>
                    <span className="channel-badge">{item.label}</span>
                  </div>
                  <button
                    type="button"
                    className="button-copy"
                    onClick={() => copyToClipboard(item.text, key)}
                    aria-label={`${item.label}をコピー`}
                  >
                    {copiedKey === key ? "コピーしました" : "文章をコピー"}
                  </button>
                </div>
                <div className="actionable-copy-box">
                  <pre>{item.text}</pre>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 運用体制の比較：手動運用 vs 自動継続モニタリング */}
      <div className="autopilot-comparison-box">
        <div className="autopilot-head">
          <span className="autopilot-pill">運用体制の検討</span>
          <h3>AI検索市場の変化に合わせた「継続的アップデート」が必要です。</h3>
          <p>
            AI検索エンジンの回答ロジックや競合他社のWeb更新は毎週変動しています。一度の施策で終わらせず、貴社が常に最適な候補として推薦され続けるための運用体制をお選びいただけます。
          </p>
        </div>

        <div className="autopilot-table">
          <div className="autopilot-row head">
            <div className="col-feature">管理項目</div>
            <div className="col-free">無料診断（手動運用）</div>
            <div className="col-paid">AI推薦枠・自動見守りプラン（月額 10,780円 税込）</div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">AI専用公式DBの更新</div>
            <div className="col-free">現時点の静的ページを1回発行のみ</div>
            <div className="col-paid highlight"><strong>競合の動向・市場の変化に応じて毎週自動最適化</strong></div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">競合動向の監視</div>
            <div className="col-free">なし（自社での都度手動確認が必要）</div>
            <div className="col-paid highlight"><strong>同一条件での週次定点観測 ＆ 変動アラート自動送信</strong></div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">運用にかかる社内工数</div>
            <div className="col-free">都度の調査・改修に月数時間の工数が発生</div>
            <div className="col-paid highlight"><strong>完全バックグラウンド実行（実務作業工数ゼロ）</strong></div>
          </div>
        </div>

        <div className="autopilot-cta-row">
          <a href="#watch-plan" className="button button-primary">
            14日間無料トライアルで効果を検証する <ArrowIcon />
          </a>
          <small>初期費用ゼロ・契約期間の縛りなし・いつでも管理画面から即時停止可能</small>
        </div>
      </div>
    </section>
  );
}
