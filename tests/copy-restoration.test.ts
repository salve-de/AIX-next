import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getSampleProfile } from "../lib/sample-profiles";

const read = (file: string) => readFileSync(file, "utf8");

test("public product copy reflects the AI buying audit contract", () => {
  const expected: Record<string, string[]> = {
    "app/page.tsx": ["AI購買監査", "候補落ち", "AIの誤情報", "問題が見つかった時", "重要な変化"],
    "app/pricing/page.tsx": ["無料AI購買監査", "AI購買Watch", "新しいAI誤情報", "新しい競合候補"],
    "app/layout.tsx": ["AI上の候補落ち・誤情報・競合変化を監視"],
    "components/buying-audit-panel.tsx": ["AI上の購買監査", "公式情報との明確な食い違い", "購入に近い質問の候補入り状況"],
    "components/site-header.tsx": ["① AI購買監査", "③ 継続Watch", "無料AI購買監査"],
    "components/site-footer.tsx": ["AI購買監査サービス", "AI購買監査の見本"],
    "components/scan-form.tsx": ["AI購買監査を無料で開始"],
  };
  for (const [file, phrases] of Object.entries(expected)) {
    const source = read(file);
    for (const phrase of phrases) assert.ok(source.includes(phrase), `${file}: missing current product copy ${phrase}`);
  }
});

test("public marketing surfaces do not restore unverified official status or timing guarantees", () => {
  for (const file of ["app/page.tsx", "app/pricing/page.tsx", "app/layout.tsx", "components/product-visuals.tsx", "components/public-profile-actions.tsx", "components/zero-effort-promise-section.tsx"]) {
    assert.doesNotMatch(read(file), /AI公式推薦|主要5大AI|10秒で即時発行|主要AIが常時自動参照|常時優先巡回/, file);
  }
  assert.match(read("components/public-profile-actions.tsx"), /内容を確認して公開する/);
  assert.match(read("components/public-profile-actions.tsx"), /公開を停止する/);
  assert.match(read("components/zero-effort-promise-section.tsx"), /30日間/);
});

test("specific business examples are segregated fictional profiles, not invented live facts", () => {
  const examples: Record<string, string> = {
    "yamada-bankin": "1〜50個の試作ロット",
    "aoba-cafe": "24席（カウンター8席・テーブル16席）",
    "aoba-souzoku": "初回相談60分無料",
    "azumino-sunshine": "家庭用りんご3kg箱・税込2,800円",
  };
  for (const [slug, value] of Object.entries(examples)) {
    const profile = getSampleProfile(slug);
    assert.ok(profile);
    assert.ok(profile.facts.some((fact) => fact.value.includes(value)));
    assert.equal(JSON.parse(profile.json).sample, true);
    assert.match(profile.markdown, /サンプルデータ/);
    assert.match(profile.sourcePages[0].description || "", /サンプルデータ/);
    assert.ok(new URL(profile.targetUrl).hostname.endsWith(".example"));
  }
  for (const file of ["lib/company-knowledge.ts", "lib/discovery.ts", "lib/positioning.ts", "lib/scan-result.ts"]) {
    for (const value of Object.values(examples)) assert.ok(!read(file).includes(value), `${file}: sample must not become a live fallback`);
  }
});

test("search and machine-readable descriptions retain the same AI buying audit purpose", () => {
  const index = JSON.parse(read("public/ai-index.json"));
  assert.match(index.description, /AI購買監査/);
  assert.match(index.description, /候補から落ち|公式情報と違う説明/);
  assert.match(read("public/llms.txt"), /AI購買監査/);
  assert.match(read("public/llms.txt"), /候補落ち|事実矛盾/);
  assert.match(read("components/structured-data.tsx"), /AI購買監査/);
  assert.match(read("app/layout.tsx"), /候補落ち・誤情報・競合変化/);
  assert.ok(index.limits.some((limit: string) => limit.includes("保証しない")));
  assert.ok(index.limits.some((limit: string) => limit.includes("顧客流出")));
});
