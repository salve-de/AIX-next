import assert from "node:assert/strict";
import test from "node:test";
import { buildMarketMap } from "../lib/market-map";
import { sampleResult } from "../lib/sample-data";
import type { ScanResult } from "../lib/types";

test("market map separates discovered direct competitors from adjacent labels", () => {
  const map = buildMarketMap({ result: sampleResult, generatedAt: "2026-09-03T00:00:00.000Z" });

  assert.equal(map.generatedAt, "2026-09-03T00:00:00.000Z");
  assert.equal(map.direct[0], "TrustOrbit");
  assert.ok(map.direct.includes("VendorLens"));
  assert.equal(map.alternatives.includes("TrustOrbit"), false);
  assert.ok(map.adjacent.includes("取引先リスク管理SaaS"));
  assert.ok(map.adjacent.includes("取引先審査"));
  assert.ok(map.adjacent.includes("法務・購買・情報システム部門"));
  assert.deepEqual(map.upstream, []);
  assert.deepEqual(map.downstream, []);
  assert.ok(map.keywords.includes("委託先リスク評価"));
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
