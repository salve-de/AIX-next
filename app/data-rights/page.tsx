import { Suspense } from "react";
import { DataRightsClient } from "@/components/data-rights-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function DataRightsPage() {
  return <main className="ux2-account-page">
    <SiteHeader compact />
    <header className="ux2-account-header"><div className="ux2-narrow"><p className="ux2-label">データ管理</p><h1>保存したAIXデータを管理する。</h1><p>継続モニタリングの測定履歴・企業入力を書き出すか、完全に削除できます。</p></div></header>
    <section className="ux2-account-body"><div className="ux2-narrow"><Suspense fallback={<div className="full-loading">データ管理を読み込んでいます。</div>}><DataRightsClient /></Suspense></div></section>
    <SiteFooter />
  </main>;
}
