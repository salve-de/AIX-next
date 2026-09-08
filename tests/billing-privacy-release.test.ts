import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import * as crypto from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { watchTokenFromInput } from "../lib/management-link";

// Execute real handlers with sealed imports: never load lib/env, storage,
// server-only, credentials, or a real provider. Unexpected imports/network fail.
function harness(options: { paid?: boolean; subscriptionId?: string; customerId?: string; missing?: boolean } = {}) {
  let watch: any = options.missing ? null : {
    id: "watch_one", token: "token_one", email: "owner@example.com", paid: options.paid ?? false,
    status: options.paid ? "active" : "trial", stripeSubscriptionId: options.subscriptionId,
    stripeCustomerId: options.customerId, nextRunAt: "2030-01-01T00:00:00.000Z",
  };
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const patches: any[] = [];
  let deleted = false;
  let exported = false;
  let failUpdate = false;
  let provider: (url: string, init: RequestInit) => Response | Promise<Response> = () => { throw new Error("Unexpected network"); };
  const cache = new Map<string, any>();
  const mocks: Record<string, any> = {
    "node:crypto": crypto,
    "@/lib/env": { env: { stripeSecretKey: "test-only", stripeWebhookSecret: "test-signing", stripePriceId: "price_test", siteUrl: "https://example.com" } },
    "@/lib/legal": { sellerReady: () => true },
    "@/lib/storage": {
      getWatch: async (token: string) => token === watch?.token ? watch : null,
      updateWatch: async (_token: string, patch: any) => { if (failUpdate) throw new Error("private storage details"); patches.push(patch); watch = { ...watch, ...patch }; return watch; },
    },
    "@/lib/brand-compatibility": { isDataDeletionConfirmation: (value: unknown) => value === "DELETE ROVAN DATA" },
    "@/lib/privacy-data": {
      exportWatchData: async () => { exported = true; return { watch }; },
      deleteWatchData: async () => { deleted = true; return { deleted: true, subscriptionCancelled: false }; },
    },
  };
  function load(relative: string): any {
    const filename = path.resolve(relative);
    if (cache.has(filename)) return cache.get(filename);
    const output = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const loaded = { exports: {} };
    cache.set(filename, loaded.exports);
    vm.runInNewContext(output, {
      module: loaded, exports: loaded.exports, Request, Response, URL, URLSearchParams, AbortSignal, Buffer,
      fetch: async (url: string, init: RequestInit) => { calls.push({ url, init }); return provider(url, init); },
      require: (name: string) => {
        if (name in mocks) return mocks[name];
        if (name.startsWith(".")) return load(path.resolve(path.dirname(filename), `${name}.ts`));
        throw new Error(`Unexpected import ${name}`);
      },
    }, { filename });
    return loaded.exports;
  }
  function request(body: unknown, method = "POST") { return new Request("https://example.com/api", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); }
  async function webhook(type: string, object: any, valid = true) {
    const body = JSON.stringify({ type, data: { object } });
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", "test-signing").update(`${timestamp}.${body}`).digest("hex");
    return load("app/api/billing/webhook/route.ts").POST(new Request("https://example.com/api", { method: "POST", body, headers: { "stripe-signature": `t=${timestamp},v1=${valid ? signature : "invalid"}` } }));
  }
  return { load, request, webhook, calls, patches, mocks, setProvider: (fn: typeof provider) => { provider = fn; }, failWrites: () => { failUpdate = true; }, get watch() { return watch; }, get deleted() { return deleted; }, get exported() { return exported; } };
}

const subscription = (status: string, id = "sub_one") => ({ id, customer: "cus_one", metadata: { watch_token: "token_one" }, status });
const eventObject = (status: string, id = "sub_one") => subscription(status, id);
const rights = { token: "token_one", email: "owner@example.com", confirmation: "DELETE ROVAN DATA" };

test("privacy routes allow email-less ownership but reject blank email for registered owners", async () => {
  for (const [file, method] of [["privacy/export", "POST"], ["privacy/delete", "DELETE"]]) {
    const h = harness();
    const denied = await h.load(`app/api/${file}/route.ts`)[method](h.request({ ...rights, email: "" }, method));
    assert.equal(denied.status, 403);
    assert.equal(h.exported, false); assert.equal(h.deleted, false);
    h.watch.email = "";
    const allowed = await h.load(`app/api/${file}/route.ts`)[method](h.request({ ...rights, email: "" }, method));
    assert.equal(allowed.status, 200);
  }
});

test("billing and privacy reject non-string bearer credentials before provider/data access", async () => {
  for (const [file, method] of [["billing/checkout", "POST"], ["billing/portal", "POST"], ["privacy/export", "POST"], ["privacy/delete", "DELETE"]]) {
    for (const token of [null, 42, {}, [], "", " ", "a".repeat(257)]) {
      const h = harness();
      const response = await h.load(`app/api/${file}/route.ts`)[method](h.request({ ...rights, token }, method));
      assert.equal(response.status, 400, `${file}: ${JSON.stringify(token)}`);
      assert.equal(h.calls.length, 0); assert.equal(h.deleted, false); assert.equal(h.exported, false);
    }
  }
});

test("portal never resolves an unbound customer by caller-controlled email", async () => {
  const h = harness({ paid: true });
  const response = await h.load("app/api/billing/portal/route.ts").POST(h.request(rights));
  assert.equal(response.status, 409); assert.equal(h.calls.length, 0); assert.equal(h.patches.length, 0);
});

test("bound former subscriber can still manage billing and invoices", async () => {
  const h = harness({ customerId: "cus_one", paid: false });
  h.setProvider((url, init) => {
    assert.equal(url, "https://api.stripe.com/v1/billing_portal/sessions");
    assert.equal(new URLSearchParams(String(init.body)).get("customer"), "cus_one");
    return Response.json({ url: "https://billing.stripe.com/session/test" });
  });
  const response = await h.load("app/api/billing/portal/route.ts").POST(h.request(rights));
  assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
});

test("unknown token cannot open a billing portal", async () => {
  const h = harness({ customerId: "cus_one" });
  const response = await h.load("app/api/billing/portal/route.ts").POST(h.request({ token: "token_other" }));
  assert.equal(response.status, 404); assert.equal(h.calls.length, 0);
});

test("checkout refuses recoverable subscriptions even when local paid flag is false", async () => {
  for (const status of ["active", "past_due", "unpaid", "paused", "incomplete"]) {
    const h = harness({ subscriptionId: "sub_one" });
    h.setProvider(() => Response.json(subscription(status)));
    const response = await h.load("app/api/billing/checkout/route.ts").POST(h.request(rights));
    assert.equal(response.status, 409); assert.equal(h.calls.length, 1); assert.equal(h.calls[0].init.method, "GET");
  }
});

test("provider errors do not disclose upstream details", async () => {
  const h = harness();
  h.setProvider(() => Response.json({ error: { message: "private upstream details" } }, { status: 500 }));
  const response = await h.load("app/api/billing/checkout/route.ts").POST(h.request(rights));
  assert.equal(response.status, 502); assert.doesNotMatch(await response.text(), /private upstream/);
});

test("webhook rejects invalid signatures without touching Stripe", async () => {
  const h = harness();
  assert.equal((await h.webhook("customer.subscription.updated", eventObject("active"), false)).status, 400);
  assert.equal(h.calls.length, 0); assert.equal(h.patches.length, 0);
});

test("late active event cannot resurrect a canceled subscription", async () => {
  const h = harness({ paid: true, subscriptionId: "sub_one", customerId: "cus_one" });
  h.setProvider(() => Response.json(subscription("canceled")));
  assert.equal((await h.webhook("customer.subscription.updated", eventObject("active"))).status, 200);
  assert.equal(h.watch.paid, false); assert.equal(h.watch.status, "cancelled");
});

test("late unpaid checkout completion does not remove currently active access", async () => {
  const h = harness({ paid: true, subscriptionId: "sub_one", customerId: "cus_one" });
  h.setProvider(() => Response.json(subscription("active")));
  assert.equal((await h.webhook("checkout.session.completed", { ...eventObject(""), mode: "subscription", subscription: "sub_one", payment_status: "unpaid" })).status, 200);
  assert.equal(h.watch.paid, true); assert.equal(h.watch.nextRunAt, "2030-01-01T00:00:00.000Z");
});

test("old subscription deletion cannot overwrite the replacement subscription", async () => {
  const h = harness({ paid: true, subscriptionId: "sub_new", customerId: "cus_one" });
  assert.equal((await h.webhook("customer.subscription.deleted", eventObject("canceled", "sub_old"))).status, 200);
  assert.equal(h.patches.length, 0); assert.equal(h.calls.length, 0); assert.equal(h.watch.paid, true);
});

test("paused subscriptions lose access and duplicate active events do not reschedule", async () => {
  const h = harness({ paid: true, subscriptionId: "sub_one", customerId: "cus_one" });
  h.setProvider(() => Response.json(subscription("paused")));
  await h.webhook("customer.subscription.updated", eventObject("paused"));
  assert.equal(h.watch.paid, false);
  h.setProvider(() => Response.json(subscription("active")));
  await h.webhook("customer.subscription.updated", eventObject("active"));
  const next = h.watch.nextRunAt;
  await h.webhook("customer.subscription.updated", eventObject("active"));
  assert.equal(h.watch.nextRunAt, next); assert.equal("nextRunAt" in h.patches[2], false);
});

test("webhook refuses subscription/customer binding mismatches", async () => {
  const h = harness({ subscriptionId: "sub_one", customerId: "cus_other" });
  h.setProvider(() => Response.json(subscription("active")));
  assert.equal((await h.webhook("customer.subscription.updated", eventObject("active"))).status, 400);
  assert.equal(h.patches.length, 0);
});

test("webhook returns retryable status on provider or persistence failure", async () => {
  for (const storageFailure of [false, true]) {
    const h = harness();
    h.setProvider(() => storageFailure ? Response.json(subscription("active")) : new Response("private details", { status: 500 }));
    if (storageFailure) h.failWrites();
    const response = await h.webhook("customer.subscription.updated", eventObject("active"));
    assert.equal(response.status, 503); assert.doesNotMatch(await response.text(), /private/);
  }
});

test("privacy requires matching email and confirmation before deletion or cancellation", async () => {
  const h = harness({ paid: true, subscriptionId: "sub_one" });
  const deletion = h.load("app/api/privacy/delete/route.ts");
  assert.equal((await deletion.DELETE(h.request({ ...rights, email: "other@example.com" }, "DELETE"))).status, 403);
  assert.equal((await deletion.DELETE(h.request({ ...rights, confirmation: "yes" }, "DELETE"))).status, 400);
  const exported = await h.load("app/api/privacy/export/route.ts").POST(h.request({ ...rights, token: "token_other" }));
  assert.equal(exported.status, 403); assert.equal(h.calls.length, 0); assert.equal(h.deleted, false); assert.equal(h.exported, false);
});

test("privacy refuses to lose a paid subscription with no cancellation identifier", async () => {
  const h = harness({ paid: true });
  assert.equal((await h.load("app/api/privacy/delete/route.ts").DELETE(h.request(rights, "DELETE"))).status, 409);
  assert.equal(h.deleted, false);
});

test("privacy cancels unpaid recoverable Stripe subscription before deletion", async () => {
  const h = harness({ subscriptionId: "sub_one", customerId: "cus_one" });
  h.setProvider((_url, init) => {
    assert.equal(h.deleted, false);
    return Response.json(subscription(init.method === "DELETE" ? "canceled" : "unpaid"));
  });
  const response = await h.load("app/api/privacy/delete/route.ts").DELETE(h.request(rights, "DELETE"));
  assert.equal(response.status, 200); assert.equal(h.deleted, true);
  assert.deepEqual(h.calls.map(call => call.init.method), ["GET", "DELETE"]);
  assert.equal((await response.json()).subscriptionCancelled, true);
});

test("failed cancellation preserves data and does not report deletion success", async () => {
  const h = harness({ subscriptionId: "sub_one" });
  h.setProvider((_url, init) => init.method === "DELETE" ? new Response("private details", { status: 500 }) : Response.json(subscription("unpaid")));
  const response = await h.load("app/api/privacy/delete/route.ts").DELETE(h.request(rights, "DELETE"));
  assert.equal(response.status, 503); assert.equal(h.deleted, false); assert.doesNotMatch(await response.text(), /private details/);
});

test("export succeeds only for matching normalized email and sends download/no-store headers", async () => {
  const h = harness();
  const response = await h.load("app/api/privacy/export/route.ts").POST(h.request({ ...rights, email: " OWNER@EXAMPLE.COM " }));
  assert.equal(response.status, 200); assert.equal(h.exported, true);
  assert.match(response.headers.get("content-disposition")!, /attachment/);
  assert.match(response.headers.get("cache-control")!, /no-store/);
});

// A small hook harness exercises handlers/effect cleanup in the actual clients.
// It intentionally does not claim DOM layout or browser download verification.
function clientHarness(filename: string, component: string) {
  let index = 0;
  const slots: any[] = [];
  const effects: Array<() => void> = [];
  const calls: Array<{ url: string; resolve: (response: Response) => void }> = [];
  const react = {
    useState(initial: any) {
      const slot = index++;
      if (!(slot in slots)) slots[slot] = initial;
      return [slots[slot], (value: any) => { slots[slot] = value; }];
    },
    useRef(initial: any) {
      const slot = index++;
      if (!(slot in slots)) slots[slot] = { current: initial };
      return slots[slot];
    },
    useEffect(effect: () => void | (() => void), deps: any[]) {
      const slot = index++;
      if (slots[slot] && deps.every((value, i) => value === slots[slot].deps[i])) return;
      slots[slot]?.cleanup?.();
      slots[slot] = { deps };
      effects.push(() => { slots[slot].cleanup = effect(); });
    },
  };
  const jsx = (type: any, props: any) => ({ type, props });
  const mocks: Record<string, any> = {
    react, "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/navigation": { useSearchParams: () => new URLSearchParams("token=token_one") },
    "next/link": { default: "link" }, "@/components/icons": {},
    "@/lib/brand": { DATA_DELETION_CONFIRMATION: "DELETE ROVAN DATA" },
  };
  const loaded = { exports: {} as any };
  const source = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(source, {
    module: loaded, exports: loaded.exports, AbortController, URLSearchParams,
    fetch: (url: string) => new Promise<Response>(resolve => { calls.push({ url, resolve }); }),
      require: (name: string) => { if (name === "@/lib/management-link") return { watchTokenFromInput }; if (name in mocks) return mocks[name]; throw new Error(`Unexpected client import ${name}`); },
  });
  return {
    calls,
    render() {
      index = 0;
      let tree = loaded.exports[component]();
      while (typeof tree?.type === "function") tree = tree.type(tree.props);
      while (effects.length) effects.shift()!();
      return tree;
    },
  };
}

function nodes(tree: any, type: string): any[] {
  if (Array.isArray(tree)) return tree.flatMap(child => nodes(child, type));
  if (!tree || typeof tree !== "object") return [];
  return [...(tree.type === type ? [tree] : []), ...nodes(tree.props?.children, type)];
}

test("billing client discards an old token response and clears stale access immediately", async () => {
  const h = clientHarness("components/billing-client.tsx", "BillingClient");
  let tree = h.render();
  nodes(tree, "input")[0].props.onChange({ target: { value: "token_two" } });
  tree = h.render();
  assert.equal(nodes(tree, "button")[0].props.disabled, true);
  h.calls[1].resolve(Response.json({ paid: false, status: "cancelled", latest: { discovery: { brandName: "Second" } } }));
  await new Promise(resolve => setImmediate(resolve));
  tree = h.render();
  assert.match(JSON.stringify(tree), /Second/);
  assert.equal(nodes(tree, "button")[0].props.disabled, false);
  h.calls[0].resolve(Response.json({ paid: true, latest: { discovery: { brandName: "First" } } }));
  await new Promise(resolve => setImmediate(resolve));
  tree = h.render();
  assert.doesNotMatch(JSON.stringify(tree), /First/);
  nodes(tree, "input")[0].props.onChange({ target: { value: "" } });
  tree = h.render();
  assert.doesNotMatch(JSON.stringify(tree), /Second/);
  assert.equal(nodes(tree, "button")[0].props.disabled, true);
});

test("privacy client prevents export and delete running concurrently, including same-tick submits", async () => {
  const h = clientHarness("components/data-rights-client.tsx", "DataRightsClient");
  let tree = h.render();
  const forms = nodes(tree, "form");
  const exporting = forms[0].props.onSubmit({ preventDefault() {} });
  await forms[1].props.onSubmit({ preventDefault() {} });
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].url, "/api/privacy/export");
  tree = h.render();
  assert.ok(nodes(tree, "button").every(node => node.props.disabled));
  assert.ok(nodes(tree, "input").every(node => node.props.disabled));
  h.calls[0].resolve(Response.json({ error: "Try again" }, { status: 503 }));
  await exporting;
  tree = h.render();
  assert.ok(nodes(tree, "button").every(node => !node.props.disabled));
});
