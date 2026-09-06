import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { runWithTimeout } from "../lib/providers/common";

test("provider timeout aborts underlying work", async () => {
  let signal: AbortSignal | undefined;
  await assert.rejects(runWithTimeout(async (value) => {
    signal = value;
    return new Promise(() => {});
  }, 5), /timeout/);
  assert.equal(signal?.aborted, true);
});

test("successful provider clears timeout without aborting completed work", async () => {
  let signal: AbortSignal | undefined;
  assert.equal(await runWithTimeout(async (value) => { signal = value; return 42; }, 5), 42);
  await new Promise((resolve) => setTimeout(resolve, 15));
  assert.equal(signal?.aborted, false);
});

// Server modules run in a fresh process with fake credentials and a fail-closed network.
function serverTest(source: string) {
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--import", "tsx", "--input-type=module", "-e", `
    import assert from 'node:assert/strict';
    const load = async (path) => { const module = await import(path); return module.default || module; };
    globalThis.fetch = async () => { throw new Error('Unexpected network request'); };
    ${source}
  `], {
    cwd: process.cwd(), encoding: "utf8",
    env: { ...process.env, NODE_ENV: "test", OPENAI_API_KEY: "", GEMINI_API_KEY: "", PERPLEXITY_API_KEY: "", SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "" },
    timeout: 20_000,
  });
  assert.equal(child.status, 0, child.stderr || String(child.error));
}

test("observation checkpoints survive interruption without repeating persisted requests", () => {
  serverTest(`
    const { providers, runObservationPanel } = await load('./lib/providers/index.ts');
    let calls = 0;
    for (const provider of providers) {
      provider.configured = () => true;
      provider.run = async () => { calls++; return { rawText: '候補1 | Example | 理由', citations: [], model: 'test' }; };
    }
    const input = { prompts: [{ id: 'p1', text: 'test' }, { id: 'p2', text: 'test2' }], discovery: { brandName: 'Example', aliases: ['Example'], competitors: [] }, repetitions: 1, concurrency: 2 };
    let checkpoint = [];
    await assert.rejects(runObservationPanel({ ...input, onCheckpoint: async (rows) => { checkpoint = rows; throw new Error('process interrupted'); } }), /interrupted/);
    assert.equal(checkpoint.length, 2);
    const rows = await runObservationPanel({ ...input, existingObservations: checkpoint });
    assert.equal(rows.length, 6);
    assert.equal(calls, 6);
    assert.equal(new Set(rows.map(row => row.promptId + row.provider + row.repetition)).size, 6);
  `);
});

test("empty and failed provider responses remain failed observations", () => {
  serverTest(`
    const { providers, runObservationPanel } = await load('./lib/providers/index.ts');
    for (const provider of providers) {
      provider.configured = () => true;
      provider.run = async () => ({ rawText: '  ', citations: [], model: 'test' });
    }
    providers[0].run = async () => { throw new Error('unavailable'); };
    const rows = await runObservationPanel({ prompts: [{ id: 'p1', text: 'test' }], discovery: {}, repetitions: 1 });
    assert.equal(rows.length, 3);
    assert.ok(rows.every(row => row.status === 'failed'));
  `);
});

test("scan refuses missing primary provider before storage or crawl", () => {
  serverTest(`
    const { POST } = await load('./app/api/scan/route.ts');
    const response = await POST(new Request('https://example.com/api/scan', { method: 'POST', body: JSON.stringify({ url: 'https://example.com' }) }));
    assert.equal(response.status, 503);
  `);
});

test("partial result completeness uses the scheduled panel, including missing observations", () => {
  serverTest(`
    const { sampleResult } = await load('./lib/sample-data.ts');
    const { buildScanResult } = await load('./lib/scan-result.ts');
    const result = await buildScanResult({ scanId: 'partial-test', targetUrl: sampleResult.targetUrl, discovery: sampleResult.discovery, prompts: sampleResult.prompts.slice(0, 2), repetitions: 1, panelKind: 'free', observations: [sampleResult.observations[0]], pages: [] });
    assert.equal(result.scheduledObservations, 6);
    assert.equal(result.successfulObservations, 1);
    assert.equal(result.measurementCompleteness, 17);
    assert.ok(result.warnings.some(warning => warning.includes('一部')));
  `);
});

test("Watch checkpoints preserve latest result while a prompt batch is unfinished", () => {
  serverTest(`
    const { env } = await load('./lib/env.ts');
    env.watchPromptBatchSize = 1;
    const { sampleWatch } = await load('./lib/sample-data.ts');
    const { processWatchMeasurement } = await load('./lib/watch-measurement.ts');
    const { getActiveWatchRun } = await load('./lib/watch-runs.ts');
    const { providers } = await load('./lib/providers/index.ts');
    let calls = 0;
    for (const provider of providers) {
      provider.configured = () => true;
      provider.run = async () => { calls++; return { rawText: '回答', citations: [], model: 'test' }; };
    }
    const watch = sampleWatch();
    watch.paid = false;
    watch.latest.prompts = watch.latest.prompts.slice(0, 3);
    globalThis.aixNextWatches.set(watch.token, watch);
    const latestId = watch.latest.scanId;
    const first = await processWatchMeasurement(watch);
    assert.equal(first.status, 'in_progress');
    const persisted = await getActiveWatchRun(watch.id);
    assert.equal(persisted.nextPromptIndex, 1);
    assert.equal(persisted.observations.length, 3);
    const second = await processWatchMeasurement(globalThis.aixNextWatches.get(watch.token));
    assert.equal(second.status, 'in_progress');
    assert.equal(calls, 6);
    assert.equal((await getActiveWatchRun(watch.id)).nextPromptIndex, 2);
    assert.equal(globalThis.aixNextWatches.get(watch.token).latest.scanId, latestId);
  `);
});
