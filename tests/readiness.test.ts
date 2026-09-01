import assert from "node:assert/strict";
import test from "node:test";
import { auditSiteReadiness } from "../lib/readiness";
import type { CrawledPage } from "../lib/types";

const pages: CrawledPage[] = [
  { url: "https://example.com/", title: "Example SaaS", description: "B2B SaaS", headings: ["Example SaaS"], text: "x".repeat(700) },
  { url: "https://example.com/pricing", title: "料金", description: "料金プラン", headings: ["料金"], text: "x".repeat(700) },
  { url: "https://example.com/case", title: "導入事例", description: "導入実績", headings: ["導入事例"], text: "x".repeat(700) },
  { url: "https://example.com/security", title: "Security", description: "Security", headings: ["Security"], text: "x".repeat(700) },
  { url: "https://example.com/docs", title: "Docs", description: "Help", headings: ["Docs"], text: "x".repeat(700) },
];

test("readiness detects explicit OAI-SearchBot block without inventing traffic", () => {
  const readiness = auditSiteReadiness({ pages, sitemapFound: true, robots: "User-agent: OAI-SearchBot\nDisallow: /\nUser-agent: *\nAllow: /" });
  assert.equal(readiness.checks.find((item) => item.id === "bot-oai-searchbot")?.status, "fail");
  assert.equal(readiness.checks.find((item) => item.id === "bot-googlebot")?.status, "pass");
  assert.equal(readiness.failCount, 1);
});

test("missing robots and sitemap are warnings rather than fabricated failures", () => {
  const readiness = auditSiteReadiness({ pages, sitemapFound: false, robots: "" });
  assert.equal(readiness.checks.find((item) => item.id === "robots")?.status, "warn");
  assert.equal(readiness.checks.find((item) => item.id === "sitemap")?.status, "warn");
  assert.equal(readiness.checks.find((item) => item.id === "bot-oai-searchbot")?.status, "pass");
});

test("commercial proof pages are recognized independently", () => {
  const readiness = auditSiteReadiness({ pages, sitemapFound: true, robots: "User-agent: *\nAllow: /" });
  for (const id of ["pricing", "proof", "security", "support"]) assert.equal(readiness.checks.find((item) => item.id === id)?.status, "pass");
});
