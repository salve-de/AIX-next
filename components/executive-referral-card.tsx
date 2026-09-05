"use client";

import { useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/icons";

type ExecutiveReferralCardProps = {
  brandName: string;
  watchToken?: string;
};

export function ExecutiveReferralCard({ brandName, watchToken = "" }: ExecutiveReferralCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // トークンまたは社名から品格ある公認招待コードを自動生成（例: AIX-7749-VIP）
  const tokenSuffix = watchToken
    ? watchToken.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()
    : "7749";
  const inviteCode = `AIX-${tokenSuffix || "VIP"}-NETWORK`;

  // 紹介された側が「教えてくれてありがとう」と感謝する、相手本位のLINE・メール用文面
  const shareMessage = `【AI推薦状況の無料確認のご案内】
${brandName}の代表です。
最近、ChatGPTやPerplexityなどのAIで会社を探す顧客が急増していますが、先日ウチの会社を診断したところ、競合大手に顧客が流出している実態が判明しました。

10秒で自社がAIに推薦されているか確認できる無料診断がありますので、御社も一度状況を観測されることをお勧めします。

▼ AIX公式 10秒無料診断窓口
https://aix-next.com/

※もし週次見守りなどの対策を実施される場合は、当社の相互見守りネットワーク公認招待コード【 ${inviteCode} 】をご決済時に入力いただくと、【初月利用料（9,800円）が100%免除（初月無料）】になります。よろしければご活用ください。`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      setCopiedMessage(false);
    }
  }

  return (
    <section className="executive-referral-card" aria-label="経営者相互見守りネットワーク特別枠">
      <div className="referral-card-header">
        <div className="referral-badge-wrap">
          <span className="referral-tag">公認特別枠</span>
          <span className="referral-subtag">経営者相互見守りネットワーク</span>
        </div>
        <h3>経営者仲間へのご紹介優待（相互還元枠）</h3>
        <p className="referral-lead">
          AI時代の顧客獲得において、地域や業界の志ある企業同士が手を携えるための公認相互優待枠です。
          知り合いの経営者様へご案内いただくことで、双方に永続的な優待が適用されます。
        </p>
      </div>

      {/* 両面優待スペック表 */}
      <div className="referral-benefits-grid">
        <div className="benefit-col incoming">
          <span className="benefit-role">ご紹介先企業様（お仲間）</span>
          <div className="benefit-highlight">
            <strong>初月利用料 100%免除</strong>
            <small>正規 9,800円（税別） ➔ 初月 0円</small>
          </div>
          <p className="benefit-desc">
            御社専用の招待コードを利用することで、初月の観測・見守り費用が完全無料になります。
            余計な負担をかけずに最新のAI対策を体験いただけます。
          </p>
        </div>

        <div className="benefit-col outgoing">
          <span className="benefit-role">ご紹介元企業様（{brandName || "御社"}）</span>
          <div className="benefit-highlight">
            <strong>1社につき毎月 3,000円 継続還元</strong>
            <small>3社ご紹介で御社のAIX利用料は【実質永久無料】</small>
          </div>
          <p className="benefit-desc">
            ご紹介先が継続される限り、毎月3,000円が御社へ還元（利用料相殺またはお振込）されます。
            4社目以降は御社の純利益として毎月積み上がります。
          </p>
        </div>
      </div>

      {/* 招待コード ＆ コピーアクション */}
      <div className="referral-action-section">
        <div className="code-display-box">
          <div className="code-label-group">
            <span className="code-label">御社専用 公認招待コード</span>
            <small className="code-note">※決済画面の「プロモーションコード」欄に入力</small>
          </div>
          <div className="code-value-wrap">
            <code className="referral-code">{inviteCode}</code>
            <button
              type="button"
              className="button button-secondary code-copy-btn"
              onClick={() => void copyCode()}
            >
              {copiedCode ? <><CheckIcon /> コピー完了</> : "コードをコピー"}
            </button>
          </div>
        </div>

        {/* LINE・メール用ワンクリックコピー */}
        <div className="message-template-box">
          <div className="template-header">
            <div>
              <strong>経営者仲間へ送るご案内文面（LINE / メール用）</strong>
              <small>相手に感謝され、自然に診断へ案内できる相手本位の推薦文面です。</small>
            </div>
            <button
              type="button"
              className="button button-dark template-copy-btn"
              onClick={() => void copyMessage()}
            >
              {copiedMessage ? <><CheckIcon /> 文面をコピーしました</> : <>文面を丸ごとコピー <ArrowIcon /></>}
            </button>
          </div>
          <pre className="message-preview-text">{shareMessage}</pre>
        </div>
      </div>

      <div className="referral-footer-note">
        <small>
          ※本制度はAIX利用企業様相互の信頼に基づく特別優待枠です。不正な大量取得や公序良俗に反する配布が行われた場合は優待資格が停止されます。
        </small>
      </div>

      <style jsx>{`
        .executive-referral-card {
          margin: 32px 0;
          padding: 28px 32px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }
        .referral-card-header h3 {
          margin: 8px 0 6px;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .referral-badge-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .referral-tag {
          font-size: 0.68rem;
          font-weight: 800;
          background: #0f172a;
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }
        .referral-subtag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
        }
        .referral-lead {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .referral-benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 640px) {
          .referral-benefits-grid {
            grid-template-columns: 1fr;
          }
        }
        .benefit-col {
          padding: 18px 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .benefit-col.incoming {
          border-color: #cbd5e1;
        }
        .benefit-col.outgoing {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        .benefit-role {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          display: block;
          margin-bottom: 6px;
        }
        .benefit-col.outgoing .benefit-role {
          color: #166534;
        }
        .benefit-highlight strong {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
        }
        .benefit-col.outgoing .benefit-highlight strong {
          color: #15803d;
        }
        .benefit-highlight small {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
          font-weight: 600;
        }
        .benefit-desc {
          margin: 10px 0 0;
          font-size: 0.78rem;
          color: #475569;
          line-height: 1.55;
        }
        .referral-action-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .code-display-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 16px;
        }
        .code-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .code-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #0f172a;
        }
        .code-note {
          font-size: 0.7rem;
          color: #64748b;
        }
        .code-value-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .referral-code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 1.1rem;
          font-weight: 800;
          background: #ffffff;
          padding: 6px 14px;
          border: 1.5px dashed #0f172a;
          border-radius: 6px;
          color: #0f172a;
          letter-spacing: 0.05em;
        }
        .code-copy-btn {
          font-size: 0.78rem;
          padding: 7px 14px;
        }
        .message-template-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .template-header strong {
          display: block;
          font-size: 0.82rem;
          font-weight: 800;
          color: #0f172a;
        }
        .template-header small {
          display: block;
          font-size: 0.72rem;
          color: #64748b;
        }
        .template-copy-btn {
          font-size: 0.78rem;
          padding: 7px 14px;
        }
        .message-preview-text {
          margin: 0;
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.78rem;
          color: #334155;
          line-height: 1.6;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .referral-footer-note {
          font-size: 0.7rem;
          color: #94a3b8;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
