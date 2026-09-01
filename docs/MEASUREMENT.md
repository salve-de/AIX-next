# AIX Next — Measurement Methodology

## Measurement boundary

AIX Next measures a declared observation panel. It does not measure every private consumer conversation and does not call an API result a universal ChatGPT rank.

Each result states:

- country and language;
- AI surface and model alias;
- exact Buyer Prompt panel and version;
- repetition count;
- execution time;
- successful, failed and skipped observations;
- extraction version.

## Panels

### Free panel

- 12 high-intent Buyer Prompts;
- OpenAI web search, Gemini grounded search and Perplexity Sonar;
- one repetition;
- generated from the company’s detected market;
- intended as a directional diagnosis.

### Watch Core panel

- 50 fixed prompts;
- three AI surfaces;
- three repetitions;
- weekly execution;
- used for longitudinal metrics.

### Discovery panel

- up to 20 rotating prompts;
- used to discover new buyer language, use cases and competitors;
- excluded from the headline trend until reviewed and promoted into a new Core panel version.

## Prompt taxonomy

A panel should cover:

1. category recommendation;
2. company size or buyer segment;
3. industry/use case;
4. feature/capability;
5. alternatives and switching;
6. direct comparison;
7. price/value/TCO;
8. implementation/migration;
9. trust/security/risk;
10. support and operations.

Prompts must describe a buying decision. Pure brand queries and repeated paraphrases are excluded from the headline metric.

## Observation eligibility

An observation is eligible when:

- the provider call succeeds;
- the response contains enough text to classify;
- the prompt and panel version are known;
- the market and company aliases are known.

Failed or unconfigured provider calls do not count as negative recommendations. They reduce Measurement Completeness.

## Metrics

### Recommendation Coverage

Eligible observations where the company is explicitly presented as a purchase candidate divided by all eligible observations.

### First Choice Rate

Eligible observations where the company is the first clearly recommended candidate divided by all eligible observations.

### Mention Coverage

Eligible observations where the company is named in any context. This is not treated as recommendation.

### Citation Coverage

Eligible observations containing a source from the company’s verified domain or subdomain divided by all eligible observations.

### Competitor Win Rate

For a named competitor, eligible observations where that competitor is recommended and the company is omitted or placed later, divided by eligible pairwise observations.

### Repeat Agreement

For each Prompt × AI surface group, AIX compares the signatures of repeated outcomes: company recommended, company position and first candidate. The group score is the share represented by the modal signature. The final metric is the average across eligible groups.

### Measurement Completeness

Successful observations divided by scheduled observations.

### Market position

Companies are ranked only when measured against the same Core panel, language, country, week and success rules. Companies measured with different custom panels are not presented in one independent public ranking.

## Raw audit record

Every observation stores:

```text
provider
surface
model alias/snapshot where available
country
locale
prompt text
prompt id and version
panel id and version
repetition
started/completed timestamps
raw response
normalized recommended entities
company position
citations
status/error
latency
token/search usage when returned
cost estimate
extraction version
```

## Evidence relationship

An Evidence Gap is generated when a material fact cannot be verified in the company’s public sources while the same fact appears in a competitor recommendation rationale or a relevant Buyer Prompt cluster.

AIX says:

> This missing evidence is related to 11 tracked prompts.

It does not say:

> Adding this evidence will improve 11 prompts.

The latter requires action/outcome data and a stronger causal design.

## Change interpretation

A change between two weeks can arise from:

- company action;
- competitor action;
- changed Web sources;
- provider/model updates;
- location or retrieval variation;
- non-determinism;
- extraction changes.

The UI therefore distinguishes:

- observed increase/decrease;
- change within instability range;
- panel incompatibility;
- change after a recorded action;
- likely association;
- causal conclusion (not available in MVP).
