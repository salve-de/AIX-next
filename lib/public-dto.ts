import type {
  AiReadableDraft,
  ChangePack,
  LostPrompt,
  Observation,
  ScanResult,
  WatchMeasurementRun,
  WatchRecord,
} from "@/lib/types";

/**
 * Fields needed by the Watch screen, without provider answers or operational
 * accounting details.  Watch is addressed by its bearer token, so returning
 * more than this shape would unnecessarily widen the impact of a leaked URL.
 */
export type PublicObservation = Pick<
  Observation,
  | "id"
  | "promptId"
  | "prompt"
  | "provider"
  | "repetition"
  | "status"
  | "citations"
  | "recommendedEntities"
  | "ownRecommended"
  | "ownPosition"
  | "firstCandidate"
>;

export type PublicLostPrompt = Omit<LostPrompt, "observations">;

export type PublicScanResult = Omit<ScanResult, "observations" | "lostPrompts" | "warnings" | "totalCostUsd"> & {
  observations: PublicObservation[];
  lostPrompts: PublicLostPrompt[];
};

export type PublicAiReadableDraft = Omit<AiReadableDraft, "sourceMeasurementId">;

export type PublicChangePack = Omit<ChangePack, "sourceMeasurementId" | "model" | "aiReadable"> & {
  aiReadable?: PublicAiReadableDraft;
};

export type PublicWatch = Omit<
  WatchRecord,
  | "id"
  | "token"
  | "email"
  | "scanId"
  | "stripeCustomerId"
  | "stripeSubscriptionId"
  | "baseline"
  | "latest"
  | "history"
  | "changePack"
> & {
  baseline: PublicScanResult;
  latest: PublicScanResult;
  history: PublicScanResult[];
  changePack?: PublicChangePack | null;
};

export type PublicWatchMeasurementRun = {
  status: WatchMeasurementRun["status"];
  panelKind: WatchMeasurementRun["panelKind"];
  completedPrompts: number;
  totalPrompts: number;
  completedObservations: number;
  totalObservations: number;
  updatedAt: string;
};

function publicObservation(observation: Observation): PublicObservation {
  const {
    id,
    promptId,
    prompt,
    provider,
    repetition,
    status,
    citations,
    recommendedEntities,
    ownRecommended,
    ownPosition,
    firstCandidate,
  } = observation;
  return {
    id,
    promptId,
    prompt,
    provider,
    repetition,
    status,
    citations,
    recommendedEntities,
    ownRecommended,
    ownPosition,
    firstCandidate,
  };
}

function publicLostPrompt(lostPrompt: LostPrompt): PublicLostPrompt {
  return {
    promptId: lostPrompt.promptId,
    prompt: lostPrompt.prompt,
    winner: lostPrompt.winner,
    summary: lostPrompt.summary,
    citations: lostPrompt.citations,
  };
}

export function toPublicScanResult(result: ScanResult): PublicScanResult {
  return {
    scanId: result.scanId,
    targetUrl: result.targetUrl,
    discovery: result.discovery,
    panel: result.panel,
    prompts: result.prompts,
    measuredAt: result.measuredAt,
    observations: result.observations.map(publicObservation),
    scheduledObservations: result.scheduledObservations,
    successfulObservations: result.successfulObservations,
    measurementCompleteness: result.measurementCompleteness,
    recommendationCoverage: result.recommendationCoverage,
    firstChoiceRate: result.firstChoiceRate,
    mentionCoverage: result.mentionCoverage,
    citationCoverage: result.citationCoverage,
    repeatAgreement: result.repeatAgreement,
    ownRecommendationCount: result.ownRecommendationCount,
    marketPosition: result.marketPosition,
    marketSize: result.marketSize,
    competitors: result.competitors,
    lostPrompts: result.lostPrompts.map(publicLostPrompt),
    evidenceGaps: result.evidenceGaps,
    actions: result.actions,
    visibilityAudit: result.visibilityAudit,
    marketMap: result.marketMap,
    demandProxy: result.demandProxy,
    contentQuality: result.contentQuality,
  };
}

export function toPublicChangePack(changePack: ChangePack): PublicChangePack {
  const { generatedAt, items, changeId, measurementPlan, aiReadable } = changePack;
  return {
    generatedAt,
    items,
    ...(changeId ? { changeId } : {}),
    ...(measurementPlan ? { measurementPlan } : {}),
    ...(aiReadable ? {
      aiReadable: {
        generatedAt: aiReadable.generatedAt,
        sourceUrl: aiReadable.sourceUrl,
        suggestedFileName: aiReadable.suggestedFileName,
        llmsTxt: aiReadable.llmsTxt,
        jsonLd: aiReadable.jsonLd,
        sourcePages: aiReadable.sourcePages,
        publishChecks: aiReadable.publishChecks,
      },
    } : {}),
  };
}

export function toPublicWatch(watch: WatchRecord): PublicWatch {
  return {
    status: watch.status,
    paid: watch.paid,
    baseline: toPublicScanResult(watch.baseline),
    latest: toPublicScanResult(watch.latest),
    history: watch.history.map(toPublicScanResult),
    evidence: watch.evidence,
    changePack: watch.changePack ? toPublicChangePack(watch.changePack) : null,
    nextRunAt: watch.nextRunAt,
    createdAt: watch.createdAt,
    updatedAt: watch.updatedAt,
    ...(watch.competitorEvents ? { competitorEvents: watch.competitorEvents } : {}),
    ...(watch.autoActions ? { autoActions: watch.autoActions } : {}),
    ...(watch.autoActionImpacts ? { autoActionImpacts: watch.autoActionImpacts } : {}),
  };
}

export function toPublicWatchMeasurementRun(run: WatchMeasurementRun): PublicWatchMeasurementRun {
  return {
    status: run.status,
    panelKind: run.panelKind,
    completedPrompts: run.nextPromptIndex,
    totalPrompts: run.prompts.length,
    completedObservations: run.observations.length,
    totalObservations: run.prompts.length * 3 * run.repetitions,
    updatedAt: run.updatedAt,
  };
}
