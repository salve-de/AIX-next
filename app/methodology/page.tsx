import { MarketingShell } from "@/components/marketing-shell";

export default function MethodologyPage() {
  return <MarketingShell eyebrow="METHODOLOGY" title="AIXは、何を測っているのか。" lead="AIXの数値は、全世界のChatGPT順位ではありません。条件を固定したAI観測パネルです。">
    <h2>測定単位</h2><p>会社の市場から生成したBuyer Promptを、OpenAIのWeb検索、GeminiのGoogle Search Grounding、Perplexity Sonarへ同じ週・同じ言語・同じ地域条件で送ります。各回答は独立したObservationとして保存します。</p>
    <div className="document-callout"><strong>無料Scan</strong><p>12 Buyer Prompts × 3 AI surfaces × 1回 = 最大36 Observations</p></div>
    <div className="document-callout"><strong>有料Watch</strong><p>50固定Core Prompts × 3 AI surfaces × 3回 = 週450 Observations</p></div>
    <h2>主要指標</h2><dl className="definition-list"><div><dt>Recommendation Coverage</dt><dd>成功したAI回答のうち、自社が明示的な購入候補として挙げられた割合。</dd></div><div><dt>First Choice Rate</dt><dd>自社が最初の推薦候補として挙げられた割合。</dd></div><div><dt>Mention Coverage</dt><dd>推薦かどうかに関係なく、自社名が登場した割合。Recommendationとは分けます。</dd></div><div><dt>Citation Coverage</dt><dd>自社の確認済みドメインまたはサブドメインが引用元に含まれた割合。</dd></div><div><dt>Repeat Agreement</dt><dd>同じPromptとAIを複数回実行した際に、候補入り・順位・第一候補が一致した割合。</dd></div><div><dt>Measurement Completeness</dt><dd>予定したObservationのうち成功した割合。失敗や未設定を自社の負けとして数えません。</dd></div></dl>
    <h2>CoreとDiscoveryを分ける理由</h2><p>毎週質問を入れ替えると、数値変化が実際の改善なのか質問変更なのか分かりません。Core Promptは固定して時系列比較に使い、Discovery Promptは新しい買い手表現や競合の発見にだけ使います。</p>
    <h2>因果関係について</h2><p>施策後に推薦率が上がっても、その施策だけが原因とは限りません。競合の更新、Web上の新しいSource、モデル更新、検索結果、非決定性も影響します。AIXは観測変化と関連を示しますが、MVPでは因果効果を断定しません。</p>
    <h2>Raw evidence</h2><p>有料Watchでは、Prompt、AI surface、モデル、日時、反復、生回答、候補順、Citation、抽出Version、成功・失敗状態を保存します。数値から元回答へ遡れることを、AIXの信頼性の中核にします。</p>
  </MarketingShell>;
}
