"use client";

import { useState } from "react";
import type { PositioningAdvice, StrategyOption } from "@/lib/types";

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
      {/* ポジショニング戦略の選定軸（ステップ1） */}
      <div className="section-heading-simple" style={{ textAlign: "left", margin: "16px 0 16px" }}>
        <p className="overline">【ステップ 1】AIに教え込む「自社の強み」を選ぶ</p>
        <h2>AIに認識させる独自の強みを、下の3つから1つ選択してください。</h2>
        <p>AIはまだ自社の本当の強みを知りません。知名度だけで大手を機械的に勧めてしまっているAIに対し、自社の最も誇れる強みを学習させましょう。</p>
      </div>

      {/* 3つの戦略タブ（サイト解析から動的生成） */}
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563eb", margin: "0 0 8px" }}>
          タブを選択すると、強み別の発信内容に切り替わります：
        </p>
      </div>
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

      {/* 選択された戦略の核（看板） */}
      <div className="winning-angle-card" style={{ marginTop: "20px" }}>
        <div className="winning-angle-badge">AIに教え込む「御社の看板」</div>
        <h3>{current.coreThesis}</h3>
      </div>

      {/* 大手の弱点 vs 御社の強み（コンパクト対比） */}
      <div className="competitor-weakness-block">
        <h3 style={{ fontSize: "1.05rem", marginBottom: "8px" }}>ライバル大手の隙間と御社の強み</h3>
        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 12px" }}>AIが「なぜ競合ではなく御社を選ぶべきか」を判定する決定的な理由です。</p>
        <div className="weakness-grid">
          {current.competitorAnalysis.map((item) => (
            <article className="weakness-card" key={item.name}>
              <div className="weakness-card-head">
                <span className="competitor-tag">{item.name}</span>
                <strong className="competitor-gap">大手の課題: {item.gap}</strong>
              </div>
              <div className="our-advantage-box">
                <span className="advantage-label">御社の強み：</span>
                <p>{item.differentiation}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* すぐに使える発信文（タブ切り替えでコンパクトに） */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <h3>そのまま使える紹介文（ワンクリックコピー）</h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0" }}>自社のホームページやSNS、資料にそのまま貼り付けて使える文章です。下の「コピー」ボタンを押してご利用ください。</p>
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
                    {copiedKey === key ? "コピー完了" : "文章をコピーする"}
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

    </section>
  );
}
