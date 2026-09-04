import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const free = ["商品名・会社名1件の調査", "買い手の質問12件での比較判定", "主要なAI（ChatGPTやGemini等）で確認", "競合各社の対応できない隙間を分析", "自社が選ばれる看板（独自の強み）", "AI専用公式台帳の自動発行（改修不要）"];
const paid = ["毎週ライバルの動向を自動モニタリング", "ライバルの急浮上・新商品アラート", "季節の需要に合わせた毎月の改善アドバイス", "AI推薦結果の変動レポート", "公式台帳データの週次定期メンテナンス", "いつでも管理画面からワンクリック解約可能"];

export default function PricingPage() {
  return <MarketingShell eyebrow="料金プラン" title="まずは無料診断で、自社が選ばれる理由を見つける。" lead="商品名や会社名を入れるだけで、AIがライバルをおすすめする理由と、自社の勝てる看板をその場で確認できます。">
    <div className="pricing-compare" aria-label="料金比較">
      <div className="pricing-plan pricing-free">
        <header>
          <p>無料診断</p>
          <strong>¥0</strong>
          <span>いつでも手軽に試せます</span>
        </header>
        <ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-secondary" href="/#scan">まずは無料で診断する <ArrowIcon /></Link>
      </div>
      <div className="pricing-plan pricing-paid">
        <header>
          <p>AI推薦・自動見守りプラン</p>
          <strong>¥10,780 <small>/月・税込</small></strong>
          <span>（税別 ¥9,800）継続的な集客改善に</span>
        </header>
        <ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-primary" href="/#scan">無料診断から始める <ArrowIcon /></Link>
        <small className="pricing-plan-note">無料診断の結果画面から、いつでもワンクリックで開始できます。無理な自動課金はありません。</small>
      </div>
    </div>
    <div className="pricing-value-strip" aria-label="使うと得られるもの">
      <article><small>いま</small><strong>競合の隙間と自社の強みが分かる</strong><span>ライバルが対応しきれない部分を見つけ、自社だけの選ばれる看板を決めます。</span></article>
      <article><small>次に</small><strong>AI専用の公式台帳を自動配備</strong><span>自社サイトの改修ゼロ。社名からAI専用ページを自動作成し、AIに推薦されやすい状態を作ります。</span></article>
      <article><small>その後</small><strong>毎週AIの推薦状況を自動で見守る</strong><span>AI回答の更新やライバルの動きを毎週自動で確認し、自社が推薦され続けているかを追跡します。</span></article>
    </div>
    <section className="pricing-explanation">
      <h2>なぜ定期的に見守る必要があるのか</h2>
      <p>AIの回答やライバルの動向は常に変化しています。競合が新商品を出したり、季節によって買い手の質問が変わると、以前はおすすめされていた自社が外れてしまうことがあります。毎週の自動モニタリングにより、順位変動時のアラートや、その時期に応じた改善アドバイスを自動でお届けします。</p>
      <div className="pricing-steps">
        <div><strong>1</strong><span>無料診断</span><p>AI推薦の現状を知る</p></div>
        <div><strong>2</strong><span>台帳開設</span><p>AI専用DBを自動配備</p></div>
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
