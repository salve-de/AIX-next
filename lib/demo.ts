import type { BuyerPrompt, Observation, ScanResult, WatchRecord } from "@/lib/types";

const prompts: BuyerPrompt[] = [
  ["p1", "社員50名で導入しやすい勤怠管理システムは？", "segment"],
  ["p2", "移行が簡単なクラウド勤怠管理を比較して", "implementation"],
  ["p3", "サポートが手厚い勤怠管理システムは？", "support"],
  ["p4", "法改正対応に強い勤怠管理システムは？", "trust"],
  ["p5", "費用対効果が高い勤怠管理システムは？", "value"],
  ["p6", "打刻方法が豊富な勤怠管理システムは？", "feature"],
  ["p7", "中小企業向けの勤怠管理SaaSを教えて", "category"],
  ["p8", "既存の勤怠管理から乗り換える候補は？", "alternative"],
  ["p9", "製造業向けの勤怠管理システムは？", "use_case"],
  ["p10", "セキュリティを重視する企業向け勤怠管理は？", "trust"],
  ["p11", "日本の代表的な勤怠管理システムを比較して", "comparison"],
  ["p12", "短期間で運用開始できる勤怠管理は？", "implementation"],
].map(([id, text, cluster], index) => ({ id, text, cluster: cluster as BuyerPrompt["cluster"], importance: index < 6 ? 5 : 4, version: 1 }));

const providers: Observation["provider"][] = ["openai", "gemini", "perplexity"];
const competitorNames = ["Orbit勤怠", "Shiftbase One", "ClockPilot", "TeamHour", "AttendFlow", "WorkPulse", "DayTrack", "RosterCloud"];

function observation(prompt: BuyerPrompt, provider: Observation["provider"], index: number): Observation {
  const ownRecommended = index % 6 === 0;
  const first = competitorNames[index % competitorNames.length];
  const rankedBrands = ownRecommended ? [first, "LatticeTime"] : [first, competitorNames[(index + 2) % competitorNames.length]];
  return {
    id: `${prompt.id}-${provider}`,
    promptId: prompt.id,
    prompt: prompt.text,
    provider,
    model: `${provider}-demo`,
    repetition: 1,
    status: "success",
    rawText: `${first}は企業規模別の導入実績、標準導入期間、初期設定支援を公開しているため有力候補です。${ownRecommended ? "LatticeTimeも柔軟な打刻方法を持つ候補として挙げられます。" : "LatticeTimeは同規模の導入実績と移行期間を公開情報から確認できず、今回の候補には入りませんでした。"}`,
    rankedBrands,
    ownRecommended,
    ownPosition: ownRecommended ? 2 : null,
    citations: [{ title: `${first} 導入ガイド（架空）`, url: `https://${first.toLowerCase().replace(/[^a-z0-9]+/g, "") || "orbit"}.example/evidence`, domain: `${first.toLowerCase().replace(/[^a-z0-9]+/g, "") || "orbit"}.example` }],
    latencyMs: 940 + index * 11,
    createdAt: "2026-09-01T09:00:00.000Z",
  };
}

const observations = prompts.flatMap((prompt, promptIndex) => providers.map((provider, providerIndex) => observation(prompt, provider, promptIndex * 3 + providerIndex)));
const lostPrompts = prompts.filter((_, index) => index > 1).map((prompt) => {
  const rows = observations.filter((item) => item.promptId === prompt.id);
  return { prompt, winner: rows[0]?.rankedBrands[0] || "Orbit勤怠", observations: rows, citations: rows.flatMap((item) => item.citations) };
});

export const demoResult: ScanResult = {
  scanId: "demo-scan",
  url: "https://latticetime.example",
  measuredAt: "2026-09-01T09:00:00.000Z",
  discovery: {
    legalName: "LatticeTime株式会社（架空）",
    brandName: "LatticeTime",
    domain: "latticetime.example",
    summary: "従業員50〜300名向けの架空クラウド勤怠管理サービス。",
    market: "勤怠管理SaaS",
    targetCustomers: ["従業員50〜300名", "人事・労務部門", "複数拠点企業"],
    useCases: ["勤怠集計", "シフト管理", "法改正対応", "既存システムからの移行"],
    aliases: ["LatticeTime", "Lattice Time"],
    competitors: competitorNames.map((name, index) => ({ name, domain: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "") || `competitor${index}`}.example`, reason: "同じ企業規模・用途で比較される架空サービス", confidence: .82 - index * .02 })),
    confidence: .94,
  },
  pages: [{ url: "https://latticetime.example", title: "LatticeTime（架空）" }, { url: "https://latticetime.example/features", title: "機能" }, { url: "https://latticetime.example/cases", title: "導入事例" }],
  prompts,
  observations,
  metrics: {
    successfulObservations: 36,
    scheduledObservations: 36,
    measurementCompleteness: 100,
    shortlistCoverage: 17,
    topChoiceRate: 0,
    citationCoverage: 8,
    stability: 100,
    marketPosition: 9,
    marketSize: 9,
    ownRecommendationCount: 6,
    lostPromptCount: 10,
    competitors: [
      { name: "Orbit勤怠", count: 21, coverage: 58 },
      { name: "Shiftbase One", count: 17, coverage: 47 },
      { name: "ClockPilot", count: 14, coverage: 39 },
      { name: "TeamHour", count: 11, coverage: 31 },
      { name: "AttendFlow", count: 9, coverage: 25 },
      { name: "WorkPulse", count: 7, coverage: 19 },
      { name: "DayTrack", count: 5, coverage: 14 },
      { name: "RosterCloud", count: 4, coverage: 11 },
    ],
  },
  lostPrompts,
  evidenceGaps: [
    { id: "proof-segment", label: "50〜100名規模の導入実績", whyItMatters: "企業規模を指定した6つの比較質問で、競合の導入事例が推薦理由になっています。", relatedPromptIds: ["p1", "p3", "p5", "p7", "p9", "p11"], relatedPromptCount: 6, competitorEvidence: "Orbit勤怠は企業規模別の架空事例を12件掲載。", confidence: .91, status: "missing" },
    { id: "proof-time", label: "標準導入期間", whyItMatters: "移行負担・短期導入の4つの質問で比較材料が不足しています。", relatedPromptIds: ["p2", "p8", "p11", "p12"], relatedPromptCount: 4, competitorEvidence: "Shiftbase Oneは標準2〜4週間と架空表示。", confidence: .87, status: "missing" },
    { id: "proof-outcome", label: "導入後の削減工数", whyItMatters: "費用対効果を説明する定量Evidenceを確認できません。", relatedPromptIds: ["p5", "p7", "p11"], relatedPromptCount: 3, competitorEvidence: "複数競合が架空の集計時間削減値を掲載。", confidence: .79, status: "partial" },
  ],
  actions: [
    { id: "action-proof", title: "企業規模別の導入Evidenceを一枚にまとめる", rationale: "最も多くの候補外Promptに共通する不足です。実績数・業種・導入前後を比較可能な表現へ変えます。", type: "owned", relatedPromptIds: ["p1", "p3", "p5", "p7", "p9", "p11"], relatedPromptCount: 6, priority: "critical", confidence: .91, target: "サービス概要・導入事例" },
    { id: "action-time", title: "標準導入期間と移行手順を公開する", rationale: "短期導入と乗り換えの不安を解消する情報が不足しています。", type: "owned", relatedPromptIds: ["p2", "p8", "p12"], relatedPromptCount: 3, priority: "high", confidence: .87, target: "導入の流れ・FAQ" },
    { id: "action-authority", title: "第三者比較で検証できる情報を増やす", rationale: "競合の第三者Sourceが推薦理由の裏付けとして使われています。", type: "third_party", relatedPromptIds: ["p5", "p7", "p11"], relatedPromptCount: 3, priority: "medium", confidence: .72, target: "業界媒体・比較媒体" },
  ],
  warnings: ["このデモは会社・競合・URL・数値をすべて架空にしたUIサンプルです。", "無料Snapshotは各AIを1回だけ観測します。"],
};

export const demoWatch: WatchRecord = {
  id: "demo-watch",
  token: "demo-token",
  email: "demo@example.com",
  scanId: demoResult.scanId,
  baseline: demoResult,
  latest: { ...demoResult, measuredAt: "2026-09-08T09:00:00.000Z", metrics: { ...demoResult.metrics, shortlistCoverage: 25, marketPosition: 7, ownRecommendationCount: 9, stability: 78 } },
  history: [demoResult, { ...demoResult, measuredAt: "2026-09-08T09:00:00.000Z", metrics: { ...demoResult.metrics, shortlistCoverage: 25, marketPosition: 7, ownRecommendationCount: 9, stability: 78 } }],
  evidence: [],
  status: "trial",
  paid: false,
  nextRunAt: "2026-09-15T09:00:00.000Z",
  createdAt: demoResult.measuredAt,
  updatedAt: "2026-09-08T09:00:00.000Z",
};
