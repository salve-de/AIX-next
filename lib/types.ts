export type ProviderName = "openai" | "gemini" | "perplexity";
export type ScanStage = "queued" | "validating" | "crawling" | "discovering" | "prompting" | "measuring" | "analyzing" | "complete" | "partial" | "failed";
export type PromptCluster = "category" | "segment" | "use_case" | "comparison" | "alternative" | "value" | "implementation" | "trust" | "support" | "feature";

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
  version: number;
};

export type Citation = {
  title: string;
  url: string;
  domain: string;
};

export type Observation = {
  id: string;
  promptId: string;
  prompt: string;
  provider: ProviderName;
  model: string;
  repetition: number;
  status: "success" | "failed" | "skipped";
  rawText: string;
  rankedBrands: string[];
  ownRecommended: boolean;
  ownPosition: number | null;
  citations: Citation[];
  latencyMs: number;
  createdAt: string;
  error?: string;
};

export type CompetitorMetric = {
  name: string;
  count: number;
  coverage: number;
};

export type EvidenceGap = {
  id: string;
  label: string;
  whyItMatters: string;
  relatedPromptIds: string[];
  relatedPromptCount: number;
  competitorEvidence: string;
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

export type LostPrompt = {
  prompt: BuyerPrompt;
  winner: string | null;
  observations: Observation[];
  citations: Citation[];
};

export type MetricSummary = {
  successfulObservations: number;
  scheduledObservations: number;
  measurementCompleteness: number;
  shortlistCoverage: number;
  topChoiceRate: number;
  citationCoverage: number;
  stability: number;
  marketPosition: number;
  marketSize: number;
  ownRecommendationCount: number;
  lostPromptCount: number;
  competitors: CompetitorMetric[];
};

export type ScanResult = {
  scanId: string;
  url: string;
  measuredAt: string;
  discovery: CompanyDiscovery;
  pages: Array<Pick<CrawledPage, "url" | "title">>;
  prompts: BuyerPrompt[];
  observations: Observation[];
  metrics: MetricSummary;
  lostPrompts: LostPrompt[];
  evidenceGaps: EvidenceGap[];
  actions: ActionCard[];
  warnings: string[];
};

export type ScanRecord = {
  id: string;
  url: string;
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

export type WatchRecord = {
  id: string;
  token: string;
  email: string;
  scanId: string;
  baseline: ScanResult;
  latest: ScanResult;
  history: ScanResult[];
  evidence: EvidenceAnswer[];
  status: "trial" | "active" | "past_due" | "cancelled";
  paid: boolean;
  nextRunAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ProgressEvent = {
  stage: ScanStage;
  progress: number;
  message: string;
  detail?: string;
};
