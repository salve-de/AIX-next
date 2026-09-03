import { MarketingShell } from "@/components/marketing-shell";

export default function TermsPage() {
  return <MarketingShell eyebrow="TERMS" title="観測値と変更案を、保証と混同しないための条件。" lead="AIX NextはAI回答を観測し、改善候補とChange Packを作成するサービスです。外部AIの順位・推薦・引用・問い合わせ・売上を支配または保証するものではありません。">
    <h2>サービス内容</h2><p>AIX Nextは、会社名・商品名・サービス名または公開URLを起点に診断対象の公開サイトを確認し、市場・競合・Buyer Promptを推定し、対応AI Providerの回答、候補企業、Citation、Evidence差、Action候補を表示・保存します。名前から始めた場合は、公開検索で見つけた候補をユーザーが確認してからサイトを診断します。有料Watchでは、公開情報およびユーザーが入力した確認済み事実をもとに、見出し・本文・FAQ等のChange Packを生成する場合があります。</p>
    <h2>測定上の制約</h2><p>AI回答はモデル、日時、場所、検索結果、質問表現、会話文脈、非決定性等により変動します。AIX Nextの数値は明示された観測パネルの結果であり、全利用者に共通する絶対順位ではありません。Buyer Promptの候補外件数は顧客・見込み客・失注件数を意味しません。</p>
    <h2>Change Packの制約</h2><p>Change Packは公開前の編集ドラフトです。AIX Nextは、入力・取得した事実の正確性、第三者権利、表示規制、業界規制、顧客許諾等を最終保証しません。ユーザーは公開前に事実、権利、法令、社内承認を確認します。AIX Nextは明示承認なしに顧客サイトへChange Packを公開しません。</p>
    <h2>保証しない事項</h2><ul><li>特定順位または推薦</li><li>特定Citation</li><li>Buyer Promptの候補入り増加</li><li>検索流入、問い合わせ、契約または売上</li><li>施策と数値変化の因果関係</li><li>第三者サイト・AI Providerの継続提供</li></ul>
    <h2>ユーザーの責任</h2><p>ユーザーは、入力する会社情報、実績、顧客数、料金、認証、ROI等について入力・外部処理・公開に必要な権限を持ち、正確であることを確認します。AIX Nextが生成した文案は公開前にユーザーが確認します。</p>
    <h2>禁止事項</h2><ul><li>他社を装ったEvidence入力</li><li>虚偽の実績、レビュー、認証、No.1表示</li><li>送信権限のない秘密情報・個人情報・第三者情報の入力</li><li>不正アクセス、過剰Scan、制限回避</li><li>医療・金融・法務等の高リスク用途での無審査利用</li><li>第三者の権利を侵害する情報の入力</li></ul>
    <h2>有料Watch</h2><p>有料Watchは月ごとの自動更新です。無料Watchから自動課金されません。契約開始前にStripe Checkoutで価格、税、更新条件を確認します。正式販売開始前に返金・解約・請求日等の最終条件を特商法表記と一致させてください。</p>
    <p className="document-note">本ページは初期製品仕様です。正式販売開始前に、準拠法、管轄、責任制限、SLA、返金、法人情報、連絡先、AI Providerへのデータ送信条件を法務確認の上で確定してください。</p>
  </MarketingShell>;
}
