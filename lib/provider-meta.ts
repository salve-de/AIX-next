import type { ProviderName } from "@/lib/types";

export const PROVIDER_ORDER: ProviderName[] = ["openai", "gemini", "perplexity", "claude", "grok"];

export const PROVIDER_LABELS: Record<ProviderName, string> = {
  openai: "OpenAI",
  gemini: "Gemini",
  perplexity: "Perplexity",
  claude: "Claude",
  grok: "Grok",
};

export const PROVIDER_SURFACE_NOTES: Record<ProviderName, string> = {
  openai: "OpenAI Responses API + Web Search",
  gemini: "Gemini API + Google Search grounding",
  perplexity: "Perplexity Sonar",
  claude: "Claude API + Web Search",
  grok: "xAI Responses API + Web Search",
};
