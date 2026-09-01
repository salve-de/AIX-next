import assert from "node:assert/strict";
import test from "node:test";
import { citationCoverage, recommendationCoverage, repeatAgreement } from "../lib/measurement";
import type { Observation } from "../lib/types";

function observation(patch: Partial<Observation>): Observation {
  return { id: "1", promptId: "p1", prompt: "test", provider: "openai", model: "test", repetition: 1, status: "success", rawText: "", citations: [], recommendedEntities: [], ownRecommended: false, ownPosition: null, firstCandidate: null, startedAt: "2026-01-01T00:00:00Z", completedAt: "2026-01-01T00:00:01Z", latencyMs: 1000, ...patch };
}

test("failed and skipped observations are excluded from recommendation denominator", () => {
  const rows = [observation({ id: "1", ownRecommended: true }), observation({ id: "2", status: "failed" }), observation({ id: "3", status: "skipped" }), observation({ id: "4", ownRecommended: false })];
  assert.equal(recommendationCoverage(rows), 50);
});

test("citation coverage includes owned subdomains", () => {
  const rows = [observation({ citations: [{ title: "a", url: "https://docs.example.com/a", domain: "docs.example.com" }] }), observation({ id: "2", citations: [{ title: "b", url: "https://other.example/b", domain: "other.example" }] })];
  assert.equal(citationCoverage(rows, "example.com"), 50);
});

test("repeat agreement uses the modal outcome signature", () => {
  const rows = [
    observation({ id: "1", repetition: 1, ownRecommended: true, ownPosition: 2, firstCandidate: "A" }),
    observation({ id: "2", repetition: 2, ownRecommended: true, ownPosition: 2, firstCandidate: "A" }),
    observation({ id: "3", repetition: 3, ownRecommended: false, ownPosition: null, firstCandidate: "B" }),
  ];
  assert.equal(repeatAgreement(rows), 67);
});
