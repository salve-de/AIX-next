import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";

const free = ["商品名・会社名1件", "買い手の質問12件で勝敗判定", "ChatGPT・Gemini・Perplexityで確認", "競合3社の弱点分析", "自社が勝てる独自の看板（ポジショニング）", "SNS・ブログ用発信文の下書き"];
const paid = ["毎週ライバルの動きを自動パトロール", "競合の裏口侵入・新商品アラート", "季節トレンドに応じた月次作戦指示", "AI推薦順位の奪還・変動レポート", "全方位発信文の定期更新", "いつでも管理画面からワンクリック解約"];

export default function PricingPage() {
  return <MarketingShell eyebrow="料金" title="まず無料で、競合の弱点と自社の看板を見る。" lead="商品名や会社名を入れて、AIがライバルを優先する理由と勝てる看板を確認。その後はライバルの動きを毎週自動パトロールして見張り続けられます。">
    <div className="pricing-compare" aria-label="料金比較"><div className="pricing-plan pricing-free"><header><p>無料診断</p><strong>¥0</strong><span>いつでも手軽に</span></header><ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-secondary" href="/#scan">無料で診断する <ArrowIcon /></Link></div><div className="pricing-plan pricing-paid"><header><p>ライバル自動見張り番</p><strong>¥9,800 <small>/月・税別</small></strong><span>ライバルに負けたくない方に</span></header><ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-primary" href="/#scan">無料診断から始める <ArrowIcon /></Link><small className="pricing-plan-note">無料診断後、いつでも開始・停止できます。無理な自動課金はありません。</small></div></div>
    <div className="pricing-value-strip" aria-label="使うと得られるもの"><article><small>いま</small><strong>競合の弱点と自社の看板が分かる</strong><span>ライバルが対応できない隙間を見つけ、勝てる売り方を決めます。</span></article><article><small>次に</small><strong>発信文をそのまま使う</strong><span>SNSプロフィールやブログ記事に、用意された文章をコピペします。</span></article><article><small>その後</small><strong>ライバルの動きを毎週見張る</strong><span>競合の追い上げやAI推薦の順位変動を、毎週自動パトロールしてお知らせします。</span></article></div>
    <section className="pricing-explanation"><h2>なぜ継続して見張る必要があるのか</h2><p>AIの推薦や競合の動きは生き物です。ライバルが新商品を出したり、季節によって買い手の質問が変わると、一度取った推薦枠が奪われることがあります。毎週の自動パトロールで、陣地が脅かされた際のアラートと次の作戦を自動でお届けします。</p><div className="pricing-steps"><div><strong>1</strong><span>無料診断</span><p>競合の弱点と看板を知る</p></div><div><strong>2</strong><span>発信</span><p>下書きをコピペして発信</p></div><div><strong>3</strong><span>自動見張り</span><p>毎週ライバルをパトロール</p></div></div></section>
    <section className="pricing-note"><h2>契約について</h2><p>無料診断から勝手に自動課金されることは一切ありません。有料開始前に料金と条件を明示し、解約や領収書の発行はStripeの契約管理ポータルからいつでもご自身で1秒で完結できます。</p><p>AIXはAI上の順位、推薦、問い合わせ、売上を保証するものではありません。公開情報と観測データに基づき、客観的な比較結果と改善の提案をお届けします。</p></section>
  </MarketingShell>;
}
