export type ProviderName = "openai" | "gemini" | "perplexity";
export type ScanStage = "created" | "validating" | "crawling" | "discovering" | "prompting" | "measuring" | "analyzing" | "complete" | "partial" | "failed";
export type PromptPanelKind = "free" | "core" | "discovery" | "custom";
export type PromptCluster = "category" | "segment" | "use_case" | "feature" | "alternative" | "comparison" | "value" | "implementation" | "trust" | "support";

export type Citation = { title: string; url: string; domain: string };
export type CrawledPage = { url: string; title: string; description: string; headings: string[]; text: string };
export type Competitor = { name: string; domain?: string; reason: string; confidence: number };

export type CompanyDiscovery = { legalName: string; brandName: string; domain: string; summary: string; market: string; targetCustomers: string[]; useCases: string[]; aliases: string[]; competitors: Competitor[]; confidence: number };
export type BuyerPrompt = { id: string; text: string; cluster: PromptCluster; importance: number; panel: PromptPanelKind; version: number; /** Why this prompt belongs in the buying panel. This is relevance evidence, not search volume. */ whyTracked?: string };
export type ObservationStatus = "success" | "failed" | "skipped";
export type Observation = { id: string; promptId: string; prompt: string; provider: ProviderName; model: string; repetition: number; status: ObservationStatus; rawText: string; citations: Citation[]; recommendedEntities: string[]; ownRecommended: boolean; ownPosition: number | null; firstCandidate: string | null; startedAt: string; completedAt: string; latencyMs: number; inputTokens?: number; outputTokens?: number; searchRequests?: number; costUsd?: number; error?: string };
export type CompetitorMetric = { name: string; recommendedCount: number; firstChoiceCount: number; coverage: number };
export type LostPrompt = { promptId: string; prompt: string; winner: string | null; summary: string; citations: Citation[]; observations: Observation[] };
export type EvidenceGap = { id: string; label: string; whyItMatters: string; relatedPromptIds: string[]; relatedPromptCount: number; competitorEvidence?: string; confidence: number; status: "missing" | "partial" };
export type NarrativeInsight = { id: string; theme: string; stance: "positive" | "neutral" | "negative" | "mixed"; summary: string; evidenceObservationIds: string[]; confidence: number };
export type ActionCard = { id: string; title: string; rationale: string; type: "owned" | "third_party" | "technical" | "positioning" | "entity"; relatedPromptIds: string[]; relatedPromptCount: number; priority: "critical" | "high" | "medium"; confidence: number; target: string };

export type ReadinessStatus = "pass" | "warn" | "fail";
export type ReadinessCheck = { id: string; label: string; status: ReadinessStatus; detail: string; affectedUrls?: string[] };
export type SiteReadiness = { checkedAt: string; passCount: number; warnCount: number; failCount: number; checks: ReadinessCheck[] };

export type EvidenceAnswer = { gapId: string; value: string; sourceUrl?: string; status: "company_asserted" | "verified" | "disputed" | "expired"; updatedAt: string };
export type ChangePackStatus = "draft" | "needs_evidence" | "ready" | "approved" | "rejected";
export type ChangePackValidation = { measuredAt: string; promptIds: string[]; beforeCoverage: number; afterCoverage: number; successfulObservations: number; note: string };
export type ChangePack = { id: string; actionId: string; status: ChangePackStatus; title: string; target: string; rationale: string; requiredFacts: string[]; missingFacts: string[]; allowedEvidence: Array<{ label: string; value: string; status: EvidenceAnswer["status"] }>; recommendedHeadings: string[]; draftBody: string; faqs: Array<{ question: string; answer: string }>; structuredDataNotes: string[]; internalLinks: string[]; validationChecklist: string[]; remeasurePromptIds: string[]; confidence: number; generatedAt: string; validation?: ChangePackValidation };

export type MeasurementPanel = { kind: PromptPanelKind; version: number; promptCount: number; repetitions: number; locale: "ja-JP"; country: "JP" };
export type ScanResult = {
  scanId: string; targetUrl: string; discovery: CompanyDiscovery; panel: MeasurementPanel; prompts: BuyerPrompt[]; measuredAt: string; observations: Observation[];
  scheduledObservations: number; successfulObservations: number; measurementCompleteness: number; recommendationCoverage: number; firstChoiceRate: number; mentionCoverage: number; citationCoverage: number; repeatAgreement: number; ownRecommendationCount: number; marketPosition: number; marketSize: number;
  competitors: CompetitorMetric[]; lostPrompts: LostPrompt[]; narratives: NarrativeInsight[]; siteReadiness: SiteReadiness; evidenceGaps: EvidenceGap[]; actions: ActionCard[]; totalCostUsd: number; warnings: string[];
};
export type ScanRecord = { id: string; targetUrl: string; stage: ScanStage; progress: number; message: string; result: ScanResult | null; error: string | null; createdAt: string; updatedAt: string };
export type WatchStatus = "trial" | "active" | "past_due" | "expired" | "cancelled";
export type WatchRecord = {
  id: string; token: string; email: string; scanId: string; status: WatchStatus; paid: boolean;
  /** Stable Core baseline. Discovery and Custom panels never contribute to Core trend metrics. */ baseline: ScanResult; latest: ScanResult; history: ScanResult[];
  /** Latest rotating Discovery panel, paid plan only. */ discoveryLatest?: ScanResult | null; discoveryHistory?: ScanResult[];
  /** User-defined prompts are intentionally isolated from Core so adding a prompt cannot fake trend improvement. */ customPrompts?: BuyerPrompt[]; customLatest?: ScanResult | null; customHistory?: ScanResult[];
  evidence: EvidenceAnswer[]; changePacks?: ChangePack[]; trialEndsAt: string; nextRunAt: string; createdAt: string; updatedAt: string;
};
export type ScanProgressEvent = { stage: ScanStage; progress: number; message: string; detail?: string };
