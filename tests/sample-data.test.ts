import assert from "node:assert/strict";
import test from "node:test";
import { sampleResult, sampleWatch } from "../lib/sample-data";
import type { ScanResult } from "../lib/types";

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
  assert.equal(leader.name, "弁護士法人ベリーベスト法律事務所");
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
