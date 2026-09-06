import type { BuyerPrompt, CompanyDiscovery, PromptCluster } from "@/lib/types";

/** The core panel is a versioned contract. Its slots never change silently. */
export const CORE_PANEL_VERSION = 1;
export const CORE_PANEL_SIZE = 50;
export const FREE_PANEL_SIZE = 12;

type CoreTemplate = {
  id: string;
  cluster: PromptCluster;
  importance: number;
  text: string;
};

/*
 * These are stable measurement slots. Company-specific words are filled from
 * discovery, but the question intent and slot IDs remain comparable week to
 * week. Keep additions/removals as a versioned change.
 */
const CORE_TEMPLATES: CoreTemplate[] = [
  { id: "category-01", cluster: "category", importance: 5, text: "日本で{market}を探すとき、最初に比較する選択肢は？" },
  { id: "category-02", cluster: "category", importance: 4, text: "{market}にはどのような種類があり、選び方の違いは？" },
  { id: "category-03", cluster: "category", importance: 4, text: "{market}を初めて選ぶ人が確認すべき基本条件は？" },
  { id: "category-04", cluster: "category", importance: 4, text: "地域で{market}を探す場合、候補をどう絞り込む？" },
  { id: "category-05", cluster: "category", importance: 3, text: "{market}を選ぶ前に知っておきたい注意点は？" },
  { id: "segment-01", cluster: "segment", importance: 5, text: "{segment}に合う{market}の候補は？" },
  { id: "segment-02", cluster: "segment", importance: 4, text: "{segment}が{market}を選ぶときに重視すべき条件は？" },
  { id: "segment-03", cluster: "segment", importance: 4, text: "小規模な{segment}でも相談しやすい{market}は？" },
  { id: "segment-04", cluster: "segment", importance: 4, text: "{segment}の個別事情に対応しやすい{market}は？" },
  { id: "segment-05", cluster: "segment", importance: 3, text: "{segment}が{market}を比較するときの判断軸は？" },
  { id: "use-case-01", cluster: "use_case", importance: 5, text: "{useCase}に強い{market}の候補は？" },
  { id: "use-case-02", cluster: "use_case", importance: 4, text: "{useCase}を依頼するとき、{market}に何を確認すべき？" },
  { id: "use-case-03", cluster: "use_case", importance: 4, text: "{useCase}の相談先を地域で探すには？" },
  { id: "use-case-04", cluster: "use_case", importance: 4, text: "{useCase}を初めて依頼する人向けの{market}は？" },
  { id: "use-case-05", cluster: "use_case", importance: 3, text: "{useCase}で失敗しない{market}の選び方は？" },
  { id: "feature-01", cluster: "feature", importance: 5, text: "{market}を機能・対応範囲で比較して" },
  { id: "feature-02", cluster: "feature", importance: 4, text: "{market}ごとの得意分野と対応できない範囲は？" },
  { id: "feature-03", cluster: "feature", importance: 4, text: "{market}のサービス内容を具体的に比べるには？" },
  { id: "feature-04", cluster: "feature", importance: 4, text: "{market}に相談する前に確認したい提供条件は？" },
  { id: "feature-05", cluster: "feature", importance: 3, text: "{market}の違いが分かる比較項目は？" },
  { id: "alternative-01", cluster: "alternative", importance: 4, text: "今の{market}から乗り換えるときの候補は？" },
  { id: "alternative-02", cluster: "alternative", importance: 4, text: "他社で対応できなかった場合に相談できる{market}は？" },
  { id: "alternative-03", cluster: "alternative", importance: 4, text: "大規模事業者以外で比較できる{market}は？" },
  { id: "alternative-04", cluster: "alternative", importance: 3, text: "近隣で別の選択肢も含めて{market}を比較して" },
  { id: "alternative-05", cluster: "alternative", importance: 3, text: "{market}の候補を切り替えるときの注意点は？" },
  { id: "comparison-01", cluster: "comparison", importance: 5, text: "{market}の候補を地域・専門性・対応範囲で比較して" },
  { id: "comparison-02", cluster: "comparison", importance: 5, text: "{market}を複数候補から選ぶための比較表を作って" },
  { id: "comparison-03", cluster: "comparison", importance: 4, text: "{market}の大手と地域事業者の違いは？" },
  { id: "comparison-04", cluster: "comparison", importance: 4, text: "{market}の候補を公開情報の根拠付きで比較して" },
  { id: "comparison-05", cluster: "comparison", importance: 4, text: "{market}で候補ごとの向き・不向きを教えて" },
  { id: "value-01", cluster: "value", importance: 5, text: "費用と対応内容のバランスがよい{market}は？" },
  { id: "value-02", cluster: "value", importance: 5, text: "{market}の料金を比較するときに見るべき項目は？" },
  { id: "value-03", cluster: "value", importance: 4, text: "安さだけでなく納得感で選べる{market}は？" },
  { id: "value-04", cluster: "value", importance: 4, text: "{market}で追加費用や条件を事前に確認するには？" },
  { id: "value-05", cluster: "value", importance: 3, text: "{market}の見積もりを比較するときの注意点は？" },
  { id: "implementation-01", cluster: "implementation", importance: 5, text: "{market}に相談してから利用開始までの流れは？" },
  { id: "implementation-02", cluster: "implementation", importance: 4, text: "{market}を導入・依頼するために準備するものは？" },
  { id: "implementation-03", cluster: "implementation", importance: 4, text: "急ぎで{market}に相談したい場合の確認事項は？" },
  { id: "implementation-04", cluster: "implementation", importance: 4, text: "{market}の初回相談で伝えるべき情報は？" },
  { id: "implementation-05", cluster: "implementation", importance: 3, text: "{market}の契約・依頼前に確認したい条件は？" },
  { id: "trust-01", cluster: "trust", importance: 5, text: "信頼できる{market}を公開情報から選ぶには？" },
  { id: "trust-02", cluster: "trust", importance: 4, text: "{market}の実績・資格・対応体制を確認する方法は？" },
  { id: "trust-03", cluster: "trust", importance: 4, text: "{market}に個人情報や機密情報を相談するときの確認点は？" },
  { id: "trust-04", cluster: "trust", importance: 4, text: "{market}の説明が分かりやすい候補を探して" },
  { id: "trust-05", cluster: "trust", importance: 3, text: "{market}の情報が最新かどうかを確認するには？" },
  { id: "support-01", cluster: "support", importance: 5, text: "相談後のサポートが分かりやすい{market}は？" },
  { id: "support-02", cluster: "support", importance: 4, text: "{market}の問い合わせ方法と対応時間を比較して" },
  { id: "support-03", cluster: "support", importance: 4, text: "{market}で担当者に継続して相談できる候補は？" },
  { id: "support-04", cluster: "support", importance: 3, text: "{market}の変更・キャンセル・アフターサポートを確認して" },
  { id: "support-05", cluster: "support", importance: 3, text: "{market}を利用した後に困ったときの相談先は？" },
];

function interpolate(template: string, discovery: CompanyDiscovery) {
  const values = {
    market: discovery.market || "この分野のサービス",
    segment: discovery.targetCustomers[0] || "個人・法人の利用者",
    useCase: discovery.useCases[0] || "具体的な相談",
  };
  return template.replace(/\{(market|segment|useCase)\}/g, (_, key: keyof typeof values) => values[key]);
}

export function buildCorePromptPanel(discovery: CompanyDiscovery): BuyerPrompt[] {
  return CORE_TEMPLATES.map((template) => ({
    id: `core-v${CORE_PANEL_VERSION}-${template.id}`,
    text: interpolate(template.text, discovery),
    cluster: template.cluster,
    importance: template.importance,
    panel: "core",
    version: CORE_PANEL_VERSION,
  }));
}

export function panelVersion(panel: BuyerPrompt["panel"]) {
  return panel === "core" ? CORE_PANEL_VERSION : 1;
}
