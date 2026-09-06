"use client";

import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PartnersPage() {
  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="partners-main">
        {/* ヒーローセクション */}
        <section className="partners-hero">
          <div className="shell">
            <span className="partners-kicker">
              B2B PARTNER PROGRAM // Web制作会社・士業・コンサルタント様向け
            </span>
            <h1>
              クライアントのAI推薦対策を、<br />
              御社の「永続ストック収益」へ。
            </h1>
            <p className="partners-lead">
              ChatGPTやPerplexityの普及により、従来のGoogle SEOは効力を失いつつあります。
              Rovan認定パートナー制度は、貴社のクライアントへ「自社サイト改修ゼロのAI公式推薦インフラ」を提供し、
              月額費用の30%を生涯にわたり貴社へ還元する公認レベニューシェアプログラムです。
            </p>

            <div className="partners-cta-row">
              <a href="#partner-apply" className="button button-primary">
                パートナー申請（登録無料） <ArrowIcon />
              </a>
              <Link href="/" className="button button-secondary">
                自社・クライアントを無料診断してみる
              </Link>
            </div>
          </div>
        </section>

        {/* 3大パートナーメリット */}
        <section className="partners-benefits shell">
          <div className="section-heading-simple">
            <p className="overline">PARTNER ADVANTAGES</p>
            <h2>なぜ全国のWeb制作会社・士業から選ばれるのか</h2>
            <p>単なるツールの代理店ではありません。貴社の既存顧客との関係性を強固にし、安定した収益基盤を構築します。</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-card-badge">収益性</div>
              <h3>月額30%の永続ライフタイム還元</h3>
              <p>
                1件成約につき、月額9,800円の30%（約3,000円）が解約されない限り毎月貴社口座へ振り込まれます。
                10社で月3万円、30社で月9万円、100社で月30万円の完全ストック収入が積み上がります。
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-card-badge">提案力</div>
              <h3>客先で使える「無料診断兵器」</h3>
              <p>
                顧客のURLを入力するだけで、「競合大手に顧客を奪われている生々しいログカルテ」が即座に出力されます。
                「御社、AIに無視されてますよ」と見せるだけで、リニューアル提案や最新AI対策の商談がスムーズに成立します。
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-card-badge">工数ゼロ</div>
              <h3>貴社の実働・改修工事ゼロ</h3>
              <p>
                「AI公式推薦パス」の開設、毎週のAI回答巡回、データ更新はすべてRovanシステムが完全放置で自走します。
                貴社のエンジニアやデザイナーが追加の制作作業に追われることは一切ありません。
              </p>
            </div>
          </div>
        </section>

        {/* ステルス両面優待の仕組み */}
        <section className="partners-mechanism shell">
          <div className="mechanism-card">
            <div className="mechanism-text">
              <span className="mechanism-tag">成約率を最大化する設計</span>
              <h2>クライアントに「教えてくれてありがとう」と感謝される両面優待</h2>
              <p>
                パートナー専用の「特別招待コード」をクライアントへご案内いただくことで、
                クライアントには【初月無料優待（9,800円 ➔ 0円）】が適用されます。
              </p>
              <p>
                「紹介料を抜いている」という疑念を抱かれることなく、「弊社の特別提携枠で初月無料の権利をご用意しました」と
                堂々と価値を提供できるため、高い成約率と良好な人間関係を両立します。
              </p>
            </div>
            <div className="mechanism-box">
              <div className="spec-row">
                <span>クライアント側</span>
                <strong>初月利用料 100%免除（初月0円）</strong>
              </div>
              <div className="spec-row">
                <span>貴社（パートナー）</span>
                <strong className="text-green">毎月 30%（約3,000円/社）永続支給</strong>
              </div>
              <div className="spec-row">
                <span>初期登録費用</span>
                <strong>完全無料（ノルマ・違約金なし）</strong>
              </div>
            </div>
          </div>
        </section>

        {/* パートナー申請フォーム */}
        <section className="partners-apply shell" id="partner-apply">
          <div className="apply-container">
            <div className="apply-head">
              <span className="overline">REGISTRATION</span>
              <h2>Rovan 認定パートナーへのお申し込み</h2>
              <p>以下のフォームより申請いただくと、専任担当より専用招待コードおよび管理ポータルのご案内を即日お送りいたします。</p>
            </div>

            <form
              className="apply-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("パートナー申請を受け付けました。\nご入力いただいたメールアドレス宛に、専任窓口より即時ご案内をお送りいたします。");
              }}
            >
              <div className="form-group">
                <label htmlFor="p-company">貴社名 / 屋号 <span className="req">*</span></label>
                <input id="p-company" type="text" required placeholder="例: 株式会社デジタルパートナーズ" />
              </div>

              <div className="form-group">
                <label htmlFor="p-name">ご担当者様氏名 <span className="req">*</span></label>
                <input id="p-name" type="text" required placeholder="例: 山田 太郎" />
              </div>

              <div className="form-group">
                <label htmlFor="p-email">事業用メールアドレス <span className="req">*</span></label>
                <input id="p-email" type="email" required placeholder="例: yamada@example.co.jp" />
              </div>

              <div className="form-group">
                <label htmlFor="p-type">貴社の主たる業態 <span className="req">*</span></label>
                <select id="p-type" required defaultValue="web">
                  <option value="web">Web制作・ホームページ制作会社</option>
                  <option value="seo">SEO・Webマーケティング支援</option>
                  <option value="ad">広告代理店・PR会社</option>
                  <option value="tax">税理士・公認会計士・士業事務所</option>
                  <option value="consult">経営コンサルタント・中小企業診断士</option>
                  <option value="other">その他（個人事業主・エージェント等）</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="p-note">想定されるクライアント数やご相談事項（任意）</label>
                <textarea id="p-note" rows={3} placeholder="例: 既存クライアント約20社への展開を検討中、など" />
              </div>

              <button type="submit" className="button button-primary apply-submit-btn">
                認定パートナー申請を送信する（無料） <ArrowIcon />
              </button>

              <p className="privacy-notice">
                ※ご送信いただいた情報はプライバシーポリシーに基づき厳重に管理し、パートナー制度のご案内のみに使用いたします。
              </p>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />

      <style jsx>{`
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
