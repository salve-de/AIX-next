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
              <p className="overline">ChatGPT・生成AI 競合推薦診断</p>
              <h1>
                ChatGPTは、あなたの会社をスルーして<br />
                <em>ライバルを「おすすめ」しています。</em>
              </h1>
              <p className="landing-hero-lead">
                サイト改修は一切不要。会社名を入れるだけで「AI専用DB」を自動作成。<br />
                ChatGPTなどの生成AIから、自社が優先推薦されやすい環境を整えます。
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
                <span><strong>作業ゼロ</strong>：サイト改修や専門知識は一切不要</span>
              </li>
              <li>
                <span className="check-mark">✔</span>
                <span><strong>自動DB生成</strong>：社名だけでAI専用の公式台帳を配備</span>
              </li>
              <li>
                <span className="check-mark">✔</span>
                <span><strong>推薦枠の獲得</strong>：ChatGPTから自社が推薦されやすくなる</span>
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
          <span className="pill-badge">推薦結果の違い</span>
          <h2>AIに情報が届いている会社と、届いていない会社の違い</h2>
          <p>AIはネット上の断片情報ではなく、公式に整備された構造化データを優先して顧客に回答します。</p>
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
          <p className="overline">具体的な導入事例</p>
          <h2>「AIに無視されていた」会社が、<br />指名されるようになるまで。</h2>
          <p>AI専用ページの配備と強みの明確化によって、実際に起きた変化の実例です。</p>
        </div>

        <div className="story-grid">
          <article className="story-card">
            <div className="story-card-header">
              <span className="category">専門士業法人（相続・事業承継）</span>
              <h3>「競合大手への流出を防ぎ、相談獲得が増加」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の状況：</strong><br />
                AIで「相続の相談」を聞いても大手ばかりが推薦され、自社は候補にすら入っていなかった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                発行されたAI専用ページで「親身な個別対応」をAIに教え込み、AIが『個別伴走の専門窓口』として推薦するようになった。
              </div>
            </div>
          </article>

          <article className="story-card">
            <div className="story-card-header">
              <span className="category">精密機械加工所（試作・小ロット）</span>
              <h3>「相見積もりの価格競争から脱出」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の状況：</strong><br />
                ネットからの引き合いは値下げを迫られる相見積もりばかりで、利益が出にくかった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                大手が敬遠する「1点からの特急試作」を看板に設定。AIが『短納期対応の工場』として名指し推薦し、高付加価値な注文を獲得。
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
          <h2>AIに選ばれない理由と、<br />自社が選ばれる看板を見せます。</h2>
          <p>お客様が比較する質問ごとに、自社が候補に入ったか、競合が先に出たか、自社の何を伝えるべきかを確認できます。</p>
        </div>
        <ProductOutputPreview />
        <div className="center-link"><Link className="text-button" href="/result?sample=1">診断結果の見本を見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-how" id="how">
      <div className="shell">
        <div className="section-intro section-intro-wide">
          <p className="overline">運用の手間はゼロ</p>
          <h2>難しい設定や勉強は一切不要。<br />裏側で自動処理します。</h2>
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
        <p className="overline">まずは現状のポジションを確認する</p>
        <h2>AI検索における貴社の推薦状況を、<br />無料診断で即座に可視化します。</h2>
        <ScanForm compact />
        <Link className="final-secondary-link" href="/pricing">料金プランの詳細を見る <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
