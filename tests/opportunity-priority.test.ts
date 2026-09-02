import assert from "node:assert/strict";
import test from "node:test";
import { buildBuyerOpportunities } from "../lib/opportunity-priority";
import { sampleResult } from "../lib/sample-data";

test("buyer opportunity queue is deterministic and bounded", () => {
  const rows = buildBuyerOpportunities(sampleResult);
  assert.equal(rows.length, sampleResult.prompts.length);
  for (const row of rows) {
    assert.ok(row.priority >= 0 && row.priority <= 100);
    assert.ok(row.lostRate >= 0 && row.lostRate <= 100);
  }
  for (let index = 1; index < rows.length; index += 1) {
    assert.ok(rows[index - 1].priority >= rows[index].priority);
  }
});

test("high-importance lost prompts outrank fully recommended prompts", () => {
  const rows = buildBuyerOpportunities(sampleResult);
  const top = rows[0];
  assert.ok(top.importance >= 4);
  assert.ok(top.lostRate > 0);
  assert.ok(top.why.length > 0);
});

test("priority is explicitly not a demand-volume field", () => {
  const top = buildBuyerOpportunities(sampleResult)[0] as unknown as Record<string, unknown>;
  assert.equal("searchVolume" in top, false);
  assert.equal("promptVolume" in top, false);
  assert.equal("marketDemand" in top, false);
});
