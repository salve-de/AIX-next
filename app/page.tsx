import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ChatGptComparisonVisual, HeroChatDiagnosticCard, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { LiveActivityTicker } from "@/components/live-activity-ticker";
import { VerifiedCompaniesGallery } from "@/components/verified-companies-gallery";

export default function HomePage() {
  return <main className="landing-page">
    <SiteHeader />
    <LiveActivityTicker />

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
                会社名やサイトURLを入れるだけで、AIが競合を先に勧めた理由と、<br />
                自社が選ばれるための改善策を即座に無料診断します。
              </p>
            </div>

            {/* 入力フォーム */}
            <div className="landing-hero-form-box">
              <ScanForm />
            </div>

            {/* 得られる3大結果（枠線を廃止し、すっきりと読みやすいチェックリストに刷新） */}
            <ul className="hero-feature-checks" aria-label="診断でわかる3つのこと">
              <li>
                <span className="check-mark">✔</span>
                <span><strong>競合に負けている質問</strong>を特定</span>
              </li>
              <li>
                <span className="check-mark">✔</span>
                <span>AIが<strong>ライバルを選んだ決定打</strong>を解明</span>
              </li>
              <li>
                <span className="check-mark">✔</span>
                <span>サイト改修不要で<strong>AIに選ばれる改善策</strong>を出力</span>
              </li>
            </ul>

            {/* 診断見本リンク */}
            <div className="hero-sample-link-wrapper">
              <Link className="hero-sample-link" href="/result?sample=1">実際の診断結果サンプルを見る <span aria-hidden="true">→</span></Link>
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

    {/* AIクローラー巡回と推薦の仕組み（中学生・農家・町工場の社長でも即座にわかる解説） */}
    <section className="crawler-proof-section">
      <div className="section-inner">
        <div className="crawler-card">
          <div className="crawler-card-header">
            <span className="crawler-status-pulse"></span>
            <strong>主要AI（ChatGPT / Gemini / Claude / Perplexity）が正しく参照する仕組み</strong>
          </div>
          <p className="crawler-card-desc">
            <strong>「なぜAI公式Web拠点があると、AIが自社を正しく認識・推薦するのか？」</strong><br />
            一般的なホームページはデザインや写真が多く、AIが料金や具体的なサービス内容を誤読したり見落とすケースが少なくありません。AIXが発行する公的ナレッジ台帳は、<strong>AIロボットが正確に理解できる標準構造化データ（Schema.org形式）</strong>で常時提供されるため、AIがユーザーへの回答を生成する際、信頼できる確定ソースとして引用されます。
          </p>

          <div className="crawler-bot-grid">
            <div className="crawler-bot-item">
              <span className="bot-name">OpenAI (ChatGPT)</span>
              <span className="bot-agent">OAI-SearchBot</span>
              <span className="bot-status green">● 巡回・参照対応</span>
            </div>
            <div className="crawler-bot-item">
              <span className="bot-name">Google (Gemini)</span>
              <span className="bot-agent">Googlebot / Gemini</span>
              <span className="bot-status green">● 構造化データ対応</span>
            </div>
            <div className="crawler-bot-item">
              <span className="bot-name">Anthropic (Claude)</span>
              <span className="bot-agent">ClaudeBot</span>
              <span className="bot-status green">● 確定ナレッジ取得</span>
            </div>
            <div className="crawler-bot-item">
              <span className="bot-name">Perplexity AI</span>
              <span className="bot-agent">PerplexityBot</span>
              <span className="bot-status green">● 出典元として引用</span>
            </div>
          </div>

          <div className="crawler-benefits-row">
            <div className="benefit-pill">
              <strong>1. ホームページ制作・維持費を圧縮</strong>
              <span>発行されたページがそのまま公式Web拠点として機能。名刺・SNS・Googleマップのウェブサイト欄に登録するだけで完結します。</span>
            </div>
            <div className="benefit-pill">
              <strong>2. AIによる誤案内や見落としを防止</strong>
              <span>料金・営業時間・強みが公式登録されているため、AIが事実無根の回答をしたり競合他社ばかり推薦するのを防ぎます。</span>
            </div>
            <div className="benefit-pill">
              <strong>3. スマホからいつでも直接更新可能</strong>
              <span>管理画面からいつでも料金改定や営業時間を手元で更新し、常に最新情報をAIに提供できます。</span>
            </div>
          </div>
        </div>
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
