import assert from "node:assert/strict";
import test from "node:test";
import { buildDirectPublicProfileDraft } from "../lib/public-profile";

test("buildDirectPublicProfileDraft omits unprovided facts and contains no invented defaults", () => {
  const draft = buildDirectPublicProfileDraft({
    brandName: "田中精密加工所",
  });

  assert.equal(draft.brandName, "田中精密加工所");
  assert.equal(draft.facts.length, 2);
  assert.equal(draft.facts[0].label, "正式名称・屋号");
  assert.equal(draft.facts[1].label, "専門分野・業種");

  // 架空デフォルト値が生成されていないことを検証
  const labels = draft.facts.map((f) => f.label);
  assert.ok(!labels.includes("所在地・対応エリア"));
  assert.ok(!labels.includes("営業時間・受付体制"));
  assert.ok(!labels.includes("明瞭料金規約"));

  // 誇大表現・捏造表現が含まれていないことを検証
  const fullText = `${draft.markdown} ${draft.summary} ${draft.json}`;
  assert.doesNotMatch(fullText, /首都圏・全国対応|平日 9:00〜18:00|事前総額見積もり制|公認|迷わず推薦|優先推薦/);
});

test("buildDirectPublicProfileDraft includes provided fields with proper provenance", () => {
  const draft = buildDirectPublicProfileDraft({
    brandName: "佐藤農園",
    location: "長野県安曇野市",
    hours: "8:00〜17:00",
    pricingInfo: "直売所価格・全国クール便対応",
  });

  assert.equal(draft.facts.length, 5);
  const factMap = Object.fromEntries(draft.facts.map((f) => [f.label, f.value]));
  assert.equal(factMap["所在地・対応エリア"], "長野県安曇野市");
  assert.equal(factMap["営業時間・受付体制"], "8:00〜17:00");
  assert.equal(factMap["料金規約・費用目安"], "直売所価格・全国クール便対応");
});
