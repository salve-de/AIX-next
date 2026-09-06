import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function harness(durable = true) {
  let watch: any = { id: "watch_one", token: "token_one", email: "owner@example.com", scanId: "scan_one", paid: false };
  const calls: Array<{ url: string; body: any }> = [];
  const runs = new Map([
    ["own", { id: "own", watchId: "watch_one", watchToken: "token_one" }],
    ["other", { id: "other", watchId: "watch_other", watchToken: "private_other" }],
  ]);
  let responder: (url: string, body: any) => Response = () => Response.json({ deleted: true, subscriptionCancelled: false, completedAt: "test" });
  const mocks: Record<string, unknown> = {
    "server-only": {},
    "@/lib/env": { env: durable ? { supabaseUrl: "https://test.invalid", supabaseServiceKey: "test-only" } : {} },
    "@/lib/storage": {
      getWatch: async (token: string) => token === watch?.token ? watch : null,
      getScan: async (id: string) => ({ id }),
      deleteMemoryWatchData: () => true,
    },
  };
  const loaded = { exports: {} as any };
  const source = ts.transpileModule(readFileSync("lib/privacy-data.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, {
    module: loaded, exports: loaded.exports, AbortSignal, aixNextWatchRuns: runs,
    fetch: async (url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body)); calls.push({ url, body }); return responder(url, body);
    },
    require(name: string) { if (name in mocks) return mocks[name]; throw new Error(`Unexpected import ${name}`); },
  });
  return { service: loaded.exports, calls, setResponder(fn: typeof responder) { responder = fn; }, clearWatch() { watch = null; } };
}

test("privacy delete issues one atomic RPC and retries failure without deleting via REST", async () => {
  const h = harness();
  h.setResponder(() => new Response("internal secret", { status: 500 }));
  await assert.rejects(h.service.deleteWatchData("token_one", "owner@example.com"), /500/);
  h.setResponder(() => Response.json({ deleted: true, subscriptionCancelled: false, completedAt: "test" }));
  assert.equal((await h.service.deleteWatchData("token_one", "owner@example.com")).deleted, true);
  assert.equal(h.calls.length, 2);
  assert.ok(h.calls.every(call => call.url.endsWith("/rpc/aix_next_delete_watch_data")));
  assert.equal(h.calls[0].body.p_expected_subscription_id, null);
});

test("privacy service recovers the authenticated receipt after Watch was committed deleted", async () => {
  const h = harness(); h.clearWatch();
  const result = await h.service.deleteWatchData("token_one", " OWNER@EXAMPLE.COM ");
  assert.equal(result.deleted, true);
  assert.equal(h.calls[0].body.p_token, "token_one");
  assert.equal(h.calls[0].body.p_email, "owner@example.com");
});

test("wrong email never initiates delete for an existing Watch", async () => {
  const h = harness();
  await assert.rejects(h.service.deleteWatchData("token_one", "other@example.com"));
  assert.equal(h.calls.length, 0);
});

test("durable export uses one authorized snapshot RPC", async () => {
  const h = harness();
  h.setResponder(() => Response.json({ watch: { id: "watch_one" }, scan: { id: "scan_one" }, measurementRuns: [{ id: "run_one" }] }));
  const result = await h.service.exportWatchData("token_one", " OWNER@EXAMPLE.COM ");
  assert.equal(result.measurementRuns.length, 1); assert.equal(result.formatVersion, 2);
  assert.equal(h.calls.length, 1); assert.ok(h.calls[0].url.endsWith("/rpc/aix_next_export_watch_data"));
  assert.equal(h.calls[0].body.p_email, "owner@example.com");
});

test("memory export includes source Scan and only owned runs without bearer credentials", async () => {
  const h = harness(false);
  const result = await h.service.exportWatchData("token_one", "owner@example.com");
  assert.equal(result.scan.id, "scan_one"); assert.equal(result.measurementRuns.length, 1);
  assert.equal(result.measurementRuns[0].id, "own");
  assert.doesNotMatch(JSON.stringify(result), /private_other|token_one/);
  assert.equal(h.calls.length, 0);
});

test("memory deletion validates scan linkage, removes owned runs and preserves independent profiles", () => {
  // Execute the exact helper body against isolated maps without loading storage/env.
  const source = readFileSync("lib/storage.ts", "utf8");
  const helper = source.slice(source.indexOf("export function deleteMemoryWatchData("), source.indexOf("export async function updateWatch("));
  const watches = new Map([["token_one", { id: "w1", scanId: "s1" }], ["token_two", { id: "w2", scanId: "s2" }]]);
  const scans = new Map([["s1", {}], ["s2", {}]]);
  const publicProfiles = new Map([["p1", { sourceScanId: "s1", token: "independent" }]]);
  const runs = new Map([["r1", { watchId: "w1" }], ["r2", { watchId: "w2" }]]);
  const loaded = { exports: {} as any };
  vm.runInNewContext(ts.transpileModule(helper, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { module: loaded, exports: loaded.exports, watches, scans, publicProfiles, aixNextWatchRuns: runs });
  assert.equal(loaded.exports.deleteMemoryWatchData("token_one", "s2"), false);
  assert.equal(watches.size, 2); assert.equal(runs.size, 2);
  assert.equal(loaded.exports.deleteMemoryWatchData("token_one", "s1"), true);
  assert.equal(runs.has("r1"), false); assert.equal(runs.has("r2"), true);
  assert.equal(scans.has("s1"), true); assert.equal(publicProfiles.size, 1);
  assert.equal(loaded.exports.deleteMemoryWatchData("token_two", "s2"), true);
  assert.equal(scans.has("s2"), false);
});
