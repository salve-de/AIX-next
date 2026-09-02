import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PricingPage() {
  return <main className="ux2-pricing-page">
    <SiteHeader compact />
    <section className="ux2-pricing-hero"><div className="shell"><p className="ux2-label">料金</p><h1>まず無料で問題を特定。<br />継続改善が必要なら月額。</h1><p>無料診断で「どこで候補から外れているか」を確認し、14日間の無料モニタリングで改善後の変化を体験してから有料を判断できます。</p></div></section>

    <section className="ux2-pricing-body"><div className="shell">
      <div className="ux2-plan-grid">
        <article className="ux2-plan">
          <small>無料診断</small>
          <h2>¥0</h2>
          <p>まず、自社がAI比較のどこで候補から外れているかを確認します。</p>
          <div className="ux2-plan-value"><strong>どこで負けているか分かる</strong><span>比較質問・競合・情報差・最優先の改善を1レポートで確認</span></div>
          <ul><li>自社が候補外になる重要な比較質問</li><li>代わりに選ばれる競合</li><li>競合にはあり、自社で確認できない比較材料</li><li>まず直すべき1件</li><li>AI回答と引用元の詳細</li></ul>
          <Link className="button button-dark" href="/#scan">無料で診断 <ArrowIcon /></Link>
          <details className="ux2-spec-details"><summary>測定仕様を見る</summary><div>会社URL 1件 / 比較質問 12件 / ChatGPT・Gemini・Perplexity / 各1回。Provider失敗は負けとして数えず、測定欠損として表示します。</div></details>
        </article>

        <article className="ux2-plan featured">
          <small>AIX Monitor</small>
          <h2>¥29,800<small> / 月・税別</small></h2>
          <p>毎週「何が変わった → 次に何を直す」を更新し、改善判断を継続できる状態を作ります。</p>
          <div className="ux2-plan-value"><strong>毎週、次に直すことが分かる</strong><span>差分確認、優先Action、編集できる変更原稿まで更新</span></div>
          <ul><li>候補入り / 候補外になった質問の差分</li><li>まだ負けている重要な比較質問</li><li>次に検証する改善Action</li><li>見出し・本文・FAQまで作る変更原稿</li><li>企業にしか分からない情報の確認タスク</li><li>AI回答・引用元・12か月の測定履歴</li></ul>
          <Link className="button button-accent" href="/#scan">まず無料診断 <ArrowIcon /></Link>
          <details className="ux2-spec-details"><summary>測定仕様を見る</summary><div>1ブランド / 固定比較質問 50件 + 探索質問 20件 / 3 AI × 各3回 / 週次測定。変更原稿は人間確認前提で、自動公開しません。</div></details>
        </article>
      </div>

      <section className="ux2-pricing-note"><h2>14日間は無料で改善後の変化を確認</h2><p>無料診断後、会社メールだけで開始できます。カード登録は不要で、有料契約へ自動移行しません。同じ質問を再測定して、AIXを継続利用する価値があるか先に確認できます。</p></section>
      <section className="ux2-pricing-note"><h2>特に価値が出やすい会社</h2><p>B2B SaaS、ITサービス、コンサルティングなど、買い手が複数社を比較してから問い合わせる会社です。AIXは実顧客数や失注数を推定するサービスではなく、問い合わせ前のAI比較で自社が検討候補に入れているかを観測します。</p></section>
      <section className="ux2-pricing-note"><h2>保証しないこと</h2><p>AI上の絶対順位、推薦、引用、問い合わせ、契約、売上の増加は保証しません。AIXは明示した比較質問とAI観測面を同条件で継続測定し、変化と改善候補を確認するサービスです。</p></section>
    </div></section>
    <SiteFooter />
  </main>;
}
