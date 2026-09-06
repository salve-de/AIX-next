import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

test("scan effect restarts after cleanup and reports a premature stream end", async () => {
  const effects: Array<() => (() => void)> = [];
  const values: unknown[] = [];
  const requests: AbortSignal[] = [];
  const output = ts.transpileModule(readFileSync("components/scan-progress.tsx", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} as { ScanProgress: () => unknown } };
  const mockReact = {
    useCallback: (fn: unknown) => fn,
    useMemo: (fn: () => unknown) => fn(),
    useRef: (current: unknown) => ({ current }),
    useState: (initial: unknown) => [initial, (value: unknown) => values.push(value)],
    useEffect: (fn: () => (() => void)) => effects.push(fn),
  };
  vm.runInNewContext(output, {
    exports: loaded.exports, module: loaded, URL, AbortController, TextDecoder,
    fetch: async (_url: string, options: { signal: AbortSignal }) => {
      requests.push(options.signal);
      return new Response(""); // A server/proxy closed without a completion event.
    },
    require: (name: string) => {
      if (name === "react") return mockReact;
      if (name === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null };
      if (name === "next/navigation") return { useRouter: () => ({}), useSearchParams: () => new URLSearchParams({ input: "https://example.com" }) };
      if (name === "@/lib/input-kind") return { isUrlInput: () => true };
      if (name === "@/lib/social-input") return { parseSocialInput: () => ({ isSocial: false }) };
      if (name.startsWith("@/components/")) return {};
      throw new Error(`Unexpected import ${name}`);
    },
  });
  loaded.exports.ScanProgress();
  const cleanup = effects[0]();
  cleanup();
  const nextCleanup = effects[0]();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests.length, 2);
  assert.equal(requests[0].aborted, true);
  assert.equal(requests[1].aborted, false);
  assert.ok(values.includes("failed"));
  assert.ok(values.some(value => typeof value === "string" && value.includes("完了前に切れました")));
  nextCleanup();
});
