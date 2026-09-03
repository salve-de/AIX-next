import type { BuyerPrompt, BuyerPromptIntent, BuyerPromptStage, DemandProxy, DemandProxySignal, ScanResult } from "@/lib/types";

type DemandProxyInput = ScanResult | { result: ScanResult; generatedAt?: string };

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function round(value: number) {
  return Math.round(clamp(value));
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("ja-JP")
    .normalize("NFKC")
    .replace(/(?:株式会社|合同会社|有限会社)/g, "")
    .replace(/(?:\binc\.?\b|\bcorp\.?\b|\bcorporation\b|\bllc\b|\bltd\.?\b)/gi, "")
    .replace(/[\s・･_\-—–/（）(),.]/g, "")
    .trim();
}

function unpack(input: DemandProxyInput) {
  if ("result" in input) return { result: input.result, generatedAt: input.generatedAt };
  return { result: input, generatedAt: undefined };
}

const intentByCluster: Record<BuyerPrompt["cluster"], BuyerPromptIntent> = {
  category: "discover",
  segment: "evaluate",
  use_case: "evaluate",
  feature: "evaluate",
  alternative: "switch",
  comparison: "compare",
  value: "compare",
  implementation: "implement",
  trust: "evaluate",
  support: "evaluate",
};

const stageByIntent: Record<BuyerPromptIntent, BuyerPromptStage> = {
  discover: "認知",
  compare: "比較",
  evaluate: "検討",
  switch: "比較",
  implement: "導入",
};

const commercialWeight: Record<BuyerPromptIntent, number> = {
  discover: 20,
  compare: 65,
  evaluate: 80,
  switch: 90,
  implement: 85,
};

const defaultUrgency: Record<BuyerPromptIntent, number> = {
  discover: 2,
  compare: 3,
  evaluate: 3,
  switch: 4,
  implement: 4,
};

function fallbackPrompts(result: ScanResult): BuyerPrompt[] {
  const seen = new Set<string>();
  return result.observations.flatMap((observation) => {
    if (seen.has(observation.promptId)) return [];
    seen.add(observation.promptId);
    const cluster = inferCluster(observation.prompt);
    return [{
      id: observation.promptId,
      text: observation.prompt,
      cluster,
      importance: 3,
      panel: result.panel.kind,
      version: result.panel.version,
    }];
  });
}

function inferCluster(prompt: string): BuyerPrompt["cluster"] {
  if (/比較|主要\s*\d+社|比べ/i.test(prompt)) return "comparison";
  if (/費用対効果|コスパ|費用|価格|料金/i.test(prompt)) return "value";
  if (/乗り換え|Excel|スプレッドシート|代替/i.test(prompt)) return "alternative";
  if (/導入|短期間|いつから|始め|即日|すぐに|急ぎ|スピード/i.test(prompt)) return "implementation";
  if (/監査|信頼|安全|証跡|認証/i.test(prompt)) return "trust";
  if (/支援|サポート|問い合わせ/i.test(prompt)) return "support";
  if (/従業員|企業規模|部門|担当者|向け/i.test(prompt)) return "segment";
  if (/海外|継続|監視|更新/i.test(prompt)) return "use_case";
  if (/機能|まとめて|対応|確認できる/i.test(prompt)) return "feature";
  return "category";
}

function isOwnName(value: string, result: ScanResult) {
  const key = normalize(value);
  return [result.discovery.brandName, result.discovery.legalName, result.discovery.domain, ...result.discovery.aliases]
    .map(normalize)
    .filter(Boolean)
    .some((alias) => alias === key || (alias.length > 3 && key.includes(alias)));
}

function signalForPrompt(prompt: BuyerPrompt, result: ScanResult, lostPromptIds: Set<string>): DemandProxySignal {
  const intent = prompt.intent || intentByCluster[prompt.cluster];
  const stage = prompt.stage || stageByIntent[intent];
  const importance = clamp(Number(prompt.importance), 1, 5);
  const urgency = clamp(Number(prompt.urgency ?? defaultUrgency[intent]), 1, 5);
  const rows = result.observations.filter((observation) => observation.promptId === prompt.id);
  const successful = rows.filter((observation) => observation.status === "success");
  const ownRecommended = successful.filter((observation) => observation.ownRecommended).length;
  const ownFirst = successful.filter((observation) => observation.firstCandidate && isOwnName(observation.firstCandidate, result)).length;
  const ownRecommendationRate = round(successful.length ? (ownRecommended / successful.length) * 100 : 0);
  const firstChoiceRate = round(successful.length ? (ownFirst / successful.length) * 100 : 0);
  const lostPrompt = lostPromptIds.has(prompt.id);

  // This is a transparent prioritization heuristic, not an estimate of the
  // number of searches or buyers. Keep the components visible in `detail`.
  const importanceScore = ((importance - 1) / 4) * 100;
  const urgencyScore = ((urgency - 1) / 4) * 100;
  const score = round(
    importanceScore * .35
      + urgencyScore * .20
      + commercialWeight[intent] * .30
      + (lostPrompt ? 100 : 0) * .10
      + (successful.length ? 100 : 0) * .05,
  );
  const label = `${stage}の質問 — ${prompt.text}`;
  const value = lostPrompt
    ? "この質問では自社より先に別の候補が選ばれています"
    : successful.length && ownRecommendationRate > 0
      ? `この質問では自社が${ownRecommendationRate}%の回答で候補に入りました`
      : successful.length
        ? "この質問では自社が候補に入りませんでした"
        : "この質問はまだ測定できていません";
  const detail = successful.length
    ? `${successful.length}件のAI回答を確認。自社の候補入り${ownRecommendationRate}%・第一候補${firstChoiceRate}%。重要度${importance}/5、緊急度${urgency}/5、${lostPrompt ? "失注あり" : "失注判定なし"}から、次に確認する優先度を算出しています。検索数や売上の実測値ではありません。`
    : `この質問の成功したAI回答はありません。重要度${importance}/5、緊急度${urgency}/5、意図「${intent}」から仮の優先度を算出しています。再測定するまで需要の有無は判断できません。`;
  const nextAction = lostPrompt || (successful.length > 0 && ownRecommendationRate < 50)
    ? "この質問で選ばれる根拠を公開情報から確認し、改善後に同じ質問を再測定する"
    : successful.length
      ? "この質問で選ばれた理由を保ち、変更後も同じ条件で確認する"
      : "AI回答を再取得して、この質問の傾向を確認する";

  return {
    label,
    value,
    detail,
    confidence: successful.length ? "observed" : "inferred",
    id: `demand:${prompt.id}`,
    promptId: prompt.id,
    prompt: prompt.text,
    cluster: prompt.cluster,
    stage,
    intent,
    priorityScore: score,
    importance,
    urgency,
    successfulObservations: successful.length,
    ownRecommendationRate,
    firstChoiceRate,
    lostPrompt,
    nextAction,
  };
}

/**
 * Converts buyer questions and their observed AI outcomes into a small demand
 * proxy. It intentionally does not call keyword, CRM, analytics, or ad APIs:
 * the score ranks questions to investigate based on the current scan only.
 */
export function buildDemandProxy(input: DemandProxyInput): DemandProxy {
  const { result, generatedAt } = unpack(input);
  const prompts = result.prompts?.length ? result.prompts : fallbackPrompts(result);
  const lostPromptIds = new Set(result.lostPrompts.map((lostPrompt) => lostPrompt.promptId));
  const signals = prompts.map((prompt) => signalForPrompt(prompt, result, lostPromptIds));
  const priorityPrompts = [...signals]
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0) || a.promptId!.localeCompare(b.promptId!))
    .slice(0, 5)
    .map((signal) => ({ promptId: signal.promptId!, label: signal.label, score: signal.priorityScore || 0 }));
  const successfulPromptCount = signals.filter((signal) => (signal.successfulObservations || 0) > 0).length;

  return {
    signals,
    priorityPrompts,
    generatedAt: generatedAt || result.measuredAt || new Date().toISOString(),
    measuredPromptCount: prompts.length,
    successfulPromptCount,
    lostPromptCount: lostPromptIds.size,
    limitations: [
      "この一覧は今回のAI回答と質問設計から作った需要の手掛かりです。検索ボリューム、顧客数、購入確率、売上を測定したものではありません。",
      "外部接続がないため、GA4・Search Console・広告・CRMの実績は含みません。",
      "priorityPromptsのscoreは、重要度・緊急度・購入に近い質問か・今回の失注・測定有無を合成した相対優先度です。",
    ],
  };
}
