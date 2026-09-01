import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { FourOutputs, HeroSignalMap, ProductDashboardVisual, ProductLoop, WatchTrendVisual } from "@/components/visuals";
import { Footer, Header, Icon } from "@/components/ui";

export default function HomePage() {
  return <>
    <Header />
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy-block">
            <p className="kicker"><span/>AI RECOMMENDATION SIGNAL</p>
            <h1>AIの推薦候補から、<br/><em>静かに外れていないか。</em></h1>
            <p className="hero-lead">会社URLを1つ入れるだけ。見込み客がAIへ聞く質問を再現し、誰が選ばれ、どの根拠が使われ、自社に何が足りないかまで可視化します。</p>
            <ScanForm />
            <Link className="demo-link" href="/demo"><span><Icon name="eye" size={18}/></span>90秒で分かるデモを見る <Icon name="arrow" size={16}/></Link>
          </div>
          <HeroSignalMap />
        </div>
      </section>

      <section className="output-band"><div className="container"><FourOutputs /></div></section>

      <section className="content-section">
        <div className="container split-intro"><div><p className="kicker"><span/>WHAT AIX CREATES</p><h2>順位ではなく、<br/>「選ばれる構造」を見る。</h2></div><p>AI回答は固定順位ではありません。AIXは同じBuyer Promptと測定条件で競合を比較し、候補入り・Citation・Evidence差を一つの画面にまとめます。</p></div>
        <div className="container product-showcase"><ProductDashboardVisual /><div className="showcase-copy"><p className="section-number">01 / MARKET SNAPSHOT</p><h3>経営者が10秒で判断できる結論。</h3><p>何社中何位かだけで終わらせず、どの質問で候補外になり、競合の何が推薦理由になったかを見せます。</p><ul><li><Icon name="check"/>分母付きShortlist Coverage</li><li><Icon name="check"/>AIごとの生回答とCitation</li><li><Icon name="check"/>競合と自社のEvidence差</li></ul><Link href="/demo">実際の画面で確認する <Icon name="arrow" size={16}/></Link></div></div>
      </section>

      <section className="content-section process-section"><div className="container split-intro"><div><p className="kicker"><span/>PRODUCT LOOP</p><h2>URLから、次に直すことまで。</h2></div><p>ユーザーにPromptや競合を設定させません。AIXが市場を作り、必要なときだけ企業にしか分からない事実を聞きます。</p></div><div className="container"><ProductLoop /></div></section>

      <section className="content-section dark-section"><div className="container watch-grid"><div className="watch-copy"><p className="kicker light"><span/>AIX WATCH</p><h2>一回の診断では、<br/>市場の変化を追えない。</h2><p>競合が新しい事例を出す。AIの引用元が変わる。モデルが更新される。AIXは固定Core Promptを週次で再測定し、何が変わったかを残します。</p><div className="watch-points"><span><b>50</b><small>固定Core Prompts</small></span><span><b>3×3</b><small>AI × Repetitions</small></span><span><b>Weekly</b><small>同条件で再測定</small></span></div><Link className="button button-light" href="/demo#watch">Watchのデモを見る <Icon name="arrow" size={17}/></Link></div><WatchTrendVisual /></div></section>

      <section className="content-section evidence-section"><div className="container evidence-layout"><div><p className="kicker"><span/>NEED YOU</p><h2>企業への質問は、<br/>価値が分かる形で。</h2><p>「プロフィールを完成させてください」では入力されません。AIXは何の情報が不足し、どの購買質問に関係するかを先に示します。</p></div><div className="evidence-card-stack"><article><header><span>関連するBuyer Prompt</span><strong>6件</strong></header><h3>50〜100名規模の導入実績</h3><p>公開Webから確認できませんでした。</p><div className="impact-list"><span>社員50名向けのおすすめ</span><span>中小企業向けの実績</span><span>同規模から乗り換えるなら</span></div><button type="button">分かる範囲で回答する <Icon name="arrow" size={16}/></button></article><article className="evidence-card-behind"><span>平均導入期間</span><strong>4 Prompt</strong></article></div></div></section>

      <section className="pricing-section"><div className="container pricing-grid"><div><p className="kicker"><span/>CLEAR COMMERCIAL MODEL</p><h2>問題と証拠までは無料。<br/>追い続ける部分から有料。</h2><p>無料Snapshotを見た後、カードなしで14日Watchを開始。無料期間から自動課金へ移行しません。</p></div><article className="price-card"><span>FOUNDER WATCH</span><strong>¥29,800<small>/月・税別</small></strong><ul><li>固定Core Prompt 50件</li><li>OpenAI・Gemini・Perplexity</li><li>各3回・週次測定</li><li>Evidence Inbox / Action Queue</li><li>全回答・Citation・履歴</li></ul><Link className="button button-primary" href="/pricing">料金と契約条件を見る <Icon name="arrow" size={17}/></Link></article></div></section>

      <section className="final-cta"><div className="container"><p className="kicker light"><span/>START WITH YOUR URL</p><h2>AIが御社を候補に入れているか、<br/>まず事実を確認する。</h2><ScanForm compact /></div></section>
    </main>
    <Footer />
  </>;
}
