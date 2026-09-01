import { PageShell } from "@/components/ui";

export const metadata = { title: "測定方法" };

export default function MethodologyPage() {
  return <PageShell><section className="public-page"><div className="container"><p className="kicker"><span/>METHODOLOGY</p><h1>AIXは、何を測っているか。</h1><p className="lead">AIXは「世界中の全ChatGPTでの絶対順位」を測るとは主張しません。明示したBuyer Prompt・AI surface・言語・地域・日時・反復条件で、同じ市場を継続観測します。</p><div className="public-body"><h2>無料Snapshot</h2><p>12件のAIX生成Buyer Promptを、OpenAI Web Search、Gemini Google Search Grounding、Perplexity Sonarへ各1回送ります。未設定・失敗したProviderは分母から隠さず、測定完了率へ反映します。</p><h2>有料Watch</h2><p>固定Core Prompt 50件を3つのAIへ各3回、週次で再測定します。時系列比較は同じPanel versionだけで行います。Discovery Promptは新しい表現や競合の発見に使い、Headline指標へ混ぜません。</p><h2>Shortlist Coverage</h2><p>成功した観測のうち、対象企業が購入候補として明示された割合です。単なる名前の登場とは分けます。</p><h2>Top Choice Rate</h2><p>対象企業が最初の推薦候補として出た割合です。</p><h2>Citation Coverage</h2><p>対象企業の公式DomainまたはSubdomainが、AI回答のCitationとして使われた割合です。</p><h2>Stability</h2><p>同じPrompt・AI・週の反復で、候補入り、順位、最初の推薦候補が一致した割合です。低い場合、単一順位を強調しません。</p><h2>因果関係</h2><p>施策後に数値が動いても、それだけで施策が原因とは断定しません。競合更新、AIモデル更新、Web更新、回答の非決定性を含むためです。AIXは観測変化と関連Evidenceを分けて表示します。</p></div></div></section></PageShell>;
}
