import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { CORE_PANEL_SIZE, FREE_PANEL_SIZE } from "@/lib/prompt-panels";

export const metadata: Metadata = {
  title: "調べ方・測定方法",
  description: "RovanがAI回答を同じ質問・条件で確認し、候補入りと参照元の変化を整理する方法。",
};

export default function MethodologyPage() {
  return <MarketingShell eyebrow="調べ方" title="AI回答に含まれる候補を、同じ質問で比較する。" lead="Rovanは会社サイトから、買い手が比較するときの質問を作ります。その質問を同じ条件で繰り返し、回答に含まれる候補と参照元の変化を確認します。">
    <h2>どの質問で、候補から外れているか</h2>
    <p>会社サイトのサービス、料金、導入事例などを確認し、購入前に出てきそうな質問を作ります。各質問への回答で、自社が候補に入ったか、先に含まれた候補はどこか、どのページが参照されたかを整理します。</p>
    <div className="document-callout"><strong>無料診断</strong><p>現在は{FREE_PANEL_SIZE}問の質問パネルを、利用可能なAIで一度確認します。取得できなかった回答は欠損として扱い、候補外とは数えません。</p></div>
    <div className="document-callout"><strong>毎週の確認</strong><p>有料Watchでは固定コア{CORE_PANEL_SIZE}問の質問パネルを使います。最初の結果を基準に同じ質問をもう一度AIに聞き、前回と今回で変わった質問だけを表示します。</p></div>

    <h2>結果の読み方</h2>
    <dl className="definition-list"><div><dt>候補に入った割合</dt><dd>確認できた回答のうち、自社が候補として挙げられた割合です。顧客数や市場シェアではありません。</dd></div><div><dt>回答内の掲載順</dt><dd>回答文から順序を抽出できた場合だけ表示します。順位を示していない回答は無理に順位へ変換しません。</dd></div><div><dt>確認できたページ</dt><dd>AIの回答に含まれた参照元URLです。Rovanページの採用や推薦を示すものではありません。</dd></div><div><dt>確認の確かさ</dt><dd>予定した回答のうち、実際に取得できた回答の割合です。取得できなかった分を自社の候補外とは数えません。</dd></div></dl>

    <h2>数字が変わる理由</h2>
    <p>AIの回答、検索結果、競合サイト、モデルの更新によって見え方は変わります。Rovanはその時点で同じ条件にそろえた結果を表示しますが、売上や順位を保証するものではありません。</p>

    <h2>直したあとに見ること</h2>
    <p>追っているのはサイトの更新履歴ではなく、AIの回答に自社が含まれたかどうかです。公開情報を変更したあとに同じ質問を聞き直し、候補入り・候補外・新しく確認された参照元URLを比べます。変更だけの前後差から因果や売上を断定しません。</p>
  </MarketingShell>;
}
