import { MarketingShell } from "@/components/marketing-shell";

export default function MethodologyPage() {
  return <MarketingShell eyebrow="調べ方" title="AIが競合を選ぶ理由を、同じ質問で確かめる。" lead="Rovanは会社サイトから、買い手が比較するときの質問を作ります。その質問を同じ条件で繰り返し、競合から取り返せたかを比べます。">
    <h2>どの質問で、候補から外れているか</h2>
    <p>会社サイトのサービス、料金、導入事例などを確認し、購入前に出てきそうな質問を作ります。各質問への回答で、自社が候補に入ったか、AIが先に勧めた会社はどこか、どのページが参照されたかを整理します。</p>
    <div className="document-callout"><strong>無料診断</strong><p>12の購入前質問を、ChatGPT・Gemini・Perplexityで一度確認します。</p></div>
    <div className="document-callout"><strong>毎週の確認</strong><p>最初の結果を基準に、同じ質問をもう一度AIに聞きます。前回と今回で変わった質問だけを表示します。</p></div>

    <h2>結果の読み方</h2>
    <dl className="definition-list"><div><dt>候補に入った割合</dt><dd>確認できた回答のうち、自社が購入候補として挙げられた割合です。</dd></div><div><dt>候補に入った順位</dt><dd>回答の中で自社が何番目に挙げられたかを示します。順位がない回答は無理に順位へ変換しません。</dd></div><div><dt>確認できたページ</dt><dd>AIの回答で参照されたURLです。理由を読み返し、改善の材料にできます。</dd></div><div><dt>確認の確かさ</dt><dd>予定した回答のうち、実際に取得できた回答の割合です。取得できなかった分を自社の負けとして数えません。</dd></div></dl>

    <h2>数字が変わる理由</h2>
    <p>AIの回答、検索結果、競合サイト、モデルの更新によって見え方は変わります。Rovanはその時点で同じ条件にそろえた結果を表示しますが、売上や順位を保証するものではありません。</p>

    <h2>直したあとに見ること</h2>
    <p>追っているのはサイトの更新履歴ではなく、AIの回答で自社が選ばれたかどうかです。サイトを直したあとに同じ質問を聞き直し、取り返せた質問、まだ競合が先の質問、AIが新しく参照したページを比べます。</p>
  </MarketingShell>;
}
