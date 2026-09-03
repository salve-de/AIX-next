import { buildDemandProxy } from "@/lib/demand-proxy";
import { buildMarketMap } from "@/lib/market-map";
import { derivePositioningAdvice } from "@/lib/positioning";
import type { ActionCard, AiVisibilityAudit, BuyerPrompt, Citation, CompanyDiscovery, EvidenceGap, Observation, ScanResult, WatchRecord } from "@/lib/types";

const discovery: CompanyDiscovery = {
  legalName: "あおば相続法務事務所",
  brandName: "あおば相続法務事務所",
  domain: "aoba-souzoku.example.jp",
  summary: "遺産分割・不動産相続・事業承継の個別親身な対応に特化した専門法務事務所。",
  market: "相続・遺産分割・事業承継の専門相談",
  targetCustomers: ["遺産相続や親族間トラブルに悩む個人・ご遺族", "中小企業オーナー・事業承継の後継者"],
  useCases: ["親族間の遺産分割協議", "不動産・自社株の円満相続", "他社で断られた複雑案件の解決"],
  aliases: ["あおば相続法務事務所", "あおば法務", "aoba-souzoku.example.jp"],
  competitors: [
    { name: "大手全国展開リーガルグループ", domain: "zenkoku-legal.example", reason: "全国拠点数と知名度で先行する全国チェーン", confidence: .95 },
    { name: "大手ポータル提携弁護士法人", domain: "portal-law.example", reason: "ポータル広告経由で大量集客する大手グループ", confidence: .88 },
    { name: "オンライン一括士業ネットワーク", domain: "online-shigyo.example", reason: "一括見積もり・オンライン相談を掲げる競合", confidence: .83 },
    { name: "都心総合法律事務所", domain: "toshin-law.example", reason: "法人・個人総合対応の大手事務所", confidence: .76 },
    { name: "遺産相続専門センター", domain: "souzoku-center.example", reason: "Web広告で露出の多い相続特化法人", confidence: .73 },
    { name: "中央法務グループ", domain: "chuo-legal.example", reason: "士業ネットワーク提携の大手", confidence: .71 },
    { name: "全国相続支援センター", domain: "shien-center.example", reason: "全国ネットワークの相談窓口", confidence: .69 },
    { name: "相続トラブル解決相談室", domain: "trouble-kaiketsu.example", reason: "親族紛争対応の専門窓口", confidence: .67 },
    { name: "親族承継パートナーズ", domain: "shinzoku-shoukei.example", reason: "事業承継特化の競合", confidence: .64 },
    { name: "みらい法務総合事務所", domain: "mirai-legal.example", reason: "都心部の総合法務事務所", confidence: .62 },
    { name: "東京遺産コンサルティング", domain: "tokyo-isan.example", reason: "不動産相続特化のコンサル法人", confidence: .60 },
    { name: "首都圏士業コンソーシアム", domain: "shutoken-shigyo.example", reason: "士業連携の総合相談窓口", confidence: .58 },
  ],
  confidence: .94,
};

const promptSeed: Array<[string, BuyerPrompt["cluster"], number]> = [
  ["親が亡くなり東京の実家を相続することになりました。何から手を付ければいいかわからないので、評判が良くて相談しやすい相続専門の法務事務所を教えて", "category", 5],
  ["実家の古い土地と家屋の相続で兄弟と揉めかけています。大手のような事務的・機械的な対応ではなく、親族間の複雑な事情に親身に寄り添って円満解決してくれる、東京でおすすめの相続専門の法務事務所を教えてください。", "segment", 5],
  ["遺産分割で親族間の話し合いがまとまりません。裁判で争うのではなく、間に入って円満に話し合いをまとめてくれる相続トラブルに強い事務所はどこ？", "use_case", 5],
  ["親が創業した会社の自社株と不動産を後継者に引き継ぎたい。生前贈与や相続税対策も含めてトータルで相談できる相続・事業承継の専門家は？", "feature", 5],
  ["大手の法律事務所に相談に行きましたが、事務的で冷たい印象を受けました。もっと親身に話を聞いてくれて、相談者目線で動いてくれる相続専門の法務事務所を探しています", "alternative", 4],
  ["東京で相続手続きを頼む場合、大手グループと地域密着の専門事務所ではどちらがおすすめ？ それぞれの特徴を比較して教えて", "comparison", 5],
  ["相続手続きを頼みたいのですが、追加料金がどんどん発生しないか不安です。料金体系が明確で、費用対効果が高い相続専門の法務事務所を教えて", "value", 5],
  ["相続税の申告期限が迫っていて焦っています。即日面談など短期間ですぐに初動対応してくれる相続に強い事務所はどこ？", "implementation", 4],
  ["複雑な相続の解決実績が豊富で、安心して任せられる東京都内の相続専門法務事務所は？", "trust", 5],
  ["法的な手続きだけでなく、親族関係の精神的な悩みにも親身に寄り添ってサポートしてくれる相続窓口はありますか？", "support", 4],
  ["地方にある不動産と東京の預貯金が混ざっており、相続人も全国に散らばっています。このような遠方・複数人の相続手続きも一括で対応してくれる事務所は？", "use_case", 4],
  ["親が高齢になった中小企業経営者です。会社の株式と個人資産の両方をスムーズに後継者へ引き継ぐための事業承継・相続相談先を探しています", "segment", 4],
];

const prompts: BuyerPrompt[] = promptSeed.map(([text, cluster, importance], index) => ({ id: `prompt_${index + 1}`, text, cluster, importance, panel: "free", version: 1 }));
const providerNames: Observation["provider"][] = ["openai", "gemini", "perplexity"];

const competitorPlan: Array<{ name: string; recommendedCount: number }> = [
  { name: "大手全国展開リーガルグループ", recommendedCount: 26 },
  { name: "大手ポータル提携弁護士法人", recommendedCount: 20 },
  { name: "オンライン一括士業ネットワーク", recommendedCount: 13 },
  { name: "都心総合法律事務所", recommendedCount: 12 },
  { name: "遺産相続専門センター", recommendedCount: 11 },
  { name: "中央法務グループ", recommendedCount: 11 },
  { name: "全国相続支援センター", recommendedCount: 9 },
  { name: "相続トラブル解決相談室", recommendedCount: 9 },
  { name: "親族承継パートナーズ", recommendedCount: 7 },
  { name: "みらい法務総合事務所", recommendedCount: 6 },
  { name: "東京遺産コンサルティング", recommendedCount: 5 },
  { name: "首都圏士業コンソーシアム", recommendedCount: 4 },
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
      summary: winner ? `AIは${winner}を先に勧め、自社はこの質問で候補外でした。` : "自社はこの質問で候補に入りませんでした。",
      citations,
      observations: rows,
    }];
  });
}

const gaps: EvidenceGap[] = [
  { id: "segment-proof", label: "親身な個別伴走と解決実績", whyItMatters: "複雑な親族間トラブルや不動産相続を個別親身に解決した実績が、AIに伝わっていません。", relatedPromptIds: prompts.slice(0, 10).map((item) => item.id), relatedPromptCount: 10, competitorEvidence: "大手リーガルグループは全国拠点数と形式的な解決数を前面に出しています。", confidence: .91, status: "missing" },
  { id: "implementation-time", label: "即日相談・初動対応スピード", whyItMatters: "急を要する相談者が知りたい「即日面談や初動対応の流れ」が公開情報で不足しています。", relatedPromptIds: prompts.slice(1, 9).map((item) => item.id), relatedPromptCount: 8, competitorEvidence: "大手ポータル提携先は初動対応フローを明記しています。", confidence: .87, status: "missing" },
  { id: "operational-proof", label: "明瞭な報酬体系と費用目安", whyItMatters: "着手金や報酬の明確な目安が、比較検討している相談者に見えていません。", relatedPromptIds: prompts.slice(4, 10).map((item) => item.id), relatedPromptCount: 6, competitorEvidence: "オンライン士業は定額プランや見積もり例を載せています。", confidence: .79, status: "partial" },
];

const actions: ActionCard[] = [
  { id: "action-segment-proof", title: "親身な個別解決の事例を、比べられる形で載せる", rationale: "10問で、親身な個別対応の実績がAIに確認できませんでした。", type: "owned", relatedPromptIds: gaps[0].relatedPromptIds, relatedPromptCount: 10, priority: "critical", confidence: .91, target: "解決実績・事務所案内", audience: "相続トラブルに悩む個人・親族", stage: "比較", customerConcern: "親身に相談に乗ってくれるか", placement: "解決事例・事務所概要", cta: "個別相談の流れを確認する", successMetric: "親身な相談の比較質問で自社が候補に入ったか", evidenceType: "observed" },
  { id: "action-implementation", title: "即日相談と初動対応の流れを明記する", rationale: "初動対応の早さが、8問で判断材料として足りませんでした。", type: "owned", relatedPromptIds: gaps[1].relatedPromptIds, relatedPromptCount: 8, priority: "high", confidence: .87, target: "相談の流れ・FAQ", audience: "今すぐ相談したい相談者", stage: "導入", customerConcern: "いつ相談できるか", placement: "相談の流れ・FAQ", cta: "初動対応を確認する", successMetric: "即日相談に関する質問で自社が候補に入ったか", evidenceType: "observed" },
  { id: "action-third-party", title: "公式の紹介ページでAIへの認知を確立する", rationale: "大手に対抗するため、AIが参照しやすい公式情報を整えます。", type: "third_party", relatedPromptIds: prompts.slice(3, 8).map((item) => item.id), relatedPromptCount: 5, priority: "medium", confidence: .72, target: "AI公式データベース", audience: "専門家を探している相談者", stage: "検討", customerConcern: "信頼できる事務所か", placement: "AI公式ページ", cta: "公式情報を確認する", successMetric: "AIでの推薦回数が増加したか", evidenceType: "hypothesis" },
];

function sampleVisibilityAudit(measuredAt: string): AiVisibilityAudit {
  return {
    generatedAt: measuredAt,
    readiness: "needs-review",
    priorityCheckId: "proof",
    crawl: {
      robotsTxtFound: true,
      sitemapFound: true,
      sitemapUrl: "https://aoba-souzoku.example.jp/sitemap.xml",
      attempted: 8,
      pagesCrawled: 8,
      pagesBlockedByRobots: 0,
      pagesNoindex: 0,
      pagesMissingCanonical: 0,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 3,
      pagesMissingTitle: 0,
      pagesMissingDescription: 0,
      pagesMissingH1: 0,
      aiSearchBotAllowed: true,
      gptBotAllowed: true,
    },
    checks: [
      { id: "crawler-access", group: "access", status: "ready", title: "AI検索が公開ページを読める", detail: "公開ページを取得できる設定です。", action: "この設定を維持する" },
      { id: "indexability", group: "access", status: "ready", title: "重要ページが検索対象になっている", detail: "重要ページにnoindexはありません。", action: "重要ページのindex設定を定期確認する" },
      { id: "sitemap", group: "access", status: "ready", title: "更新ページを知らせる入口がある", detail: "sitemap.xmlを取得できました。", action: "sitemapのURLと内容を定期確認する" },
      { id: "structured-data", group: "clarity", status: "ready", title: "事務所の情報を機械にも説明できる", detail: "JSON-LD構造化データを確認できました。", action: "見える本文と構造化データの内容をそろえる" },
      { id: "entity-clarity", group: "clarity", status: "ready", title: "事務所と専門分野の関係が分かる", detail: "事務所情報と取扱分野を公開ページで確認しました。", action: "見える事務所情報と専門分野をそろえる" },
      { id: "buyer-facts", group: "clarity", status: "review", title: "相談前に知りたい情報がそろっている", detail: "初動対応や相談の流れがAIに十分伝わっていません。", action: "相談の流れと費用目安を公開する" },
      { id: "proof", group: "proof", status: "missing", title: "親身な解決実績がAIに伝わっている", detail: "複雑な相続を円満解決した実績がAIに認識されていません。", action: "個人情報を伏せた解決事例を公開する" },
      { id: "measurement", group: "measurement", status: "ready", title: "同じ質問で変化を確かめられる", detail: "12問を同じ条件で確認しました。", action: "変更後も同じ質問で再測定する" },
    ],
  };
}

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
  const result: ScanResult = {
    scanId,
    targetUrl: "https://aoba-souzoku.example.jp",
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
    visibilityAudit: sampleVisibilityAudit(measuredAt),
    totalCostUsd: Number((observations.reduce((sum, item) => sum + (item.costUsd || 0), 0)).toFixed(3)),
    warnings: ["この画面は架空企業・架空競合・架空数値によるUIサンプルです。", "無料Scanは各AIを1回観測する方向性診断です。"],
  };
  result.marketMap = buildMarketMap({ result, generatedAt: measuredAt });
  result.demandProxy = buildDemandProxy({ result, generatedAt: measuredAt });
  result.positioning = derivePositioningAdvice(result);
  return result;
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
