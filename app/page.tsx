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
        <p className="overline">生成AI検索における市場シェアの可視化と最適化</p>
        <h1>購買検討者が生成AIに相談したとき、<br /><em>貴社は「第一想起の候補」に入っていますか？</em></h1>
        <p className="landing-hero-lead">ChatGPTやGeminiなどの生成AIは、購買・相談直前の比較検討において急速に活用されています。AIXは、貴社と競合他社がAI上でどう推薦されているかを客観的に観測し、AI専用の構造化インデックスを通じて第一想起の推薦ポジション獲得を支援します。</p>
        
        {/* 【最重要】ファーストビューのド真ん中に入力フォームを配置 */}
        <div style={{ maxWidth: "800px", margin: "24px auto 36px" }}>
          <ScanForm />
        </div>

        {/* 入力欄の真下に、0.5秒でわかるAI比較観測ビジュアル */}
        <ChatGptComparisonVisual />
        
        {/* ホームに訪れた瞬間にわかる「3つのコアバリュー」 */}
        <div className="hero-instant-grid" aria-label="AIXが提供する3大価値">
          <article className="hero-instant-card">
            <span className="hero-instant-badge highlight">① 自社サイトの改修不要</span>
            <h3>AI専用公式データベースの即時発行</h3>
            <p>自社ホームページの改修は一切不要。AI検索クローラー（GPTBot等）が直接参照して推薦判断に用いる構造化データ（JSON-LD）を、貴社専用に自動発行します。</p>
          </article>
          <article className="hero-instant-card">
            <span className="hero-instant-badge">② 競合3社の隙間を解明</span>
            <h3>構造的差別化ポジショニングの特定</h3>
            <p>なぜAIが競合大手ばかりを推薦するのか、その判断基準を解明。大手の画一的マニュアル対応と貴社の強みを比較し、AIが論理的に貴社を選ぶ根拠を導出します。</p>
          </article>
          <article className="hero-instant-card">
            <span className="hero-instant-badge">③ 実務コストの最小化</span>
            <h3>公式チャネル向け発信文の即時出力</h3>
            <p>公式サイト・SNSプロフィール、Web解説コラム、提案資料など、選定した戦略に合わせてすぐに実務展開できる高品質なドラフト文章をワンクリックで提供します。</p>
          </article>
        </div>

        <Link className="hero-sample-link" href="/result?sample=1">診断レポートの見本を確認する <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    {/* 客観的な導入事例・効果検証 */}
    <section className="landing-story-section">
      <div className="shell">
        <div className="section-intro">
          <p className="overline">導入効果と分析事例</p>
          <h2>「AIの推薦候補外」から、<br />第一想起ポジションを獲得した実績。</h2>
          <p>生成AIを活用した購買検討が進む中、AI専用データベースの配備とポジショニングの明確化がもたらした具体的な成果です。</p>
        </div>

        <div className="story-grid">
          <article className="story-card">
            <div className="story-card-header">
              <span className="category">専門士業法人（相続・事業承継専門窓口）</span>
              <h3>「競合大手への流出を防ぎ、相談獲得率が向上」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の課題：</strong><br />
                AI検索で「相続相談のおすすめ」を比較した際、全国展開の大手グループや比較ポータルのみが推薦され、自社は候補外となって商談機会を逸失していた。
              </div>
              <div className="story-after">
                <strong>AIX導入後の成果：</strong><br />
                「複雑案件への個別伴走」をAI専用データベースに構造化。AIが『事務的対応を避けたい相談者向けの専門家』として認識し、質の高い個別相談案件の獲得につながった。
              </div>
            </div>
          </article>

          <article className="story-card">
            <div className="story-card-header">
              <span className="category">精密機械製造企業（試作・小ロット加工）</span>
              <h3>「価格競争から脱出し、短納期・高付加価値案件を獲得」</h3>
            </div>
            <div className="story-timeline">
              <div className="story-before">
                <strong>導入前の課題：</strong><br />
                一般的な「金属加工」の検索では量産チェーンの情報量に埋没し、Web経由の引き合いは単価の厳しい相見積もりに限定されていた。
              </div>
              <div className="story-after">
                <strong>AIX導入後の成果：</strong><br />
                「1点からの特急試作・難削材加工」にポジショニングを絞り込んでAIにインデックス。短納期を重視する開発部門の比較質問において第一想起を獲得し、適正単価での受注を実現。
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="landing-proof" id="example">
      <div className="shell">
        <div className="section-intro">
          <p className="overline">診断レポートの構造</p>
          <h2>AIが競合を選んだ理由と、<br />貴社が選ばれるための根拠を可視化。</h2>
          <p>顧客が比較検討する質問ごとに、自社が候補に入ったか、競合が先に推薦されたか、自社の何を伝えるべきかを客観的に確認できます。</p>
        </div>
        <ProductOutputPreview />
        <div className="center-link"><Link className="text-button" href="/result?sample=1">診断レポートの実例を見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-how" id="how">
      <div className="shell">
        <div className="section-intro section-intro-wide">
          <p className="overline">社内工数を最小化する運用設計</p>
          <h2>複雑な設定や学習は不要。<br />すべてバックグラウンドで自動処理します。</h2>
        </div>
        <ProductProcessVisual />
      </div>
    </section>

    <section className="landing-watch">
      <div className="shell landing-watch-grid">
        <WatchTrendVisual />
        <div className="section-intro">
          <p className="overline">継続モニタリングプログラム（月額10,780円税込）</p>
          <h2>施策展開後、<br />推薦ポジションがどう変化したか。</h2>
          <p>同一の比較質問を毎週定期的に定点観測し、自社が新しく推薦候補に入ったかをトラッキング。競合の動向やAIアルゴリズムの変動をバックグラウンドで継続管理します。</p>
          <Link className="text-button" href="/watch?sample=1">観測データの推移例を見る <span aria-hidden="true">→</span></Link>
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
