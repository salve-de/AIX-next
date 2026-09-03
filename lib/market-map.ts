import type { MarketMap, MarketMapNode, ScanResult } from "@/lib/types";

type MarketMapInput = ScanResult | { result: ScanResult; generatedAt?: string };

type CandidateEvidence = {
  name: string;
  count: number;
  lostPromptCount: number;
  sourceUrls: Set<string>;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase("ja-JP")
    .normalize("NFKC")
    .replace(/(?:株式会社|合同会社|有限会社)/g, "")
    .replace(/(?:\binc\.?\b|\bcorp\.?\b|\bcorporation\b|\bllc\b|\bltd\.?\b)/gi, "")
    .replace(/[\s・･_\-—–/（）(),.「」『』]/g, "")
    .trim();
}

function cleanName(value: string) {
  return value
    .replace(/^(?:候補\s*\d+\s*[|｜:]\s*|\d+[.)、]\s*)/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanDomain(value: string | undefined) {
  if (!value) return undefined;
  const domain = value.trim().toLocaleLowerCase("en-US").replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  return domain || undefined;
}

function unique(values: string[], limit = 50) {
  const found = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    const cleaned = cleanName(value);
    const key = normalize(cleaned);
    if (!cleaned || !key || found.has(key)) return;
    found.add(key);
    result.push(cleaned);
  });
  return result.slice(0, limit);
}

function unpack(input: MarketMapInput) {
  if ("result" in input) return { result: input.result, generatedAt: input.generatedAt };
  return { result: input, generatedAt: undefined };
}

function isOwnName(value: string, result: ScanResult) {
  const key = normalize(value);
  return [result.discovery.brandName, result.discovery.legalName, result.discovery.domain, ...result.discovery.aliases]
    .map(normalize)
    .filter(Boolean)
    .some((alias) => alias === key || (alias.length > 3 && key.includes(alias)));
}

function nodeId(relation: MarketMapNode["relation"], name: string) {
  return `${relation}:${normalize(name)}`;
}

/**
 * Builds a small directional market map from the existing scan result.
 *
 * Competitors are taken from discovery, alternatives from entities actually
 * appearing in successful AI answers or lost prompts, and adjacent items from
 * the discovered market/use-case/audience labels. No web search or market-size
 * provider is called here, and empty upstream/downstream lanes are deliberate:
 * inventing a supply-chain relationship would make the result look more
 * certain than the available evidence allows.
 */
export function buildMarketMap(input: MarketMapInput): MarketMap {
  const { result, generatedAt } = unpack(input);
  const discovery = result.discovery;
  const successful = result.observations.filter((observation) => observation.status === "success");
  const candidateEvidence = new Map<string, CandidateEvidence>();
  const knownDomains = new Map<string, string>();
  const knownDirect = new Set<string>();

  discovery.competitors.forEach((competitor) => {
    const name = cleanName(competitor.name);
    if (!name) return;
    const key = normalize(name);
    knownDirect.add(key);
    const domain = cleanDomain(competitor.domain);
    if (domain) knownDomains.set(key, domain);
    candidateEvidence.set(key, {
      name,
      count: 0,
      lostPromptCount: 0,
      sourceUrls: new Set<string>(),
    });
  });

  successful.forEach((observation) => {
    const recommended = unique(observation.recommendedEntities, 30);
    recommended.forEach((candidate) => {
      if (isOwnName(candidate, result)) return;
      const key = normalize(candidate);
      if (!key) return;
      const current = candidateEvidence.get(key) || { name: candidate, count: 0, lostPromptCount: 0, sourceUrls: new Set<string>() };
      current.count += 1;
      const firstCandidateMatches = observation.firstCandidate ? normalize(observation.firstCandidate) === key : false;
      const candidateCitations = firstCandidateMatches
        ? observation.citations
        : observation.citations.filter((citation) => normalize(`${citation.title} ${citation.domain}`).includes(key));
      candidateCitations.forEach((citation) => {
        if (citation.url) current.sourceUrls.add(citation.url);
      });
      candidateEvidence.set(key, current);
    });
  });

  result.lostPrompts.forEach((lostPrompt) => {
    const winner = lostPrompt.winner && cleanName(lostPrompt.winner);
    if (!winner || isOwnName(winner, result)) return;
    const key = normalize(winner);
    const current = candidateEvidence.get(key) || { name: winner, count: 0, lostPromptCount: 0, sourceUrls: new Set<string>() };
    current.lostPromptCount += 1;
    const winnerCitations = lostPrompt.citations.filter((citation) => normalize(`${citation.title} ${citation.domain}`).includes(key));
    winnerCitations.forEach((citation) => {
      if (citation.url) current.sourceUrls.add(citation.url);
    });
    candidateEvidence.set(key, current);
  });

  const nodes: MarketMapNode[] = [{
    id: nodeId("subject", discovery.brandName),
    name: discovery.brandName,
    relation: "subject",
    domain: cleanDomain(discovery.domain),
    confidence: clamp(discovery.confidence),
    evidenceType: "observed",
    evidence: ["今回の会社・サービス情報"],
    sourceUrls: result.targetUrl ? [result.targetUrl] : [],
  }];

  const directNodes = discovery.competitors.map((competitor): MarketMapNode | null => {
    const name = cleanName(competitor.name);
    if (!name || isOwnName(name, result)) return null;
    const evidence = candidateEvidence.get(normalize(name));
    const observationDetail = evidence?.count && successful.length
      ? `AI回答の${evidence.count}/${successful.length}件で候補に含まれた`
      : "会社・市場の比較候補として抽出された";
    const lostDetail = evidence?.lostPromptCount ? `自社が先に選ばれなかった質問${evidence.lostPromptCount}件で先頭候補` : null;
    return {
      id: nodeId("direct", name),
      name,
      relation: "direct",
      domain: cleanDomain(competitor.domain),
      confidence: clamp(Math.max(competitor.confidence, evidence?.count && successful.length ? evidence.count / successful.length : 0)),
      evidenceType: "observed",
      evidence: [competitor.reason || "比較候補として抽出された", observationDetail, ...(lostDetail ? [lostDetail] : [])],
      sourceUrls: [...(evidence?.sourceUrls || [])].slice(0, 10),
    };
  }).filter((node): node is MarketMapNode => Boolean(node));
  nodes.push(...directNodes);

  const alternativeNodes = [...candidateEvidence.values()]
    .filter((candidate) => !knownDirect.has(normalize(candidate.name)) && candidate.count + candidate.lostPromptCount > 0)
    .sort((a, b) => b.lostPromptCount - a.lostPromptCount || b.count - a.count || a.name.localeCompare(b.name, "ja"))
    .map((candidate): MarketMapNode => {
      const evidence: string[] = [];
      if (candidate.count && successful.length) evidence.push(`AI回答の${candidate.count}/${successful.length}件で候補に含まれた`);
      if (candidate.lostPromptCount) evidence.push(`自社が先に選ばれなかった質問${candidate.lostPromptCount}件で先頭候補`);
      return {
        id: nodeId("alternative", candidate.name),
        name: candidate.name,
        relation: "alternative",
        domain: knownDomains.get(normalize(candidate.name)),
        confidence: clamp(Math.max(.1, (candidate.count + candidate.lostPromptCount) / Math.max(1, successful.length))),
        evidenceType: "observed",
        evidence,
        sourceUrls: [...candidate.sourceUrls].slice(0, 10),
      };
    });
  nodes.push(...alternativeNodes);

  const adjacentLabels = unique([discovery.market, ...discovery.useCases, ...discovery.targetCustomers]);
  const adjacentNodes = adjacentLabels.map((label): MarketMapNode => ({
    id: nodeId("adjacent", label),
    name: label,
    relation: "adjacent",
    confidence: clamp(discovery.confidence * .8),
    evidenceType: "inferred",
    evidence: [
      discovery.market === label ? "発見された市場カテゴリ" : discovery.useCases.includes(label) ? "発見された利用目的" : "発見された対象顧客",
      "隣接領域としての分類は入力情報からの推定",
    ],
    sourceUrls: [],
  }));
  nodes.push(...adjacentNodes);

  const directNames = directNodes.map((node) => node.name);
  const alternativeNames = alternativeNodes.map((node) => node.name);
  return {
    direct: unique(directNames),
    alternatives: unique(alternativeNames),
    adjacent: unique(adjacentLabels),
    upstream: [],
    downstream: [],
    keywords: unique([discovery.market, ...discovery.useCases, ...discovery.targetCustomers, ...discovery.aliases], 30),
    generatedAt: generatedAt || result.measuredAt || new Date().toISOString(),
    subject: { name: discovery.brandName, domain: cleanDomain(discovery.domain) || discovery.domain, market: discovery.market },
    nodes,
    limitations: [
      "公開情報と今回取得したAI回答だけから作った比較用の地図です。",
      "検索ボリューム、売上、市場シェア、勝敗の因果関係は測定していません。",
      "上流・下流の関係は根拠がないため空欄にしています。",
      "隣接領域の分類は市場・用途・対象顧客の記述からの推定です。",
    ],
  };
}
