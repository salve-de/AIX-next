import { PageShell } from "@/components/ui";

export const metadata = { title: "プライバシー" };

export default function PrivacyPage() {
  return <PageShell><section className="public-page"><div className="container"><p className="kicker"><span/>PRIVACY</p><h1>企業情報とEvidenceを、<br/>標準で非公開にする。</h1><p className="lead">AIXは公開Webの診断結果、Watch、企業が入力したEvidenceを目的別に分離します。公開Profileは初期版では自動作成しません。</p><div className="public-body"><h2>取得する情報</h2><p>入力された会社URL、公開Webから取得したページ、AIの回答とCitation、会社メール、企業が任意に入力するEvidence、決済状態、アクセス・障害ログを扱います。</p><h2>利用目的</h2><p>AI比較市場の診断、競合・Buyer Prompt・Evidence Gapの分析、Watchの再測定、通知、契約管理、不正利用防止、品質改善に使用します。</p><h2>公開範囲</h2><p>無料結果とWatchは推測困難なURLで提供し、検索Index対象外にします。企業入力Evidenceは非公開が既定です。</p><h2>外部サービス</h2><p>AI測定、データ保存、決済、メール送信のため、設定されたOpenAI、Google、Perplexity、Supabase、Stripe、Resend等を利用します。</p><h2>削除・訂正</h2><p>正式公開時に、運営法人の問い合わせ窓口と本人確認手続きを明示します。法令上またはセキュリティ上必要な記録を除き、確認後に削除・訂正します。</p></div></div></section></PageShell>;
}
