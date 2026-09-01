import "server-only";
import { env } from "@/lib/env";
import type { Citation } from "@/lib/types";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";

export const perplexityProvider: AiSearchProvider = {
  name: "perplexity",
  configured: () => Boolean(env.perplexityKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.perplexityKey) throw new Error("PERPLEXITY_API_KEYが未設定です。");
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${env.perplexityKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.perplexityModel,
        messages: [{ role: "user", content: recommendationInstruction(input) }],
        search_context_size: "low",
        temperature: 0.2,
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Perplexity ${response.status}`);
    const rawText = data.choices?.[0]?.message?.content || "";
    if (!rawText) throw new Error("Perplexityが空の回答を返しました。");
    const rawSources = Array.isArray(data.citations) ? data.citations : Array.isArray(data.search_results) ? data.search_results.map((item: any) => item.url) : [];
    const citations: Citation[] = [];
    for (const source of rawSources) {
      const url = typeof source === "string" ? source : source?.url;
      if (!url) continue;
      try {
        const parsed = new URL(url);
        citations.push({ title: typeof source === "object" ? source.title || parsed.hostname : parsed.hostname, url: parsed.toString(), domain: parsed.hostname.replace(/^www\./, "") });
      } catch { /* ignore */ }
    }
    return {
      rawText,
      citations: [...new Map(citations.map((item) => [item.url, item])).values()].slice(0, 20),
      model: env.perplexityModel,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
      searchRequests: 1,
    };
  },
};
