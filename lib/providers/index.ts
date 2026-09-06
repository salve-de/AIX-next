import "server-only";
import { id } from "@/lib/ids";
import { extractRecommendedEntities } from "@/lib/entity-extraction";
import type { BuyerPrompt, CompanyDiscovery, Observation } from "@/lib/types";
import type { AiSearchProvider } from "@/lib/providers/common";
import { observationFromFailure } from "@/lib/providers/common";
import { openAiProvider } from "@/lib/providers/openai";
import { geminiProvider } from "@/lib/providers/gemini";
import { perplexityProvider } from "@/lib/providers/perplexity";

export const providers: AiSearchProvider[] = [openAiProvider, geminiProvider, perplexityProvider];

function providerModelName(provider: string) {
  if (provider === "openai") return "gpt-4o (Search Grounding)";
  if (provider === "gemini") return "gemini-1.5-pro (Google Grounding)";
  if (provider === "perplexity") return "sonar (Online Web Grounding)";
  return `${provider}-search`;
}

export async function runObservationPanel(input: {
  prompts: BuyerPrompt[];
  discovery: CompanyDiscovery;
  repetitions: number;
  concurrency?: number;
  onProgress?: (completed: number, total: number, detail: string) => Promise<void> | void;
}) {
  const tasks = input.prompts.flatMap((prompt) =>
    providers.flatMap((provider) =>
      Array.from({ length: input.repetitions }, (_, index) => ({
        prompt,
        provider,
        repetition: index + 1,
      }))
    )
  );

  const observations: Observation[] = [];
  let completed = 0;
  const concurrency = Math.min(12, Math.max(1, Math.floor(input.concurrency || 6)));

  for (let offset = 0; offset < tasks.length; offset += concurrency) {
    const batch = tasks.slice(offset, offset + concurrency);
    const rows = await Promise.all(
      batch.map(async ({ prompt, provider, repetition }) => {
        const providerInput = { prompt, discovery: input.discovery, repetition };
        const startedAt = new Date().toISOString();
        const start = Date.now();

        if (!provider.configured()) {
          return observationFromFailure(providerInput, provider.name, providerModelName(provider.name), `${provider.name}のAPI設定がありません。`);
        }

        try {
          // 外部通信は最大5秒でタイムアウトさせ、Vercelの停止を絶対防御
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("AI Provider request timeout")), 5000)
          );
          const output = await Promise.race([provider.run(providerInput), timeoutPromise]);
          const recommendedEntities = extractRecommendedEntities(output.rawText, input.discovery);
          const ownPositionIndex = recommendedEntities.indexOf(input.discovery.brandName);

          return {
            id: id("obs"),
            promptId: prompt.id,
            prompt: prompt.text,
            provider: provider.name,
            model: output.model || providerModelName(provider.name),
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
          return observationFromFailure(providerInput, provider.name, providerModelName(provider.name), error);
        }
      })
    );

    observations.push(...rows);
    completed += rows.length;
    await input.onProgress?.(completed, tasks.length, rows.map((row) => row.provider).join(" / "));
  }

  return observations;
}
