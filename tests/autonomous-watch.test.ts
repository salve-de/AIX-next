import assert from "node:assert/strict";
import test from "node:test";
import {
  buildMonthlyValueReport,
  detectCompetitorWebChanges,
  evaluateAutoActionImpact,
  planAndExecuteAutoActions,
} from "../lib/autonomous-watch";
import type { AutoAction, CrawledPage, ScanResult } from "../lib/types";
import { sampleResult } from "../lib/sample-data";

test("detectCompetitorWebChanges detects meaningful competitor uplift and creates CompetitorEvent", () => {
  const previous: ScanResult = {
    ...sampleResult,
    competitors: [{ name: "大手リーガルグループ", recommendedCount: 10, firstChoiceCount: 4, coverage: 50 }],
  };

  const latest: ScanResult = {
    ...sampleResult,
    competitors: [{ name: "大手リーガルグループ", recommendedCount: 15, firstChoiceCount: 6, coverage: 75 }],
  };

  const events = detectCompetitorWebChanges(latest, previous);
  assert.equal(events.length, 1);
  assert.equal(events[0].competitorName, "大手リーガルグループ");
  assert.equal(events[0].eventType, "speed_claim_added");
  assert.ok(events[0].summary.includes("大手リーガルグループ"));
  assert.equal(events[0].severity, "high");
});

test("planAndExecuteAutoActions finds verified facts from crawled pages and creates AutoAction without hallucinations", () => {
  const events = [
    {
      id: "evt_1",
      competitorName: "大手リーガルグループ",
      sourceUrl: "https://legal.example",
      eventType: "speed_claim_added" as const,
      summary: "競合が短納期訴求を強化",
      dimensions: ["納期・スピード"],
      extractedFacts: ["最短即日対応"],
      affectedPromptIds: ["p1", "p2"],
      severity: "high" as const,
      confidence: 0.9,
      detectedAt: new Date().toISOString(),
    },
  ];

  // 1. 自社サイトに一次情報が存在する場合
  const pagesWithFact: CrawledPage[] = [
    {
      url: "https://aoba.example/about",
      title: "事務所概要",
      description: "迅速な対応が強みです",
      headings: ["迅速対応"],
      text: "当事務所は最短即日での面談に対応しております。急ぎのご相談も承ります。",
    },
  ];

  const { actions, factsToApply } = planAndExecuteAutoActions({
    targetUrl: "https://aoba.example",
    events,
    crawledPages: pagesWithFact,
  });

  assert.equal(actions.length, 1);
  assert.equal(actions[0].factLabel, "対応スピード・着手体制");
  assert.equal(actions[0].sourceUrl, "https://aoba.example/about");
  assert.ok(actions[0].summary.includes("確認済み事実を自動抽出"));
  assert.equal(factsToApply.length, 1);
  assert.equal(factsToApply[0].label, "対応スピード・着手体制");

  // 2. 自社サイトに一次情報が一切ない場合（捏造防止の検証）
  const pagesWithoutFact: CrawledPage[] = [
    {
      url: "https://aoba.example/blank",
      title: "白紙ページ",
      description: "",
      headings: [],
      text: "一般的な案内のみ記載されています。",
    },
  ];

  const emptyResult = planAndExecuteAutoActions({
    targetUrl: "https://aoba.example",
    events,
    crawledPages: pagesWithoutFact,
  });

  // 一次情報がない場合は架空Factをでっち上げず、空配列であること
  assert.equal(emptyResult.actions.length, 0);
  assert.equal(emptyResult.factsToApply.length, 0);
});

test("evaluateAutoActionImpact calculates observed uplift without making absolute causal claims", () => {
  const previousActions: AutoAction[] = [
    {
      id: "act_1",
      triggerEventIds: ["evt_1"],
      actionType: "profile_fact_updated",
      factLabel: "対応スピード・着手体制",
      factValue: "即日対応",
      sourceUrl: "https://aoba.example",
      affectedPromptIds: ["prompt_1", "prompt_2"],
      summary: "台帳自動補強",
      executedAt: new Date().toISOString(),
    },
  ];

  const previous: ScanResult = {
    ...sampleResult,
    observations: [
      {
        id: "obs_1", promptId: "prompt_1", prompt: "p1", provider: "openai", model: "gpt", repetition: 1,
        status: "success", rawText: "", citations: [], recommendedEntities: [], ownRecommended: false,
        ownPosition: null, firstCandidate: null, startedAt: "", completedAt: "", latencyMs: 100,
      },
      {
        id: "obs_2", promptId: "prompt_2", prompt: "p2", provider: "openai", model: "gpt", repetition: 1,
        status: "success", rawText: "", citations: [], recommendedEntities: [], ownRecommended: false,
        ownPosition: null, firstCandidate: null, startedAt: "", completedAt: "", latencyMs: 100,
      },
    ],
  };

  const latest: ScanResult = {
    ...sampleResult,
    observations: [
      {
        id: "obs_3", promptId: "prompt_1", prompt: "p1", provider: "openai", model: "gpt", repetition: 1,
        status: "success", rawText: "", citations: [], recommendedEntities: [], ownRecommended: true,
        ownPosition: 1, firstCandidate: "あおば", startedAt: "", completedAt: "", latencyMs: 100,
      },
      {
        id: "obs_4", promptId: "prompt_2", prompt: "p2", provider: "openai", model: "gpt", repetition: 1,
        status: "success", rawText: "", citations: [], recommendedEntities: [], ownRecommended: true,
        ownPosition: 2, firstCandidate: "あおば", startedAt: "", completedAt: "", latencyMs: 100,
      },
    ],
  };

  const impacts = evaluateAutoActionImpact(previousActions, latest, previous);
  assert.equal(impacts.length, 1);
  assert.equal(impacts[0].observedUplift, 2);
  assert.equal(impacts[0].providerAgreement.openai, "improved");
  assert.ok(impacts[0].summary.includes("+2問の推薦枠獲得を客観観測"));
});


test("buildMonthlyValueReport generates complete executive monthly summary without asking for actions", () => {
  const latest = {
    observations: [{ promptId: "p1", ownRecommended: true }, { promptId: "p2", ownRecommended: true }],
    citations: [{ domain: "example.com" }, { domain: "aoba.example" }],
  };
  const previous = {
    observations: [{ promptId: "p1", ownRecommended: false }],
    citations: [{ domain: "example.com" }],
  };

  const report = buildMonthlyValueReport({
    latest,
    previous,
    competitorEvents: [
      {
        id: "evt_1",
        competitorName: "大手ライバル",
        sourceUrl: "https://rival.example",
        eventType: "speed_claim_added",
        summary: "ライバルが新訴求",
        dimensions: ["スピード"],
        extractedFacts: ["即日対応"],
        affectedPromptIds: ["p1"],
        severity: "medium",
        confidence: 0.9,
        detectedAt: "2026-09-01T00:00:00Z",
      },
    ],
    autoActions: [
      {
        id: "act_1",
        triggerEventIds: ["evt_1"],
        actionType: "profile_fact_updated",
        factLabel: "対応スピード",
        factValue: "迅速対応",
        sourceUrl: "https://aoba.example",
        affectedPromptIds: ["p1"],
        summary: "自社一次情報から反映",
        executedAt: "2026-09-02T00:00:00Z",
      },
    ],
    impacts: [
      {
        id: "imp_1",
        actionId: "act_1",
        afterScanId: "scan_latest",
        observedUplift: 1,
        affectedPromptCount: 1,
        providerAgreement: { openai: "improved", gemini: "improved", perplexity: "unchanged" },
        causalConfidence: "high",
        summary: "+1問の回復を観測",
        measuredAt: "2026-09-03T00:00:00Z",
      },
    ],
    now: "2026-09-05T00:00:00Z",
  });

  assert.equal(report.period, "2026年9月度");
  assert.ok(report.aiObservationCount >= 8);
  assert.equal(report.competitorChangeCount, 1);
  assert.equal(report.citationChangeCount, 1);
  assert.equal(report.profileUpdateCount, 1);
  assert.equal(report.autoActionCount, 1);
  assert.ok(report.observedUpliftSummary.includes("+1問のAI推薦枠"));
  assert.ok(report.topRisks.length > 0);
  assert.ok(report.upcomingTracking.length > 0);
});

test("extractCompetitorTextDiff extracts objective diff snippets without hallucinated text", () => {
  const { extractCompetitorTextDiff } = require("../lib/competitor-diff");
  const previousText = "当社は地域密着の不動産会社です。仲介業務を行っています。";
  const currentText = "当社は地域密着の不動産会社です。仲介業務を行っています。最短即日での直接買取に対応を開始しました。買取手数料無料・仲介手数料0円です。";

  const diff = extractCompetitorTextDiff({
    competitorName: "大手買取チェーン",
    sourceUrl: "https://kaitori.example",
    previousText,
    currentText,
  });

  assert.equal(diff.hasMeaningfulDiff, true);
  assert.equal(diff.competitorName, "大手買取チェーン");
  assert.ok(diff.evidences.length >= 2);
  assert.ok(diff.evidences.some((e: any) => e.dimension === "納期・対応スピード"));
  assert.ok(diff.evidences.some((e: any) => e.dimension === "料金・費用"));
  assert.ok(diff.summary.includes("大手買取チェーン"));
});

