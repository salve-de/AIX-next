import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getSampleProfile } from "../lib/sample-profiles";

const samples = [
  { slug: "aoba-souzoku", name: "あおば相続法務事務所", url: "https://aoba-souzoku.example/", numbers: ["60分無料", "88,000円", "20時", "2〜4週間", "1日3組"] },
  { slug: "aoba-cafe", name: "青葉カフェ", url: "https://aoba-cafe.example/", numbers: ["24席", "200g", "1,400円", "5〜10分"] },
  { slug: "yamada-bankin", name: "山田板金製作所", url: "https://yamada-bankin.example/", numbers: ["1〜50個", "1.0〜3.0mm", "8,800円", "5〜10営業日"] },
  { slug: "azumino-sunshine", name: "安曇野サンシャイン果樹園", url: "https://azumino-sunshine.example/", numbers: ["3kg", "2,800円", "3〜5営業日", "1日20箱"] },
  { slug: "nexora-cloud", name: "Nexora Cloud", url: "https://nexora-cloud.example/", numbers: ["5ユーザー", "9,800円", "10GB", "14日間", "2〜3営業日"] },
];

for (const sample of samples) {
  test(`${sample.slug}: substantive fictional facts agree across page data, JSON, JSON-LD and Markdown`, () => {
    const profile = getSampleProfile(sample.slug);
    assert.ok(profile);
    assert.equal(profile.slug, sample.slug);
    assert.equal(profile.brandName, sample.name);
    assert.equal(profile.targetUrl, sample.url);
    assert.equal(new URL(profile.targetUrl).hostname, `${sample.slug}.example`);
    assert.ok(profile.sourcePages.every((page) => page.url === sample.url));
    assert.equal(profile.id, `sample_${sample.slug}`);
    assert.match(profile.summary, /見本/);
    assert.doesNotMatch(JSON.stringify(profile), /サンプル候補[A-Z]|TODO|最短即日|糖度18度/);
    assert.ok(profile.facts.length >= 7);
    const json = JSON.parse(profile.json);
    const ld = JSON.parse(profile.structuredData);
    assert.equal(json.sample, true);
    assert.equal(json.subject.name, profile.brandName);
    assert.equal(json.subject.sourceUrl, sample.url);
    assert.equal(ld.url, sample.url);
    assert.equal(ld.name, profile.brandName);
    assert.equal(ld.description, profile.summary);
    assert.deepEqual(json.facts, profile.facts);
    assert.deepEqual(json.targetCustomers, profile.targetCustomers);
    assert.deepEqual(json.useCases, profile.useCases);
    assert.deepEqual(ld.additionalProperty.map((property: { name: string; value: string }) => ({ label: property.name, value: property.value })), profile.facts.map(({ label, value }) => ({ label, value })));
    for (const fact of profile.facts) {
      assert.equal(fact.sourceUrl, sample.url);
      assert.ok(profile.markdown.includes(`- **${fact.label}**: ${fact.value}`));
    }
    for (const value of [profile.summary, ...profile.targetCustomers, ...profile.useCases]) {
      assert.ok(profile.markdown.includes(value));
    }
    const facts = profile.facts.map(({ value }) => value).join("\n");
    for (const number of sample.numbers) {
      for (const artifact of [facts, profile.json, profile.structuredData, profile.markdown]) {
        assert.ok(artifact.includes(number), `${sample.slug} missing ${number}`);
      }
    }
    assert.doesNotMatch(facts, /\b\d{2,4}-\d{2,4}-\d{4}\b|〒|丁目|番地|[\w.+-]+@[\w.-]+/);
  });
}

test("law examples qualify price and timing without invented credentials or outcomes", () => {
  const facts = getSampleProfile("aoba-souzoku")!.facts.map(({ value }) => value).join("\n");
  for (const condition of ["税込88,000円から", "実費は別途", "土曜", "必要資料が揃ってから", "期限は保証しない", "資格・登録・解決実績を示すものではない"]) {
    assert.ok(facts.includes(condition));
  }
  assert.doesNotMatch(facts, /必ず解決|成功率|認定|登録番号/);
});

test("capacity and SaaS example totals are internally consistent", () => {
  const cafe = getSampleProfile("aoba-cafe")!.facts.find(({ label }) => label === "席数・設備")!.value;
  const seats = cafe.match(/(\d+)席（カウンター(\d+)席・テーブル(\d+)席）/)!;
  assert.equal(Number(seats[1]), Number(seats[2]) + Number(seats[3]));
  const pricing = getSampleProfile("nexora-cloud")!.facts.find(({ label }) => label === "料金例")!.value;
  const amounts = [...pricing.matchAll(/税込([\d,]+)円/g)].map((match) => Number(match[1].replaceAll(",", "")));
  assert.equal(amounts[0] + (10 - 5) * amounts[1], amounts[2]);
  assert.match(pricing, /Rovanの料金ではない/);
});

test("existing HTML and download consumers retain explicit sample and noindex boundaries", () => {
  const page = readFileSync("app/ai/company/[slug]/page.tsx", "utf8");
  assert.match(page, /if \(sample\) return getSampleProfile\(slug\)/);
  assert.match(page, /robots: sample \? \{ index: false/);
  assert.match(page, /const facts = profile\.facts/);
  assert.match(page, /\{fact\.value\}/);
  for (const format of ["json", "md"]) {
    const route = readFileSync(`app/ai/company/[slug]/${format}/route.ts`, "utf8");
    assert.match(route, /searchParams\.get\("sample"\) === "1"/);
    assert.match(route, /"x-robots-tag": "noindex"/);
    assert.match(route, /getActivePublicProfileBySlug/);
  }
  assert.equal(getSampleProfile("unknown-company"), null);
});
