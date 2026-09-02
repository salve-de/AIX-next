import { MarketingShell } from "@/components/marketing-shell";

export default function PrivacyPage() {
  return <MarketingShell eyebrow="PRIVACY" title="公開Webを調べ、企業入力は公開しない。" lead="AIX Nextは、診断・Watch・Change Packの提供に必要な範囲で公開サイト、AI回答、会社メール、企業が入力したEvidenceを取り扱います。">
    <h2>取得する情報</h2><ul><li>診断対象として入力された公開URL</li><li>対象サイトの公開HTML、robots.txt、sitemap、公開ページ上の事実</li><li>AI Providerへ送ったBuyer Promptと返された回答・Citation</li><li>Watch登録メール</li><li>企業が任意で入力したEvidenceと根拠URL</li><li>生成したChange Packと公開前チェック項目</li><li>利用状況、エラー、原価、セキュリティログ</li></ul>
    <h2>利用目的</h2><ul><li>会社、市場、競合、Buyer Promptの特定</li><li>AI上の候補入り、Citation、Evidence差の観測</li><li>確認済み事実に基づくChange Packの生成</li><li>週次Watch、通知、課金、サポート</li><li>不正利用防止、障害調査、品質評価</li><li>匿名・集計化したプロダクト改善</li></ul>
    <h2>公開範囲</h2><p>無料Scan、Watch、企業入力Evidence、Change Packは公開Webへ掲載しません。結果URLは検索Indexから除外します。ここでいう「非公開」はインターネット上へ一般公開しないという意味であり、サービス処理に必要な委託先への送信まで否定するものではありません。</p>
    <h2>AI Providerへの送信</h2><p>診断ではOpenAI、Google Gemini、PerplexityへBuyer Promptと必要な市場文脈を送信します。Change Pack生成では、公開ページの抜粋と、ユーザーが入力したEvidenceのうちドラフト作成に必要な内容をOpenAIへ送信する場合があります。入力前に、送信権限のない個人情報、秘密情報、契約上外部処理できない情報を含めないでください。</p>
    <h2>その他の第三者サービス</h2><p>永続保存にはSupabase、決済にはStripeを利用します。カード番号はAIX Nextで保持しません。正式販売前に、利用する委託先、処理地域、各社のデータ取扱条件を確定し、本ページへ反映します。</p>
    <h2>保存・書き出し・削除</h2><p>無料結果、Watch履歴、Evidence、Change Packはサービス提供と監査に必要な期間だけ保存します。Data Rights画面から対象Watchの書き出し・削除を行える実装を用意しています。正式公開時には運営者情報、保存期間、問い合わせ窓口、開示等の手順を確定してください。</p>
    <h2>安全管理</h2><p>Secretはサーバー環境変数として管理し、顧客EvidenceとChange Packは一般公開しません。URL Scannerは内部IP、認証情報付きURL、不正Redirect等を拒否します。Change Packは公開Webまたは企業が入力した事実だけを素材とし、未確認数値を自動で事実化しない設計です。</p>
    <p className="document-note">本ページは製品実装用の初期ポリシーです。正式販売開始前に、運営法人の住所・連絡先、保存期間、委託先、国外移転、各Providerの契約条件、開示請求手順を法務確認の上で確定してください。</p>
  </MarketingShell>;
}
