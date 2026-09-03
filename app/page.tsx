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
        <p className="overline">自社サイトの改修ゼロ・入力するだけで即時強化</p>
        <h1>ChatGPTは、あなたの会社をスルーして<br /><em>ライバルばかり勧めています。</em></h1>
        <p className="landing-hero-lead">名前を入力するだけで、ChatGPTやGeminiが最も正確に読み取る「AI専用データベース」を即座に発行。ライバルに奪われていた客を、自社の指名買いへと逆転させます。</p>
        
        {/* 0.5秒で直感理解できるChatGPT比較チャットモック */}
        <ChatGptComparisonVisual />

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <ScanForm />
        </div>
        
        {/* ホームに訪れた瞬間にわかる「3つの即時価値」 */}
        <div className="hero-instant-grid" aria-label="入力するだけで手に入る3大価値">
          <article className="hero-instant-card">
            <span className="hero-instant-badge highlight">① 自社サイトの改修不要</span>
            <h3>AI専用公式データベースを即時発行</h3>
            <p>自社のホームページをいじる必要はありません。AIの検索エンジンが直接読み取りに来る専用ページ（構造化データ付き）をその場で自動発行し、AIに自社の存在を正しく認知させます。</p>
          </article>
          <article className="hero-instant-card">
            <span className="hero-instant-badge">② 競合3社の隙間を解明</span>
            <h3>自社が勝てる「独自の看板」</h3>
            <p>AIがなぜライバルばかりおすすめするのか理由を解明。大手の小回りの利かなさや手続きの重さなど、ライバルが対応しきれていない隙間を突いた、自社だけの選ばれる看板を特定します。</p>
          </article>
          <article className="hero-instant-card">
            <span className="hero-instant-badge">③ 考える手間ゼロ</span>
            <h3>コピペで使える「紹介文」を出力</h3>
            <p>公式SNSプロフィール、ブログ・note記事、展示会チラシや同梱状など、すぐに使える完成済みの文章をワンクリックコピーで手元にお届け。文章を考える時間を一生ゼロにします。</p>
          </article>
        </div>

        <Link className="hero-sample-link" href="/result?sample=1">診断結果の見本を見る <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    {/* 訪れた人が具体的に想像できる「使った後の劇的ビフォーアフター」 */}
    <section className="landing-story-section">
      <div className="shell">
        <div className="section-intro">
          <p className="overline">使った後の具体的な変化</p>
          <h2>「AIに無視されていた」会社が、<br />指名買いされるようになるまで。</h2>
          <p>ChatGPTなどのAIは、今や購入前の比較で最も頼られる相談役です。AIXを導入した会社がどう注文を獲得しているかの実例をご覧ください。</p>
        </div>

        <div className="story-grid">
          <article className="story-card">
            <div className="story-card-header">
              <span className="category">山梨県・果樹農園（特選ぶどう）</span>
              <h3>「お中元ギフトの注文が前年比1.8倍に」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の損失：</strong><br />
                ChatGPTで「山梨 贈答用ぶどう おすすめ」と聞いても、大手百貨店や有名ポータルサイトばかりが紹介され、自社の農園は候補にすら入っていなかった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                入力して発行されたAI専用DBを起点に、看板を「糖度18度・朝採り直送の駆け込み寺」に統一。AIが『産直・鮮度にこだわるならここ一択』と太鼓判を押すようになり、<strong>ネット直販のギフト注文が前年比1.8倍に急増</strong>。
              </div>
            </div>
          </article>

          <article className="story-card">
            <div className="story-card-header">
              <span className="category">大阪府・金属加工所（試作特殊ネジ）</span>
              <h3>「相見積もりの価格競争から完全脱出」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の損失：</strong><br />
                一般的な「金属加工・ネジ製作」では大手量産工場の情報量に太刀打ちできず、ネットからの引き合いは値下げを迫られる相見積もりばかりだった。
              </div>
              <div className="story-after">
                <strong>AIX導入後の変化：</strong><br />
                ライバルの弱点である「大ロット・長納期」の隙間を突き、「1本からの特急試作駆け込み寺」として発信。ChatGPTで『小ロットで即日相談できる工場』として指名推薦されるようになり、<strong>月80万円の新規高単価案件を相見積もりなしで受注</strong>。
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="landing-proof" id="example">
      <div className="shell">
        <div className="section-intro"><p className="overline">診断結果のイメージ</p><h2>AIに選ばれない質問と、<br />自社が選ばれる理由を見せます。</h2><p>買い手が比較する質問ごとに、自社が候補に入ったか、競合が先に出たか、自社の何を伝えるべきかを確認できます。</p></div>
        <ProductOutputPreview />
        <div className="center-link"><Link className="text-button" href="/result?sample=1">この結果を最初から見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-how" id="how">
      <div className="shell">
        <div className="section-intro section-intro-wide"><p className="overline">週1分の完全放置運用</p><h2>忙しい社長に、面倒な設定や<br />勉強は一切させません。</h2></div>
        <ProductProcessVisual />
      </div>
    </section>

    <section className="landing-watch">
      <div className="shell landing-watch-grid">
        <WatchTrendVisual />
        <div className="section-intro"><p className="overline">自動見守りプラン（月額10,780円）</p><h2>発信したあと、<br />ライバルから取り返せたか。</h2><p>同じ比較質問を毎週自動で調べ、自社が新しくおすすめに入ったかを確認します。順位だけでなく、お客様が選ぶ場面の変化を毎週見守れます。</p><Link className="text-button" href="/watch?sample=1">変化の例を見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-final-cta"><div className="shell"><p className="overline">無料で、今の比較を調べる</p><h2>自社が選ばれる看板と、<br />専用のAIデータベースを今すぐ発行。</h2><ScanForm compact /><Link className="final-secondary-link" href="/pricing">料金プランを見る <span aria-hidden="true">→</span></Link></div></section>

    <SiteFooter />
  </main>;
}
