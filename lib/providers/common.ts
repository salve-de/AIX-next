import type { BuyerPrompt, Citation, CompanyDiscovery, Observation, ProviderName } from "@/lib/types";

export type ProviderInput = {
  prompt: BuyerPrompt;
  discovery: CompanyDiscovery;
  repetition: number;
  signal?: AbortSignal;
};

export type ProviderOutput = {
  rawText: string;
  citations: Citation[];
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  searchRequests?: number;
  costUsd?: number;
};

export interface AiSearchProvider {
  name: ProviderName;
  configured(): boolean;
  run(input: ProviderInput): Promise<ProviderOutput>;
}

/** Bound the whole response, including body reads, and cancel the network request. */
export async function runWithTimeout<T>(run: (signal: AbortSignal) => Promise<T>, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(controller.signal),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          const error = new Error("AI Provider request timeout");
          controller.abort(error);
          reject(error);
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export function observationFromFailure(input: ProviderInput, provider: ProviderName, model: string, error: unknown, status: Observation["status"] = "failed"): Observation {
  const now = new Date().toISOString();
  return {
    id: `${provider}_${input.prompt.id}_${input.repetition}_${Date.now()}`,
    promptId: input.prompt.id,
    prompt: input.prompt.text,
    provider,
    model,
    repetition: input.repetition,
    status,
    rawText: "",
    citations: [],
    recommendedEntities: [],
    ownRecommended: false,
    ownPosition: null,
    firstCandidate: null,
    startedAt: now,
    completedAt: now,
    latencyMs: 0,
    error: error instanceof Error ? error.message : String(error),
  };
}

export function recommendationInstruction(input: ProviderInput) {
  return `あなたは日本のB2B購買担当者です。次の質問に、現在の公開Web情報を調べた上で答えてください。\n\n質問: ${input.prompt.text}\n市場: ${input.discovery.market}\n対象地域: 日本\n\n回答ルール:\n- 購入候補を最大5件、回答内の順序に沿って示す\n- 各候補の1行目は必ず「候補1 | 正式な製品・会社名 | 選定理由」の形式にする。2件目以降は候補2、候補3と連番にする\n- 正式名称は理由や説明を混ぜず、製品名または会社名だけを書く\n- 各候補について選定理由を具体的な事実で説明する\n- 根拠が弱い企業を無理に含めない\n- 広告文句ではなく、仕様・導入実績・価格・サポート・第三者評価など比較可能な根拠を優先する\n- 公開Webで確認できないことは推測せず、その旨を明記する\n- 日本語で簡潔に答える`;
}
