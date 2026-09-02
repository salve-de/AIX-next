import "server-only";
import { env } from "@/lib/env";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";
import { parsePerplexitySonarResponse } from "@/lib/providers/parsers";

export const perplexityProvider: AiSearchProvider = {
  name: "perplexity",
  configured: () => Boolean(env.perplexityKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.perplexityKey) throw new Error("PERPLEXITY_API_KEYが未設定です。");
    const response = await fetch("https://api.perplexity.ai/v1/sonar", {
      method: "POST",
      headers: { authorization: `Bearer ${env.perplexityKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.perplexityModel,
        messages: [{ role: "user", content: recommendationInstruction(input) }],
        web_search_options: { search_mode: "web" },
        language_preference: "ja",
        temperature: 0.2,
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || data.detail?.[0]?.msg || `Perplexity ${response.status}`);
    const parsed = parsePerplexitySonarResponse(data);
    if (!parsed.rawText) throw new Error("Perplexityが空の回答を返しました。");
    return {
      rawText: parsed.rawText,
      citations: parsed.citations,
      model: parsed.model || env.perplexityModel,
      inputTokens: parsed.inputTokens,
      outputTokens: parsed.outputTokens,
      searchRequests: parsed.searchRequests,
      costUsd: parsed.costUsd,
    };
  },
};
