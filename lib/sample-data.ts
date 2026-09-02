import type { ActionCard, BuyerPrompt, Citation, CompanyDiscovery, EvidenceGap, Observation, ScanResult, WatchRecord } from "@/lib/types";

const discovery: CompanyDiscovery = {
  legalName: "Nexora Works株式会社（架空）",
  brandName: "NEXORA Cloud",
  domain: "nexora.example",
  summary: "取引先審査・委託先リスク管理をまとめる架空のB2B SaaS。",
  market: "取引先リスク管理SaaS",
  targetCustomers: ["従業員100〜500名の企業", "法務・購買・情報システム部門"],
  useCases: ["取引先審査", "委託先リスク評価", "更新確認の自動化"],
  aliases: ["NEXORA Cloud", "Nexora Works", "nexora.example"],
  competitors: [
    { name: "TrustOrbit", domain: "trustorbit.example", reason: "同じ取引先審査予算で比較される架空SaaS", confidence: .94 },
    { name: "VendorLens", domain: "vendorlens.example", reason: "委託先リスク評価の架空SaaS", confidence: .88 },
    { name: "RiskCanvas", domain: "riskcanvas.example", reason: "購買・法務向けの架空代替", confidence: .83 },
    { name: "ThirdCheck", domain: "thirdcheck.example", reason: "取引先情報確認の架空代替", confidence: .76 },
    { name: "AuditLoop", domain: "auditloop.example", reason: "監査証跡を強みにする架空SaaS", confidence: .73 },
    { name: "VendorScope", domain: "vendorscope.example", reason: "委託先管理の架空代替", confidence: .71 },
    { name: "SafeChain", domain: "safechain.example", reason: "サプライヤーリスク管理の架空SaaS", confidence: .69 },
    { name: "DueTrack", domain: "duetrack.example", reason: "継続審査の架空代替", confidence: .67 },
    { name: "ComplyNest", domain: "complynest.example", reason: "コンプライアンス確認の架空代替", confidence: .64 },
    { name: "ClearVendor", domain: "clearvendor.example", reason: "取引先確認の架空代替", confidence: .62 },
    { name: "RiskDock", domain: "riskdock.example", reason: "リスク台帳の架空代替", confidence: .60 },
    { name: "ChainProof", domain: "chainproof.example", reason: "サプライヤー証跡管理の架空代替", confidence: .58 },
  ],
  confidence: .93,
};

const promptSeed: Array<[string, BuyerPrompt["cluster"], number]> = [
  ["日本でおすすめの取引先リスク管理SaaSは？", "category", 5],
  ["従業員300名の企業に合う取引先審査ツールは？", "segment", 5],
  ["委託先リスクを継続監視できるサービスは？", "use_case", 5],
  ["反社・制裁・情報セキュリティをまとめて確認できるツールは？", "feature", 5],
  ["Excelの取引先審査から乗り換えやすいサービスは？", "alternative", 4],
  ["取引先リスク管理SaaSの主要3社を比較して", "comparison", 5],
  ["費用対効果が高い取引先審査サービスは？", "value", 5],
  ["短期間で導入できる取引先審査ツールは？", "implementation", 4],
  ["監査証跡を残せる信頼性の高いサービスは？", "trust", 5],
  ["導入支援が充実した取引先リスク管理SaaSは？", "support", 4],
  ["海外取引先にも対応できるリスク管理サービスは？", "use_case", 4],
  ["購買部門と法務部門が共同利用しやすいツールは？", "segment", 4],
];

const prompts: BuyerPrompt[] = promptSeed.map(([text, cluster, importance], index) => ({ id: `prompt_${index + 1}`, text, cluster, importance, panel: "free", version: 1 }));
const providerNames: Observation["provider"][] = ["openai", "gemini", "perplexity"];
const firstCandidates = [
  "TrustOrbit", "TrustOrbit", "VendorLens",
  "TrustOrbit", "VendorLens", "TrustOrbit",
  "RiskCanvas", "TrustOrbit", "VendorLens",
  "TrustOrbit", "RiskCanvas", "TrustOrbit",
  "NEXORA Cloud", "TrustOrbit", "VendorLens",
  "TrustOrbit", "NEXORA Cloud", "RiskCanvas",
  "TrustOrbit", "VendorLens", "TrustOrbit",
  "NEXORA Cloud", "TrustOrbit", "VendorLens",
  "TrustOrbit", "RiskCanvas", "TrustOrbit",
  "NEXORA Cloud", "TrustOrbit", "VendorLens",
  "TrustOrbit", "NEXORA Cloud", "RiskCanvas",
  "NEXORA Cloud", "TrustOrbit", "VendorLens",
];

function citation(name: string): Citation {
  const slug = name.toLowerCase().replace(/\s+/g, "");
  return { title: `${name} 導入実績・機能`, url: `https://${slug}.example/customer-proof`, domain: `${slug}.example` };
}

const observations: Observation[] = prompts.flatMap((prompt, promptIndex) => providerNames.map((provider, providerIndex) => {
  const index = promptIndex * 3 + providerIndex;
  const first = firstCandidates[index];
  const ownRecommended = first === "NEXORA Cloud" || [3, 8].includes(index % 12);
  const recommendedEntities = [first, ...(first !== "TrustOrbit" ? ["TrustOrbit"] : ["VendorLens"]), ...(ownRecommended && first !== "NEXORA Cloud" ? ["NEXORA Cloud"] : [])];
  const ownPosition = recommendedEntities.indexOf("NEXORA Cloud") + 1 || null;
  return {
    id: `obs_${index + 1}`,
    promptId: prompt.id,
    prompt: prompt.text,
    provider,
    model: `${provider}-sample`,
    repetition: 1,
    status: "success",
    rawText: `${first}を第一候補として挙げます。${first}は企業規模別の導入事例、標準導入期間、審査対象、監査証跡、導入支援を比較可能な形で公開しています。${ownRecommended ? "NEXORA Cloudも候補ですが、" : "NEXORA Cloudは公開情報から"}同規模の導入実績と標準導入期間を十分に確認できません。`,
    citations: [citation(first)],
    recommendedEntities,
    ownRecommended,
    ownPosition,
    firstCandidate: first,
    startedAt: "2026-09-01T09:00:00.000Z",
    completedAt: "2026-09-01T09:00:01.000Z",
    latencyMs: 1000,
    costUsd: .002,
  };
}));

const lostPrompts = prompts.filter((prompt) => observations.filter((item) => item.promptId === prompt.id && item.ownRecommended).length < 2).map((prompt) => ({
  promptId: prompt.id,
  prompt: prompt.text,
  winner: "TrustOrbit",
  summary: "TrustOrbitが公開導入実績と標準導入期間を根拠に先に推薦され、NEXORA Cloudは過半数の回答で候補に入りませんでした。",
  citations: [citation("TrustOrbit")],
  observations: observations.filter((item) => item.promptId === prompt.id),
}));

const gaps: EvidenceGap[] = [
  { id: "segment-proof", label: "従業員100〜500名での導入実績", whyItMatters: "同規模企業向けの推薦理由を公開Webから確認できません。", relatedPromptIds: prompts.slice(0, 10).map((item) => item.id), relatedPromptCount: 10, competitorEvidence: "TrustOrbitは企業規模別の架空導入事例を公開。", confidence: .91, status: "missing" },
  { id: "implementation-time", label: "標準導入期間", whyItMatters: "契約から稼働までの期間と条件を確認できません。", relatedPromptIds: prompts.slice(1, 9).map((item) => item.id), relatedPromptCount: 8, competitorEvidence: "TrustOrbitは標準3〜5週間と明示。", confidence: .87, status: "missing" },
  { id: "operational-proof", label: "審査工数の削減実績", whyItMatters: "費用対効果を比較する数値根拠を確認できません。", relatedPromptIds: prompts.slice(4, 10).map((item) => item.id), relatedPromptCount: 6, competitorEvidence: "VendorLensは更新確認工数の削減例を掲載。", confidence: .79, status: "partial" },
];

const actions: ActionCard[] = [
  { id: "action-segment-proof", title: "企業規模別の導入実績を比較可能な形で公開する", rationale: "最重要10 Promptに共通するEvidence不足です。", type: "owned", relatedPromptIds: gaps[0].relatedPromptIds, relatedPromptCount: 10, priority: "critical", confidence: .91, target: "導入事例・サービス概要" },
  { id: "action-implementation", title: "標準導入期間と導入条件を明示する", rationale: "導入負担を比較する8 Promptで判断材料が不足しています。", type: "owned", relatedPromptIds: gaps[1].relatedPromptIds, relatedPromptCount: 8, priority: "high", confidence: .87, target: "導入の流れ・FAQ" },
  { id: "action-third-party", title: "第三者が検証できる導入成果を増やす", rationale: "競合は自社サイト外の比較可能な根拠も引用されています。", type: "third_party", relatedPromptIds: prompts.slice(3, 8).map((item) => item.id), relatedPromptCount: 5, priority: "medium", confidence: .72, target: "業界媒体・顧客事例" },
];

export const sampleResult: ScanResult = {
  scanId: "sample_clean_room",
  targetUrl: "https://nexora.example",
  discovery,
  panel: { kind: "free", version: 1, promptCount: 12, repetitions: 1, locale: "ja-JP", country: "JP" },
  measuredAt: "2026-09-01T09:00:00.000Z",
  observations,
  scheduledObservations: 36,
  successfulObservations: 36,
  measurementCompleteness: 100,
  recommendationCoverage: 22,
  firstChoiceRate: 17,
  mentionCoverage: 31,
  citationCoverage: 8,
  repeatAgreement: 100,
  ownRecommendationCount: 8,
  marketPosition: 9,
  marketSize: 13,
  competitors: [
    { name: "TrustOrbit", recommendedCount: 29, firstChoiceCount: 20, coverage: 81 },
    { name: "VendorLens", recommendedCount: 20, firstChoiceCount: 9, coverage: 56 },
    { name: "RiskCanvas", recommendedCount: 13, firstChoiceCount: 6, coverage: 36 },
    { name: "ThirdCheck", recommendedCount: 11, firstChoiceCount: 1, coverage: 31 },
    { name: "AuditLoop", recommendedCount: 10, firstChoiceCount: 0, coverage: 28 },
    { name: "VendorScope", recommendedCount: 10, firstChoiceCount: 0, coverage: 28 },
    { name: "SafeChain", recommendedCount: 9, firstChoiceCount: 0, coverage: 25 },
    { name: "DueTrack", recommendedCount: 9, firstChoiceCount: 0, coverage: 25 },
    { name: "ComplyNest", recommendedCount: 7, firstChoiceCount: 0, coverage: 19 },
    { name: "ClearVendor", recommendedCount: 6, firstChoiceCount: 0, coverage: 17 },
    { name: "RiskDock", recommendedCount: 5, firstChoiceCount: 0, coverage: 14 },
    { name: "ChainProof", recommendedCount: 4, firstChoiceCount: 0, coverage: 11 },
  ],
  lostPrompts,
  evidenceGaps: gaps,
  actions,
  totalCostUsd: .072,
  warnings: ["この画面は架空企業・架空競合・架空数値によるUIサンプルです。", "無料Scanは各AIを1回観測する方向性診断です。"],
};

export function sampleWatch(): WatchRecord {
  const latest: ScanResult = {
    ...sampleResult,
    measuredAt: "2026-09-08T09:00:00.000Z",
    recommendationCoverage: 28,
    firstChoiceRate: 19,
    ownRecommendationCount: 10,
    marketPosition: 7,
    repeatAgreement: 78,
    lostPrompts: sampleResult.lostPrompts.slice(2),
  };
  return { id: "watch_sample", token: "sample", email: "sample@nexora.example", scanId: sampleResult.scanId, status: "trial", paid: false, baseline: sampleResult, latest, history: [sampleResult, latest], evidence: [], nextRunAt: "2026-09-15T09:00:00.000Z", createdAt: sampleResult.measuredAt, updatedAt: latest.measuredAt };
}
