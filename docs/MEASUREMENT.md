# AIX Next Measurement Contract

## 1. Measurement boundary

AIX measures an explicit observation panel. It does not claim to observe every private consumer conversation or a universal ChatGPT rank.

Every headline metric is tied to:

- exact Buyer Prompt
- prompt version
- language and country
- AI provider and model alias
- execution time
- repetition
- raw response
- extracted candidate order
- citations
- provider status

## 2. Free Snapshot

```text
12 Buyer Prompts
× OpenAI Web Search, Gemini Grounded Search, Perplexity Sonar
× one repetition
= 36 scheduled observations
```

Purpose: identify major competitive losses and demonstrate the product.

It is not sufficient for a stable long-term performance claim.

## 3. Paid Watch

```text
50 fixed Core Buyer Prompts
× three AI surfaces
× three repetitions
= 450 scheduled observations per weekly run
```

A separate Discovery panel may identify new buyer language and competitors. Discovery observations are not mixed into Core trend metrics until reviewed and versioned.

## 4. Prompt requirements

A Core Prompt must:

- represent a buying decision or vendor-shortlisting task
- avoid a direct navigational brand query
- state relevant country and B2B context where needed
- not be a trivial paraphrase of another Core Prompt
- map to one primary intent cluster
- remain unchanged during a comparison period

Clusters:

- category
- company segment
- use case
- comparison
- alternative
- value / TCO
- implementation / migration
- trust / security
- support
- feature

## 5. Metrics

### Shortlist Coverage

Successful observations where the company is explicitly included as a recommended purchase candidate divided by all successful eligible observations.

Failed and unconfigured provider runs are excluded from the recommendation denominator and included in Measurement Completeness.

### Top Choice Rate

Successful observations where the company is the first recommended candidate divided by all successful eligible observations.

### Citation Coverage

Successful observations with at least one citation from the company’s official domain or subdomain divided by all successful eligible observations.

### Stability

For the same Prompt, AI surface and week, AIX compares:

- company included or excluded
- company position
- first recommended candidate

Stability is the mean majority agreement across groups.

### Market Position

Companies are ordered by Shortlist Coverage on the same panel. AIX does not compare ranks created from different prompts, languages, countries, weeks or failure sets.

### Measurement Completeness

Successful observations divided by scheduled observations.

## 6. Candidate extraction

The measurement prompt explicitly requests a maximum of five purchase candidates in priority order.

AIX then:

1. builds a company/brand alias set
2. finds candidate names in the raw answer
3. orders candidates by their first occurrence
4. records the raw answer and citations
5. exposes the result for human audit

A future classifier may improve ambiguous answers, but the raw response remains canonical.

## 7. Change interpretation

AIX distinguishes:

- observed change
- change within an unstable panel
- change after a recorded company action
- likely relationship
- controlled evidence of uplift

A before/after difference alone is not causation. Model changes, competitor changes, Web changes, geographic variation and non-determinism can all affect the observation.

## 8. Quality gates

Before a metric is used in public marketing or a case study:

- Measurement Completeness ≥ 90%
- market confidence ≥ 0.8
- company entity reviewed when ambiguous
- Core panel unchanged
- raw observations retained
- no unsupported causal wording
