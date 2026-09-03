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
    <section className="positioning-section shell" aria-label="競合から顧客を取り戻すための整理">
      <div className="section-heading-simple">
        <p className="overline">競合から顧客を取り戻す</p>
        <h2>競合が選ばれた理由を見つけ、<br />自社を選ぶ材料をつくる。</h2>
        <p>今回の比較で確認できた差から、次に伝えることと載せる場所を整理します。</p>
      </div>

      {/* 1. 勝てる看板 */}
      <div className="winning-angle-card">
        <div className="winning-angle-badge">今回の比較で見えた勝ち筋</div>
        <h3>{positioning.winningAngle}</h3>
        <p className="winning-angle-summary">{positioning.summary}</p>
      </div>

      {/* 2. 比較で見えた差 */}
      <div className="competitor-weakness-block">
        <h3>競合が先に選ばれた理由</h3>
        <p className="block-desc">AIの回答と公開ページで確認できた内容を、自社が埋める差として整理しました。</p>
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

      {/* 3. そのまま使える発信文 */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <div>
            <h3>そのまま使える発信文</h3>
            <p className="block-desc">プロフィール、記事、営業資料に合わせた下書きを用意しました。</p>
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
