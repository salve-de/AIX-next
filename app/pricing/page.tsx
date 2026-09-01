import Link from "next/link";
import { PageShell } from "@/components/ui";

export const metadata = { title: "料金" };

export default function PricingPage() {
  return <PageShell><section className="public-page"><div className="container"><p className="kicker"><span/>PRICING</p><h1>調べるまでは無料。<br/>追い続ける部分から有料。</h1><p className="lead">無料結果を見た後、カードなしで14日Watchを開始できます。無料期間から自動課金へ移行しません。</p><div className="pricing-table"><article><p className="kicker"><span/>FREE SNAPSHOT</p><h2>AI市場診断</h2><strong>¥0</strong><ul><li>会社URL 1件</li><li>Buyer Prompt 12件</li><li>OpenAI / Gemini / Perplexity</li><li>候補入り・競合・Citation</li><li>Evidence Gap 3件</li><li>最優先Action</li></ul><Link className="button button-primary" href="/#scan">無料で診断する</Link></article><article className="featured"><p className="kicker"><span/>FOUNDER WATCH</p><h2>AIX Watch</h2><strong>¥29,800<small>/月・税別</small></strong><ul><li>1ブランド</li><li>固定Core Prompt 50件</li><li>3 AI × 各3回 × 週次</li><li>全生回答・Citation・履歴</li><li>Evidence Inbox</li><li>優先Action Queue</li><li>次回更新日前まで解約可能</li></ul><Link className="button button-primary" href="/demo#watch">Watchを確認する</Link></article></div><div className="public-body"><h2>課金の境界</h2><p>無料で問題と根拠まで見せます。料金が発生するのは、同じ市場を継続して観測し、Evidenceと改善判断を更新する部分です。</p><h2>保証しないこと</h2><p>AIの順位、推薦、Citation、流入、商談、売上は保証しません。AIXは観測条件・生回答・根拠を監査可能にし、改善の判断材料を提供します。</p></div></div></section></PageShell>;
}
