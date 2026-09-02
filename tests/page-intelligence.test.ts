import assert from "node:assert/strict";
import test from "node:test";
import { buildPageIntelligence } from "../lib/page-intelligence";
import type { BuyerPrompt, CrawledPage, LostPrompt, Observation } from "../lib/types";

const pages: CrawledPage[] = [
  { url: "https://acme.example/", title: "Acme", description: "B2B SaaS", headings: ["Acme"], text: "x".repeat(800) },
  { url: "https://acme.example/cases", title: "導入事例", description: "顧客事例", headings: ["導入事例"], text: "x".repeat(1200) },
  { url: "https://acme.example/pricing", title: "料金", description: "料金", headings: ["料金"], text: "x".repeat(900) },
];
const prompts: BuyerPrompt[] = [
  { id: "segment", text: "中小企業向けは？", cluster: "segment", importance: 5, panel: "core", version: 1 },
  { id: "value", text: "費用対効果は？", cluster: "value", importance: 5, panel: "core", version: 1 },
  { id: "category", text: "おすすめは？", cluster: "category", importance: 5, panel: "core", version: 1 },
];
function observation(): Observation {
  return { id: "o1", promptId: "segment", prompt: prompts[0].text, provider: "openai", model: "x", repetition: 1, status: "success", rawText: "Acme", citations: [{ title: "導入事例", url: "https://acme.example/cases", domain: "acme.example" }], recommendedEntities: ["Acme"], ownRecommended: true, ownPosition: 1, firstCandidate: "Acme", startedAt: "2026-01-01T00:00:00Z", completedAt: "2026-01-01T00:00:01Z", latencyMs: 1000 };
}
const losses: LostPrompt[] = [
  { promptId: "segment", prompt: prompts[0].text, winner: "Rival", summary: "", citations: [], observations: [] },
  { promptId: "value", prompt: prompts[1].text, winner: "Rival", summary: "", citations: [], observations: [] },
];

test("page intelligence links owned citations to the exact crawled page", () => {
  const rows = buildPageIntelligence({ pages, prompts, observations: [observation()], lostPrompts: losses });
  const proof = rows.find((row) => row.role === "proof");
  assert.equal(proof?.status, "cited");
  assert.equal(proof?.citationEvents, 1);
  assert.deepEqual(proof?.citedProviders, ["openai"]);
  assert.equal(proof?.recommendationEventsWhenCited, 1);
});

test("uncited pages can surface as buyer-loss opportunities without claiming causality", () => {
  const rows = buildPageIntelligence({ pages, prompts, observations: [observation()], lostPrompts: losses });
  const pricing = rows.find((row) => row.role === "pricing");
  assert.equal(pricing?.status, "uncited");
  assert.equal(pricing?.relatedLostPromptCount, 1);
  assert.match(pricing?.rationale || "", /断定しません/);
});
