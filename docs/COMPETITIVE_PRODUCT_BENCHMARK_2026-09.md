# AIX v3 — Competitive Product Benchmark

Date: 2026-09-02

This file is a product-decision record. It is not marketing copy. Features are added only when they improve a buyer/user job or close a verified competitive gap.

## The category is already crowded

The following are now table stakes in AI-search / GEO software:

- brand visibility / mention tracking;
- prompt-level monitoring;
- citation/domain/URL tracking;
- competitor share of voice;
- multi-model measurement;
- historical trends;
- recommendations / content opportunities;
- exports and stakeholder reporting.

AIX must implement these well, but none of them is sufficient differentiation alone.

## Current competitors reviewed

### OtterlyAI

Official sources:

- https://otterly.ai/features/
- https://otterly.ai/features/ai-search-analytics
- https://help.otterly.ai/ai-recommendations
- https://help.otterly.ai/changelog
- https://help.otterly.ai/search-prompt-monitoring

Observed product strengths as of this review:

- seven AI search engines on its current feature page;
- daily prompt monitoring;
- prompt research;
- brand mentions, sentiment and competitive benchmarking;
- domain + page citation tracking;
- Citation winners/losers;
- crawlability and content audit;
- prioritized recommendations with Suggested / To-Do / Archive workflow;
- reports, Looker Studio, API, MCP;
- Agent Analytics early access.

AIX decision:

- Visibility / Prompt / Citation / Competitor / Narrative are required table stakes.
- AIX cannot stop at a recommendation list because Otterly already has an action workflow.
- AIX must connect a loss to the raw answer, the missing comparison material, an approval-gated Change Pack and re-observation of the exact affected prompts.
- Page Intelligence must join owned page inventory, citation events and lost buyer intent rather than being an isolated SEO audit.

### Profound

Official sources:

- https://www.tryprofound.com/features/prompt-volumes
- https://help.tryprofound.com/articles/6700593218-about-pages
- https://product.tryprofound.com/changelog

Observed product strengths as of this review:

- enterprise Answer Engine measurement;
- proprietary Prompt Volumes / prompt research based on a very large first-party prompt dataset;
- page-level AI citation + bot activity view;
- Agent Analytics;
- workflows/actions around AI visibility.

AIX decision:

- Never invent or relabel an LLM-generated prompt relevance score as real prompt volume.
- `whyTracked` explains why a prompt is in the AIX panel; it is not demand volume.
- Stable Core and rotating Discovery remain separate.
- Page Intelligence is required because page-level citation and bot activity are becoming standard at the enterprise end.
- AIX competes through lower setup friction and a tighter buyer-loss → evidence → execution loop, not fake data parity with proprietary prompt panels.

### Scrunch

Official sources:

- https://origin.scrunchai.com/
- https://origin.scrunchai.com/blog/agent-experience-platform

Observed product direction:

- moving beyond visibility toward Agent Experience;
- observes what agents say and do;
- connects AI-agent behavior to site readiness/content delivery.

AIX decision:

- Agent Analytics is a first-class product surface, not a vanity server-log chart.
- AIX distinguishes synthetic observation from observed crawler/referral events.
- Real bot/referral events can raise business confidence, but do not retroactively prove causality for a content change.

## User evidence reviewed

Directional community discussions reviewed:

- https://www.reddit.com/r/GEO_optimization/comments/1umrd01/i_tried_at_least_20_ai_visibility_tools_for_my/
- https://www.reddit.com/r/aeo/comments/1uazav3/what_are_actually_the_best_ai_visibility_tools/
- https://www.reddit.com/r/Rankin_AI/comments/1u84bb3/for_people_using_ai_visibility_tools_what_feature/
- https://www.reddit.com/r/GEO_optimization/comments/1ullj7a/are_current_ai_visibility_tools_enough_for_ur/
- https://www.reddit.com/r/DigitalMarketing/comments/1rk94ho/we_tested_several_ai_visibility_platforms_which/
- https://www.reddit.com/r/SEO_Xpert/comments/1u359yd/ai_visibility_scores_only_help_if_you_can_see_the/

These are qualitative user/community signals, not representative market statistics.

Repeated problems:

1. Different tools return incompatible visibility scores and users cannot inspect the methodology.
2. A single blended score hides model disagreement.
3. Users care about exact citation sources/pages, not mention count alone.
4. Users want competitor/topic gaps and a concrete next action.
5. A recommendation that is not tied back to a real prompt/source still requires expert interpretation.
6. Single-run measurements are noisy.

AIX decisions:

- no overall AIX Score;
- exact Prompt, Provider, model, repetitions, date, raw answer, citation and denominator stay inspectable;
- failed/skipped observations are not losses;
- paid Core uses repeated observation;
- weekly change logic uses majority outcome across repetitions and skips under-observed cells;
- model/surface changes create a new baseline rather than a fake trend;
- executive Watch leads with changed buyer outcomes, not internal job logs;
- Workspace contains the deep data for specialists.

## Surface coverage decision

AIX Founder Watch currently treats these as explicit API-grounded surfaces:

- OpenAI Responses API + Web Search;
- Gemini API + Google Search grounding;
- Perplexity Sonar;
- Claude API + Web Search;
- xAI / Grok Responses + Web Search.

Google AI Mode / Google AI Overviews can be obtained through third-party SERP vendors such as DataForSEO or SerpApi, but current language/location coverage and product semantics differ from the five API-grounded surfaces. AIX does not label them as measured until a dedicated adapter has acceptable Japanese coverage and reproducibility.

## What AIX must be best at

### 1. Zero-setup buyer market

Required user input before value: one company URL.

AIX automatically derives brand, market, buyer, use cases, likely substitutes/competitors and the initial Buyer Prompt panel. Users may later correct/enrich the system; configuration is not a prerequisite for the free result.

### 2. Auditability

Every executive conclusion must drill down to observations. A number without a denominator is a display bug.

### 3. Closed-loop action

The primary chain is:

`Buyer Prompt → Recommendation outcome → Citation → competitor evidence → missing comparison material → Action → Change Pack → approval → safe execution → same-prompt re-observation`

### 4. Measurement integrity

- Core = stable trend panel.
- Discovery = rotating exploration.
- Custom = customer-defined diagnostic panel.
- These panels never share trend denominators.
- Provider-set / repetition / panel-version changes invalidate the previous trend baseline.
- Weekly diff uses repeated outcomes, not “any one run changed.”

### 5. Page + agent reality

AIX combines:

- synthetic answer-engine observations;
- owned Page Intelligence;
- crawlability/readiness;
- observed AI crawler events;
- observed AI referral/conversion events when supplied.

The UI labels which layer every statement came from.

## Information architecture

### Public funnel

1. Home — understand the buyer event and scan URL.
2. Free Result — biggest buyer loss, replacement, evidence gap, first action, audit trail.
3. 14-day Watch — preserve a stable baseline without card details.
4. Paid Founder Watch — recurring measurement + deep Workspace + execution.

### Weekly Watch

Purpose: answer in under ten seconds:

- What changed?
- Which competitor is taking the buyer surface?
- Which citation changed?
- What comparison material is missing?
- What should we do next?

### Deep Workspace

Purpose: complete the work without buying another specialist tool.

- Visibility;
- Buyer Prompts;
- Recommendations;
- Citations;
- Competitors;
- Narratives;
- Evidence / comparison materials;
- Actions / Change Packs;
- Page Intelligence;
- Site Readiness;
- Agent Analytics;
- business outcomes;
- Core / Discovery / Custom history;
- exports;
- GitHub / WordPress execution.

## CTA design rules

Every primary button must answer “why this button, here?”

- Home: `候補外になる購買質問を無料で調べる` — lowest-friction route to company-specific value.
- Sample link: lets cautious users inspect output before submitting a domain.
- Free Result: `この市場を14日間追跡する` — converts a noisy snapshot into a repeatable baseline, after value is visible.
- Evidence: `非公開で保存` — user is resolving a specific missing fact, not completing a generic profile.
- Action: `この変更案を作る` — converts diagnosis to an inspectable, reversible Change Pack.
- Execution: GitHub PR / WordPress Draft only after ownership + explicit approval — actionability without autonomous production writes.
- Re-measure: runs the affected prompt set after an approved change, but labels the result as observed difference, not proven causal uplift.
- Paid CTA: `固定Core観測を継続する` — describes exactly what the recurring subscription buys.

## Current no-go claims

Do not ship copy that implies:

- universal ChatGPT rank;
- deterministic AI rankings;
- guaranteed citation/recommendation;
- causal lift from simple before/after;
- real AI prompt volume unless the source is genuinely observed/licensed;
- that API-grounded observations are identical to every personalized consumer UI;
- that a company-provided fact is independently verified.
