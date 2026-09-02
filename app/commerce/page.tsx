import { DocumentShell } from "@/components/document-shell";
import { seller, sellerReady } from "@/lib/legal";

export default function CommercePage() {
  const rows = [
    ["販売事業者", seller.legalName],
    ["運営責任者", seller.representative || ""],
    ["所在地", seller.address || ""],
    ["電話番号", seller.phone || "請求により遅滞なく開示"],
    ["メール", seller.email || ""],
    ["販売価格", "AIX Monitor 月額29,800円（税別）。Stripe Checkoutに税込総額を表示します。"],
    ["販売価格以外の費用", "インターネット接続料金、外部媒体掲載費、広告費等は利用者負担です。"],
    ["支払方法", "クレジットカード決済（Stripe）"],
    ["支払時期", "申込時に初回決済し、以後は月ごとに自動更新します。"],
    ["提供時期", "決済完了後、対象モニタリングを有料機能へ切り替えます。"],
    ["解約", "次回更新日前までStripe Customer Portalから解約できます。解約後も当該請求期間末まで利用できます。"],
    ["返金", "デジタルサービスの性質上、提供開始後の利用済み期間は原則返金しません。法令上必要な場合を除きます。"],
  ].filter(([, value]) => Boolean(value));

  return <DocumentShell label="Commercial disclosure" title="特定商取引法に基づく表記" lead="有料モニタリングの販売者、価格、更新、解約、返金条件を表示します。">
    {!sellerReady() ? <p className="ux2-notice">AIX Monitorは現在一般販売準備中です。販売開始時に、法令上必要な販売者情報をすべて掲載したうえで決済を公開します。</p> : null}
    <dl>{rows.map(([label, content]) => <div key={label}><dt>{label}</dt><dd>{content}</dd></div>)}</dl>
    <h2>サービスの性質</h2>
    <p>AIXは外部AIの回答を観測・分析し、比較質問ごとの候補入り、競合、比較材料の差、改善候補を示すサービスです。特定の順位、推薦、引用、問い合わせ、契約、売上を保証しません。</p>
  </DocumentShell>;
}
