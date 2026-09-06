import { Suspense } from "react";
import { DataRightsClient } from "@/components/data-rights-client";
import { MarketingShell } from "@/components/marketing-shell";

export default function DataRightsPage() {
  return <MarketingShell eyebrow="DATA RIGHTS" title="自分のRovanデータを管理する。" lead="Watch tokenと登録メールを確認し、保存データを書き出すか、完全に削除できます。"><Suspense fallback={<div className="full-loading">データ管理を読み込んでいます。</div>}><DataRightsClient /></Suspense></MarketingShell>;
}
