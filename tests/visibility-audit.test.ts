import assert from "node:assert/strict";
import test from "node:test";
import { buildAiVisibilityAudit } from "../lib/visibility-audit";
import { sampleResult } from "../lib/sample-data";

test("visibility audit turns public crawl signals into a prioritized action list", () => {
  const audit = buildAiVisibilityAudit({
    result: sampleResult,
    pages: [
      { url: "https://nexora.example/", title: "NEXORA Cloud", description: "取引先審査を整理", headings: ["サービス概要"], text: "法人向けの取引先審査サービス。料金と導入期間を案内します。", canonicalUrl: "https://nexora.example/", noindex: false, hasStructuredData: true, structuredDataTypes: ["Organization", "WebSite", "Service"], h1Count: 1 },
      { url: "https://nexora.example/cases", title: "導入事例", description: "", headings: ["導入事例"], text: "導入企業の事例です。", canonicalUrl: "https://nexora.example/cases", noindex: false, hasStructuredData: false, structuredDataTypes: [], h1Count: 1 },
    ],
    crawl: {
      robotsTxtFound: true,
      sitemapFound: true,
      sitemapUrl: "https://nexora.example/sitemap.xml",
      attempted: 2,
      pagesCrawled: 2,
      pagesBlockedByRobots: 0,
      pagesNoindex: 0,
      pagesMissingCanonical: 0,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 1,
      pagesMissingTitle: 0,
      pagesMissingDescription: 1,
      pagesMissingH1: 0,
      aiSearchBotAllowed: true,
      gptBotAllowed: true,
    },
  });

  assert.equal(audit.readiness, "needs-review");
  assert.equal(audit.priorityCheckId, "proof");
  assert.equal(audit.checks.find((item) => item.id === "crawler-access")?.status, "ready");
  assert.equal(audit.checks.find((item) => item.id === "proof")?.status, "missing");
  assert.equal(audit.checks.find((item) => item.id === "entity-clarity")?.status, "ready");
  assert.ok(audit.checks.some((item) => item.action.includes("許諾")));
});

test("a blocked crawler or home noindex is surfaced as a blocker", () => {
  const audit = buildAiVisibilityAudit({
    result: sampleResult,
    pages: [{ url: "https://nexora.example/", title: "NEXORA Cloud", description: "", headings: [], text: "", noindex: true }],
    crawl: {
      robotsTxtFound: true,
      sitemapFound: false,
      attempted: 1,
      pagesCrawled: 1,
      pagesBlockedByRobots: 0,
      pagesNoindex: 1,
      pagesMissingCanonical: 1,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 0,
      pagesMissingTitle: 0,
      pagesMissingDescription: 1,
      pagesMissingH1: 1,
      aiSearchBotAllowed: false,
      gptBotAllowed: true,
    },
  });
  assert.equal(audit.readiness, "blocked");
  assert.equal(audit.checks.find((item) => item.id === "crawler-access")?.status, "missing");
  assert.equal(audit.checks.find((item) => item.id === "indexability")?.status, "missing");
});

test("provider-specific search crawlers are distinguished from GPT training access", () => {
  const audit = buildAiVisibilityAudit({
    result: sampleResult,
    pages: [{ url: "https://nexora.example/", title: "NEXORA Cloud", description: "", headings: ["概要"], text: "法人向けサービスです。", noindex: false }],
    crawl: {
      robotsTxtFound: true,
      sitemapFound: true,
      attempted: 1,
      pagesCrawled: 1,
      pagesBlockedByRobots: 0,
      pagesNoindex: 0,
      pagesMissingCanonical: 0,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 0,
      pagesMissingTitle: 0,
      pagesMissingDescription: 0,
      pagesMissingH1: 0,
      aiSearchBotAllowed: true,
      gptBotAllowed: false,
      crawlerAccess: { "OAI-SearchBot": true, Googlebot: true, Bingbot: true, PerplexityBot: false, ClaudeBot: true, "Claude-User": true, GPTBot: false },
    },
  });
  const crawler = audit.checks.find((item) => item.id === "crawler-access");
  assert.equal(crawler?.status, "review");
  assert.match(crawler?.detail || "", /Perplexity/);
  assert.notEqual(audit.readiness, "blocked");
});

test("structured data that disagrees with visible copy needs review", () => {
  const audit = buildAiVisibilityAudit({
    result: sampleResult,
    pages: [{
      url: "https://nexora.example/",
      title: "NEXORA Cloud",
      description: "取引先審査サービス",
      headings: ["サービス概要"],
      text: "NEXORA Cloudは取引先審査を支援します。",
      noindex: false,
      hasStructuredData: true,
      structuredDataTypes: ["Organization", "Service"],
      structuredDataMatchesVisible: false,
      h1Count: 1,
    }],
    crawl: {
      robotsTxtFound: true,
      sitemapFound: true,
      attempted: 1,
      pagesCrawled: 1,
      pagesBlockedByRobots: 0,
      pagesNoindex: 0,
      pagesMissingCanonical: 0,
      pagesCanonicalMismatch: 0,
      pagesWithStructuredData: 1,
      pagesWithStructuredDataMismatch: 1,
      pagesMissingTitle: 0,
      pagesMissingDescription: 0,
      pagesMissingH1: 0,
      aiSearchBotAllowed: true,
      gptBotAllowed: true,
    },
  });
  const schema = audit.checks.find((item) => item.id === "structured-data");
  assert.equal(schema?.status, "review");
  assert.match(schema?.detail || "", /見える本文/);
});
