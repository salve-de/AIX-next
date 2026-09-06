import { buildDemandProxy } from "@/lib/demand-proxy";
import { buildMarketMap } from "@/lib/market-map";
import { derivePositioningAdvice } from "@/lib/positioning";
import type {
  ActionCard,
  AiVisibilityAudit,
  BuyerPrompt,
  Citation,
  CompanyDiscovery,
  EvidenceGap,
  Observation,
  ScanResult,
  WatchRecord,
} from "@/lib/types";

/**
 * These values are deterministic fixtures for local UI/tests only.
 * They are not observations from an AI provider, a business directory, or a
 * company website. Keep the warning on every generated result so a fixture
 * cannot be mistaken for a production measurement.
 */
const FIXTURE_WARNING = "画面確認用の架空データです。実在企業の情報・AI回答・推薦・実績を示しません。";
const FIXTURE_SOURCE_NOTE = "設計見本の固定値。実在企業の評価・比較事実ではありません。";
const FIXTURE_DATE = "2026-09-01T09:00:00.000Z";
const providerNames: Observation["provider"][] = ["openai", "gemini", "perplexity"];

type FixtureCompetitor = { name: string; recommendedCount: number };

type FixtureProfile = {
  market: string;
  summary: string;
  targetCustomers: string[];
  useCases: string[];
  competitors: FixtureCompetitor[];
  promptSeed: Array<[string, BuyerPrompt["cluster"], number]>;
  gaps: Array<Pick<EvidenceGap, "id" | "label" | "whyItMatters" | "confidence" | "status">>;
  actions: Array<Pick<ActionCard, "id" | "title" | "rationale" | "target" | "audience" | "stage" | "customerConcern" | "placement" | "cta" | "successMetric">>;
};

const primaryFixtureCompetitors: FixtureCompetitor[] = [
  { name: "サンプル候補A", recommendedCount: 21 },
  { name: "サンプル候補B", recommendedCount: 12 },
  { name: "サンプル候補C", recommendedCount: 12 },
  { name: "サンプル候補D", recommendedCount: 12 },
  { name: "サンプル候補E", recommendedCount: 12 },
  { name: "サンプル候補F", recommendedCount: 12 },
  { name: "サンプル候補G", recommendedCount: 9 },
  { name: "サンプル候補H", recommendedCount: 9 },
  { name: "サンプル候補I", recommendedCount: 6 },
  { name: "サンプル候補J", recommendedCount: 6 },
  { name: "サンプル候補K", recommendedCount: 6 },
  { name: "サンプル候補L", recommendedCount: 6 },
];

const genericFixtureCompetitors: FixtureCompetitor[] = [
  { name: "比較候補A", recommendedCount: 21 },
  { name: "比較候補B", recommendedCount: 12 },
  { name: "比較候補C", recommendedCount: 12 },
  { name: "比較候補D", recommendedCount: 12 },
  { name: "比較候補E", recommendedCount: 12 },
  { name: "比較候補F", recommendedCount: 12 },
  { name: "比較候補G", recommendedCount: 9 },
  { name: "比較候補H", recommendedCount: 9 },
  { name: "比較候補I", recommendedCount: 6 },
  { name: "比較候補J", recommendedCount: 6 },
  { name: "比較候補K", recommendedCount: 6 },
  { name: "比較候補L", recommendedCount: 6 },
];

const primaryPromptSeed: FixtureProfile["promptSeed"] = [
  ["相続・遺産分割・事業承継の専門相談を探す人が確認できる情報は？", "category", 5],
  ["親族間の遺産分割協議について相談先を比較したい", "use_case", 5],
  ["不動産・自社株の円満相続について相談できる窓口は？", "feature", 5],
  ["初回相談で確認しておきたい対応範囲は？", "implementation", 4],
  ["相続手続きの相談先を選ぶときの比較項目は？", "comparison", 4],
  ["遠方の相続人がいる場合に確認する条件は？", "use_case", 4],
  ["相談前に公開情報から確認できる費用項目は？", "value", 4],
  ["相続・事業承継の相談先を探すときの注意点は？", "trust", 4],
  ["不動産を含む相続の相談で確認できる専門分野は？", "segment", 3],
  ["手続きの進め方を比較するために必要な情報は？", "implementation", 3],
  ["相談窓口の受付方法を確認できる公開ページは？", "support", 3],
  ["相続に関する公開情報を確認して相談先を決めたい", "category", 3],
];

const genericPromptSeed: FixtureProfile["promptSeed"] = [
  ["この事業者が扱う分野を確認できる公開情報は？", "category", 5],
  ["初めて利用する人が確認したい対象と条件は？", "use_case", 5],
  ["事業者を比較するときに確認できる項目は？", "comparison", 5],
  ["提供内容を確認できる一次情報は？", "feature", 4],
  ["利用前に確認したい手続きや進め方は？", "implementation", 4],
  ["対応範囲を公開情報から確認したい", "segment", 4],
  ["料金や条件を確認するときの注意点は？", "value", 4],
  ["相談先を選ぶ前に確認できる根拠は？", "trust", 4],
  ["受付方法と問い合わせ先を確認できるページは？", "support", 3],
  ["このサービスの利用目的を確認したい", "category", 3],
  ["導入前に確認できる公開資料は？", "implementation", 3],
  ["公開情報を比較して候補を整理したい", "alternative", 3],
];

function fixtureProfile(brandName: string, primary: boolean): FixtureProfile {
  if (primary) {
    return {
      market: "相続・遺産分割・事業承継の専門相談",
      summary: `${brandName}を表示した画面確認用の架空シナリオです。実在の事務所情報、対応実績、AI回答、推薦結果ではありません。`,
      targetCustomers: ["相続・遺産分割の相談先を探している人", "事業承継や不動産・自社株の整理を検討している人"],
      useCases: ["親族間の遺産分割協議", "不動産・自社株の円満相続", "相続・遺産分割・事業承継の専門相談"],
      competitors: primaryFixtureCompetitors,
      promptSeed: primaryPromptSeed,
      gaps: [
        { id: "source", label: "参照元と更新日", whyItMatters: "公開情報の出どころと更新状況を確認するための項目です。", confidence: 0.5, status: "partial" },
        { id: "scope", label: "対応範囲", whyItMatters: "対象・条件・受付方法を事実と参照元に分けて確認するための項目です。", confidence: 0.5, status: "missing" },
        { id: "process", label: "利用手順", whyItMatters: "利用前に確認できる手順が記載されているかを確認するための項目です。", confidence: 0.5, status: "partial" },
      ],
      actions: [
        { id: "action-source", title: "参照元と更新日をそろえる", rationale: "設計見本の測定ログに対する整理案です。実際の掲載前に参照元を確認してください。", target: "公開情報の整理", audience: "公開情報を確認したい人", stage: "認知", customerConcern: "情報の出どころが分かるか", placement: "公開プロフィール", cta: "参照元を確認する", successMetric: "同じ質問パネルで参照元の変化を確認できるか" },
        { id: "action-scope", title: "対象と対応範囲を明記する", rationale: "設計見本の測定ログに対する整理案です。未確認の条件は追加しません。", target: "公開情報の整理", audience: "比較条件を確認したい人", stage: "比較", customerConcern: "自分の条件に合うか", placement: "概要・サービス案内", cta: "公開内容を確認する", successMetric: "同じ質問で対象と条件を確認できるか" },
        { id: "action-process", title: "利用手順と問い合わせ方法を明記する", rationale: "設計見本の測定ログに対する整理案です。実際の手順と一致するか確認してください。", target: "公開情報の整理", audience: "利用前に手順を確認したい人", stage: "検討", customerConcern: "次に何をすればよいか", placement: "手順・問い合わせ", cta: "手順を確認する", successMetric: "同じ質問で受付方法を確認できるか" },
      ],
    };
  }

  return {
    market: "業務サービス（設計見本）",
    summary: `${brandName || "入力名称"}を表示した画面確認用の架空シナリオです。実在の企業情報、業務内容、AI回答、推薦結果ではありません。`,
    targetCustomers: ["公開情報を確認したい人"],
    useCases: ["公開内容の確認", "比較項目の整理", "参照元の確認"],
    competitors: genericFixtureCompetitors,
    promptSeed: genericPromptSeed,
    gaps: [
      { id: "source", label: "参照元と更新日", whyItMatters: "公開情報の出どころと更新状況を確認するための項目です。", confidence: 0.5, status: "partial" },
      { id: "scope", label: "対象と条件", whyItMatters: "対象・条件・受付方法を事実と参照元に分けて確認するための項目です。", confidence: 0.5, status: "missing" },
      { id: "process", label: "利用手順", whyItMatters: "利用前に確認できる手順が記載されているかを確認するための項目です。", confidence: 0.5, status: "partial" },
    ],
    actions: [
      { id: "action-source", title: "参照元と更新日を確認する", rationale: "設計見本の測定ログに対する整理案です。実際の掲載前に参照元を確認してください。", target: "公開情報の整理", audience: "公開情報を確認したい人", stage: "認知", customerConcern: "情報の出どころが分かるか", placement: "公開プロフィール", cta: "参照元を確認する", successMetric: "同じ質問パネルで参照元の変化を確認できるか" },
        { id: "action-scope", title: "対象と条件を確認する", rationale: "設計見本の測定ログに対する整理案です。未確認の条件は追加しません。", target: "公開情報の整理", audience: "比較条件を確認したい人", stage: "比較", customerConcern: "自分の条件に合うか", placement: "概要・サービス案内", cta: "公開内容を確認する", successMetric: "同じ質問で対象と条件を確認できるか" },
        { id: "action-process", title: "利用手順を確認する", rationale: "設計見本の測定ログに対する整理案です。実際の手順と一致するか確認してください。", target: "公開情報の整理", audience: "利用前に手順を確認したい人", stage: "検討", customerConcern: "次に何をすればよいか", placement: "手順・問い合わせ", cta: "手順を確認する", successMetric: "同じ質問で受付方法を確認できるか" },
      ],
  };
}

function slugFor(brandName: string) {
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "sample-company";
}

function percent(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

function fixtureCitation(name: string, index: number): Citation {
  const candidateSlug = `candidate-${String(index + 1).padStart(2, "0")}`;
  return {
    title: `${name}（設計見本の比較候補）`,
    url: `https://${candidateSlug}.example/`,
    domain: `${candidateSlug}.example`,
  };
}

function isCompetitorRecommended(observationIndex: number, planIndex: number, count: number) {
  if (planIndex === 0) {
    // Seven prompts contain the first fixed candidate, which keeps the
    // historical fixture assertion deterministic without claiming a real rank.
    return Math.floor(observationIndex / providerNames.length) < 7;
  }
  // A permutation of 0..35 gives each fixture candidate the requested count.
  return ((observationIndex * 13 + planIndex * 7) % 36) < count;
}

function modal(values: Array<string | null>) {
  const counts = new Map<string, number>();
  values.filter((value): value is string => Boolean(value)).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja"))[0]?.[0] || null;
}

function fixtureVisibilityAudit(domain: string, measuredAt: string): AiVisibilityAudit {
  return {
    generatedAt: measuredAt,
    readiness: "needs-review",
    priorityCheckId: "source",
    crawl: {
      robotsTxtFound: false,
      sitemapFound: false,
      sitemapUrl: `https://${domain}/sitemap.xml`,
      attempted: 0,
      pagesCrawled: 0,
      pagesBlockedByRobots: 0,
      pagesNoindex: 0,
      pagesMissingCanonical: 0,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 0,
      pagesMissingTitle: 0,
      pagesMissingDescription: 0,
      pagesMissingH1: 0,
      aiSearchBotAllowed: false,
      gptBotAllowed: false,
    },
    checks: [
      { id: "crawler-access", group: "access", status: "review", title: "公開ページの取得状態", detail: "これは設計見本です。実サイトへの取得は行っていません。", action: "実サイトを指定して確認する" },
      { id: "indexability", group: "access", status: "review", title: "公開範囲", detail: "設計見本のため、実サイトのindex設定は判定していません。", action: "実サイトの公開設定を確認する" },
      { id: "sitemap", group: "access", status: "review", title: "サイトマップ", detail: "設計見本のため、実サイトのsitemapは取得していません。", action: "実サイトのsitemapを確認する" },
      { id: "structured-data", group: "clarity", status: "review", title: "構造化データ", detail: "設計見本のため、実サイトの構造化データは判定していません。", action: "表示本文と構造化データを確認する" },
      { id: "entity-clarity", group: "clarity", status: "review", title: "名称と分野の対応", detail: "設計見本のため、実サイトの記載は判定していません。", action: "名称・分野・参照元を確認する" },
      { id: "buyer-facts", group: "clarity", status: "review", title: "確認できる条件", detail: "設計見本のため、実サイトの条件は判定していません。", action: "対象・条件・受付方法を確認する" },
      { id: "proof", group: "proof", status: "review", title: "事実の根拠", detail: "設計見本のため、実績や資格の根拠は判定していません。", action: "参照元ページを確認する" },
      { id: "measurement", group: "measurement", status: "review", title: "同じ条件での再測定", detail: "固定の架空回答ログを表示しています。実測値ではありません。", action: "実サイトを指定して再測定する" },
    ],
  };
}

function buildScanResultInternal(brandName: string, scanId: string, measuredAt: string, ownRecommendedIndexes: Set<number>, primary: boolean): ScanResult {
  const displayName = brandName || "入力名称";
  const profile = fixtureProfile(displayName, primary);
  const domain = primary ? "aoba-souzoku.example" : `${slugFor(displayName)}.example`;

  const discovery: CompanyDiscovery = {
    legalName: displayName,
    brandName: displayName,
    domain,
    summary: profile.summary,
    market: profile.market,
    targetCustomers: profile.targetCustomers,
    useCases: profile.useCases,
    aliases: [displayName, domain],
    competitors: profile.competitors.map((candidate, index) => ({
      name: candidate.name,
      domain: `candidate-${String(index + 1).padStart(2, "0")}.example`,
      reason: FIXTURE_SOURCE_NOTE,
      confidence: 0.5,
    })),
    confidence: 0.5,
  };

  const prompts: BuyerPrompt[] = profile.promptSeed.map(([text, cluster, importance], index) => ({
    id: `prompt_${index + 1}`,
    text,
    cluster,
    importance,
    panel: "free",
    version: 1,
  }));

  const observations: Observation[] = prompts.flatMap((prompt, promptIndex) =>
    providerNames.map((provider, providerIndex) => {
      const index = promptIndex * providerNames.length + providerIndex;
      const candidateNames = profile.competitors
        .filter((candidate, candidateIndex) => isCompetitorRecommended(index, candidateIndex, candidate.recommendedCount))
        .map((candidate) => candidate.name);
      const firstCandidate = candidateNames[0] || null;
      const ownRecommended = ownRecommendedIndexes.has(index);
      const recommendedEntities = [...candidateNames, ...(ownRecommended ? [displayName] : [])];
      const ownPosition = ownRecommended ? recommendedEntities.indexOf(displayName) + 1 : null;
      const answer = [
        "設計見本の固定回答ログです。実際のプロバイダー回答ではありません。",
        candidateNames.length ? `候補文字列: ${candidateNames.join("、")}` : "候補文字列: なし",
        ownRecommended ? `${displayName}を候補文字列に含めています。` : `${displayName}は候補文字列に含めていません。`,
      ].join(" ");

      return {
        id: `obs_${index + 1}`,
        promptId: prompt.id,
        prompt: prompt.text,
        provider,
        model: `fixture-${provider}`,
        repetition: 1,
        status: "success" as const,
        rawText: answer,
        citations: firstCandidate ? [fixtureCitation(firstCandidate, profile.competitors.findIndex((candidate) => candidate.name === firstCandidate))] : [],
        recommendedEntities,
        ownRecommended,
        ownPosition,
        firstCandidate,
        startedAt: measuredAt,
        completedAt: measuredAt,
        latencyMs: 0,
        costUsd: 0,
      };
    })
  );

  const successfulObservations = observations.filter((item) => item.status === "success").length;
  const ownRecommendationCount = observations.filter((item) => item.status === "success" && item.ownRecommended).length;
  const competitors = profile.competitors.map((candidate) => {
    const recommendedCount = observations.filter((item) => item.recommendedEntities.includes(candidate.name)).length;
    const firstChoiceCount = observations.filter((item) => item.firstCandidate === candidate.name).length;
    return { name: candidate.name, recommendedCount, firstChoiceCount, coverage: percent(recommendedCount, successfulObservations) };
  });
  const ownCoverage = percent(ownRecommendationCount, successfulObservations);
  const ranked = [...competitors.map((item) => ({ name: item.name, coverage: item.coverage })), { name: displayName, coverage: ownCoverage }]
    .sort((a, b) => b.coverage - a.coverage || a.name.localeCompare(b.name, "ja"));
  const firstChoiceCount = observations.filter((item) => item.firstCandidate === displayName).length;
  const mentionCount = observations.filter((item) => item.rawText.includes(displayName)).length;
  const ownCitationCount = observations.filter((item) => item.citations.some((itemCitation) => itemCitation.domain === domain)).length;

  const lostPrompts = prompts.flatMap((prompt) => {
    const rows = observations.filter((item) => item.promptId === prompt.id && item.status === "success");
    const ownWins = rows.filter((item) => item.ownRecommended).length;
    if (!rows.length || ownWins >= Math.ceil(rows.length / 2)) return [];
    const winner = modal(rows.map((item) => item.firstCandidate).filter((name) => name !== displayName));
    const citations = [...new Map(rows.flatMap((item) => item.citations).map((item) => [item.url, item])).values()];
    return [{
      promptId: prompt.id,
      prompt: prompt.text,
      winner,
      summary: winner ? `設計見本のログでは${winner}が候補文字列に含まれ、自社はこの質問で含まれていません。` : "設計見本のログでは自社が候補文字列に含まれていません。",
      citations,
      observations: rows,
    }];
  });

  const fullActions: ActionCard[] = profile.actions.map((action, index) => ({
    ...action,
    type: "positioning" as const,
    relatedPromptIds: prompts.slice(0, 8).map((prompt) => prompt.id),
    relatedPromptCount: 8,
    priority: index === 0 ? "critical" as const : index === 1 ? "high" as const : "medium" as const,
    confidence: 0.5,
    effort: "medium" as const,
    evidenceType: "hypothesis" as const,
  }));

  const fullGaps: EvidenceGap[] = profile.gaps.map((gap) => ({
    ...gap,
    relatedPromptIds: prompts.slice(0, 10).map((prompt) => prompt.id),
    relatedPromptCount: 10,
    competitorEvidence: FIXTURE_SOURCE_NOTE,
  }));

  const result: ScanResult = {
    scanId,
    targetUrl: `https://${domain}/`,
    discovery,
    panel: { kind: "free", version: 1, promptCount: prompts.length, repetitions: 1, locale: "ja-JP", country: "JP" },
    prompts,
    measuredAt,
    observations,
    scheduledObservations: prompts.length * providerNames.length,
    successfulObservations,
    measurementCompleteness: percent(successfulObservations, prompts.length * providerNames.length),
    recommendationCoverage: ownCoverage,
    firstChoiceRate: percent(firstChoiceCount, successfulObservations),
    mentionCoverage: percent(mentionCount, successfulObservations),
    citationCoverage: percent(ownCitationCount, successfulObservations),
    repeatAgreement: 0,
    ownRecommendationCount,
    marketPosition: Math.max(1, ranked.findIndex((item) => item.name === displayName) + 1),
    marketSize: ranked.length,
    competitors,
    lostPrompts,
    evidenceGaps: fullGaps,
    actions: fullActions,
    visibilityAudit: fixtureVisibilityAudit(domain, measuredAt),
    totalCostUsd: 0,
    warnings: [FIXTURE_WARNING, "比較候補の名称・数値・参照元URLは固定テスト値です。実在企業の推薦や市場シェアを示しません。"],
  };

  result.marketMap = buildMarketMap({ result, generatedAt: measuredAt });
  result.demandProxy = buildDemandProxy({ result, generatedAt: measuredAt });
  result.positioning = derivePositioningAdvice(result);
  return result;
}

const baselineOwnRecommended = new Set([0, 1, 3, 6, 9, 12, 33, 34]);
const latestOwnRecommended = new Set([0, 1, 3, 6, 15, 16, 24, 25, 33, 34]);

export const sampleResult: ScanResult = buildScanResultInternal(
  "あおば相続法務事務所",
  "sample_clean_room",
  FIXTURE_DATE,
  baselineOwnRecommended,
  true
);

/**
 * Dynamic samples are generic fixtures, never a copy of the named primary
 * fixture. This keeps `?sample=1&brand=...` useful for layout checks without
 * presenting another company's facts under an arbitrary name.
 */
export function buildDynamicScanResult(brandName: string, measuredAt = FIXTURE_DATE): ScanResult {
  return buildScanResultInternal(brandName.trim() || "入力名称", "sample_dynamic", measuredAt, baselineOwnRecommended, false);
}

export function sampleWatch(brandName?: string): WatchRecord {
  const base = brandName
    ? buildDynamicScanResult(brandName, FIXTURE_DATE)
    : sampleResult;
  const latest = brandName
    ? buildScanResultInternal(brandName.trim() || "入力名称", "sample_dynamic_week_2", "2026-09-08T09:00:00.000Z", latestOwnRecommended, false)
    : buildScanResultInternal("あおば相続法務事務所", "sample_clean_room_week_2", "2026-09-08T09:00:00.000Z", latestOwnRecommended, true);

  return {
    id: "watch_sample",
    token: "sample",
    email: "sample@example.invalid",
    scanId: base.scanId,
    status: "trial",
    paid: false,
    baseline: base,
    latest,
    history: [base, latest],
    evidence: [],
    nextRunAt: "2026-09-15T09:00:00.000Z",
    createdAt: base.measuredAt,
    updatedAt: latest.measuredAt,
  };
}
