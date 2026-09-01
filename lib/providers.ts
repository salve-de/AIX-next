import "server-only";
import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";
import type { BuyerPrompt, Citation, CompanyDiscovery, Observation, ProviderName } from "@/lib/types";

function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

function aliases(discovery: CompanyDiscovery) {
  return [...new Set([discovery.brandName, discovery.legalName, ...discovery.aliases, ...discovery.competitors.map((item) => item.name)].filter(Boolean))];
}

function rankedBrands(text: string, names: string[]) {
  return names.map((name) => ({ name, index: text.toLowerCase().indexOf(name.toLowerCase()) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.name);
}

function normalizeObservation(input: {
  provider: ProviderName;
  model: string;
  prompt: BuyerPrompt;
  repetition: number;
  rawText: string;
  citations: Citation[];
  discovery: CompanyDiscovery;
  latencyMs: number;
}): Observation {
  const ranked = rankedBrands(input.rawText, aliases(input.discovery));
  const ownIndex = ranked.findIndex((name) => input.discovery.aliases.some((alias) => alias.toLowerCase() === name.toLowerCase()) || [input.discovery.brandName, input.discovery.legalName].some((alias) => alias.toLowerCase() === name.toLowerCase()));
  return {
    id: randomUUID(),
    promptId: input.prompt.id,
    prompt: input.prompt.text,
    provider: input.provider,
    model: input.model,
    repetition: input.repetition,
    status: "success",
    rawText: input.rawText,
    rankedBrands: ranked,
    ownRecommended: ownIndex >= 0,
    ownPosition: ownIndex >= 0 ? ownIndex + 1 : null,
    citations: input.citations,
    latencyMs: input.latencyMs,
    createdAt: new Date().toISOString(),
  };
}

function failed(provider: ProviderName, model: string, prompt: BuyerPrompt, repetition: number, error: unknown): Observation {
  return {
    id: randomUUID(), promptId: prompt.id, prompt: prompt.text, provider, model, repetition,
    status: "failed", rawText: "", rankedBrands: [], ownRecommended: false, ownPosition: null, citations: [], latencyMs: 0,
    createdAt: new Date().toISOString(), error: error instanceof Error ? error.message : "Provider error",
  };
}

function skipped(provider: ProviderName, model: string, prompt: BuyerPrompt, repetition: number): Observation {
  return {
    id: randomUUID(), promptId: prompt.id, prompt: prompt.text, provider, model, repetition,
    status: "skipped", rawText: "", rankedBrands: [], ownRecommended: false, ownPosition: null, citations: [], latencyMs: 0,
    createdAt: new Date().toISOString(), error: `${provider} API key is not configured`,
  };
}

async function openAi(prompt: BuyerPrompt, discovery: CompanyDiscovery, repetition: number) {
  if (!env.openAiKey) return skipped("openai", env.openAiSearchModel, prompt, repetition);
  const started = Date.now();
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${env.openAiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.openAiSearchModel,
        tools: [{ type: "web_search" }],
        input: `あなたは日本企業の比較調査を行うアシスタントです。次の質問に、現在の公開Webを調べて回答してください。購入候補を最大5社、重要な順に会社・サービス名を明記し、各候補の理由と根拠URLを示してください。質問: ${prompt.text}`,
      }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `OpenAI ${response.status}`);
    const chunks: string[] = [];
    const citations: Citation[] = [];
    for (const output of data.output || []) for (const content of output.content || []) {
      if (content.text) chunks.push(content.text);
      for (const annotation of content.annotations || []) {
        const citation = annotation.url_citation || annotation;
        if (citation.url) citations.push({ title: citation.title || domainOf(citation.url), url: citation.url, domain: domainOf(citation.url) });
      }
    }
    const rawText = data.output_text || chunks.join("\n");
    if (!rawText) throw new Error("OpenAI returned an empty answer");
    return normalizeObservation({ provider: "openai", model: env.openAiSearchModel, prompt, repetition, rawText, citations: [...new Map(citations.map((item) => [item.url, item])).values()], discovery, latencyMs: Date.now() - started });
  } catch (error) { return failed("openai", env.openAiSearchModel, prompt, repetition, error); }
}

async function gemini(prompt: BuyerPrompt, discovery: CompanyDiscovery, repetition: number) {
  if (!env.geminiKey) return skipped("gemini", env.geminiModel, prompt, repetition);
  const started = Date.now();
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.geminiModel)}:generateContent?key=${encodeURIComponent(env.geminiKey)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `公開Webを検索して日本市場向けに回答してください。購入候補を最大5社、重要な順にサービス名と理由を明記してください。質問: ${prompt.text}` }] }], tools: [{ google_search: {} }] }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Gemini ${response.status}`);
    const candidate = data.candidates?.[0];
    const rawText = (candidate?.content?.parts || []).map((part: any) => part.text || "").join("\n");
    const citations: Citation[] = (candidate?.groundingMetadata?.groundingChunks || []).map((chunk: any) => chunk.web).filter(Boolean).map((web: any) => ({ title: web.title || domainOf(web.uri), url: web.uri, domain: domainOf(web.uri) }));
    if (!rawText) throw new Error("Gemini returned an empty answer");
    return normalizeObservation({ provider: "gemini", model: env.geminiModel, prompt, repetition, rawText, citations: [...new Map(citations.map((item) => [item.url, item])).values()], discovery, latencyMs: Date.now() - started });
  } catch (error) { return failed("gemini", env.geminiModel, prompt, repetition, error); }
}

async function perplexity(prompt: BuyerPrompt, discovery: CompanyDiscovery, repetition: number) {
  if (!env.perplexityKey) return skipped("perplexity", env.perplexityModel, prompt, repetition);
  const started = Date.now();
  try {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${env.perplexityKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: env.perplexityModel, messages: [{ role: "system", content: "日本市場の公開Webを調査し、購入候補を重要な順に最大5社、理由とともに明記してください。" }, { role: "user", content: prompt.text }], search_context_size: "low" }),
    });
    const data = await response.json() as any;
    if (!response.ok) throw new Error(data.error?.message || `Perplexity ${response.status}`);
    const rawText = data.choices?.[0]?.message?.content || "";
    const citations: Citation[] = (data.citations || []).map((url: string) => ({ title: domainOf(url), url, domain: domainOf(url) }));
    if (!rawText) throw new Error("Perplexity returned an empty answer");
    return normalizeObservation({ provider: "perplexity", model: env.perplexityModel, prompt, repetition, rawText, citations, discovery, latencyMs: Date.now() - started });
  } catch (error) { return failed("perplexity", env.perplexityModel, prompt, repetition, error); }
}

export async function runProvider(provider: ProviderName, prompt: BuyerPrompt, discovery: CompanyDiscovery, repetition: number) {
  if (provider === "openai") return openAi(prompt, discovery, repetition);
  if (provider === "gemini") return gemini(prompt, discovery, repetition);
  return perplexity(prompt, discovery, repetition);
}
