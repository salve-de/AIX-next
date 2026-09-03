import assert from "node:assert/strict";
import test from "node:test";
import { buildContentQuality } from "../lib/content-quality";
import { sampleResult } from "../lib/sample-data";
import type { CrawledPage } from "../lib/types";

const goodPage: CrawledPage = {
  url: "https://nexora.example/",
  title: "NEXORA Cloud | 取引先審査",
  description: "法務・購買部門向けに取引先審査と委託先リスク評価を支援するサービス。料金と導入事例を案内します。",
  headings: ["NEXORA Cloud", "取引先審査を、短く正確に"],
  text: "NEXORA Cloudは従業員100〜500名の企業向けに、取引先審査・委託先リスク評価を提供します。料金、導入期間、導入事例、顧客レビューをご確認ください。資料請求・デモはこちら。",
  canonicalUrl: "https://nexora.example/",
  noindex: false,
  hasStructuredData: true,
  structuredDataTypes: ["Organization", "Service"],
  structuredDataMatchesVisible: true,
  h1Count: 1,
};

const weakPage: CrawledPage = {
  url: "https://nexora.example/old",
  title: "",
  description: "",
  headings: [],
  text: "短いページ",
  noindex: true,
  hasStructuredData: true,
  structuredDataMatchesVisible: false,
  h1Count: 0,
};

test("content quality exposes page-level facts and a compact relative score", () => {
  const report = buildContentQuality({ result: sampleResult, pages: [goodPage, weakPage], generatedAt: "2026-09-03T00:00:00.000Z" });
  const good = report.pages[0];
  const weak = report.pages[1];

  assert.equal(report.generatedAt, "2026-09-03T00:00:00.000Z");
  assert.equal(report.pages.length, 2);
  assert.ok((good?.score || 0) > (weak?.score || 0));
  assert.equal(good?.checks.find((item) => item.id === "heading")?.status, "ready");
  assert.equal(weak?.checks.find((item) => item.id === "title")?.status, "missing");
  assert.equal(weak?.checks.find((item) => item.id === "indexability")?.status, "missing");
  assert.equal(weak?.checks.find((item) => item.id === "structured-data")?.status, "review");
  assert.ok(report.summary.missing >= 1);
  assert.ok(report.limitations?.some((item) => item.includes("GA4")));
});

test("duplicate metadata is surfaced as a review on affected pages", () => {
  const pages: CrawledPage[] = [
    { ...goodPage, url: "https://nexora.example/a" },
    { ...goodPage, url: "https://nexora.example/b" },
  ];
  const report = buildContentQuality({ pages, result: sampleResult });

  assert.equal(report.pages[0]?.checks.find((item) => item.id === "duplicate-title")?.status, "review");
  assert.equal(report.pages[1]?.checks.find((item) => item.id === "duplicate-description")?.status, "review");
  assert.equal(report.summary.review, 2);
});

test("an empty crawl returns no invented page findings", () => {
  const report = buildContentQuality({ pages: [], targetUrl: "https://empty.example", generatedAt: "2026-09-03T00:00:00.000Z" });

  assert.deepEqual(report.pages, []);
  assert.deepEqual(report.summary, { ready: 0, review: 0, missing: 0 });
  assert.equal(report.targetUrl, "https://empty.example");
  assert.ok(report.limitations?.some((item) => item.includes("公開ページ")));
});
