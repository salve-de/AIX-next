import assert from "node:assert/strict";
import test from "node:test";
import { buildContentQuality } from "../lib/content-quality";
import { buildDemandProxy } from "../lib/demand-proxy";
import { buildMarketMap } from "../lib/market-map";
import { sampleWatch } from "../lib/sample-data";
import { toPublicWatch, toPublicWatchMeasurementRun } from "../lib/public-dto";
import type { WatchMeasurementRun } from "../lib/types";

test("Watch DTO omits bearer, contact, billing, and raw provider fields", () => {
  const watch = sampleWatch();
  watch.stripeCustomerId = "cus_private";
  watch.stripeSubscriptionId = "sub_private";
  const publicWatch = toPublicWatch(watch);
  const serialized = JSON.stringify(publicWatch);

  assert.equal("token" in publicWatch, false);
  assert.equal("email" in publicWatch, false);
  assert.equal("stripeCustomerId" in publicWatch, false);
  assert.equal("stripeSubscriptionId" in publicWatch, false);
  assert.equal("rawText" in publicWatch.latest.observations[0], false);
  assert.equal("costUsd" in publicWatch.latest.observations[0], false);
  assert.equal("observations" in publicWatch.latest.lostPrompts[0], false);
  assert.equal(serialized.includes("cus_private"), false);
  assert.equal(serialized.includes("sub_private"), false);
});

test("Watch measurement DTO exposes progress without prompts or answers", () => {
  const run: WatchMeasurementRun = {
    id: "run_private",
    watchId: "watch_private",
    watchToken: "token_private",
    status: "running",
    targetUrl: "https://example.com/",
    discovery: sampleWatch().latest.discovery,
    prompts: sampleWatch().latest.prompts || [],
    panelKind: "core",
    repetitions: 3,
    switchToCore: false,
    nextPromptIndex: 2,
    observations: sampleWatch().latest.observations,
    error: null,
    createdAt: "2026-09-03T00:00:00.000Z",
    updatedAt: "2026-09-03T00:01:00.000Z",
  };
  const summary = toPublicWatchMeasurementRun(run);

  assert.deepEqual(summary, {
    status: "running",
    panelKind: "core",
    completedPrompts: 2,
    totalPrompts: run.prompts.length,
    completedObservations: run.observations.length,
    totalObservations: run.prompts.length * 9,
    updatedAt: run.updatedAt,
  });
  assert.equal("watchToken" in summary, false);
  assert.equal("observations" in summary, false);
});

test("public scan DTO keeps decision summaries but no operational internals", () => {
  const watch = sampleWatch();
  watch.latest.marketMap = buildMarketMap(watch.latest);
  watch.latest.demandProxy = buildDemandProxy(watch.latest);
  watch.latest.contentQuality = buildContentQuality({ result: watch.latest, pages: [] });
  const result = watch.latest;
  const publicResult = toPublicWatch(watch).latest;
  assert.equal("rawText" in publicResult.observations[0], false);
  assert.equal("totalCostUsd" in publicResult, false);
  assert.equal(publicResult.marketMap?.subject?.name, result.marketMap?.subject?.name);
  assert.equal(publicResult.demandProxy?.measuredPromptCount, result.demandProxy?.measuredPromptCount);
  assert.equal(publicResult.contentQuality?.summary.ready, result.contentQuality?.summary.ready);
});
