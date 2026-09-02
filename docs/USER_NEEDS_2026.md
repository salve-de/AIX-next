# AIX Next — User Needs & Competitive Response

Updated: 2026-09-02

This document is the product decision record for what AIX should optimize for. It is not marketing copy. A feature should exist only when it reduces a demonstrated user problem or closes an important competitive gap.

## Sources reviewed

Official product/pricing/docs:
- Profound — features, Answer Engine Insights, Prompt Volumes, pricing
- Peec AI — pricing/product
- OtterlyAI — product/pricing
- Goodie — product/pricing
- Scrunch AI — product/pricing
- AthenaHQ — product/pricing
- Anthropic — Web Search and current model docs
- xAI — Web Search and Grok model docs

User evidence reviewed:
- G2 reviews for Profound and Peec AI
- Recent Reddit discussions in SEO / AEO / GEO communities about AI visibility tools

Community posts are directional qualitative evidence, not ground truth. They are used to identify repeated pain patterns, not to make quantitative market claims.

## Repeated user needs

### 1. Trust the number

Repeated complaint: different tools can show materially different visibility scores, while methodology, prompts, repetitions and model surfaces are unclear.

AIX response:
- no overall AIX Score;
- exact Buyer Prompt visible;
- exact provider/model/repetition/date visible;
- failed/skipped observations excluded from recommendation denominators;
- raw answer and citations open from the result;
- fixed Core Panel for trends;
- Panel version changes when the measured AI surface set changes.

Product implication: measurement detail is not an advanced setting. It must be reachable from the result that uses the metric.

### 2. Know what to do next

Repeated complaint: dashboards show visibility, competitors and citations, but users still do not know whether to update a page, add proof, create content or ignore noise.

AIX response:
- identify the highest-value lost Buyer Prompt;
- compare the winning competitor evidence with what can be verified for the company;
- produce one prioritized Action;
- convert Action into a Change Pack;
- keep unsupported facts as `[要確認]` rather than inventing claims;
- re-observe the affected Prompt set after an approved change.

Product implication: Action and Change Pack belong in the same project as monitoring. Sending the user to a generic content generator breaks the value chain.

### 3. Keep trends apples-to-apples

Repeated complaint: adding prompts can make historical charts difficult or misleading.

AIX response:
- Core, Discovery and Custom are separate panels;
- only fixed Core contributes to trend metrics;
- paid migration from 3 measured surfaces to 5 creates a new Core baseline;
- Discovery can rotate without changing the trend line;
- Custom Prompt additions cannot improve the official Core trend.

Product implication: flexibility is allowed, but flexibility cannot silently rewrite the benchmark.

### 4. Avoid dashboard overload

Positive user feedback across products frequently mentions clean dashboards and useful weekly summaries; negative feedback mentions similar-sounding metrics and learning curve.

AIX response:
- free result opens with the concrete buyer loss, not all metrics;
- Weekly Brief starts with what changed;
- Workspace contains the deeper modules;
- Mention, Recommendation, First Choice and Citation remain separate but are not all treated as equal headline metrics;
- one primary action per stage.

Product implication: the Workspace may be broad; the first screen may not be broad.

### 5. Track the AI surfaces that matter without destroying unit economics

Users value multi-model coverage, but small customers also complain about GEO tooling cost.

AIX response:
- Free Scan: 12 prompts × OpenAI/Gemini/Perplexity × 1;
- 14-day Watch: stable 30-prompt Core on the same 3 surfaces;
- Founder Watch: 50 Core + 20 Discovery across OpenAI/Gemini/Perplexity/Claude/Grok × 3 repetitions;
- Custom prompts remain isolated and capped;
- unconfigured/failed providers reduce completeness rather than count as brand losses.

Product implication: five-surface monitoring is paid product value, not a free-scan cost leak.

### 6. Prove business relevance, not just AI visibility

Repeated complaint: visibility and citation movement does not by itself show business impact.

AIX response:
- Agent Analytics ingests real recognized crawler/referral events;
- AI referrals are separated from crawler visits;
- optional non-PII conversion labels can be attached by the customer's analytics pipeline;
- optional observed conversion value/currency can be stored;
- multiple currencies are not summed into a fake revenue total;
- AIX never labels a visibility/content change as the cause of the observed conversion.

Product implication: show observed business outcomes alongside AI visibility, while keeping attribution and causality separate.

### 7. Track prompts that are worth tracking

Repeated complaint: one hundred arbitrary generated prompts are not necessarily better than fifty relevant prompts.

AIX response:
- generate prompts from discovered market, target customer, use case and comparison context;
- store `whyTracked` for each prompt;
- cover distinct buyer-intent clusters;
- allow Custom Prompts without contaminating Core;
- do not claim proprietary AI prompt volume data that AIX does not possess.

Product implication: relevance rationale is more defensible than fake precision around prompt demand.

## Competitive position

AIX should match category expectations where they are useful:
- visibility;
- prompt tracking;
- recommendation/shortlist analysis;
- citations;
- competitors;
- multi-model monitoring;
- AI crawler/referral analytics;
- exports and recurring summaries.

AIX should differentiate on the closed operational chain:

`Buyer Loss → Raw Evidence → Missing Comparison Material → Change Pack → Approval → Safe Execution → Re-observation → Observed Business Events`

The product loses its differentiation if any step becomes a disconnected report or generic AI-writing feature.

## Known gaps we should not hide

- AIX does not currently own a proprietary corpus of real-user AI prompt volume comparable to Profound Prompt Volumes.
- API-grounded model observations are not represented as identical to every consumer UI answer.
- Google AI Overviews / AI Mode and consumer Copilot need a separate compliant surface-capture adapter; they must not be mislabeled as Gemini or another API result.
- Enterprise controls and agency portfolio workflows remain less mature than established enterprise competitors.

These are roadmap gaps, not claims to paper over with UI copy.

## Product acceptance test

Every primary screen must answer, in order:
1. What buyer decision is being observed?
2. Is the company mentioned, recommended, first choice, cited, or omitted?
3. Who wins instead?
4. What source or comparison material supports the outcome?
5. What is the smallest credible next action?
6. How will AIX re-observe the same decision surface?
7. If real referral/conversion data is connected, what business events were actually observed?
