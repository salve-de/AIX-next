import { MarketingShell } from "@/components/marketing-shell";
import { seller } from "@/lib/legal";

export default function SupportPage() {
  return <MarketingShell eyebrow="SUPPORT" title="診断、請求、情報訂正の窓口。" lead="対象会社の誤認、競合の誤判定、Citation、請求、データ削除について連絡できます。">
    <h2>問い合わせに含める情報</h2><ul><li>Scan IDまたはWatch tokenの先頭8文字</li><li>対象会社URL</li><li>問題がある画面・Buyer Prompt</li><li>正しい情報を確認できる公式URL</li></ul>
    <h2>対応する依頼</h2><ul><li>会社・ブランド・市場の誤認</li><li>競合候補の誤り</li><li>AI回答・Citation抽出の不具合</li><li>会社Evidenceの訂正</li><li>支払方法・請求・解約</li><li>データ書き出し・削除</li><li>RovanBotの停止</li></ul>
    <h2>連絡先</h2>{seller.email ? <p><a className="document-link" href={`mailto:${seller.email}`}>{seller.email}</a></p> : <p className="document-note">正式公開前にSELLER_EMAILを設定してください。</p>}
    <p>受付時間: {seller.supportHours}</p>
    <h2>緊急性</h2><p>情報漏えい、不正アクセス、誤課金等の重大事象は件名の先頭に「URGENT」を付けてください。AI順位やCitationの通常変動は緊急障害には該当しません。</p>
  </MarketingShell>;
}
