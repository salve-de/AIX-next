import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ChatGptComparisonVisual, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";

export default function HomePage() {
  return <main className="landing-page">
    <SiteHeader />

    <section className="landing-hero">
      <div className="shell landing-hero-inner">
        <p className="overline">自社サイトの改修ゼロ・入力するだけで診断</p>
        <h1>AIは、あなたの会社をスルーして<br /><em>ライバルばかり勧めています。</em></h1>
        <p className="landing-hero-lead">会社名や商品名を入れるだけで、AIが競合を先に勧めた理由と、今すぐ選ばれるための看板がわかります。自社サイトの改修は一切不要です。</p>
        
        {/* 【最重要】ファーストビューのド真ん中に入力フォームを配置 */}
        <div style={{ maxWidth: "800px", margin: "24px auto 36px" }}>
          <ScanForm />
        </div>

        {/* 入力欄の真下に、0.5秒でわかるAI比較観測ビジュアル */}
        <ChatGptComparisonVisual />
        
        {/* ホームに訪れた瞬間にわかる「3つの即時価値」 */}
        <div className="hero-instant-grid" aria-label="入力するだけでわかる3大価値">
          <article className="hero-instant-card">
            <span className="hero-instant-badge highlight">① 自社サイト改修ゼロ</span>
            <h3>AI専用の公式ページを発行</h3>
            <p>ホームページを書き換える必要はありません。AIが直接読み取っておすすめに使う専用ページを、その場で自動発行します。</p>
          </article>
          <article className="hero-instant-card">
            <span className="hero-instant-badge">② ライバルの隙間を解明</span>
            <h3>自社が勝てる「独自の看板」</h3>
            <p>なぜAIがライバルばかり勧めるのか理由を解明。大手の画一的な対応に対し、自社が選ばれる決定的な強みを特定します。</p>
          </article>
          <article className="hero-instant-card">
            <span className="hero-instant-badge">③ 考える手間ゼロ</span>
            <h3>コピペで使える「紹介文」を出力</h3>
            <p>公式SNSプロフィール、自社サイト記事、チラシや資料など、すぐに使える文章をワンクリックコピーで手元にお届けします。</p>
          </article>
        </div>

        <Link className="hero-sample-link" href="/result?sample=1">診断結果の見本を見る <span aria-hidden="true">→</span></Link>
      </div>
    </section>

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

    <section className="landing-watch">
      <div className="shell landing-watch-grid">
        <WatchTrendVisual />
        <div className="section-intro">
          <p className="overline">自動見守りプラン（月額10,780円税込）</p>
          <h2>発信したあと、<br />ライバルから取り返せたか。</h2>
          <p>同じ比較質問を毎週自動で調べ、自社が新しくおすすめに入ったかを追跡します。ライバルの動きも見逃しません。</p>
          <Link className="text-button" href="/watch?sample=1">変化の例を見る <span aria-hidden="true">→</span></Link>
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
