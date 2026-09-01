import { MarketingShell } from "@/components/marketing-shell";

export default function TermsPage() {
  return <MarketingShell eyebrow="TERMS" title="観測値を、保証と混同しないための条件。" lead="AIX NextはAI回答を継続観測するサービスです。外部AIの順位・推薦・引用・売上を支配または保証するものではありません。">
    <h2>サービス内容</h2><p>AIX Nextは、入力された公開URLを分析し、市場・競合・Buyer Promptを推定し、対応AI Providerの回答、候補企業、Citation、Evidence差、Action候補を表示・保存します。</p>
    <h2>測定上の制約</h2><p>AI回答はモデル、日時、場所、検索結果、質問表現、会話文脈、非決定性等により変動します。AIX Nextの数値は明示された観測パネルの結果であり、全利用者に共通する絶対順位ではありません。</p>
    <h2>保証しない事項</h2><ul><li>特定順位または推薦</li><li>特定Citation</li><li>検索流入、問い合わせ、契約または売上</li><li>施策と数値変化の因果関係</li><li>第三者サイト・AI Providerの継続提供</li></ul>
    <h2>ユーザーの責任</h2><p>ユーザーは、入力する会社情報、実績、顧客数、料金、認証、ROI等について公開・利用権限を持ち、正確であることを確認します。AIX Nextが生成した文案は公開前にユーザーが確認します。</p>
    <h2>禁止事項</h2><ul><li>他社を装ったEvidence入力</li><li>虚偽の実績、レビュー、認証、No.1表示</li><li>不正アクセス、過剰Scan、制限回避</li><li>医療・金融・法務等の高リスク用途での無審査利用</li><li>第三者の権利を侵害する情報の入力</li></ul>
    <h2>有料Watch</h2><p>有料Watchは月ごとの自動更新です。無料Watchから自動課金されません。契約開始前にStripe Checkoutで価格、税、更新条件を確認します。正式販売開始前に返金・解約・請求日等の最終条件を特商法表記と一致させてください。</p>
    <p className="document-note">本ページは初期製品仕様です。正式販売開始前に、準拠法、管轄、責任制限、SLA、返金、法人情報、連絡先を法務確認の上で確定してください。</p>
  </MarketingShell>;
}
