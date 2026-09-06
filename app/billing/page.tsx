import { Suspense } from "react";
import { BillingClient } from "@/components/billing-client";
import { MarketingShell } from "@/components/marketing-shell";

export default function BillingPage() {
  return <MarketingShell eyebrow="BILLING" title="Rovan Watchの契約を管理する。" lead="有料契約の支払方法、請求履歴、更新、解約はStripe Customer Portalで管理します。"><Suspense fallback={<div className="full-loading">契約情報を読み込んでいます。</div>}><BillingClient /></Suspense></MarketingShell>;
}
