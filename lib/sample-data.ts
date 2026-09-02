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

const competitorPlan: Array<{ name: string; recommendedCount: number }> = [
  { name: "TrustOrbit", recommendedCount: 26 },
  { name: "VendorLens", recommendedCount: 20 },
  { name: "RiskCanvas", recommendedCount: 13 },
  { name: "ThirdCheck", recommendedCount: 12 },
  { name: "AuditLoop", recommendedCount: 11 },
  { name: "VendorScope", recommendedCount: 11 },
  { name: "SafeChain", recommendedCount: 9 },
  { name: "DueTrack", recommendedCount: 9 },
  { name: "ComplyNest", recommendedCount: 7 },
  { name: "ClearVendor", recommendedCount: 6 },
  { name: "RiskDock", recommendedCount: 5 },
  { name: "ChainProof", recommendedCount: 4 },
];

const baselineOwnRecommended = new Set([0, 1, 3, 6, 9, 12, 33, 34]);
const latestOwnRecommended = new Set([0, 1, 3, 6, 15, 16, 24, 25, 33, 34]);

function percent(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function citation(name: string): Citation {
  const slug = name.toLowerCase().replace(/\s+/g, "");
  return { title: `${name} 導入実績・機能`, url: `https://${slug}.example/customer-proof`, domain: `${slug}.example` };
}

function isCompetitorRecommended(observationIndex: number, planIndex: number, count: number) {
  if (planIndex === 0) {
    const promptIndex = Math.floor(observationIndex / providerNames.length);
    const providerIndex = observationIndex % providerNames.length;
    return promptIndex < 7 || providerIndex === 0;
  }
  return ((observationIndex * 13 + planIndex * 7) % 36) < count;
}

function buildObservations(ownRecommendedIndexes: Set<number>, measuredAt: string): Observation[] {
  return prompts.flatMap((prompt, promptIndex) => providerNames.map((provider, providerIndex) => {
    const index = promptIndex * providerNames.length + providerIndex;
    const competitors = competitorPlan.filter((plan, planIndex) => isCompetitorRecommended(index, planIndex, plan.recommendedCount)).map((plan) => plan.name);
    const firstCandidate = competitors[0] || null;
    const ownRecommended = ownRecommendedIndexes.has(index);
    const recommendedEntities = [...competitors, ...(ownRecommended ? [discovery.brandName] : [])];
    const ownPosition = ownRecommended ? recommendedEntities.indexOf(discovery.brandName) + 1 : null;
    const competitorText = firstCandidate
      ? `${firstCandidate}を第一候補として挙げます。${firstCandidate}は企業規模別の導入事例、標準導入期間、審査対象、監査証跡、導入支援を比較可能な形で公開しています。`
      : "公開情報から比較可能な候補を十分に確認できませんでした。";
    const ownText = ownRecommended
      ? `${discovery.brandName}も購入候補ですが、同規模の導入実績と標準導入期間の比較材料は限定的です。`
      : `${discovery.brandName}は購入候補には入りません。公開情報から同規模の導入実績と標準導入期間を十分に確認できません。`;
    return {
      id: `obs_${index + 1}`,
      promptId: prompt.id,
      prompt: prompt.text,
      provider,
      model: `${provider}-sample`,
      repetition: 1,
      status: "success",
      rawText: `${competitorText}${ownText}`,
      citations: firstCandidate ? [citation(firstCandidate)] : [],
      recommendedEntities,
      ownRecommended,
      ownPosition,
      firstCandidate,
      startedAt: measuredAt,
      completedAt: new Date(new Date(measuredAt).getTime() + 1000).toISOString(),
      latencyMs: 1000,
      costUsd: .002,
    };
  }));
}

function modal(values: Array<string | null>) {
  const counts = new Map<string, number>();
  values.filter((value): value is string => Boolean(value)).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))[0]?.[0] || null;
}

function buildLostPrompts(observations: Observation[]) {
  return prompts.flatMap((prompt) => {
    const rows = observations.filter((item) => item.promptId === prompt.id && item.status === "success");
    const ownWins = rows.filter((item) => item.ownRecommended).length;
    if (!rows.length || ownWins >= Math.ceil(rows.length / 2)) return [];
    const winner = modal(rows.map((item) => item.firstCandidate).filter((name) => name !== discovery.brandName));
    const citations = [...new Map(rows.flatMap((item) => item.citations).map((item) => [item.url, item])).values()];
    return [{
      promptId: prompt.id,
      prompt: prompt.text,
      winner,
      summary: winner ? `${winner}がより多くのAI回答で購入候補として先に挙げられ、${discovery.brandName}は過半数の回答で候補に入りませんでした。` : `${discovery.brandName}は過半数のAI回答で購入候補に入りませんでした。`,
      citations,
      observations: rows,
    }];
  });
}

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

function buildScanResult(scanId: string, measuredAt: string, ownRecommendedIndexes: Set<number>): ScanResult {
  const observations = buildObservations(ownRecommendedIndexes, measuredAt);
  const successfulObservations = observations.filter((item) => item.status === "success").length;
  const ownRecommendationCount = observations.filter((item) => item.status === "success" && item.ownRecommended).length;
  const competitors = competitorPlan.map((plan) => {
    const recommendedCount = observations.filter((item) => item.recommendedEntities.includes(plan.name)).length;
    const firstChoiceCount = observations.filter((item) => item.firstCandidate === plan.name).length;
    return { name: plan.name, recommendedCount, firstChoiceCount, coverage: percent(recommendedCount, successfulObservations) };
  }).sort((a, b) => b.coverage - a.coverage || b.firstChoiceCount - a.firstChoiceCount || a.name.localeCompare(b.name, "ja"));
  const ownCoverage = percent(ownRecommendationCount, successfulObservations);
  const ranked = [...competitors.map((item) => ({ name: item.name, coverage: item.coverage })), { name: discovery.brandName, coverage: ownCoverage }]
    .sort((a, b) => b.coverage - a.coverage || a.name.localeCompare(b.name, "ja"));
  const firstChoiceCount = observations.filter((item) => item.firstCandidate === discovery.brandName).length;
  const mentionCount = observations.filter((item) => item.rawText.includes(discovery.brandName)).length;
  const ownCitationCount = observations.filter((item) => item.citations.some((itemCitation) => itemCitation.domain === discovery.domain)).length;
  return {
    scanId,
    targetUrl: "https://nexora.example",
    discovery,
    panel: { kind: "free", version: 1, promptCount: prompts.length, repetitions: 1, locale: "ja-JP", country: "JP" },
    measuredAt,
    observations,
    scheduledObservations: prompts.length * providerNames.length,
    successfulObservations,
    measurementCompleteness: percent(successfulObservations, prompts.length * providerNames.length),
    recommendationCoverage: ownCoverage,
    firstChoiceRate: percent(firstChoiceCount, successfulObservations),
    mentionCoverage: percent(mentionCount, successfulObservations),
    citationCoverage: percent(ownCitationCount, successfulObservations),
    repeatAgreement: 100,
    ownRecommendationCount,
    marketPosition: Math.max(1, ranked.findIndex((item) => item.name === discovery.brandName) + 1),
    marketSize: ranked.length,
    competitors,
    lostPrompts: buildLostPrompts(observations),
    evidenceGaps: gaps,
    actions,
    totalCostUsd: Number((observations.reduce((sum, item) => sum + (item.costUsd || 0), 0)).toFixed(3)),
    warnings: ["この画面は架空企業・架空競合・架空数値によるUIサンプルです。", "無料Scanは各AIを1回観測する方向性診断です。"],
  };
}

export const sampleResult: ScanResult = buildScanResult("sample_clean_room", "2026-09-01T09:00:00.000Z", baselineOwnRecommended);

export function sampleWatch(): WatchRecord {
  const latest = buildScanResult("sample_clean_room_week_2", "2026-09-08T09:00:00.000Z", latestOwnRecommended);
  return {
    id: "watch_sample",
    token: "sample",
    email: "sample@nexora.example",
    scanId: sampleResult.scanId,
    status: "trial",
    paid: false,
    baseline: sampleResult,
    latest,
    history: [sampleResult, latest],
    evidence: [],
    nextRunAt: "2026-09-15T09:00:00.000Z",
    createdAt: sampleResult.measuredAt,
    updatedAt: latest.measuredAt,
  };
}
