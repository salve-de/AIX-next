import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WATCH_MONTHLY_PRICE_LABEL, WATCH_MONTHLY_PRICE_TAX_EXCLUSIVE_LABEL, WATCH_MONTHLY_PRICE_TAX_INCLUSIVE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "料金プラン",
  description: "Rovanの無料AI購買監査と、候補落ち・AI誤情報・競合変化を継続監視するWatchプランの料金・提供範囲。",
};

const free = [
  "社名またはURL 1件の初回診断",
  "購入判断に近い質問を優先したAI観測",
  "重要質問での候補入り・候補外と競合の確認",
  "AI回答と公式サイトに明確な食い違いがある場合の事実照合",
  "重要質問でAIが使った外部参照元の確認",
];

const paid = [
  "重要な購入前質問を継続観測",
  "新たな候補落ち・候補入り回復を検出",
  "新しいAI誤情報を検出",
  "新しい競合候補・外部参照元の変化を記録",
  "問題が見つかった時のChange Pack（対象ページ・見出し・本文・FAQ・根拠）",
  "月単位で利用でき、管理画面から解約手続きが可能",
];

export default function PricingPage() {
  return <MarketingShell
    eyebrow="料金プラン"
    title="AIの中で御社がどう選ばれ、どう説明されているかを継続監視。"
    lead="まず無料診断で、重要な購入前質問の候補落ち・競合・AIの事実誤り・参照元を確認。必要な場合だけWatchを開始できます。"
  >
    <div className="pricing-compare" aria-label="料金比較">
      <div className="pricing-plan pricing-free">
        <header>
          <p>無料AI購買監査</p>
          <strong>¥0</strong>
          <span>まずはAI上の扱われ方を確認</span>
        </header>
        <ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-secondary" href="/#scan">まずは無料で診断する <ArrowIcon /></Link>
      </div>
      <div className="pricing-plan pricing-paid">
        <header>
          <p>AI購買Watch</p>
          <strong>¥{WATCH_MONTHLY_PRICE_TAX_INCLUSIVE.toLocaleString()} <small>/月・税込</small></strong>
          <span>{WATCH_MONTHLY_PRICE_TAX_EXCLUSIVE_LABEL}</span>
        </header>
        <ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-primary" href="/#scan">無料診断から始める <ArrowIcon /></Link>
        <small className="pricing-plan-note">無料診断後、料金を確認してから開始します。開始しない限り有料契約にはなりません。</small>
      </div>
    </div>

    <div className="pricing-value-strip" aria-label="サービスで確認できること">
      <article>
        <small>候補</small>
        <strong>どんな購入条件で候補から落ちているか</strong>
        <span>重要な購入前質問で自社が候補に入った割合と、代わりに現れた競合を確認します。</span>
      </article>
      <article>
        <small>正確性</small>
        <strong>AIが自社を間違って説明していないか</strong>
        <span>AI回答と取得できた公式サイト本文に直接の矛盾がある場合だけ、原文と公式ページを並べて確認します。</span>
      </article>
      <article>
        <small>変化</small>
        <strong>新しい異常だけを継続監視</strong>
        <span>候補落ち、新しい誤情報、新しい競合・参照元の変化を前回と比較します。</span>
      </article>
    </div>

    <section className="pricing-explanation">
      <h2>無料診断とWatchの違い</h2>
      <p>
        無料診断では、指定した質問・AI・日時の条件で、現在の候補入り・競合・参照元と、確認可能な事実不一致を調べます。<br />
        Watchでは同じ測定パネルを継続して観測し、前回から新しく発生した重要変化を確認できます。料金は{WATCH_MONTHLY_PRICE_LABEL}です。
      </p>
      <div className="pricing-steps">
        <div><strong>1</strong><span>URL・社名を入力</span><p>公開情報から会社・市場・購入前質問を整理</p></div>
        <div><strong>2</strong><span>AI上の候補・説明を監査</span><p>競合、事実不一致、参照元を確認</p></div>
        <div><strong>3</strong><span>Watchで変化を監視</span><p>問題発生時はChange Packで修正案まで整理</p></div>
      </div>
    </section>

    <section className="pricing-note">
      <h2>ご契約と測定の範囲</h2>
      <p>無料診断を利用しただけで有料課金は発生しません。Watchを開始するときに料金と更新条件を確認し、Stripe Customer Portalから解約手続きを行えます。</p>
      <p>Rovanは指定した質問・AI・日時における観測と公開情報の照合を行います。全利用者のAI会話、AI内部順位、実際の顧客流出を取得するものではなく、推薦、引用、問い合わせ、契約、売上を保証しません。対象会社のサイトを無断で変更することもありません。</p>
    </section>
  </MarketingShell>;
}
