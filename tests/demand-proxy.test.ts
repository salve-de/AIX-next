import assert from "node:assert/strict";
import test from "node:test";
import { buildDemandProxy } from "../lib/demand-proxy";
import { sampleResult } from "../lib/sample-data";
import type { ScanResult } from "../lib/types";

test("demand proxy ranks commercial questions without claiming search volume", () => {
  const proxy = buildDemandProxy({ result: sampleResult, generatedAt: "2026-09-03T00:00:00.000Z" });
  const lostPromptId = sampleResult.lostPrompts[0]?.promptId;
  const lost = proxy.signals.find((signal) => signal.promptId === lostPromptId);

  assert.equal(proxy.generatedAt, "2026-09-03T00:00:00.000Z");
  assert.equal(proxy.signals.length, new Set(sampleResult.observations.map((item) => item.promptId)).size);
  assert.equal(proxy.priorityPrompts.length, 5);
  assert.equal(proxy.lostPromptCount, sampleResult.lostPrompts.length);
  assert.equal(lost?.lostPrompt, true);
  assert.equal(lost?.confidence, "observed");
  assert.ok((lost?.priorityScore || 0) > 0);
  assert.ok(proxy.priorityPrompts.some((item) => item.promptId === lostPromptId));
  assert.ok(proxy.limitations?.some((item) => item.includes("検索ボリューム")));
});

test("failed observations produce an inferred signal instead of fake demand", () => {
  const result = structuredClone(sampleResult) as ScanResult;
  result.observations = result.observations.map((observation) => ({ ...observation, status: "failed", ownRecommended: false }));
  result.lostPrompts = [];
  const proxy = buildDemandProxy(result);

  assert.equal(proxy.successfulPromptCount, 0);
  assert.ok(proxy.signals.length > 0);
  assert.ok(proxy.signals.every((signal) => signal.confidence === "inferred"));
  assert.ok(proxy.signals.every((signal) => signal.successfulObservations === 0));
  assert.ok(proxy.signals.every((signal) => signal.detail.includes("再測定")) || proxy.signals.every((signal) => signal.detail.includes("成功したAI回答はありません")));
});

test("prompt records can be recovered from observations in older scans", () => {
  const result = structuredClone(sampleResult) as ScanResult;
  result.prompts = undefined;
  const proxy = buildDemandProxy(result);

  assert.equal(proxy.measuredPromptCount, new Set(result.observations.map((item) => item.promptId)).size);
  assert.ok(proxy.signals.some((signal) => signal.cluster === "comparison"));
  assert.ok(proxy.signals.some((signal) => signal.cluster === "implementation"));
});
