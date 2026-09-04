import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ChatGptComparisonVisual, HeroChatDiagnosticCard, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { VerifiedCompaniesGallery } from "@/components/verified-companies-gallery";

export default function HomePage() {
  return <main className="landing-page">
    <SiteHeader />

    <section className="landing-hero">
      <div className="shell landing-hero-inner">
        <div className="landing-hero-grid">
          
          {/* 左カラム：問題提起・入力フォーム・得られるメリット */}
          <div className="landing-hero-col-left">
            <div className="landing-hero-head-block">
              <p className="overline">ChatGPT・生成AI 推薦獲得システム</p>
              <h1>
                ChatGPTは、あなたの会社をスルーして<br />
                <em>ライバルを「おすすめ」しています。</em>
              </h1>
              <p className="landing-hero-lead">
                もう、新しい営業マンを雇う必要はありません。<br />
                自社サイト改修ゼロ・ブログ更新ゼロ。会社名を入れるだけで、<br />
                AIが御社の「本当の強み」を学習し、大手ライバルをスルーして御社をおすすめし始めます。
              </p>
            </div>

            {/* 入力フォーム */}
            <div className="landing-hero-form-box">
              <ScanForm />
            </div>

            {/* 一瞬で刺さる3大価値 */}
            <ul className="hero-feature-checks" aria-label="選ばれる3つの理由">
              <li>
                <span className="check-mark">✔</span>
                <span><strong>営業マン不要</strong>：月30万円以上の採用費をかけず、AIが24時間自社を紹介</span>
              </li>
              <li>
                <span className="check-mark">✔</span>
                <span><strong>作業・更新ゼロ</strong>：サイト改修もブログ執筆も一切不要。社名だけで台帳開設</span>
              </li>
              <li>
                <span className="check-mark">✔</span>
                <span><strong>新時代の推薦枠</strong>：ChatGPT等の相談検索で、ライバルより優先して推薦獲得</span>
              </li>
            </ul>

            {/* 診断見本リンク */}
            <div className="hero-sample-link-wrapper">
              <Link className="hero-sample-link" href="/result?sample=1">実際の診断・自動生成サンプルを見る <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          {/* 右カラム：0.1秒で伝わるChatGPTリアル比較＆診断プレビュー */}
          <div className="landing-hero-col-right">
            <HeroChatDiagnosticCard />
          </div>

        </div>
      </div>
    </section>

    {/* 入力欄の真下に、0.5秒で納得できるChatGPT比較観測ビジュアル */}
    <section className="landing-visual-section">
      <div className="shell">
        <div className="section-head-center" style={{ marginBottom: "20px" }}>
          <span className="pill-badge">なぜ今、対策が必要なのか</span>
          <h2>「Google検索」が終わり、顧客は「AIへの直接相談」へ移行しています</h2>
          <p>AI専用の公式台帳を持たない企業は、AIから「存在しない」と見なされ、推薦枠から完全に消えてしまいます。<br />自社サイト改修ゼロで公式台帳を配備し、AI新時代に取り残されるリスクをゼロにします。</p>
        </div>
        <ChatGptComparisonVisual />
      </div>
    </section>

    {/* 全国の事業者による公式台帳 開設・運用実例ギャラリー */}
    <VerifiedCompaniesGallery />

    {/* わかりやすい導入事例 */}
    <section className="landing-story-section">
      <div className="shell">
        <div className="section-intro">
          <p className="overline">営業マン不要の導入事例</p>
          <h2>「AIにスルーされていた」実業が、<br />24時間指名されるようになるまで。</h2>
          <p>自社サイトの改修ゼロでAI専用台帳を開設し、専任営業マンなしで推薦を獲得した事例です。</p>
        </div>

        <div className="story-grid">
          <article className="story-card">
            <div className="story-card-header">
              <span className="category">専門士業法人（相続・事業承継）</span>
              <h3>「営業活動ゼロで、AI経由の親身な相談が増加」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の状況：</strong><br />
                AIで「相続の相談窓口」を聞いても大手ばかりが推薦され、自社の存在は認知されていなかった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                自社サイト改修ゼロで公式台帳を開設。「親身な個別伴走体制」をAIに公式登録したことで、AIが『手厚い個別対応の専門家』として名指しでおすすめするようになった。
              </div>
            </div>
          </article>

          <article className="story-card">
            <div className="story-card-header">
              <span className="category">精密板金加工所（試作・小ロット）</span>
              <h3>「飛び込み営業なし。高単価な試作案件を直接獲得」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の状況：</strong><br />
                営業マンがおらず、ネットからの問い合わせも値下げを強いられる相見積もりばかりだった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                大手が対応できない「1点からの特急試作」を公式台帳に明記。AIが『短納期に強い工場』として開発者へ推薦し、適正価格の案件を獲得。
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="landing-proof" id="example">
      <div className="shell">
        <div className="section-intro">
          <p className="overline">診断レポートのイメージ</p>
          <h2>なぜAIは御社をスルーしているのか？<br />どうすれば推薦されるのかを完全可視化。</h2>
          <p>見込み客がAIに相談する質問ごとに、なぜ大手ライバルが先に出たのか、御社の何をAIに教えれば切り替わるのかを明確に提示します。</p>
        </div>
        <ProductOutputPreview />
        <div className="center-link"><Link className="text-button" href="/result?sample=1">診断結果の見本を見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-how" id="how">
      <div className="shell">
        <div className="section-intro section-intro-wide">
          <p className="overline">運用の手間はゼロ</p>
          <h2>ブログ更新も、HTML改修も不要。<br />社長は本業に集中するだけです。</h2>
        </div>
        <ProductProcessVisual />
      </div>
    </section>

    {/* 定期モニタリング（AI推薦の自動追跡） */}
    <section className="landing-watch">
      <div className="shell landing-watch-grid">
        <WatchTrendVisual />
        <div className="section-intro">
          <p className="overline">定期モニタリング機能</p>
          <h2>AIの推薦状況を、<br />毎週自動で追跡・チェック。</h2>
          <p>ChatGPTなどのAI回答は日々更新されます。自社がちゃんとお勧めされ続けているか、ライバルが割り込んできていないかを毎週自動で追跡調査します。</p>
          <Link className="text-button" href="/watch?sample=1">追跡レポートの見本を見る <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>

    <section className="landing-final-cta">
      <div className="shell">
        <p className="overline">AI新時代に取り残されないために</p>
        <h2>御社はAIから「おすすめ」されていますか？<br />まずは無料診断で、自社の現状をご確認ください。</h2>
        <ScanForm compact />
        <Link className="final-secondary-link" href="/pricing">料金プランの詳細を見る <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
