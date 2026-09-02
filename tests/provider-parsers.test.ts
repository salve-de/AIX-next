import assert from "node:assert/strict";
import test from "node:test";
import { parseGeminiInteractionResponse, parseOpenAiWebSearchResponse, parsePerplexitySonarResponse } from "../lib/providers/parsers";

test("OpenAI Responses parser keeps inline and full web-search sources", () => {
  const parsed = parseOpenAiWebSearchResponse({
    model: "gpt-5.6-luna",
    output: [
      { type: "web_search_call", action: { sources: [{ url: "https://vendor.example/proof", title: "Vendor proof" }] } },
      { type: "message", content: [{ type: "output_text", text: "候補1 | Vendor | 導入実績", annotations: [{ type: "url_citation", url: "https://media.example/review", title: "Review" }] }] },
    ],
    usage: { input_tokens: 101, output_tokens: 42 },
  });
  assert.equal(parsed.rawText, "候補1 | Vendor | 導入実績");
  assert.equal(parsed.searchRequests, 1);
  assert.equal(parsed.inputTokens, 101);
  assert.deepEqual(parsed.citations.map((item) => item.domain).sort(), ["media.example", "vendor.example"]);
});

test("Gemini Interactions parser reads model_output annotations and grounding count", () => {
  const parsed = parseGeminiInteractionResponse({
    model: "gemini-3.6-flash",
    status: "completed",
    steps: [
      { type: "google_search_call" },
      { type: "model_output", content: [{ type: "text", text: "候補1 | Vendor | 根拠", annotations: [{ type: "url_citation", url: "https://vendor.example/case", title: "Case" }] }] },
    ],
    usage: { total_input_tokens: 88, total_output_tokens: 31, grounding_tool_count: [{ type: "google_search", count: 2 }] },
  });
  assert.equal(parsed.rawText, "候補1 | Vendor | 根拠");
  assert.equal(parsed.searchRequests, 2);
  assert.equal(parsed.citations[0]?.domain, "vendor.example");
  assert.equal(parsed.outputTokens, 31);
});

test("Perplexity Sonar parser prefers structured search_results and cost usage", () => {
  const parsed = parsePerplexitySonarResponse({
    model: "sonar",
    choices: [{ message: { content: "候補1 | Vendor | 根拠" } }],
    citations: ["https://fallback.example/"],
    search_results: [{ url: "https://vendor.example/source", title: "Source" }],
    usage: { prompt_tokens: 77, completion_tokens: 29, num_search_queries: 1, cost: { total_cost: 0.0042 } },
  });
  assert.equal(parsed.rawText, "候補1 | Vendor | 根拠");
  assert.equal(parsed.searchRequests, 1);
  assert.equal(parsed.citations[0]?.domain, "vendor.example");
  assert.equal(parsed.costUsd, 0.0042);
});
