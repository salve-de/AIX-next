import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { indexableRoutes } from "../lib/site";

test("unconfigured contact and seller pages do not expose unfinished notices", () => {
  const support = readFileSync("app/support/page.tsx", "utf8");
  const commerce = readFileSync("app/commerce/page.tsx", "utf8");
  assert.match(support, /if \(!seller\.email\) notFound\(\)/);
  assert.match(commerce, /if \(!sellerReady\(\)\) notFound\(\)/);
  assert.doesNotMatch(support + commerce, /受付を開始していません|未掲載（販売受付前）/);
  assert.match(readFileSync("app/api/billing/checkout/route.ts", "utf8"), /sellerReady/);
});

test("default navigation omits unavailable destinations but keeps user controls", () => {
  const footer = readFileSync("components/site-footer.tsx", "utf8");
  assert.doesNotMatch(footer, /href="\/(support|commerce)"/);
  assert.match(footer, /href="\/manage"/);
  assert.match(footer, /\/data-rights/);
  assert.ok(!indexableRoutes.some(route => ["/support", "/commerce"].includes(route)));
  assert.doesNotMatch(readFileSync("components/data-rights-client.tsx", "utf8"), /お問い合わせ窓口/);
});
