import "server-only";
import { extractRecommendedEntities } from "@/lib/entity-extraction";
import { id } from "@/lib/ids";
import type { BuyerPrompt, CompanyDiscovery, Observation, ProviderName } from "@/lib/types";
import type { AiSearchProvider } from "@/lib/providers/common";
import { observationFromFailure } from "@/lib/providers/common";
import { openAiProvider } from "@/lib/providers/openai";
import { geminiProvider } from "@/lib/providers/gemini";
import { perplexityProvider } from "@/lib/providers/perplexity";
import { claudeProvider } from "@/lib/providers/claude";
import { grokProvider } from "@/lib/providers/grok";

export const providers: AiSearchProvider[] = [openAiProvider, geminiProvider, perplexityProvider, claudeProvider, grokProvider];
export const freeProviders: ProviderName[] = ["openai", "gemini", "perplexity"];
export const paidProviders: ProviderName[] = providers.map((provider) => provider.name);

export async function runObservationPanel(input: {
  prompts: BuyerPrompt[];
  discovery: CompanyDiscovery;
  repetitions: number;
  providerNames?: ProviderName[];
  onProgress?: (completed: number, total: number, detail: string) => Promise<void> | void;
}) {
  const selected = input.providerNames?.length
    ? providers.filter((provider) => input.providerNames!.includes(provider.name))
    : providers;
  if (!selected.length) throw new Error("測定対象AI surfaceがありません。");

  const tasks = input.prompts.flatMap((prompt) => selected.flatMap((provider) => Array.from({ length: input.repetitions }, (_, index) => ({ prompt, provider, repetition: index + 1 }))));
  const observations: Observation[] = [];
  let completed = 0;

  for (let offset = 0; offset < tasks.length; offset += selected.length) {
    const batch = tasks.slice(offset, offset + selected.length);
    const rows = await Promise.all(batch.map(async ({ prompt, provider, repetition }) => {
      const providerInput = { prompt, discovery: input.discovery, repetition };
      if (!provider.configured()) return observationFromFailure(providerInput, provider.name, "unconfigured", "API credential is not configured", "skipped");
      const startedAt = new Date().toISOString();
      const start = Date.now();
      try {
        const output = await provider.run(providerInput);
        const recommendedEntities = extractRecommendedEntities(output.rawText, input.discovery);
        const ownPositionIndex = recommendedEntities.indexOf(input.discovery.brandName);
        return {
          id: id("obs"),
          promptId: prompt.id,
          prompt: prompt.text,
          provider: provider.name,
          model: output.model,
          repetition,
          status: "success" as const,
          rawText: output.rawText,
          citations: output.citations,
          recommendedEntities,
          ownRecommended: ownPositionIndex >= 0,
          ownPosition: ownPositionIndex >= 0 ? ownPositionIndex + 1 : null,
          firstCandidate: recommendedEntities[0] || null,
          startedAt,
          completedAt: new Date().toISOString(),
          latencyMs: Date.now() - start,
          inputTokens: output.inputTokens,
          outputTokens: output.outputTokens,
          searchRequests: output.searchRequests,
          costUsd: output.costUsd,
        } satisfies Observation;
      } catch (error) {
        const failed = observationFromFailure(providerInput, provider.name, provider.name, error);
        return { ...failed, id: id("obs"), startedAt, completedAt: new Date().toISOString(), latencyMs: Date.now() - start };
      }
    }));
    observations.push(...rows);
    completed += rows.length;
    await input.onProgress?.(completed, tasks.length, rows.map((row) => row.provider).join(" / "));
  }
  return observations;
}
