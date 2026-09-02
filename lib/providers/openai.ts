import "server-only";
import { env } from "@/lib/env";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";
import { parseOpenAiWebSearchResponse } from "@/lib/providers/parsers";

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
    const parsed = parseOpenAiWebSearchResponse(data);
    if (!parsed.rawText) throw new Error("OpenAIが空の回答を返しました。");
    return {
      rawText: parsed.rawText,
      citations: parsed.citations,
      model: parsed.model || env.openAiSearchModel,
      inputTokens: parsed.inputTokens,
      outputTokens: parsed.outputTokens,
      searchRequests: parsed.searchRequests,
    };
  },
};
