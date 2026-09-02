import "server-only";
import { env } from "@/lib/env";
import type { Citation } from "@/lib/types";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";

function textFromResponse(data: any) {
  return (Array.isArray(data.content) ? data.content : [])
    .filter((block: any) => block?.type === "text" && typeof block.text === "string")
    .map((block: any) => block.text)
    .join("\n")
    .trim();
}

function citationsFromResponse(data: any): Citation[] {
  const map = new Map<string, Citation>();
  for (const block of Array.isArray(data.content) ? data.content : []) {
    if (block?.type === "text") {
      for (const citation of Array.isArray(block.citations) ? block.citations : []) {
        const url = citation?.url;
        if (!url) continue;
        try {
          const parsed = new URL(url);
          map.set(parsed.toString(), {
            title: citation.title || parsed.hostname,
            url: parsed.toString(),
            domain: parsed.hostname.replace(/^www\./, ""),
          });
        } catch { /* ignore invalid citation */ }
      }
    }
    if (block?.type === "web_search_tool_result") {
      for (const result of Array.isArray(block.content) ? block.content : []) {
        if (result?.type !== "web_search_result" || !result.url) continue;
        try {
          const parsed = new URL(result.url);
          map.set(parsed.toString(), {
            title: result.title || parsed.hostname,
            url: parsed.toString(),
            domain: parsed.hostname.replace(/^www\./, ""),
          });
        } catch { /* ignore invalid result */ }
      }
    }
  }
  return [...map.values()].slice(0, 20);
}

export const claudeProvider: AiSearchProvider = {
  name: "claude",
  configured: () => Boolean(env.anthropicKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.anthropicKey) throw new Error("ANTHROPIC_API_KEYが未設定です。");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.anthropicModel,
        max_tokens: 2500,
        messages: [{ role: "user", content: recommendationInstruction(input) }],
        tools: [{
          type: "web_search_20260318",
          name: "web_search",
          max_uses: 3,
          user_location: { type: "approximate", country: "JP", timezone: "Asia/Tokyo" },
        }],
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Claude ${response.status}`);
    const rawText = textFromResponse(data);
    if (!rawText) throw new Error("Claudeが空の回答を返しました。");
    return {
      rawText,
      citations: citationsFromResponse(data),
      model: env.anthropicModel,
      inputTokens: data.usage?.input_tokens,
      outputTokens: data.usage?.output_tokens,
      searchRequests: data.usage?.server_tool_use?.web_search_requests,
    };
  },
};
