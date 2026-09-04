import assert from "node:assert/strict";
import test from "node:test";
import { buildMarketMap } from "../lib/market-map";
import { sampleResult } from "../lib/sample-data";
import type { ScanResult } from "../lib/types";

test("market map separates discovered direct competitors from adjacent labels", () => {
  const map = buildMarketMap({ result: sampleResult, generatedAt: "2026-09-03T00:00:00.000Z" });

  assert.equal(map.generatedAt, "2026-09-03T00:00:00.000Z");
  assert.equal(map.direct[0], "弁護士法人ベリーベスト法律事務所");
  assert.ok(map.direct.includes("弁護士法人アディーレ法律事務所"));
  assert.equal(map.alternatives.includes("弁護士法人ベリーベスト法律事務所"), false);
  assert.ok(map.adjacent.includes("相続・遺産分割・事業承継の専門相談"));
  assert.ok(map.adjacent.includes("親族間の遺産分割協議"));
  assert.deepEqual(map.upstream, []);
  assert.deepEqual(map.downstream, []);
  assert.ok(map.keywords.includes("不動産・自社株の円満相続"));
  assert.equal(map.nodes?.[0]?.relation, "subject");
  assert.ok(map.limitations?.some((item) => item.includes("市場シェア")));
});

test("unknown winners are shown as observed alternatives and the subject is excluded", () => {
  const result = structuredClone(sampleResult) as ScanResult;
  result.observations[0] = {
    ...result.observations[0],
    recommendedEntities: [...result.observations[0].recommendedEntities, "NewVendor"],
  };
  result.lostPrompts = [{ ...result.lostPrompts[0], winner: "NewVendor" }];
  result.discovery.aliases = [...result.discovery.aliases, "自社の別名"];
  result.observations[1] = {
    ...result.observations[1],
    recommendedEntities: [...result.observations[1].recommendedEntities, "自社の別名"],
  };

  const map = buildMarketMap(result);
  assert.ok(map.alternatives.includes("NewVendor"));
  assert.equal(map.direct.includes("NEXORA Cloud"), false);
  assert.equal(map.alternatives.includes("自社の別名"), false);
  assert.equal(map.nodes?.find((node) => node.name === "NewVendor")?.evidenceType, "observed");
});
