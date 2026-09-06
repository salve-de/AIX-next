import assert from "node:assert/strict";
import test from "node:test";
import { northStarShare } from "../lib/north-star";
import { sampleResult } from "../lib/sample-data";

function panel() {
  const prompts = Array.from({ length: 50 }, (_, i) => ({ ...sampleResult.prompts![0], id: `p${i}`, text: `固定質問${i}` }));
  return { ...sampleResult, panel: { ...sampleResult.panel, kind: "core" as const, promptCount: 50, repetitions: 1 }, prompts,
    observations: prompts.map((prompt, i) => ({ ...sampleResult.observations[0], id: `o${i}`, provider: "openai" as const, promptId: prompt.id, prompt: prompt.text, repetition: 1, status: "success" as const, model: "test-model", ownRecommended: i < 20 })) };
}

test("North Star uses fixed panel, not initially lost denominator; partial and failed responses stay visible", () => {
  const base = panel();
  const latest = panel();
  latest.observations.forEach((row, index) => { row.ownRecommended = index < 30; });
  const metric = northStarShare(latest, base).providers[0];
  assert.equal(metric.value, 60);
  assert.deepEqual(metric.comparison, {count:50,before:40,after:60});
  latest.observations.pop();
  const partial = northStarShare(latest, base).providers[0];
  assert.equal(partial.successful, 49);
  assert.equal(partial.missing, 1);
  assert.equal(partial.comparison?.count, 49);
  latest.observations.forEach(row => { row.model = "changed-model"; });
  assert.equal(northStarShare(latest, base).providers[0].comparison, null);
  assert.equal(northStarShare({...latest,panel:{...latest.panel,kind:"free"}}).status, "short-panel");
  assert.equal(northStarShare({...latest,observations:[]}).providers[0].value, null);
});
