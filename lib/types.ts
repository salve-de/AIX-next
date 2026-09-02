export type ProviderName = "openai" | "gemini" | "perplexity";
export type ScanStage = "created" | "validating" | "crawling" | "discovering" | "prompting" | "measuring" | "analyzing" | "complete" | "partial" | "failed";
export type PromptPanelKind = "free" | "core" | "discovery";
export type PromptCluster = "category" | "segment" | "use_case" | "feature" | "alternative" | "comparison" | "value" | "implementation" | "trust" | "support";

export type Citation = {
  title: string;
  url: string;
  domain: string;
};

export type CrawledPage = {
  url: string;
  title: string;
  description: string;
  headings: string[];
  text: string;
};

export type Competitor = {
  name: string;
  domain?: string;
  reason: string;
  confidence: number;
};

export type CompanyDiscovery = {
  legalName: string;
  brandName: string;
  domain: string;
  summary: string;
  market: string;
  targetCustomers: string[];
  useCases: string[];
  aliases: string[];
  competitors: Competitor[];
  confidence: number;
};

export type BuyerPrompt = {
  id: string;
  text: string;
  cluster: PromptCluster;
  importance: number;
  panel: PromptPanelKind;
  version: number;
};

export type ObservationStatus = "success" | "failed" | "skipped";

export type Observation = {
  id: string;
  promptId: string;
  prompt: string;
  provider: ProviderName;
  model: string;
  repetition: number;
  status: ObservationStatus;
  rawText: string;
  citations: Citation[];
  recommendedEntities: string[];
  ownRecommended: boolean;
  ownPosition: number | null;
  firstCandidate: string | null;
  startedAt: string;
  completedAt: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  searchRequests?: number;
  costUsd?: number;
  error?: string;
};

export type CompetitorMetric = {
  name: string;
  recommendedCount: number;
  firstChoiceCount: number;
  coverage: number;
};

export type LostPrompt = {
  promptId: string;
  prompt: string;
  winner: string | null;
  summary: string;
  citations: Citation[];
  observations: Observation[];
};

export type EvidenceGap = {
  id: string;
  label: string;
  whyItMatters: string;
  relatedPromptIds: string[];
  relatedPromptCount: number;
  competitorEvidence?: string;
  confidence: number;
  status: "missing" | "partial";
};

export type ActionCard = {
  id: string;
  title: string;
  rationale: string;
  type: "owned" | "third_party" | "technical" | "positioning" | "entity";
  relatedPromptIds: string[];
  relatedPromptCount: number;
  priority: "critical" | "high" | "medium";
  confidence: number;
  target: string;
};

export type MeasurementPanel = {
  kind: PromptPanelKind;
  version: number;
  promptCount: number;
  repetitions: number;
  locale: "ja-JP";
  country: "JP";
};

export type ScanResult = {
  scanId: string;
  targetUrl: string;
  discovery: CompanyDiscovery;
  panel: MeasurementPanel;
  prompts?: BuyerPrompt[];
  measuredAt: string;
  observations: Observation[];
  scheduledObservations: number;
  successfulObservations: number;
  measurementCompleteness: number;
  recommendationCoverage: number;
  firstChoiceRate: number;
  mentionCoverage: number;
  citationCoverage: number;
  repeatAgreement: number;
  ownRecommendationCount: number;
  marketPosition: number;
  marketSize: number;
  competitors: CompetitorMetric[];
  lostPrompts: LostPrompt[];
  evidenceGaps: EvidenceGap[];
  actions: ActionCard[];
  totalCostUsd: number;
  warnings: string[];
};

export type ScanRecord = {
  id: string;
  targetUrl: string;
  stage: ScanStage;
  progress: number;
  message: string;
  result: ScanResult | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceAnswer = {
  gapId: string;
  value: string;
  sourceUrl?: string;
  status: "company_asserted" | "verified" | "disputed" | "expired";
  updatedAt: string;
};

export type WatchStatus = "trial" | "active" | "past_due" | "cancelled" | "expired";

export type WatchRecord = {
  id: string;
  token: string;
  email: string;
  scanId: string;
  status: WatchStatus;
  paid: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  baseline: ScanResult;
  latest: ScanResult;
  history: ScanResult[];
  evidence: EvidenceAnswer[];
  nextRunAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ScanProgressEvent = {
  stage: ScanStage;
  progress: number;
  message: string;
  detail?: string;
};
