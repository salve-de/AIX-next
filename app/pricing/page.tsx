import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const free = [
  "商品名・会社名1件のAI推薦調査",
  "見込み客の相談質問12問での比較判定",
  "なぜ大手ライバルが選ばれたかの理由特定",
  "大手ライバルの対応できない隙間を分析",
  "AI営業マンに持たせる「自社の看板」の選定",
  "自社サイト改修ゼロでのAI公式台帳発行",
];
const paid = [
  "毎週ライバルの動向とAI推薦を自動追跡",
  "ライバルの急浮上・推薦枠の変動アラート",
  "季節の需要や新検索に合わせた月次アドバイス",
  "最新のAI推薦カルテ・変動レポート送付",
  "公式台帳データの週次定期自動メンテナンス",
  "いつでも管理画面からワンクリック解約可能",
];

export default function PricingPage() {
  return <MarketingShell
    eyebrow="料金プラン"
    title="営業マンを雇う前に。AI新時代に取り残されないための投資。"
    lead="月30万円以上の営業人件費や、成果の出ない高額SEOに頼る時代は終わりました。自社サイト改修ゼロで、AIから推薦されやすい専属窓口を即座に配備できます。"
  >
    <div className="pricing-compare" aria-label="料金比較">
      <div className="pricing-plan pricing-free">
        <header>
          <p>無料診断</p>
          <strong>¥0</strong>
          <span>まずは現状の推薦状況を確認</span>
        </header>
        <ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-secondary" href="/#scan">まずは無料で診断する <ArrowIcon /></Link>
      </div>
      <div className="pricing-plan pricing-paid">
        <header>
          <p>AI推薦・自動見守りプラン</p>
          <strong>¥10,780 <small>/月・税込</small></strong>
          <span>（税別 ¥9,800）専属営業マン代わりとして</span>
        </header>
        <ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-primary" href="/#scan">無料診断から始める <ArrowIcon /></Link>
        <small className="pricing-plan-note">無料診断の結果画面から、いつでもワンクリックで開始できます。無理な自動課金はありません。</small>
      </div>
    </div>
    <div className="pricing-value-strip" aria-label="使うと得られるもの">
      <article>
        <small>いま</small>
        <strong>AI新時代の機会損失と自社の強みが分かる</strong>
        <span>ライバルが対応しきれない隙間を見つけ、AIが御社を推薦しやすくなる看板を確定します。</span>
      </article>
      <article>
        <small>次に</small>
        <strong>改修ゼロでAI専属営業窓口を開設</strong>
        <span>自社サイトの改修やブログ更新はゼロ。社名からAI専用公式台帳を自動配備し、AIに優先推薦されやすい環境を整えます。</span>
      </article>
      <article>
        <small>その後</small>
        <strong>毎週の自動見守りで推薦状況を追跡</strong>
        <span>AI回答の更新やライバルの動きを毎週自動で追跡し、自社がおすすめ候補に入り続けているかを監視します。</span>
      </article>
    </div>
    <section className="pricing-explanation">
      <h2>なぜ営業マンを雇うより効果的なのか</h2>
      <p>
        顧客の購買行動は「Google検索で比べる」ことから「ChatGPT等のAIに直接相談する」ことへと急速に移行しています。<br />
        営業マンが足で稼ぐよりも、顧客がAIに「おすすめの会社は？」と聞いた瞬間に御社が推薦候補に入る方が、確度の高い相談につながりやすくなります。<br />
        月30万円以上の人件費をかけることなく、月額わずか9,800円（税別）で24時間働くAI営業窓口が手に入ります。
      </p>
      <div className="pricing-steps">
        <div><strong>1</strong><span>無料診断</span><p>AI推薦の現状を知る</p></div>
        <div><strong>2</strong><span>台帳開設</span><p>AI営業窓口を即日配備</p></div>
        <div><strong>3</strong><span>自動見守り</span><p>毎週の推薦状況を追跡</p></div>
      </div>
    </section>
    <section className="pricing-note">
      <h2>ご契約について</h2>
      <p>無料診断から勝手に有料課金されることは一切ありません。有料プランの開始前に料金と更新条件を明示し、解約や領収書の発行は世界標準の決済システム（Stripe）の管理画面からいつでもご自身でワンクリックで完了できます。</p>
      <p>本サービスはAI上での絶対的な順位や推薦、売上を保証するものではありません。公開情報と客観的な観測データに基づき、誠実な比較結果と改善のアドバイスをお届けします。</p>
    </section>
  </MarketingShell>;
}
