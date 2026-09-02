import assert from "node:assert/strict";
import test from "node:test";
import { extractRecommendedEntities } from "../lib/entity-extraction";
import type { CompanyDiscovery } from "../lib/types";

const discovery: CompanyDiscovery = {
  legalName: "社会情報株式会社",
  brandName: "社会情報Cloud",
  domain: "shakai.example",
  summary: "test",
  market: "test market",
  targetCustomers: [],
  useCases: [],
  aliases: ["社会情報Cloud", "社会情報株式会社"],
  competitors: [
    { name: "KnownVendor", domain: "known.example", reason: "test", confidence: .9 },
  ],
  confidence: .9,
};

test("structured candidate rows retain competitors that discovery did not know", () => {
  const text = [
    "候補1 | NewSignal | 導入実績が公開されている",
    "候補2 | KnownVendor | 価格が明確",
    "候補3 | 社会情報株式会社 | 自社も候補",
  ].join("\n");
  assert.deepEqual(extractRecommendedEntities(text, discovery), ["NewSignal", "KnownVendor", "社会情報Cloud"]);
});

test("fallback alias matching preserves Japanese company-name characters", () => {
  const text = [
    "1. KnownVendor は価格が明確です。",
    "2. 社会情報Cloud は導入条件を公開しています。",
  ].join("\n");
  assert.deepEqual(extractRecommendedEntities(text, discovery), ["KnownVendor", "社会情報Cloud"]);
});
