import "server-only";
import { env } from "@/lib/env";
import type { Citation } from "@/lib/types";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";

function extractText(data: any) {
  if (typeof data.output_text === "string") return data.output_text.trim();
  return (Array.isArray(data.output) ? data.output : [])
    .flatMap((item: any) => Array.isArray(item.content) ? item.content : [])
    .map((part: any) => typeof part.text === "string" ? part.text : "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function extractCitations(data: any): Citation[] {
  const map = new Map<string, Citation>();
  const add = (url: string, title?: string) => {
    try {
      const parsed = new URL(url);
      map.set(parsed.toString(), { title: title || parsed.hostname, url: parsed.toString(), domain: parsed.hostname.replace(/^www\./, "") });
    } catch { /* ignore invalid citation */ }
  };
  for (const citation of Array.isArray(data.citations) ? data.citations : []) {
    if (typeof citation === "string") add(citation);
    else if (citation?.url) add(citation.url, citation.title);
  }
  for (const item of Array.isArray(data.output) ? data.output : []) {
    for (const part of Array.isArray(item.content) ? item.content : []) {
      for (const annotation of Array.isArray(part.annotations) ? part.annotations : []) {
        const url = annotation.url || annotation.url_citation?.url;
        if (url) add(url, annotation.title || annotation.url_citation?.title);
      }
    }
  }
  return [...map.values()].slice(0, 20);
}

export const grokProvider: AiSearchProvider = {
  name: "grok",
  configured: () => Boolean(env.xaiKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.xaiKey) throw new Error("XAI_API_KEYが未設定です。");
    const response = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${env.xaiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.xaiModel,
        input: recommendationInstruction(input),
        tools: [{ type: "web_search" }],
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Grok ${response.status}`);
    const rawText = extractText(data);
    if (!rawText) throw new Error("Grokが空の回答を返しました。");
    return {
      rawText,
      citations: extractCitations(data),
      model: env.xaiModel,
      inputTokens: data.usage?.input_tokens,
      outputTokens: data.usage?.output_tokens,
      searchRequests: data.server_side_tool_usage?.web_search_requests || data.usage?.server_tool_use?.web_search_requests,
    };
  },
};
