import assert from "node:assert/strict";
import test from "node:test";
import { buildAiReadableDraft } from "../lib/ai-readable";
import { sampleResult } from "../lib/sample-data";

test("AI-readable draft is based on crawled public pages, not private measurement details", () => {
  const draft = buildAiReadableDraft({
    result: sampleResult,
    pages: [
      { url: "https://nexora.example/service", title: "サービス概要", description: "機能と利用方法", headings: ["機能"], text: "公開ページの本文" },
      { url: "https://nexora.example/", title: "あおば相続法務事務所 | 相続専門相談", description: "相続・遺産分割の相談を整理する専門事務所。", headings: ["サービス概要"], text: "公開ページの本文" },
    ],
  });

  const schema = JSON.parse(draft.jsonLd) as { "@graph": Array<{ "@type": string; name?: string; hasPart?: Array<{ url: string }> }> };
  const website = schema["@graph"].find((item) => item["@type"] === "WebSite");
  const organization = schema["@graph"].find((item) => item["@type"] === "Organization");
  assert.equal(website?.name, "あおば相続法務事務所");
  assert.equal(website?.hasPart?.length, 2);
  assert.equal(organization?.name, "あおば相続法務事務所");
  assert.match(draft.llmsTxt, /# あおば相続法務事務所/);
  assert.match(draft.llmsTxt, /https:\/\/nexora\.example\/service/);
  assert.doesNotMatch(draft.llmsTxt, /大手全国展開リーガルグループ|候補外|競合に流れた質問/);
  assert.deepEqual(draft.sourcePages.map((page) => page.url), ["https://nexora.example/service", "https://nexora.example/"]);
});
