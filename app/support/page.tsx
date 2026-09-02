import { DocumentShell } from "@/components/document-shell";
import { seller } from "@/lib/legal";

export default function SupportPage() {
  return <DocumentShell label="Support" title="サポート" lead="診断結果の訂正、請求、データ管理、不具合について問い合わせできます。">
    <h2>診断結果について</h2>
    <p>会社・ブランド・市場・競合の誤認、AI回答や引用元の抽出不具合、確認情報の訂正に対応します。問い合わせ時は、対象会社URLと問題がある比較質問、正しい情報を確認できる公式URLを添えてください。</p>

    <h2>請求・契約について</h2>
    <p>有料モニタリングの支払方法、請求、更新、解約について確認できます。契約中の場合は、モニタリング画面の「契約を管理」からStripe Customer Portalを開くのが最短です。</p>

    <h2>データの書き出し・削除</h2>
    <p>保存した継続モニタリング、測定履歴、企業入力はデータ管理ページから書き出し・削除できます。</p>

    <h2>問い合わせ先</h2>
    {seller.email ? <p><a className="ux2-link" href={`mailto:${seller.email}`}>{seller.email}</a><br />受付時間: {seller.supportHours}</p> : <p className="ux2-notice">一般公開前のため、問い合わせ受付はまだ開始していません。販売開始時に正式な連絡先を掲載します。</p>}

    <h2>重大な問題</h2>
    <p>情報漏えい、不正アクセス、誤課金等の重大事象は、問い合わせ件名の先頭に「URGENT」を付けてください。AI順位や引用元の通常変動は緊急障害には該当しません。</p>
  </DocumentShell>;
}
