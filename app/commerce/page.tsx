import { MarketingShell } from "@/components/marketing-shell";
import { seller, sellerReady } from "@/lib/legal";

const rows = [
  ["販売事業者", seller.legalName || "販売開始前に設定"],
  ["運営責任者", seller.representative || "販売開始前に設定"],
  ["所在地", seller.address || "販売開始前に設定"],
  ["電話番号", seller.phone || "請求により遅滞なく開示"],
  ["メール", seller.email || "販売開始前に設定"],
  ["販売価格", "Founder Watch 月額29,800円（税別）。Stripe Checkoutに税込総額を表示します。"],
  ["販売価格以外の費用", "インターネット接続料金、顧客自身が実施するサイト改修、外部媒体掲載費、広告費等は利用者負担です。"],
  ["支払方法", "クレジットカード決済（Stripe）"],
  ["支払時期", "申込時に初回決済し、以後は月ごとに自動更新します。"],
  ["提供時期", "決済完了後、対象Watchを有料機能へ切り替えます。初回Core測定・Change PackはProviderと対象サイトの状態に応じて順次生成されます。"],
  ["解約", "次回更新日前までStripe Customer Portalから解約できます。解約後も当該請求期間末まで利用できます。"],
  ["返金", "デジタルサービスの性質上、提供開始後の利用済み期間は原則返金しません。法令上必要な場合を除きます。"],
  ["動作環境", "最新の主要デスクトップ・モバイルブラウザ。AI Providerや対象サイトの状態により一部観測・Change Pack生成が失敗する場合があります。"],
];

export default function CommercePage() {
  return <MarketingShell eyebrow="COMMERCIAL DISCLOSURE" title="特定商取引法に基づく表記。" lead="有料Watchの販売者、価格、提供内容、更新、解約、返金条件を表示します。">
    {!sellerReady() ? <p className="document-note">販売開始前設定が未完了です。SELLER_REPRESENTATIVE、SELLER_ADDRESS、SELLER_EMAILを本番環境へ設定するまで決済を一般公開しないでください。</p> : null}
    <dl className="definition-list">{rows.map(([label, content]) => <div key={label}><dt>{label}</dt><dd>{content}</dd></div>)}</dl>
    <h2>サービスの性質</h2><p>Rovanは、外部AIの回答を観測し、競合との差を分析し、改善候補と人間確認用Change Packを生成して再測定するサービスです。特定の順位、推薦、Citation、Buyer Promptの候補入り、問い合わせ、契約、売上を保証しません。Change Packは自動公開されません。</p>
  </MarketingShell>;
}
