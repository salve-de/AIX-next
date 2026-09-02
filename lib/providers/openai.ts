import "server-only";
import { env } from "@/lib/env";
import type { Citation } from "@/lib/types";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";

function extractText(data: any) {
  if (typeof data.output_text === "string") return data.output_text;
  return (Array.isArray(data.output) ? data.output : [])
    .filter((item: any) => item?.type === "message")
    .flatMap((item: any) => Array.isArray(item.content) ? item.content : [])
    .map((part: any) => typeof part.text === "string" ? part.text : "")
    .filter(Boolean)
    .join("\n");
}

function addCitation(result: Map<string, Citation>, url: unknown, title?: unknown) {
  if (typeof url !== "string" || !url) return;
  try {
    const parsed = new URL(url);
    result.set(parsed.toString(), {
      title: typeof title === "string" && title ? title : parsed.hostname,
      url: parsed.toString(),
      domain: parsed.hostname.replace(/^www\./, ""),
    });
  } catch { /* ignore invalid source */ }
}

function extractCitations(data: any): Citation[] {
  const result = new Map<string, Citation>();
  for (const item of Array.isArray(data.output) ? data.output : []) {
    if (item?.type === "message") {
      for (const part of Array.isArray(item.content) ? item.content : []) {
        for (const annotation of Array.isArray(part.annotations) ? part.annotations : []) {
          addCitation(result, annotation?.url || annotation?.url_citation?.url, annotation?.title || annotation?.url_citation?.title);
        }
      }
    }
    if (item?.type === "web_search_call") {
      for (const source of Array.isArray(item?.action?.sources) ? item.action.sources : []) {
        addCitation(result, source?.url, source?.title);
      }
    }
  }
  return [...result.values()].slice(0, 20);
}

function searchRequestCount(data: any) {
  return (Array.isArray(data.output) ? data.output : []).filter((item: any) => item?.type === "web_search_call").length;
}

export const openAiProvider: AiSearchProvider = {
  name: "openai",
  configured: () => Boolean(env.openAiKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.openAiKey) throw new Error("OPENAI_API_KEYが未設定です。");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${env.openAiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.openAiSearchModel,
        input: recommendationInstruction(input),
        tools: [{ type: "web_search" }],
        tool_choice: "required",
        include: ["web_search_call.action.sources"],
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `OpenAI ${response.status}`);
    const rawText = extractText(data);
    if (!rawText) throw new Error("OpenAIが空の回答を返しました。");
    return {
      rawText,
      citations: extractCitations(data),
      model: data.model || env.openAiSearchModel,
      inputTokens: data.usage?.input_tokens,
      outputTokens: data.usage?.output_tokens,
      searchRequests: searchRequestCount(data),
    };
  },
};
