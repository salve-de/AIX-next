import assert from "node:assert/strict";
import test from "node:test";
import { buildSelectedPublicProfileDraft } from "../lib/profile-selection";
import { buildDirectPublicProfileDraft, toPublicProfile } from "../lib/public-profile";
import { sampleResult } from "../lib/sample-data";
import type { CrawledPage, PublicProfile, ScanResult, StrategyOption } from "../lib/types";

const strategy = (id: string, name: string) => ({ id, name, targetMarket: name, coreThesis: "全国最安の架空実績", deliverables: { profile: { text: "絶対に推薦されます" } } }) as StrategyOption;
function result(): ScanResult {
  return { ...structuredClone(sampleResult), targetUrl: "https://source.example/", positioning: { ...sampleResult.positioning!, strategies: [strategy("a", "相続"), strategy("b", "不動産"), strategy("c", "航空整備")] } };
}
function page(text: string, url = "https://source.example/"): CrawledPage {
  return { url, title: "会社案内", description: "", headings: [], text };
}
const values = (output: ReturnType<typeof buildSelectedPublicProfileDraft>) => output.draft.facts.map((fact) => fact.value);

test("flat address and opening-hour fields survive without Japanese sentence punctuation", () => {
  const output = buildSelectedPublicProfileDraft(result(), [page("所在地 東京都港区 営業時間 平日9:00〜18:00 定休日 土日祝日")], "a");
  assert.equal(output.selection.status, "ready");
  assert.equal(output.selection.reason, "strategy_no_match");
  assert.deepEqual(values(output), ["東京都港区", "平日9:00〜18:00", "土日祝日"]);
  assert.ok(output.draft.facts.every((fact) => fact.provenance === "source_excerpt" && fact.sourceUrl === "https://source.example/"));
});

test("line and flat bullet source text can support a selected specialty", () => {
  for (const text of ["• 相続相談専門 • 不動産手続きの相談受付", "- 相続相談専門\n- 不動産手続きの相談受付"]) {
    const output = buildSelectedPublicProfileDraft(result(), [page(text)], "a");
    assert.equal(output.selection.status, "ready");
    assert.ok(values(output).includes("相続相談専門"));
    assert.doesNotMatch(output.draft.markdown, /不動産手続き/);
  }
});

test("genuinely source-confirmed baseline fields survive changing the selected strategy", () => {
  const scan = result();
  Object.assign(scan.discovery, { summary: "地域密着の相談窓口です。", market: "法務相談専門", targetCustomers: ["地域の中小企業"], useCases: ["事業承継の相談"] });
  const source = page("地域密着の相談窓口です。\n法務相談専門\n地域の中小企業\n事業承継の相談\n所在地：東京都港区\n相続の相談を受け付けています。不動産の手続きを受け付けています。");
  for (const id of ["a", "b", "c"]) {
    const output = buildSelectedPublicProfileDraft(scan, [source], id);
    assert.equal(output.draft.summary, scan.discovery.summary);
    assert.equal(output.draft.market, scan.discovery.market);
    assert.deepEqual(output.draft.targetCustomers, scan.discovery.targetCustomers);
    assert.deepEqual(output.draft.useCases, scan.discovery.useCases);
    assert.ok(values(output).includes("東京都港区"));
    assert.doesNotMatch(output.draft.markdown + output.draft.json, /全国最安|絶対に推薦/);
  }
});

test("baseline inference or a negated substring never counts as source confirmation", () => {
  const scan = result();
  Object.assign(scan.discovery, { summary: "全国最安", market: "不動産専門", targetCustomers: ["上場企業"], useCases: ["国際相続"] });
  const output = buildSelectedPublicProfileDraft(scan, [page("当社は不動産専門ではありません。所在地：東京都港区")], "a");
  assert.equal(output.draft.summary, "");
  assert.equal(output.draft.market, "");
  assert.deepEqual(output.draft.targetCustomers, []);
  assert.deepEqual(output.draft.useCases, []);
  assert.doesNotMatch(output.draft.json, /全国最安|上場企業|国際相続/);
});

test("no source, no extract and no selected evidence have explicit reasons for the API", () => {
  const scan = result();
  for (const [pages, reason] of [
    [[], "no_eligible_sources"],
    [[{ ...page("所在地：東京都港区"), noindex: true }], "no_eligible_sources"],
    [[page("所在地：東京都港区", "https://unrelated.example/")], "no_eligible_sources"],
    [[page("メニュー")], "no_source_facts"],
    [[page("不動産の相談を受け付けています。")], "strategy_no_match"],
    [[page("a".repeat(30_000))], "no_eligible_sources"],
  ] as Array<[CrawledPage[], string]>) {
    const output = buildSelectedPublicProfileDraft(scan, pages, "a");
    assert.equal(output.selection.status, "empty");
    assert.equal(output.selection.reason, reason);
    assert.equal(output.draft.facts.length, 0);
  }
});

function sourceProfile(): PublicProfile {
  const targetUrl = "https://rovan.example/ai/company/direct-input";
  const draft = buildDirectPublicProfileDraft({ brandName: "入力会社", location: "東京都全域の相続相談に対応しています。" });
  return toPublicProfile({ ...draft, targetUrl, facts: draft.facts.map((fact) => ({ ...fact, sourceUrl: targetUrl })),
    id: "p", slug: "direct-input", token: "owner-only", sourceScanId: "direct-creation", status: "published",
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString() });
}

test("raw Rovan input and neighboring company pages cannot become independently supported facts", () => {
  const scan = { ...result(), targetUrl: "https://rovan.example/ai/company/direct-input" };
  const pages = [page("東京都全域の相続相談に対応しています。（入力情報・参照元未確認）", scan.targetUrl), page("航空整備の専門資格を保有しています。", "https://rovan.example/ai/company/unrelated")];
  const output = buildSelectedPublicProfileDraft(scan, pages, "a");
  assert.equal(output.selection.status, "empty");
  assert.equal(output.selection.reason, "source_provenance_required");
  assert.equal(output.selection.supportedFactCount, 0);
  assert.doesNotMatch(output.draft.json, /東京都全域|航空整備の専門資格/);
  for (const suffix of ["/md", "/json", ""]) {
    const targetUrl = `${scan.targetUrl}${suffix}`;
    const unmarked = buildSelectedPublicProfileDraft({ ...scan, targetUrl }, [page("相続相談に対応しています。", targetUrl)], "a");
    assert.equal(unmarked.selection.reason, "source_provenance_required", "internal paths are blocked even without an unverified marker");
  }
});

test("server-supplied original profile preserves company-asserted provenance across the re-scan path", () => {
  const original = sourceProfile();
  const scan = { ...result(), targetUrl: original.targetUrl };
  const output = buildSelectedPublicProfileDraft(scan, [page("架空の国家資格に対応しています。", scan.targetUrl)], "a", { sourceProfile: original });
  assert.equal(output.selection.status, "ready");
  assert.equal(output.selection.supportedFactCount, 0);
  assert.equal(output.selection.assertedFactCount, original.facts.length);
  assert.deepEqual(output.draft.facts, original.facts);
  assert.equal(output.draft.brandName, original.brandName, "the re-scan's inferred company name cannot replace the original subject");
  assert.match(output.draft.markdown, /入力情報・参照元未確認/);
  assert.doesNotMatch(output.draft.json, /架空の国家資格|owner-only/);
  assert.equal(JSON.parse(output.draft.structuredData).knowsAbout, undefined);
});

test("structured source must match the page, be live, and never upgrade ambiguous legacy facts", () => {
  const original = sourceProfile();
  const scan = { ...result(), targetUrl: original.targetUrl };
  for (const source of [{ ...original, slug: "other" }, { ...original, status: "revoked" as const }, { ...original, expiresAt: "2000-01-01T00:00:00Z" }]) {
    assert.equal(buildSelectedPublicProfileDraft(scan, [], "", { sourceProfile: source }).selection.status, "empty");
  }
  const legacy = { ...original, facts: original.facts.map((fact) => ({ ...fact, provenance: undefined })) };
  const output = buildSelectedPublicProfileDraft(scan, [], "", { sourceProfile: legacy });
  assert.equal(output.selection.supportedFactCount, 0);
  assert.ok(output.draft.facts.every((fact) => fact.provenance === "company_asserted"));
});

test("external input annotations survive sentence splitting instead of promoting adjacent claims", () => {
  const output = buildSelectedPublicProfileDraft(result(), [page("相続相談に対応しています。（入力情報・参照元未確認）")], "a");
  assert.equal(output.selection.supportedFactCount, 0);
  assert.equal(output.selection.assertedFactCount, 1);
  assert.match(output.draft.markdown, /入力情報・参照元未確認/);
});

test("a structured Rovan source retains external confirmed facts but not inferred metadata", () => {
  const original = sourceProfile();
  original.facts.push({ label: "対応地域", value: "東京都港区", sourceUrl: "https://source.example/area", provenance: "source_excerpt" });
  original.market = "全国最安の専門店";
  const output = buildSelectedPublicProfileDraft({ ...result(), targetUrl: original.targetUrl }, [], "a", { sourceProfile: original });
  assert.equal(output.selection.supportedFactCount, 1);
  assert.ok(output.draft.facts.some((fact) => fact.value === "東京都港区" && fact.provenance === "source_excerpt"));
  assert.equal(output.draft.market, "");
  assert.doesNotMatch(output.draft.json, /全国最安/);
});

test("a complete multi-sentence source paragraph preserves the confirmed baseline summary", () => {
  const scan = result();
  scan.discovery.summary = "地域密着の相談窓口です。予約は平日に受け付けています。";
  const output = buildSelectedPublicProfileDraft(scan, [page(`${scan.discovery.summary}\n所在地 東京都港区`)], "c");
  assert.equal(output.draft.summary, scan.discovery.summary);
  assert.equal(output.selection.status, "ready");
});
