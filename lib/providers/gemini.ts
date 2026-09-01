import "server-only";
import { env } from "@/lib/env";
import type { Citation } from "@/lib/types";
import type { AiSearchProvider, ProviderInput, ProviderOutput } from "@/lib/providers/common";
import { recommendationInstruction } from "@/lib/providers/common";

function citations(data: any): Citation[] {
  const result = new Map<string, Citation>();
  for (const candidate of Array.isArray(data.candidates) ? data.candidates : []) {
    const chunks = candidate?.groundingMetadata?.groundingChunks || [];
    for (const chunk of chunks) {
      const web = chunk?.web;
      if (!web?.uri) continue;
      try {
        const parsed = new URL(web.uri);
        result.set(parsed.toString(), { title: web.title || parsed.hostname, url: parsed.toString(), domain: parsed.hostname.replace(/^www\./, "") });
      } catch { /* ignore */ }
    }
  }
  return [...result.values()].slice(0, 20);
}

export const geminiProvider: AiSearchProvider = {
  name: "gemini",
  configured: () => Boolean(env.geminiKey),
  async run(input: ProviderInput): Promise<ProviderOutput> {
    if (!env.geminiKey) throw new Error("GEMINI_API_KEYが未設定です。");
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.geminiModel)}:generateContent?key=${encodeURIComponent(env.geminiKey)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: recommendationInstruction(input) }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.2 },
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Gemini ${response.status}`);
    const rawText = (data.candidates || []).flatMap((candidate: any) => candidate?.content?.parts || []).map((part: any) => part.text || "").filter(Boolean).join("\n");
    if (!rawText) throw new Error("Geminiが空の回答を返しました。");
    return {
      rawText,
      citations: citations(data),
      model: env.geminiModel,
      inputTokens: data.usageMetadata?.promptTokenCount,
      outputTokens: data.usageMetadata?.candidatesTokenCount,
      searchRequests: 1,
    };
  },
};
