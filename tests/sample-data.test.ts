import assert from "node:assert/strict";
import test from "node:test";
import { sampleResult, sampleWatch } from "../lib/sample-data";
import type { ScanResult } from "../lib/types";
import { sampleAiReadable } from "../lib/sample-report-content";
import { getSampleProfile } from "../lib/sample-profiles";

function shortlistedPromptCount(result: ScanResult) {
  return result.panel.promptCount - result.lostPrompts.length;
}

function entityPromptWins(result: ScanResult, entity: string) {
  const promptIds = [...new Set(result.observations.map((item) => item.promptId))];
  return promptIds.filter((promptId) => {
    const rows = result.observations.filter((item) => item.promptId === promptId && item.status === "success");
    const wins = rows.filter((item) => item.recommendedEntities.includes(entity)).length;
    return rows.length > 0 && wins >= Math.ceil(rows.length / 2);
  }).length;
}

function assertObservationTotals(result: ScanResult) {
  assert.equal(result.successfulObservations, result.observations.filter((item) => item.status === "success").length);
  assert.equal(result.ownRecommendationCount, result.observations.filter((item) => item.status === "success" && item.ownRecommended).length);
}

test("fictional baseline is internally consistent with the rank-first UI", () => {
  assertObservationTotals(sampleResult);
  assert.equal(sampleResult.marketSize, 13);
  assert.equal(sampleResult.marketPosition, 9);
  assert.equal(sampleResult.panel.promptCount, 12);
  assert.equal(shortlistedPromptCount(sampleResult), 2);
  assert.equal(sampleResult.lostPrompts.length, 10);
  assert.equal(sampleResult.ownRecommendationCount, 8);
  assert.equal(sampleResult.successfulObservations, 36);

  const leader = sampleResult.competitors[0];
  assert.equal(leader.name, "月澄相続パートナーズ");
  assert.equal(entityPromptWins(sampleResult, leader.name), 7);
});

test("fictional Watch movement is derived from the latest observation set", () => {
  const watch = sampleWatch();
  assertObservationTotals(watch.latest);
  assert.equal(watch.baseline.marketPosition, 9);
  assert.equal(watch.latest.marketPosition, 7);
  assert.equal(shortlistedPromptCount(watch.baseline), 2);
  assert.equal(shortlistedPromptCount(watch.latest), 4);
  assert.equal(watch.baseline.lostPrompts.length, 10);
  assert.equal(watch.latest.lostPrompts.length, 8);
  assert.equal(watch.baseline.ownRecommendationCount, 8);
  assert.equal(watch.latest.ownRecommendationCount, 10);
});

test("sample reports contain fictional names and substantive shared draft facts", () => {
  const watch = sampleWatch();
  for (const result of [sampleResult, watch.latest]) {
    assert.doesNotMatch(JSON.stringify(result), /サンプル候補[A-Z]|候補文字列/);
    assert.ok(result.competitors.every(company => !company.name.includes("架空")));
    assert.ok(result.observations.every(row => row.rawText.includes("AI回答の見本")));
  }
  const draft = sampleAiReadable();
  const profile = getSampleProfile("aoba-souzoku")!;
  assert.equal(draft.llmsTxt, profile.markdown);
  assert.equal(draft.jsonLd, profile.structuredData);
  assert.ok(watch.changePack?.items.length);
  const content = JSON.stringify(watch.changePack);
  for (const fact of ["88,000", "60分", "20時", "2〜4週間"]) assert.ok(content.includes(fact));
});
