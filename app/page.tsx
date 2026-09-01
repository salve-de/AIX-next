import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroShortlistVisual, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { ArrowIcon, BotIcon, EvidenceIcon, EyeIcon, NetworkIcon, QuoteIcon, SearchIcon, SparkIcon, TrendIcon, TrophyIcon } from "@/components/icons";

const modules = [
  { icon: <EyeIcon />, label: "01 · VISIBILITY", title: "AI可視性", body: "AI別・Buyer Intent別に、ブランドがどこで見えているかを分解。" },
  { icon: <SearchIcon />, label: "02 · PROMPTS", title: "Buyer Prompt追跡", body: "市場・対象顧客・用途から質問を自動生成し、追う理由も表示。" },
  { icon: <TrophyIcon />, label: "03 · RECOMMENDATIONS", title: "推薦・候補順位", body: "Mentionではなく、購入候補・第一候補・候補外まで保存。" },
  { icon: <QuoteIcon />, label: "04 · CITATIONS", title: "Citation分析", body: "自社・競合・第三者の引用DomainとPageをPrompt単位で追跡。" },
  { icon: <NetworkIcon />, label: "05 · COMPETITORS", title: "競合比較", body: "同じ成功Observationの分母で、誰が先に選ばれるかを比較。" },
  { icon: <BotIcon />, label: "06 · NARRATIVES", title: "AIの語り方", body: "自社が推薦・候補外・引用される文脈を実回答へ紐づける。" },
  { icon: <EvidenceIcon />, label: "07 · EVIDENCE", title: "比較材料の不足", body: "企業にしか分からない事実だけを、関連Prompt数と一緒に確認。" },
  { icon: <TrendIcon />, label: "08 · ACTION LOOP", title: "変更案→再観測", body: "Change Packを作り、同じBuyer Promptで観測差を検証。" },
];

export default function HomePage() {
  return <main>
    <SiteHeader />
    <section className="hero-section">
      <div className="shell hero-grid">
        <div className="hero-copy-block">
          <div className="hero-highlight"><i />AI BUYER INTELLIGENCE OS</div>
          <h1>AIが誰を薦め、<br /><span>なぜ自社を外すか。</span><br />全部ひとつで見る。</h1>
          <p className="hero-copy">会社URLだけで、AI Visibility、見込み客のBuyer Prompt、推薦される競合、Citation、不足する比較材料、次の変更案まで調べます。改善後は同じ質問で再観測します。</p>
          <ScanForm />
          <div className="hero-trust"><span>登録不要</span><span>カード不要</span><span>公開Webのみ</span></div>
          <div className="all-one-line"><span>Visibility</span><span>Prompts</span><span>Recommendations</span><span>Citations</span><span>Competitors</span><span>Evidence</span><span>Actions</span></div>
          <Link className="text-link" href="/result?sample=1">架空企業の診断結果を見る <ArrowIcon /></Link>
        </div>
        <HeroShortlistVisual />
      </div>
    </section>

    <section className="proof-strip-v3"><article><EyeIcon /><div><strong>AI別にVisibilityを分解</strong><small>一つの曖昧なScoreにしない</small></div></article><article><TrophyIcon /><div><strong>Recommendationを主役に</strong><small>名前が出ただけと区別</small></div></article><article><QuoteIcon /><div><strong>Citationを原文まで監査</strong><small>Domain / Page / Prompt</small></div></article><article><TrendIcon /><div><strong>修正後も同じ質問で確認</strong><small>観測差として保存</small></div></article></section>

    <section className="platform-section">
      <div className="shell">
        <div className="platform-head"><div><p className="eyebrow">ONE PROJECT, COMPLETE AI BUYER INTELLIGENCE</p><h2>別々のツールを、<br />行ったり来たりしない。</h2></div><p>競合カテゴリで標準になっているVisibility、Prompt追跡、Recommendation、Citation、Competitor分析を全部搭載。その上でAIXは、比較材料の不足→変更案→同じPromptで再観測までを同じProjectに閉じます。</p></div>
        <div className="platform-grid">{modules.map((item) => <article key={item.label}>{item.icon}<span>{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        <div className="platform-loop"><b>BUYER QUESTION</b><i>→</i><span>Visibility</span><i>→</i><span>Recommendation</span><i>→</i><span>Citation</span><i>→</i><span>Evidence</span><i>→</i><span>Change Pack</span><i>→</i><b>RE-MEASURE</b></div>
      </div>
    </section>

    <section className="workspace-preview-band"><div className="shell"><p><strong>AIX Workspace</strong>では、上の8領域を一つのProject画面で横断できます。</p><Link href="/workspace?sample=1">統合Workspaceを見る <ArrowIcon /></Link></div></section>

    <section className="section section-light">
      <div className="shell split-section">
        <div className="section-copy"><p className="eyebrow">THE OUTPUT</p><h2>「AI SEO 43点」ではなく、<br />購買質問ごとの勝敗を出す。</h2><p>経営者が知りたいのは抽象的な総合点ではありません。どの質問で購入候補に入り、誰に負け、どの引用元・比較材料が判断に使われたかです。</p><ul className="check-list"><li>Recommendation / Mention / Citationを分離</li><li>OpenAI・Gemini・Perplexityの生回答</li><li>競合CoverageとFirst Choice</li><li>Promptを追う理由とBuyer Intent</li><li>不足する比較材料と最優先Action</li></ul><Link className="button button-dark" href="/result?sample=1">無料結果の完成形を見る <ArrowIcon /></Link></div>
        <ProductOutputPreview />
      </div>
    </section>

    <section className="difference-section">
      <div className="shell difference-grid"><div className="difference-copy"><p className="eyebrow">WHY AIX</p><h2>監視だけでも、<br />コンテンツ生成だけでもない。</h2><p>AI Visibility市場はすでに成熟し始めています。だから「Promptを追えます」だけでは価値になりません。AIXは標準機能を持った上で、意思決定と実行の距離を短くします。</p><p className="research-note">※AIXは独自の実ユーザーPrompt Volumeデータを保有しているとは主張しません。Promptは市場・顧客・用途・比較条件から構成し、追跡理由を明示します。</p></div><div className="difference-table"><header><span>比較軸</span><span>一般的な監視</span><span>AIX</span></header><article><strong>開始設定</strong><span>Prompt/競合を設定</span><span className="aix-win">URLから自動構成</span></article><article><strong>主要単位</strong><span>Visibility Score</span><span className="aix-win">Buyer Promptの勝敗</span></article><article><strong>監査性</strong><span>集計中心</span><span className="aix-win">Raw回答・Citation・分母</span></article><article><strong>次の行動</strong><span>Recommendation</span><span className="aix-win">Evidence → Change Pack</span></article><article><strong>改善確認</strong><span>全体推移</span><span className="aix-win">対象Promptを再観測</span></article></div></div>
    </section>

    <section className="section section-deep"><div className="shell"><div className="section-heading centered"><p className="eyebrow">CLOSED LOOP</p><h2>URLから、直して、もう一度測るまで。</h2><p>ユーザーに最初から大量設定を要求しません。AIXが市場を作り、企業にしか分からない事実だけを後から聞きます。</p></div><ProductProcessVisual /></div></section>

    <section className="section section-light"><div className="shell split-section watch-split"><WatchTrendVisual /><div className="section-copy"><p className="eyebrow">STABLE CORE + ROTATING DISCOVERY</p><h2>追跡と探索を、<br />意図的に分ける。</h2><p>有料Watchは固定Core 50件を3 AI × 3回で毎週再観測。新しい機会を探すDiscovery 20件も別Panelで実行し、トレンドには混ぜません。</p><div className="watch-value-list"><article><TrendIcon /><div><strong>Stable Core</strong><small>同じ質問だけで推移比較</small></div></article><article><SparkIcon /><div><strong>Rotating Discovery</strong><small>新しい購買場面を探索</small></div></article><article><EvidenceIcon /><div><strong>Change → Re-measure</strong><small>対象Promptだけ再検証</small></div></article></div><Link className="button button-dark" href="/watch?sample=1">Weekly Briefを見る <ArrowIcon /></Link></div></div></section>

    <section className="section pricing-preview-section"><div className="shell pricing-preview-grid"><div><p className="eyebrow">COMMERCIAL MODEL</p><h2>問題と根拠までは無料。<br />市場を追い続ける部分から有料。</h2><p>無料結果を見てから14日Watchへ。カードは不要で、自動課金もしません。価値を確認してからFounder Watchへ移れます。</p><Link className="text-link light-link" href="/pricing">料金と測定範囲を確認 <ArrowIcon /></Link></div><article className="price-card"><span>FOUNDER WATCH</span><strong>¥29,800<small> / 月・税別</small></strong><ul><li>50固定Core + 20 Discovery</li><li>OpenAI・Gemini・Perplexity</li><li>各3回・週次観測</li><li>Visibility / Prompt / Citation / Competitor</li><li>Evidence / Change Pack / 再観測</li><li>12か月Core履歴</li></ul><a className="button button-accent" href="#scan">候補外になる質問を無料で調べる <ArrowIcon /></a></article></div></section>

    <section className="section final-scan-section"><div className="shell final-scan"><p className="eyebrow">FREE AI BUYER MARKET SCAN</p><h2>AIが誰を薦め、<br />自社をどこで外すか調べる。</h2><p>結果を見るまで登録もカードも不要です。</p><ScanForm compact /></div></section>
    <SiteFooter />
  </main>;
}
