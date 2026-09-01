import { MarketingShell } from "@/components/marketing-shell";

export default function PrivacyPage() {
  return <MarketingShell eyebrow="PRIVACY" title="公開Webを調べ、企業入力は非公開にする。" lead="AIX Nextは、診断に必要な範囲で公開サイト、AI回答、会社メール、企業が入力したEvidenceを取り扱います。">
    <h2>取得する情報</h2><ul><li>診断対象として入力された公開URL</li><li>対象サイトの公開HTML、robots.txt、sitemap、公開ページ上の事実</li><li>AI Providerへ送ったBuyer Promptと返された回答・Citation</li><li>Watch登録メール</li><li>企業が任意で入力したEvidenceと根拠URL</li><li>利用状況、エラー、原価、セキュリティログ</li></ul>
    <h2>利用目的</h2><ul><li>会社、市場、競合、Buyer Promptの特定</li><li>AI上の候補入り、Citation、Evidence差の観測</li><li>週次Watch、通知、課金、サポート</li><li>不正利用防止、障害調査、品質評価</li><li>匿名・集計化したプロダクト改善</li></ul>
    <h2>公開範囲</h2><p>無料Scan、Watch、企業入力Evidenceは非公開が既定です。結果URLは検索Indexから除外します。公開企業Profile機能はMVPに含まず、将来追加する場合もDomain所有確認と明示承認を必要とします。</p>
    <h2>第三者サービス</h2><p>診断のためOpenAI、Google Gemini、PerplexityへBuyer Promptと市場文脈を送信します。永続保存にはSupabase、決済にはStripeを利用します。カード番号はAIX Nextで保持しません。</p>
    <h2>保存と削除</h2><p>無料結果、Watch履歴、Evidenceはサービス提供と監査に必要な期間だけ保存します。削除・訂正・書き出しの依頼窓口は正式公開時に運営者情報とともに掲載します。</p>
    <h2>安全管理</h2><p>Secretはサーバー環境変数として管理し、顧客Evidenceは非公開で扱います。URL Scannerは内部IP、認証情報付きURL、不正Redirect等を拒否します。</p>
    <p className="document-note">本ページは製品実装用の初期ポリシーです。正式販売開始前に、運営法人の住所・連絡先、保存期間、委託先、国外移転、開示請求手順を確定してください。</p>
  </MarketingShell>;
}
