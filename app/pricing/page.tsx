import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { WATCH_MONTHLY_PRICE_LABEL, WATCH_MONTHLY_PRICE_TAX_EXCLUSIVE_LABEL, WATCH_MONTHLY_PRICE_TAX_INCLUSIVE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "料金プラン",
  description: "無料診断と、同じ条件でAI回答を確認する週次見守りの料金・提供範囲。",
};

const free = [
  "社名またはURL 1件の初回診断",
  "公開情報をもとにした購入検討向け質問パネルでの比較",
  "AI回答に自社が含まれた質問・含まれなかった質問の確認",
  "回答で参照されたURLと公開情報の対応確認",
  "自社サイトを改修せずに公開情報の整理案を確認",
];

const paid = [
  "承認済みの公開情報参照ページを維持（自社サイト改修不要）",
  "同じ測定条件でAI回答を毎週記録・比較",
  "AI回答に含まれる候補と参照URLの変化を通知",
  "公開前の変更案と参照元の確認",
  "URL入力後は、追加の質問票なしで継続測定",
  "月単位で利用でき、管理画面から解約手続きが可能",
];

export default function PricingPage() {
  return <MarketingShell
    eyebrow="料金プラン"
    title="AI回答と公開情報を、同じ条件で確認する。"
    lead="URLや社名を入力すると、指定した質問とAI回答、回答で参照されたURLを確認できます。公開情報の整理案は内容を確認してから公開します。AIの推薦・順位・売上の改善は保証しません。"
  >
    <div className="pricing-compare" aria-label="料金比較">
      <div className="pricing-plan pricing-free">
        <header>
          <p>無料診断</p>
          <strong>¥0</strong>
          <span>まずはAI回答の現状を確認</span>
        </header>
        <ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul>
        <Link className="button button-secondary" href="/#scan">まずは無料で診断する <ArrowIcon /></Link>
      </div>
      <div className="pricing-plan pricing-paid">
        <header>
          <p>AI回答・週次見守りプラン</p>
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
        <small>現在</small>
        <strong>AI回答の現状を確認</strong>
        <span>指定した質問とAI回答を記録し、自社が候補に含まれたか、どのURLが参照されたかを確認します。</span>
      </article>
      <article>
        <small>整理</small>
        <strong>公開情報を参照元付きで整理</strong>
        <span>公開サイトで確認できる事実と参照元URLを整理し、公開前の下書きとして確認できます。</span>
      </article>
      <article>
        <small>継続</small>
        <strong>同じ条件で週次測定</strong>
        <span>同じ質問・AI・条件で前回との差分を確認します。結果は将来の推薦や売上を保証しません。</span>
      </article>
    </div>

    <section className="pricing-explanation">
      <h2>無料診断と週次測定の違い</h2>
      <p>
        無料診断では、指定した質問・AI・日時の条件で、AI回答と参照URLを確認します。<br />
        有料プランでは、同じ測定条件を毎週記録し、前回との差分を確認できます。料金は{WATCH_MONTHLY_PRICE_LABEL}です。<br />
        Rovanは営業活動の代行サービスではなく、AIの推薦や回答を保証するサービスでもありません。
      </p>
      <div className="pricing-steps">
        <div><strong>1</strong><span>URL・社名を入力</span><p>公開情報をもとに初回診断</p></div>
        <div><strong>2</strong><span>公開情報の下書き</span><p>内容を確認してから公開</p></div>
        <div><strong>3</strong><span>週次測定を開始</span><p>同じ条件で前回との差分を確認</p></div>
      </div>
    </section>
    <section className="pricing-note">
      <h2>ご契約について</h2>
      <p>無料診断を利用しただけで有料課金は発生しません。継続測定を開始するときに料金と更新条件を確認し、Stripe Customer Portalから解約手続きを行えます。</p>
      <p>本サービスは、指定した条件でのAI回答と公開情報を確認・整理するものです。AIの推薦、引用、検索順位、問い合わせ、契約、売上は保証しません。対象会社のサイトを自動変更することもありません。</p>
    </section>
  </MarketingShell>;
}
