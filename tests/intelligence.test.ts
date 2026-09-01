import assert from "node:assert/strict";
import test from "node:test";
import { buildCitationIntelligence, buildClusterIntelligence, buildPromptIntelligence, withPromptRationale } from "../lib/intelligence";
import type { BuyerPrompt, CompanyDiscovery, Observation, ScanResult } from "../lib/types";

const discovery: CompanyDiscovery = {
  legalName: "Acme Inc.", brandName: "Acme", domain: "acme.example", summary: "", market: "B2B SaaS",
  targetCustomers: ["中小企業"], useCases: ["請求管理"], aliases: ["Acme", "acme.example"],
  competitors: [{ name: "Rival", domain: "rival.example", reason: "same market", confidence: .9 }], confidence: .9,
};
const prompts: BuyerPrompt[] = withPromptRationale([
  { id: "p1", text: "おすすめのB2B SaaSは？", cluster: "category", importance: 5, panel: "core", version: 1 },
  { id: "p2", text: "導入しやすいB2B SaaSは？", cluster: "implementation", importance: 4, panel: "core", version: 1 },
], discovery);
const observations: Observation[] = [
  { id: "o1", promptId: "p1", prompt: prompts[0].text, provider: "openai", model: "x", repetition: 1, status: "success", rawText: "AcmeとRivalを候補にします", citations: [{ title: "Acme", url: "https://acme.example/proof", domain: "acme.example" }], recommendedEntities: ["Acme", "Rival"], ownRecommended: true, ownPosition: 1, firstCandidate: "Acme", startedAt: "2026-01-01T00:00:00Z", completedAt: "2026-01-01T00:00:01Z", latencyMs: 1000 },
  { id: "o2", promptId: "p1", prompt: prompts[0].text, provider: "gemini", model: "x", repetition: 1, status: "success", rawText: "Rivalを推奨します", citations: [{ title: "Rival", url: "https://rival.example/case", domain: "rival.example" }], recommendedEntities: ["Rival"], ownRecommended: false, ownPosition: null, firstCandidate: "Rival", startedAt: "2026-01-01T00:00:00Z", completedAt: "2026-01-01T00:00:01Z", latencyMs: 1000 },
  { id: "o3", promptId: "p2", prompt: prompts[1].text, provider: "openai", model: "x", repetition: 1, status: "success", rawText: "第三者比較ではRivalが導入しやすい", citations: [{ title: "Review", url: "https://review.example/b2b", domain: "review.example" }], recommendedEntities: ["Rival"], ownRecommended: false, ownPosition: null, firstCandidate: "Rival", startedAt: "2026-01-01T00:00:00Z", completedAt: "2026-01-01T00:00:01Z", latencyMs: 1000 },
];
const result = { discovery, prompts, observations } as Pick<ScanResult, "discovery" | "prompts" | "observations">;

test("prompt rationale explains why each prompt is tracked", () => {
  assert.match(prompts[0].whyTracked || "", /カテゴリ選定/);
  assert.match(prompts[1].whyTracked || "", /導入期間|導入/);
});

test("prompt intelligence separates mention, recommendation and first choice", () => {
  const row = buildPromptIntelligence(result).find((item) => item.prompt.id === "p1");
  assert.equal(row?.successful, 2);
  assert.equal(row?.mentions, 1);
  assert.equal(row?.recommendations, 1);
  assert.equal(row?.firstChoices, 1);
  assert.equal(row?.recommendationCoverage, 50);
});

test("citation intelligence separates owned, competitor and third party sources", () => {
  const rows = buildCitationIntelligence(result);
  assert.equal(rows.find((row) => row.domain === "acme.example")?.kind, "owned");
  assert.equal(rows.find((row) => row.domain === "rival.example")?.kind, "competitor");
  assert.equal(rows.find((row) => row.domain === "review.example")?.kind, "third_party");
});

test("cluster intelligence exposes the weakest buyer intent", () => {
  const rows = buildClusterIntelligence(result);
  assert.equal(rows[0].cluster, "implementation");
  assert.equal(rows[0].coverage, 0);
  assert.equal(rows.find((row) => row.cluster === "category")?.coverage, 50);
});
