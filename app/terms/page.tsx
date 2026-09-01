import { PageShell } from "@/components/ui";

export const metadata = { title: "利用規約" };

export default function TermsPage() {
  return <PageShell><section className="public-page"><div className="container"><p className="kicker"><span/>TERMS</p><h1>AIX利用規約。</h1><p className="lead">AIXはAI回答の観測・分析・継続監視を提供します。特定の推薦、順位、流入、売上を保証するサービスではありません。</p><div className="public-body"><h2>利用できるURL</h2><p>利用者は公開Webとして正当にアクセスできるURLだけを入力できます。認証突破、内部システム、第三者の権利を侵害する利用は禁止します。</p><h2>測定の性質</h2><p>AI回答は、モデル、時期、地域、質問表現、Web更新等で変化します。AIXの数値は明示された観測パネルの結果であり、全ユーザーに共通する絶対順位ではありません。</p><h2>企業情報</h2><p>企業が入力した情報は、根拠が確認されるまで企業申告として扱います。虚偽、誤認、第三者の権利侵害にあたる情報を入力してはいけません。</p><h2>有料契約</h2><p>AIX Watchは月額自動更新です。無料Watchから自動課金へ移行しません。Stripe Checkoutで契約を確定し、次回更新日前まで所定の方法で解約できます。</p><h2>禁止事項</h2><p>偽レビュー、検索結果操作を目的とした大量低品質コンテンツ、AI crawlerと人間に異なる虚偽表示、権限のない会社情報変更、サービス妨害を禁止します。</p><h2>責任範囲</h2><p>AIXが表示する分析は意思決定支援です。公開・広告・法務・規制上の最終確認は利用者の責任で行います。</p></div></div></section></PageShell>;
}
