import assert from "node:assert/strict";
import test from "node:test";
import { compareWatchRuns } from "../lib/watch-diff";
import type { Observation, ScanResult } from "../lib/types";

function observation(id: string, repetition: number, recommended: boolean, first = false, status: Observation["status"] = "success", citation = "") : Observation {
  return {
    id,
    promptId: "p1",
    prompt: "おすすめは？",
    provider: "openai",
    model: "test",
    repetition,
    status,
    rawText: recommended ? "Acmeを候補にします" : "Rivalを候補にします",
    citations: citation ? [{ title: citation, url: `https://${citation}/page`, domain: citation }] : [],
    recommendedEntities: recommended ? ["Acme", "Rival"] : ["Rival"],
    ownRecommended: recommended,
    ownPosition: first ? 1 : recommended ? 2 : null,
    firstCandidate: first ? "Acme" : "Rival",
    startedAt: "2026-09-01T00:00:00Z",
    completedAt: "2026-09-01T00:00:01Z",
    latencyMs: 1000,
  };
}

function result(observations: Observation[], coverage: number, position = 2): ScanResult {
  return {
    scanId: "scan",
    targetUrl: "https://acme.example",
    discovery: { legalName: "Acme", brandName: "Acme", domain: "acme.example", summary: "", market: "B2B SaaS", targetCustomers: [], useCases: [], aliases: ["Acme"], competitors: [], confidence: 1 },
    panel: { kind: "core", version: 2, promptCount: 1, repetitions: 3, locale: "ja-JP", country: "JP" },
    prompts: [{ id: "p1", text: "おすすめは？", cluster: "category", importance: 5, panel: "core", version: 2 }],
    measuredAt: "2026-09-01T00:00:00Z",
    observations,
    scheduledObservations: observations.length,
    successfulObservations: observations.filter((item) => item.status === "success").length,
    measurementCompleteness: 100,
    recommendationCoverage: coverage,
    firstChoiceRate: 0,
    mentionCoverage: 0,
    citationCoverage: 0,
    repeatAgreement: 100,
    ownRecommendationCount: observations.filter((item) => item.ownRecommended).length,
    marketPosition: position,
    marketSize: 2,
    competitors: [],
    lostPrompts: [],
    narratives: [],
    evidenceGaps: [],
    actions: [],
    totalCostUsd: 0,
    warnings: [],
  };
}

test("Watch diff uses majority across repetitions instead of any single run", () => {
  const before = result([
    observation("b1", 1, false), observation("b2", 2, false), observation("b3", 3, true),
  ], 33);
  const after = result([
    observation("a1", 1, true), observation("a2", 2, true), observation("a3", 3, false),
  ], 67, 1);
  const diff = compareWatchRuns(before, after);
  assert.equal(diff.comparable, true);
  assert.equal(diff.newWins, 1);
  assert.equal(diff.newLosses, 0);
  assert.equal(diff.coverageDelta, 34);
  assert.equal(diff.rankDelta, 1);
});

test("Watch diff refuses to compare different provider sets", () => {
  const before = result([observation("b1", 1, true), observation("b2", 2, true), observation("b3", 3, true)], 100);
  const after = result([
    observation("a1", 1, true), observation("a2", 2, true), observation("a3", 3, true),
    { ...observation("g1", 1, true), provider: "gemini" }, { ...observation("g2", 2, true), provider: "gemini" }, { ...observation("g3", 3, true), provider: "gemini" },
  ], 100);
  const diff = compareWatchRuns(before, after);
  assert.equal(diff.comparable, false);
  assert.ok(diff.reasons.includes("provider_set_changed"));
  assert.equal(diff.coverageDelta, null);
});

test("Watch diff skips cells without enough successful repetitions", () => {
  const before = result([observation("b1", 1, false), observation("b2", 2, false), observation("b3", 3, false)], 0);
  const after = result([
    observation("a1", 1, true), observation("a2", 2, true, false, "failed"), observation("a3", 3, false, false, "failed"),
  ], 100);
  const diff = compareWatchRuns(before, after);
  assert.equal(diff.comparable, true);
  assert.equal(diff.newWins, 0);
  assert.equal(diff.skippedCells, 1);
});

test("Watch diff tracks citation additions and removals", () => {
  const before = result([observation("b1", 1, false, false, "success", "old.example"), observation("b2", 2, false), observation("b3", 3, false)], 0);
  const after = result([observation("a1", 1, false, false, "success", "new.example"), observation("a2", 2, false), observation("a3", 3, false)], 0);
  const diff = compareWatchRuns(before, after);
  assert.deepEqual(diff.newCitations, ["https://new.example/page"]);
  assert.deepEqual(diff.removedCitations, ["https://old.example/page"]);
});
