import { Suspense } from "react";
import { BillingClient } from "@/components/billing-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function BillingPage() {
  return <main className="ux2-account-page">
    <SiteHeader compact />
    <header className="ux2-account-header"><div className="ux2-narrow"><p className="ux2-label">契約管理</p><h1>AIX Monitorの契約を管理する。</h1><p>支払方法、請求履歴、次回更新、解約はStripe Customer Portalで管理します。</p></div></header>
    <section className="ux2-account-body"><div className="ux2-narrow"><Suspense fallback={<div className="full-loading">契約情報を読み込んでいます。</div>}><BillingClient /></Suspense></div></section>
    <SiteFooter />
  </main>;
}
