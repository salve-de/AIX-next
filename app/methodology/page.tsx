import { MarketingShell } from "@/components/marketing-shell";

export default function MethodologyPage() {
  return <MarketingShell eyebrow="METHODOLOGY" title="AIXは、何を測っているのか。" lead="AIXの数値は、全世界のChatGPT順位でも、consumer UIを完全再現した値でもありません。条件を固定したAI観測パネルです。">
    <h2>測定単位</h2><p>会社の市場から構成したBuyer Promptを、測定対象AI surfaceへ同じPanel・言語・地域条件で送ります。各回答は独立したObservationとして保存し、生回答、Citation、候補順、モデル、日時、反復を後から監査できます。</p>
    <div className="document-callout"><strong>無料Scan</strong><p>12 Buyer Prompts × OpenAI / Gemini / Perplexity × 1回 = 最大36 Observations</p></div>
    <div className="document-callout"><strong>14日無料Watch</strong><p>30固定Core Prompts × OpenAI / Gemini / Perplexity × 1回。無料Scanとは別のStable Baselineを作ります。</p></div>
    <div className="document-callout"><strong>Founder Watch</strong><p>50固定Core Prompts × OpenAI / Gemini / Perplexity / Claude / Grok × 3回 = 週最大750 Core Observations。加えて20 Discovery Promptsを別Panelで測定します。</p></div>
    <h2>各AI surface</h2><dl className="definition-list"><div><dt>OpenAI</dt><dd>Responses API + Web Searchを使った観測。</dd></div><div><dt>Gemini</dt><dd>Gemini API + Google Search groundingを使った観測。</dd></div><div><dt>Perplexity</dt><dd>Perplexity Sonarを使った検索回答観測。</dd></div><div><dt>Claude</dt><dd>Claude API + Web Searchを使った観測。有料Watchで追加。</dd></div><div><dt>Grok</dt><dd>xAI Responses API + Web Searchを使った観測。有料Watchで追加。</dd></div></dl>
    <h2>consumer UIとの違い</h2><p>API・grounded searchによるObservationは、ChatGPT、Claude、Grok等の一般ユーザー向けWeb/App画面で全ユーザーが必ず見る回答と同一ではありません。AIXはProvider・Model・取得方法を保存し、API観測を「世界共通の順位」と言い換えません。Google AI Overviews / AI Modeやconsumer Copilotも、同等の取得面を実装するまで別surfaceとして測定済みとは表示しません。</p>
    <h2>主要指標</h2><dl className="definition-list"><div><dt>Recommendation Coverage</dt><dd>成功したAI回答のうち、自社が明示的な購入候補として挙げられた割合。</dd></div><div><dt>First Choice Rate</dt><dd>自社が最初の推薦候補として挙げられた割合。</dd></div><div><dt>Mention Coverage</dt><dd>推薦かどうかに関係なく、自社名が登場した割合。Recommendationとは分けます。</dd></div><div><dt>Citation Coverage</dt><dd>自社の確認済みドメインまたはサブドメインが引用元に含まれた割合。</dd></div><div><dt>Repeat Agreement</dt><dd>同じPromptとAIを複数回実行した際に、候補入り・順位・第一候補が一致した割合。</dd></div><div><dt>Measurement Completeness</dt><dd>予定したObservationのうち成功した割合。失敗や未設定を自社の負けとして数えません。</dd></div></dl>
    <h2>Core / Discovery / Customを分ける理由</h2><p>毎週質問を入れ替えると、数値変化が改善なのか質問変更なのか分かりません。Core Promptは固定して時系列比較に使い、Discoveryは新しい買い手表現や競合の発見、Customは企業固有の追加質問に使います。DiscoveryとCustomはCoreのTrendへ混ぜません。</p>
    <h2>AI surfaceが変わった場合</h2><p>無料Watchの3面からFounder Watchの5面へ変わる場合など、測定surface構成が変わればPanel versionも変わり、新しいBaselineを作ります。違う面を測った結果を同じ時系列として比較しません。</p>
    <h2>因果関係について</h2><p>施策後に推薦率やReferral Conversionが上がっても、その施策だけが原因とは限りません。競合の更新、新しいSource、モデル更新、検索結果、非決定性、他チャネルも影響します。AIXは観測変化と実イベントを示しますが、単純なBefore/Afterを因果効果と断定しません。</p>
    <h2>Raw evidence</h2><p>Prompt、AI surface、モデル、日時、反復、生回答、候補順、Citation、成功・失敗状態を保存します。数字から元回答へ遡れることを、AIXの信頼性の中核にします。</p>
  </MarketingShell>;
}
