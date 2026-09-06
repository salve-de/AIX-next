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
          name: "対象・用途を明確にする",
          targetMarket: "今回の質問で検討された利用場面",
          coreThesis: "対象・用途・条件を、参照元付きで確認できる形にする",
          strategicReason: "今回の測定で不足していた情報を、確認できる事実と参照元に分けて整理します。AIの推薦・順位・成果は保証しません。",
          competitorAnalysis: [],
          deliverables: {
            profile: { label: "公開情報プロフィール案", text: "対象・用途・対応条件を、確認できる公開情報と参照元付きで案内します。" },
            website: { label: "Webサイト・FAQ案", text: "対象・用途・対応条件について、確認できる事実と参照元を整理します。" },
            brief: { label: "案内文の下書き", text: "公開情報と参照元を確認できる案内を作成します。" },
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
      {/* ポジショニング戦略の選定軸 */}
      <div className="section-heading-simple" style={{ textAlign: "left", margin: "16px 0 16px" }}>
          <p className="overline">【公開情報の整理案】確認する軸を1つ選ぶ</p>
        <h2>今回の測定で不足していた情報を、参照元付きで整理する軸を選択してください。</h2>
        <p>ここで示すのは改善候補です。記載のない情報は推測せず、内容を確認してから公開します。AIの推薦・順位・成果は保証しません。</p>
      </div>

      {/* 3つの戦略タブ（サイト解析から動的生成） */}
      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563eb", margin: "0 0 8px" }}>
          タブを選択すると、整理する情報の軸が切り替わります：
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

      {/* 選択された戦略の核 */}
      <div className="winning-angle-card" style={{ marginTop: "20px" }}>
        <div className="winning-angle-badge">公開情報に整理する確認軸</div>
        <h3>{current.coreThesis}</h3>
      </div>

      {/* 回答ログ上の候補と、自社側で確認する情報 */}
      <div className="competitor-weakness-block">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "1.05rem", margin: 0 }}>今回の候補表示と、自社側で確認する情報</h3>
          <span style={{ fontSize: "0.72rem", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
            ※測定ログと公開情報を分けて確認するための案
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 12px" }}>比較候補の弱点を推測せず、今回の回答ログと自社側の公開情報を分けて確認します。</p>
        {current.competitorAnalysis.length ? (
          <div className="weakness-grid">
            {current.competitorAnalysis.map((item) => (
              <article className="weakness-card" key={item.name}>
                <div className="weakness-card-head">
                  <span className="competitor-tag">{item.name}</span>
                  <strong className="competitor-gap">回答ログ: {item.gap}</strong>
                </div>
                <div className="our-advantage-box">
                  <span className="advantage-label">自社側で確認する情報：</span>
                  <p>{item.differentiation}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, padding: "14px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", fontSize: "0.84rem" }}>
            今回の測定では比較候補を確認できませんでした。候補が確認できた場合だけ、この欄に回答ログと参照元を表示します。
          </p>
        )}
      </div>

      {/* すぐに使える発信文（タブ切り替えでコンパクトに） */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <h3>確認用の紹介文案（ワンクリックコピー）</h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0" }}>確認できる事実と条件を入れた下書きです。内容を確認してから自社サイトや資料に掲載してください。</p>
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
