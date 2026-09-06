import "server-only";
import { env } from "@/lib/env";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";
import { parseGeminiInteractionResponse } from "@/lib/providers/parsers";

export const geminiProvider: AiSearchProvider = {
  name: "gemini",
  configured: () => Boolean(env.geminiKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.geminiKey) throw new Error("GEMINI_API_KEYが未設定です。");
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      signal: input.signal,
      headers: { "content-type": "application/json", "x-goog-api-key": env.geminiKey },
      body: JSON.stringify({
        model: env.geminiModel,
        input: recommendationInstruction(input),
        tools: [{ type: "google_search" }],
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Gemini ${response.status}`);
    const parsed = parseGeminiInteractionResponse(data);
    if (!parsed.rawText) throw new Error(`Geminiが空の回答を返しました。status=${parsed.status || "unknown"}`);
    return {
      rawText: parsed.rawText,
      citations: parsed.citations,
      model: parsed.model || env.geminiModel,
      inputTokens: parsed.inputTokens,
      outputTokens: parsed.outputTokens,
      searchRequests: parsed.searchRequests,
    };
  },
};
