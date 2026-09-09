import assert from "node:assert/strict";
import test from "node:test";
import { attachBuyingAuditDelta, buildBaseBuyingAudit, setBuyingAudit, withFactCheck } from "../lib/buying-audit-core";
import type { BuyerPrompt, Observation, ScanResult } from "../lib/types";

function prompt(id: string, text: string, cluster: BuyerPrompt["cluster"], importance = 5): BuyerPrompt {
  return { id, text, cluster, importance, intent: cluster === "comparison" || cluster === "value" ? "compare" : "discover", stage: cluster === "comparison" || cluster === "value" ? "比較" : "認知", urgency: importance, panel: "core", version: 1 };
}

function observation(id: string, promptRow: BuyerPrompt, provider: Observation["provider"], ownRecommended: boolean, competitors: string[] = []): Observation {
  return {
    id,
    promptId: promptRow.id,
    prompt: promptRow.text,
    provider,
    model: "test-model",
    repetition: 1,
    status: "success",
    rawText: "test answer",
    citations: [{ title: "source", url: "https://example-source.test/page", domain: "example-source.test" }],
    recommendedEntities: ownRecommended ? ["Example", ...competitors] : competitors,
    ownRecommended,
    ownPosition: ownRecommended ? 1 : null,
    firstCandidate: ownRecommended ? "Example" : competitors[0] || null,
    startedAt: "2026-09-09T00:00:00Z",
    completedAt: "2026-09-09T00:00:01Z",
    latencyMs: 1000,
  };
}

function scan(scanId: string, ownOnComparison: boolean, competitor = "Competitor A"): ScanResult {
  const high = prompt("p-high", "中小企業向けで料金を比較したおすすめは？", "comparison", 5);
  const low = prompt("p-low", "この分野とは？", "category", 2);
  const observations = [
    observation(`${scanId}-1`, high, "openai", ownOnComparison, [competitor]),
    observation(`${scanId}-2`, high, "gemini", ownOnComparison, [competitor]),
    observation(`${scanId}-3`, high, "perplexity", ownOnComparison, [competitor]),
    observation(`${scanId}-4`, low, "openai", true, []),
  ];
  return {
    scanId,
    targetUrl: "https://example.test",
    discovery: { legalName: "Example Inc.", brandName: "Example", domain: "example.test", summary: "", market: "B2B SaaS", targetCustomers: [], useCases: [], aliases: ["Example"], competitors: [], confidence: 1 },
    panel: { kind: "core", version: 1, promptCount: 2, repetitions: 1, locale: "ja-JP", country: "JP" },
    prompts: [high, low],
    measuredAt: "2026-09-09T00:00:00Z",
    observations,
    scheduledObservations: 6,
    successfulObservations: observations.length,
    measurementCompleteness: 100,
    recommendationCoverage: 0,
    firstChoiceRate: 0,
    mentionCoverage: 0,
    citationCoverage: 0,
    repeatAgreement: 100,
    ownRecommendationCount: observations.filter((row) => row.ownRecommended).length,
    marketPosition: 0,
    marketSize: 0,
    competitors: [{ name: competitor, recommendedCount: 3, firstChoiceCount: ownOnComparison ? 0 : 3, coverage: 75 }],
    lostPrompts: [],
    evidenceGaps: [],
    actions: [],
    totalCostUsd: 0,
    warnings: [],
  };
}

test("AI購買監査は購入意図の強い候補落ちを優先する", () => {
  const result = scan("before", false);
  const audit = buildBaseBuyingAudit(result);
  assert.equal(audit.candidateRisks[0].promptId, "p-high");
  assert.equal(audit.candidateRisks[0].ownRecommendationRate, 0);
  assert.equal(audit.candidateGapCount, 1);
  assert.equal(audit.externalCitationDomainCount, 1);
});

test("Watch差分は新しい候補落ちと新しい競合を異常として残す", () => {
  const before = scan("before", true, "Competitor A");
  const after = scan("after", false, "Competitor B");
  setBuyingAudit(before, buildBaseBuyingAudit(before));
  setBuyingAudit(after, buildBaseBuyingAudit(after));
  const audit = attachBuyingAuditDelta(after, before);
  assert.equal(audit.changeSummary?.newCandidateDrops, 1);
  assert.equal(audit.changeSummary?.newCompetitors, 1);
  assert.ok(audit.alerts.some((alert) => alert.kind === "candidate_drop"));
  assert.ok(audit.alerts.some((alert) => alert.kind === "new_competitor"));
});

test("明確な事実不一致は誤情報件数に加算される", () => {
  const result = scan("fact", false);
  const audit = withFactCheck(buildBaseBuyingAudit(result), [{
    id: "issue-1",
    category: "price",
    severity: "high",
    provider: "openai",
    promptId: "p-high",
    prompt: "中小企業向けで料金を比較したおすすめは？",
    aiClaim: "月額5万円",
    officialFact: "月額3万円",
    officialSourceUrl: "https://example.test/pricing",
    citationUrls: ["https://old.example/pricing"],
    explanation: "料金の記載が一致していません。",
  }], "completed");
  assert.equal(audit.misinformationCount, 1);
  assert.equal(audit.factCheckStatus, "completed");
  assert.ok(audit.alerts.some((alert) => alert.kind === "new_fact_error"));
});
