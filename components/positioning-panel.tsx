"use client";

import { useState } from "react";
import type { ActionableMessage, PositioningAdvice } from "@/lib/types";

export function PositioningPanel({ positioning }: { positioning?: PositioningAdvice }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!positioning) return null;

  async function copyToClipboard(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // コピー不可環境では何もしない
    }
  }

  return (
    <section className="positioning-section shell" aria-label="競合弱点分析と事業の勝ち筋">
      <div className="section-heading-simple">
        <p className="overline">事業の勝ち筋・ポジショニング軍師</p>
        <h2>競合の弱点を突き、<br />AIがあなたを1位に選ぶ「看板」を掲げる。</h2>
        <p>ホームページの小手先の修正にとどまらず、事業の売り方・発信方針そのものを競合の隙間に合わせます。</p>
      </div>

      {/* 1. 勝てる看板 */}
      <div className="winning-angle-card">
        <div className="winning-angle-badge">自社が勝てる独自の看板</div>
        <h3>{positioning.winningAngle}</h3>
        <p className="winning-angle-summary">{positioning.summary}</p>
      </div>

      {/* 2. 競合3社の弱点一覧 */}
      <div className="competitor-weakness-block">
        <h3>競合が対応できていない「弱点・隙間」</h3>
        <p className="block-desc">AIの回答データと公開情報から、ライバル各社の構造的な弱点をあぶり出しました。</p>
        <div className="weakness-grid">
          {positioning.competitorWeaknesses.map((item) => (
            <article className="weakness-card" key={item.competitor}>
              <div className="weakness-card-head">
                <span className="competitor-tag">{item.competitor}</span>
                <strong>{item.weakness}</strong>
              </div>
              <p>{item.rationale}</p>
            </article>
          ))}
        </div>
      </div>

      {/* 3. 全方位の発信指示（SNS・ブログ・チラシ） */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <div>
            <h3>全方位の発信指示（今すぐ使える下書き）</h3>
            <p className="block-desc">この看板をAIに認知させるため、各媒体ですぐに使える具体的な文章を用意しました。</p>
          </div>
        </div>

        <div className="actionable-messages-list">
          {positioning.actionableMessages.map((msg: ActionableMessage, idx: number) => (
            <article className="actionable-message-card" key={msg.channel}>
              <div className="actionable-card-header">
                <div>
                  <span className="channel-badge">{msg.channelLabel}</span>
                  <h4>{msg.headline}</h4>
                </div>
                <button
                  type="button"
                  className="button-copy"
                  onClick={() => copyToClipboard(msg.copy, idx)}
                  aria-label={`${msg.channelLabel}の文章をコピー`}
                >
                  {copiedIndex === idx ? "✓ コピー完了" : "文章をコピー"}
                </button>
              </div>
              <div className="actionable-copy-box">
                <pre>{msg.copy}</pre>
              </div>
              <p className="actionable-instruction">
                <strong>使い方:</strong> {msg.instruction}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
