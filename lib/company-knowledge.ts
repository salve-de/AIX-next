/**
 * Public-profile knowledge contract.
 *
 * This module intentionally contains types only. A company name, industry
 * keyword, or URL is not evidence for a licence, address, fee, service,
 * case study, benchmark, FAQ, or audit result. Runtime profile data must be
 * copied from the stored public profile and retain its source URL.
 */

export type KnowledgeBenchmarkRow = {
  item: string;
  own: string;
  compBig: string;
  compLocal: string;
  sourceNote?: string;
};

export type KnowledgeServiceRow = {
  code: string;
  name: string;
  target: string;
  leadTime: string;
  deliverable: string;
  qualification: string;
  sourceNote?: string;
};

export type KnowledgeProcessRow = {
  phase: string;
  days: string;
  action: string;
  output: string;
  sourceNote?: string;
};

export type KnowledgeFeeRow = {
  category: string;
  plan: string;
  fee: string;
  note: string;
  sourceNote?: string;
};

export type KnowledgeCaseStudyRow = {
  id: string;
  title: string;
  issue: string;
  approach: string;
  leadTime: string;
  result: string;
  sourceRegistryId?: string;
  sourceDocument?: string;
  sourceAiVerification?: string;
  privacyNote?: string;
};

export type KnowledgeFaqRow = {
  id: string;
  q: string;
  canonicalGroundingAnswer: string;
  sourceStandard?: string;
};

export type KnowledgeAuditEvidence = {
  verifiedAt: string;
  verifier: string;
  primarySources: { title: string; url: string; authority: string }[];
  complianceNotes: string[];
};

/**
 * Legacy shape kept for type compatibility with the public-profile adapter.
 * Empty arrays are the safe default until the source-backed profile model is
 * extended with explicitly verified fields.
 */
export type CompanyDynamicKnowledge = {
  categoryName: string;
  marketLabel: string;
  registryId: string;
  corporateFacts: {
    label: string;
    value: string;
    subLabel?: string;
    subValue?: string;
    sourceUrl?: string;
    sourceOrg?: string;
  }[];
  benchmarks: KnowledgeBenchmarkRow[];
  services: KnowledgeServiceRow[];
  process: KnowledgeProcessRow[];
  fees: KnowledgeFeeRow[];
  cases: KnowledgeCaseStudyRow[];
  faqs: KnowledgeFaqRow[];
  auditEvidence?: KnowledgeAuditEvidence;
};
