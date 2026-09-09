import type { BuyerPrompt, ProviderName, ScanResult } from "@/lib/types";

export type BuyingAuditSeverity = "critical" | "high" | "medium" | "low";
export type BuyingAuditFactCategory = "price" | "eligibility" | "capability" | "integration" | "trial" | "region" | "support" | "security" | "other";
export type BuyingAuditFactCheckStatus = "completed" | "unavailable" | "failed";
export type BuyingAuditAlertKind = "current_candidate_gap" | "candidate_drop" | "candidate_recovery" | "new_fact_error" | "new_competitor" | "citation_change";

export type BuyingPromptRisk = {
  promptId: string;
  prompt: string;
  score: number;
  stage?: string;
  intent?: string;
  ownRecommendationRate: number | null;
  ownIncludedVotes: number;
  totalVotes: number;
  excludedProviders: ProviderName[];
  topCompetitors: string[];
  citationDomains: string[];
  severity: BuyingAuditSeverity;
};

export type FactAccuracyIssue = {
  id: string;
  category: BuyingAuditFactCategory;
  severity: BuyingAuditSeverity;
  provider: ProviderName;
  promptId: string;
  prompt: string;
  aiClaim: string;
  officialFact: string;
  officialSourceUrl: string;
  citationUrls: string[];
  explanation: string;
};

export type CitationDependency = {
  domain: string;
  references: number;
  promptCount: number;
  owned: boolean;
};

export type BuyingAuditAlert = {
  id: string;
  kind: BuyingAuditAlertKind;
  severity: BuyingAuditSeverity;
  title: string;
  detail: string;
  promptId?: string;
  provider?: ProviderName;
  sourceUrl?: string;
};

export type BuyingAuditChangeSummary = {
  newCandidateDrops: number;
  recoveries: number;
  newFactErrors: number;
  newCompetitors: number;
  newCitationDomains: number;
};

export type BuyingAudit = {
  generatedAt: string;
  factCheckStatus: BuyingAuditFactCheckStatus;
  highIntentPromptCount: number;
  candidateGapCount: number;
  misinformationCount: number;
  externalCitationDomainCount: number;
  candidateRisks: BuyingPromptRisk[];
  factIssues: FactAccuracyIssue[];
  citationDependencies: CitationDependency[];
  alerts: BuyingAuditAlert[];
  changeSummary?: BuyingAuditChangeSummary;
};

type ScanWithAudit = ScanResult & { buyingAudit?: BuyingAudit };

const clusterWeight: Record<string, number> = {
  comparison: 5,
  value: 5,
  alternative: 5,
  feature: 4,
  use_case: 4,
  segment: 4,
  implementation: 3,
  trust: 3,
  category: 2,
  support: 2,
};

const intentWeight: Record<string, number> = {
  compare: 4,
  switch: 4,
  evaluate: 3,
  implement: 2,
  discover: 1,
};

const stageWeight: Record<string, number> = {
  比較: 4,
  検討: 3,
  導入: 3,
  認知: 2,
};

function percent(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : null;
}

function host(value: string) {
  try { return new URL(value).hostname.replace(/^www\./iu, "").toLowerCase(); } catch { return value.replace(/^www\./iu, "").toLowerCase(); }
}

function ownedDomain(domain: string, targetDomain: string) {
  const current = host(domain);
  const target = host(targetDomain);
  return current === target || current.endsWith(`.${target}`);
}

function fallbackPrompts(result: ScanResult): BuyerPrompt[] {
  const seen = new Map<string, BuyerPrompt>();
  for (const observation of result.observations) {
    if (!seen.has(observation.promptId)) {
      seen.set(observation.promptId, {
        id: observation.promptId,
        text: observation.prompt,
        cluster: "category",
        importance: 3,
        panel: result.panel.kind,
        version: result.panel.version,
      });
    }
  }
  return [...seen.values()];
}

export function commercialPriorityScore(prompt: BuyerPrompt) {
  const urgency = prompt.urgency || 0;
  return (prompt.importance || 0) * 2
    + (clusterWeight[prompt.cluster] || 0)
    + (prompt.intent ? intentWeight[prompt.intent] || 0 : 0)
    + (prompt.stage ? stageWeight[prompt.stage] || 0 : 0)
    + urgency;
}

export function selectCommercialPrompts(result: ScanResult, limit = 12) {
  const prompts = result.prompts?.length ? result.prompts : fallbackPrompts(result);
  return [...prompts]
    .sort((a, b) => commercialPriorityScore(b) - commercialPriorityScore(a) || b.importance - a.importance || a.id.localeCompare(b.id))
    .slice(0, Math.max(1, limit));
}

function providerExcluded(rows: ScanResult["observations"], provider: ProviderName) {
  const providerRows = rows.filter((row) => row.provider === provider && row.status === "success");
  if (!providerRows.length) return false;
  return providerRows.filter((row) => row.ownRecommended).length < Math.ceil(providerRows.length / 2);
}

function candidateSeverity(score: number, recommendationRate: number | null): BuyingAuditSeverity {
  if (recommendationRate === null || recommendationRate >= 67) return "low";
  if (recommendationRate === 0 && score >= 15) return "critical";
  if (recommendationRate < 50 && score >= 12) return "high";
  if (recommendationRate < 50) return "medium";
  return "low";
}

export function deriveCandidateRisks(result: ScanResult, limit = 12): BuyingPromptRisk[] {
  const prompts = selectCommercialPrompts(result, limit);
  const aliases = new Set([result.discovery.brandName, result.discovery.legalName, ...result.discovery.aliases].filter(Boolean).map((value) => value.toLocaleLowerCase("ja-JP")));
  return prompts.map((prompt) => {
    const rows = result.observations.filter((row) => row.promptId === prompt.id && row.status === "success");
    const ownIncludedVotes = rows.filter((row) => row.ownRecommended).length;
    const ownRecommendationRate = percent(ownIncludedVotes, rows.length);
    const counts = new Map<string, number>();
    for (const row of rows) {
      for (const entity of row.recommendedEntities) {
        if (!entity || aliases.has(entity.toLocaleLowerCase("ja-JP"))) continue;
        counts.set(entity, (counts.get(entity) || 0) + 1);
      }
    }
    const topCompetitors = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja-JP")).slice(0, 3).map(([name]) => name);
    const citationDomains = [...new Set(rows.flatMap((row) => row.citations.map((citation) => citation.domain || host(citation.url))).filter(Boolean))].slice(0, 6);
    const score = commercialPriorityScore(prompt);
    const excludedProviders = (["openai", "gemini", "perplexity"] as ProviderName[]).filter((provider) => providerExcluded(rows, provider));
    return {
      promptId: prompt.id,
      prompt: prompt.text,
      score,
      stage: prompt.stage,
      intent: prompt.intent,
      ownRecommendationRate,
      ownIncludedVotes,
      totalVotes: rows.length,
      excludedProviders,
      topCompetitors,
      citationDomains,
      severity: candidateSeverity(score, ownRecommendationRate),
    };
  }).sort((a, b) => {
    const severityRank: Record<BuyingAuditSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityRank[b.severity] - severityRank[a.severity] || b.score - a.score || (a.ownRecommendationRate ?? 101) - (b.ownRecommendationRate ?? 101);
  });
}

export function deriveCitationDependencies(result: ScanResult, promptIds = selectCommercialPrompts(result).map((prompt) => prompt.id)): CitationDependency[] {
  const selected = new Set(promptIds);
  const rows = new Map<string, { references: number; promptIds: Set<string>; domain: string }>();
  for (const observation of result.observations) {
    if (observation.status !== "success" || !selected.has(observation.promptId)) continue;
    for (const citation of observation.citations) {
      const domain = citation.domain || host(citation.url);
      if (!domain) continue;
      const current = rows.get(domain) || { references: 0, promptIds: new Set<string>(), domain };
      current.references += 1;
      current.promptIds.add(observation.promptId);
      rows.set(domain, current);
    }
  }
  return [...rows.values()]
    .map((row) => ({ domain: row.domain, references: row.references, promptCount: row.promptIds.size, owned: ownedDomain(row.domain, result.discovery.domain) }))
    .sort((a, b) => b.promptCount - a.promptCount || b.references - a.references || a.domain.localeCompare(b.domain));
}

function alertId(kind: BuyingAuditAlertKind, parts: Array<string | number | undefined>) {
  const source = [kind, ...parts].filter((value) => value !== undefined).join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) hash = Math.imul(hash ^ source.charCodeAt(index), 16777619);
  return `${kind}_${(hash >>> 0).toString(36)}`;
}

export function buildBaseBuyingAudit(result: ScanResult): BuyingAudit {
  const candidateRisks = deriveCandidateRisks(result);
  const citationDependencies = deriveCitationDependencies(result, candidateRisks.map((risk) => risk.promptId));
  const candidateGaps = candidateRisks.filter((risk) => (risk.ownRecommendationRate ?? 100) < 50 && risk.totalVotes > 0);
  const alerts: BuyingAuditAlert[] = candidateGaps.slice(0, 3).map((risk) => ({
    id: alertId("current_candidate_gap", [risk.promptId]),
    kind: "current_candidate_gap",
    severity: risk.severity === "low" ? "medium" : risk.severity,
    title: "重要な購入前質問で候補外が目立ちます",
    detail: `「${risk.prompt}」で自社候補入りは${risk.ownRecommendationRate ?? 0}%です。${risk.topCompetitors.length ? `回答では${risk.topCompetitors.join("、")}が候補に含まれています。` : ""}`,
    promptId: risk.promptId,
  }));
  return {
    generatedAt: result.measuredAt,
    factCheckStatus: "unavailable",
    highIntentPromptCount: candidateRisks.length,
    candidateGapCount: candidateGaps.length,
    misinformationCount: 0,
    externalCitationDomainCount: citationDependencies.filter((row) => !row.owned).length,
    candidateRisks,
    factIssues: [],
    citationDependencies,
    alerts,
  };
}

export function withFactCheck(audit: BuyingAudit, issues: FactAccuracyIssue[], status: BuyingAuditFactCheckStatus): BuyingAudit {
  const factAlerts: BuyingAuditAlert[] = issues.slice(0, 5).map((issue) => ({
    id: alertId("new_fact_error", [issue.provider, issue.promptId, issue.category, issue.officialSourceUrl]),
    kind: "new_fact_error",
    severity: issue.severity,
    title: "AIの説明と公式情報が食い違っています",
    detail: `${issue.provider}: 「${issue.aiClaim}」 / 公式情報: 「${issue.officialFact}」`,
    promptId: issue.promptId,
    provider: issue.provider,
    sourceUrl: issue.officialSourceUrl,
  }));
  return {
    ...audit,
    factCheckStatus: status,
    factIssues: issues,
    misinformationCount: issues.length,
    alerts: [...factAlerts, ...audit.alerts].slice(0, 12),
  };
}

export function getBuyingAudit(result: ScanResult | undefined | null): BuyingAudit | undefined {
  return (result as ScanWithAudit | undefined | null)?.buyingAudit;
}

export function setBuyingAudit(result: ScanResult, audit: BuyingAudit) {
  (result as ScanWithAudit).buyingAudit = audit;
  return result;
}

function comparablePanel(before: ScanResult, after: ScanResult) {
  return before.targetUrl === after.targetUrl
    && before.panel.kind === after.panel.kind
    && before.panel.version === after.panel.version
    && before.panel.promptCount === after.panel.promptCount;
}

function factKey(issue: FactAccuracyIssue) {
  return `${issue.provider}|${issue.promptId}|${issue.category}|${issue.officialSourceUrl}`;
}

function dedupeAlerts(alerts: BuyingAuditAlert[]) {
  const seen = new Set<string>();
  return alerts.filter((alert) => {
    if (seen.has(alert.id)) return false;
    seen.add(alert.id);
    return true;
  });
}

export function attachBuyingAuditDelta(current: ScanResult, previous: ScanResult) {
  const currentAudit = getBuyingAudit(current) || buildBaseBuyingAudit(current);
  const previousStoredAudit = getBuyingAudit(previous);
  const previousAudit = previousStoredAudit || buildBaseBuyingAudit(previous);
  const deltaAlerts: BuyingAuditAlert[] = [];
  let newCandidateDrops = 0;
  let recoveries = 0;
  let newFactErrors = 0;
  let newCompetitors = 0;
  let newCitationDomains = 0;

  if (comparablePanel(previous, current)) {
    const previousRisks = new Map(previousAudit.candidateRisks.map((risk) => [risk.promptId, risk]));
    for (const risk of currentAudit.candidateRisks) {
      const before = previousRisks.get(risk.promptId);
      if (!before || before.ownRecommendationRate === null || risk.ownRecommendationRate === null) continue;
      if (before.ownRecommendationRate >= 50 && risk.ownRecommendationRate < 50) {
        newCandidateDrops += 1;
        deltaAlerts.push({
          id: alertId("candidate_drop", [risk.promptId, current.scanId]),
          kind: "candidate_drop",
          severity: risk.severity === "low" ? "high" : risk.severity,
          title: "重要な購入前質問で新たに候補外になりました",
          detail: `「${risk.prompt}」で候補入り率が${before.ownRecommendationRate}%から${risk.ownRecommendationRate}%へ低下しました。`,
          promptId: risk.promptId,
        });
      } else if (before.ownRecommendationRate < 50 && risk.ownRecommendationRate >= 50) {
        recoveries += 1;
        deltaAlerts.push({
          id: alertId("candidate_recovery", [risk.promptId, current.scanId]),
          kind: "candidate_recovery",
          severity: "low",
          title: "重要な購入前質問で候補入りが回復しました",
          detail: `「${risk.prompt}」で候補入り率が${before.ownRecommendationRate}%から${risk.ownRecommendationRate}%へ改善しました。`,
          promptId: risk.promptId,
        });
      }
    }

    const previousCompetitors = new Set(previous.competitors.map((row) => row.name.toLocaleLowerCase("ja-JP")));
    for (const competitor of current.competitors) {
      if (!previousCompetitors.has(competitor.name.toLocaleLowerCase("ja-JP"))) {
        newCompetitors += 1;
        deltaAlerts.push({
          id: alertId("new_competitor", [competitor.name, current.scanId]),
          kind: "new_competitor",
          severity: "medium",
          title: "新しい競合候補がAI回答に現れました",
          detail: `${competitor.name}が今回の回答で新たに候補として確認されました。`,
        });
      }
    }

    const previousCitationDomains = new Set(previousAudit.citationDependencies.map((row) => row.domain));
    for (const citation of currentAudit.citationDependencies.filter((row) => !row.owned)) {
      if (!previousCitationDomains.has(citation.domain)) {
        newCitationDomains += 1;
        deltaAlerts.push({
          id: alertId("citation_change", [citation.domain, current.scanId]),
          kind: "citation_change",
          severity: "low",
          title: "AIが参照する外部情報源が増えました",
          detail: `${citation.domain}が重要な購入前質問の参照元として新たに確認されました。`,
          sourceUrl: `https://${citation.domain}`,
        });
      }
    }
  }

  if (previousStoredAudit?.factCheckStatus === "completed" && currentAudit.factCheckStatus === "completed") {
    const previousIssues = new Set(previousStoredAudit.factIssues.map(factKey));
    for (const issue of currentAudit.factIssues) {
      if (!previousIssues.has(factKey(issue))) {
        newFactErrors += 1;
        deltaAlerts.push({
          id: alertId("new_fact_error", [issue.provider, issue.promptId, issue.category, current.scanId]),
          kind: "new_fact_error",
          severity: issue.severity,
          title: "新しいAI誤情報を検出しました",
          detail: `${issue.provider}: 「${issue.aiClaim}」 / 公式情報: 「${issue.officialFact}」`,
          promptId: issue.promptId,
          provider: issue.provider,
          sourceUrl: issue.officialSourceUrl,
        });
      }
    }
  }

  const next: BuyingAudit = {
    ...currentAudit,
    changeSummary: { newCandidateDrops, recoveries, newFactErrors, newCompetitors, newCitationDomains },
    alerts: dedupeAlerts([...deltaAlerts, ...currentAudit.alerts]).slice(0, 12),
  };
  setBuyingAudit(current, next);
  return next;
}
