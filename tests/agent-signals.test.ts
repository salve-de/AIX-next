import assert from "node:assert/strict";
import test from "node:test";
import { classifyAgentSignal } from "../lib/agent-signals";

test("recognizes AI crawler user agents", () => {
  assert.deepEqual(classifyAgentSignal("Mozilla/5.0 compatible; OAI-SearchBot/1.0", ""), { kind: "crawler", agent: "OAI-SearchBot" });
  assert.deepEqual(classifyAgentSignal("PerplexityBot/1.0", ""), { kind: "crawler", agent: "PerplexityBot" });
});

test("recognizes human visits referred by AI products", () => {
  assert.deepEqual(classifyAgentSignal("Mozilla/5.0", "https://chatgpt.com/c/abc"), { kind: "referral", agent: "ChatGPT", referrerDomain: "chatgpt.com" });
  assert.deepEqual(classifyAgentSignal("Mozilla/5.0", "https://www.perplexity.ai/search/x"), { kind: "referral", agent: "Perplexity", referrerDomain: "perplexity.ai" });
});

test("does not fabricate AI traffic from unknown user agents and referrers", () => {
  assert.equal(classifyAgentSignal("Mozilla/5.0", "https://example.com"), null);
});
