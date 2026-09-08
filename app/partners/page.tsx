import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "パートナー制度",
  description: "Web制作会社・士業・コンサルタント向けに、Rovanの現在の提供範囲を案内します。",
};

export default function PartnersPage() {
  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="partners-main">
        {/* ヒーローセクション */}
        <section className="partners-hero">
          <div className="shell">
            <span className="partners-kicker">
              PARTNER INFORMATION // Web制作会社・士業・コンサルタント向け
            </span>
            <h1>
              顧客の専門性を、AIに選ばれる理由へ。<br />
              Rovanパートナー制度。
            </h1>
            <p className="partners-lead">
              自社サイトを改修せず、顧客のニッチな強みを伝える情報補強とAI回答の継続測定を支援します。
              紹介・パートナー制度は廃止ではなく、受付・報酬管理の実装を復旧するまで開始待ちです。
              現時点では紹介報酬の発生や割引適用は行いません。
            </p>

            <div className="partners-cta-row">
              <a href="#partner-apply" className="button button-primary">
                現在の提供範囲を見る <ArrowIcon />
              </a>
              <Link href="/result?sample=1" className="button button-secondary">
                診断の見本を見る
              </Link>
            </div>
          </div>
        </section>

        {/* パートナーが説明しやすい情報 */}
        <section className="partners-benefits shell">
          <div className="section-heading-simple">
            <p className="overline">WHAT PARTNERS CAN EXPLAIN</p>
            <h2>現在、説明できるサービスの範囲</h2>
            <p>結果の条件・参照元・未確認事項を分けて示し、顧客と同じ情報を確認できる状態をつくります。</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-card-badge">測定条件</div>
              <h3>質問・AI・日時を記録</h3>
              <p>
                どの質問、どのAI、いつの観測かを表示します。観測結果を全利用者に共通する順位や売上の指標として扱いません。
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-card-badge">参照元</div>
              <h3>回答と公開情報を分けて確認</h3>
              <p>
                AI回答に含まれた参照URLと、対象サイトから確認できた事実を別々に確認できます。根拠のない補足は表示しません。
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-card-badge">公開前確認</div>
              <h3>整理案は確認してから公開</h3>
              <p>
                公開情報の整理案は下書きとして扱い、事実と参照元を確認してから公開します。対象サイトを自動変更しません。
              </p>
            </div>
          </div>
        </section>

        {/* 現在の提供範囲 */}
        <section className="partners-mechanism shell">
          <div className="mechanism-card">
            <div className="mechanism-text">
              <span className="mechanism-tag">CURRENT SCOPE</span>
              <h2>制度の開始に向けて復旧中です</h2>
              <p>
                現時点では、紹介料、割引、専用招待コード、パートナー管理画面、申請後の自動案内を提供していません。
                提供内容や契約条件が確定した場合は、料金・規約・問い合わせ窓口をこのページで更新します。
              </p>
              <p>
                いま確認できる機能は、AI回答の観測、参照元URLの確認、公開情報の整理案、同じ条件での継続測定です。
              </p>
            </div>
            <div className="mechanism-box">
              <div className="spec-row">
                <span>確認できるもの</span>
                <strong>AI回答・参照URL・公開情報の整理案</strong>
              </div>
              <div className="spec-row">
                <span>対象サイト</span>
                <strong>自動変更なし</strong>
              </div>
              <div className="spec-row">
                <span>制度の状態</span>
                <strong>準備中</strong>
              </div>
            </div>
          </div>
        </section>

        {/* パートナー制度の案内 */}
        <section className="partners-apply shell" id="partner-apply">
          <div className="apply-container">
            <div className="apply-head">
              <span className="overline">NEXT STEP</span>
              <h2>まずは公開されている設計を確認してください</h2>
              <p>申請フォームは、実際の受付・案内機能を用意できるまで公開しません。現在のサービス仕様は以下から確認できます。</p>
            </div>
            <div className="partners-cta-row">
              <Link href="/methodology" className="button button-primary">
                測定方法を見る <ArrowIcon />
              </Link>
              <Link href="/pricing" className="button button-secondary">
                料金と提供範囲を見る
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <style>{`
        .partners-main {
          padding-bottom: 80px;
        }
        .partners-hero {
          padding: 80px 0 60px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }
        .partners-kicker {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          background: #e0f2fe;
          padding: 4px 12px;
          border-radius: 4px;
        }
        .partners-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          letter-spacing: -0.03em;
          margin: 0 0 20px;
        }
        .partners-lead {
          max-width: 680px;
          margin: 0 auto 32px;
          font-size: 1rem;
          color: #475569;
          line-height: 1.7;
        }
        .partners-cta-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .partners-benefits {
          padding: 80px 0 60px;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 36px;
        }
        @media (max-width: 768px) {
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          .partners-hero h1 {
            font-size: 1.85rem;
          }
        }
        .benefit-card {
          padding: 28px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
        }
        .benefit-card-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          color: #0284c7;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 12px;
        }
        .benefit-card h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .benefit-card p {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.65;
          margin: 0;
        }
        .partners-mechanism {
          margin: 20px auto 60px;
        }
        .mechanism-card {
          background: #0f172a;
          color: #ffffff;
          border-radius: 14px;
          padding: 48px;
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 840px) {
          .mechanism-card {
            grid-template-columns: 1fr;
            padding: 32px 24px;
          }
        }
        .mechanism-tag {
          font-size: 0.72rem;
          font-weight: 800;
          background: #0284c7;
          color: #ffffff;
          padding: 3px 10px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 12px;
        }
        .mechanism-text h2 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 16px;
          line-height: 1.35;
        }
        .mechanism-text p {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.65;
          margin: 0 0 12px;
        }
        .mechanism-box {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #334155;
          font-size: 0.85rem;
        }
        .spec-row:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }
        .spec-row span {
          color: #94a3b8;
        }
        .spec-row strong {
          color: #ffffff;
          font-weight: 700;
        }
        .spec-row .text-green {
          color: #4ade80;
        }
        .partners-apply {
          padding: 40px 0 60px;
        }
        .apply-container {
          max-width: 640px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
        }
        .apply-head {
          text-align: center;
          margin-bottom: 28px;
        }
        .apply-head h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 6px 0 8px;
        }
        .apply-head p {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
          line-height: 1.55;
        }
        .apply-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
        }
        .form-group .req {
          color: #dc2626;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px 14px;
          font-size: 0.85rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #ffffff;
          color: #0f172a;
        }
        .apply-submit-btn {
          margin-top: 8px;
          padding: 12px 20px;
          font-size: 0.9rem;
          font-weight: 800;
        }
        .privacy-notice {
          font-size: 0.7rem;
          color: #94a3b8;
          text-align: center;
          margin: 6px 0 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
