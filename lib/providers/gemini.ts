import "server-only";
import { env } from "@/lib/env";
import type { Citation } from "@/lib/types";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";

function modelOutputBlocks(data: any) {
  return (Array.isArray(data.steps) ? data.steps : [])
    .filter((step: any) => step?.type === "model_output")
    .flatMap((step: any) => Array.isArray(step.content) ? step.content : [])
    .filter((block: any) => block?.type === "text");
}

function citations(data: any): Citation[] {
  const result = new Map<string, Citation>();
  for (const block of modelOutputBlocks(data)) {
    for (const annotation of Array.isArray(block.annotations) ? block.annotations : []) {
      if (annotation?.type !== "url_citation" || typeof annotation.url !== "string") continue;
      try {
        const parsed = new URL(annotation.url);
        result.set(parsed.toString(), {
          title: typeof annotation.title === "string" && annotation.title ? annotation.title : parsed.hostname,
          url: parsed.toString(),
          domain: parsed.hostname.replace(/^www\./, ""),
        });
      } catch { /* ignore invalid source */ }
    }
  }
  return [...result.values()].slice(0, 20);
}

function searchRequestCount(data: any) {
  const usageCount = (Array.isArray(data.usage?.grounding_tool_count) ? data.usage.grounding_tool_count : [])
    .filter((item: any) => item?.type === "google_search")
    .reduce((sum: number, item: any) => sum + (Number(item?.count) || 0), 0);
  if (usageCount) return usageCount;
  return (Array.isArray(data.steps) ? data.steps : []).filter((step: any) => step?.type === "google_search_call").length;
}

export const geminiProvider: AiSearchProvider = {
  name: "gemini",
  configured: () => Boolean(env.geminiKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.geminiKey) throw new Error("GEMINI_API_KEYが未設定です。");
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.geminiKey },
      body: JSON.stringify({
        model: env.geminiModel,
        input: recommendationInstruction(input),
        tools: [{ type: "google_search" }],
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Gemini ${response.status}`);
    const rawText = modelOutputBlocks(data).map((block: any) => typeof block.text === "string" ? block.text : "").filter(Boolean).join("\n");
    if (!rawText) throw new Error(`Geminiが空の回答を返しました。status=${data.status || "unknown"}`);
    return {
      rawText,
      citations: citations(data),
      model: data.model || env.geminiModel,
      inputTokens: data.usage?.total_input_tokens,
      outputTokens: data.usage?.total_output_tokens,
      searchRequests: searchRequestCount(data),
    };
  },
};
