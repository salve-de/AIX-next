# AIX Next v3 — Critical Product Review

Date: 2026-09-02

## Verdict

v2 is coherent, auditable and visually understandable, but it is still too easy to classify as another AI-search monitoring dashboard. That is a dangerous position because the category is already crowded with products that track more models, run daily, expose prompt analytics, and offer recommendations.

AIX must win on a narrower job:

> Find the buyer questions where a company falls out of the AI shortlist, show the evidence that replaced it, turn the missing proof into a safe change package, and re-observe the same decision surface.

The product is therefore not primarily a visibility tracker. It is a **Buyer Loss → Evidence → Change → Re-observe operating loop**.

## Competitive reality

Official product pages reviewed for v3:

- Profound: https://www.tryprofound.com/pricing and https://www.tryprofound.com/features
- Peec AI: https://peec.ai/pricing
- OtterlyAI: https://otterly.ai/pricing
- Goodie: https://higoodie.com/pricing/
- Scrunch: https://www.scrunchai.com/pricing (current public pricing may redirect by region/version)

### What competitors already make commodity

- prompt tracking;
- share of voice / visibility scores;
- competitor benchmarking;
- citation analysis;
- daily monitoring;
- recommendations;
- multi-model dashboards.

AIX cannot use those features as its main differentiation.

### Competitive disadvantages we must acknowledge

1. Some competitors run larger prompt panels and daily observations.
2. Profound publicly emphasizes direct/browser answer capture on some surfaces; AIX v3 currently measures provider/API-grounded observations and must not present that as identical to every consumer UI experience.
3. Profound has prompt-volume data; AIX currently generates buyer prompts from company/market evidence rather than a proprietary corpus of real-user prompt volume.
4. Mature competitors have enterprise security, integrations, agencies, exports and revenue attribution.

We do not hide these gaps with marketing copy.

## v2 problems

### P0 — Result opens with a fragile rank

The free scan uses 12 prompts and one repetition. Leading with “13社中9位” gives a precision impression stronger than the panel supports.

**v3 decision:** lead with the concrete unit: “12の購買テーマ中8テーマで候補外”. Market position becomes supporting context, not the headline promise.

### P0 — Too many metrics before the user understands the loss

v2 exposes market rank, Recommendation Coverage, top competitor, lost topics, First Choice, Mention Coverage, Citation Coverage, Repeat Agreement and completeness near the top.

**v3 decision:** first screen answers only three questions:

1. how many buyer themes were lost;
2. who most often replaced the company;
3. what evidence gap appears across those losses.

Technical metrics move into an auditable measurement detail disclosure.

### P0 — Paid-plan promise and runtime do not match

Pricing says 50 Core + 20 Discovery prompts. v2 paid cron only runs 50 Core prompts. v2 trial also keeps the original free panel rather than creating the intended stable Watch panel. Trial watches do not expire after 14 days.

**v3 decision:** implement trial expiry, a 30-prompt trial Core panel, a 50-prompt paid Core panel, and a separate 20-prompt paid Discovery result. Discovery never contributes to trend metrics.

### P0 — Action is still recommendation-shaped

A list saying “add implementation evidence” is useful, but competitors also provide recommendations.

**v3 decision:** create a Change Pack object tied to an Action and tracked prompts. It records required facts, target page, proposed structure/copy placeholders, validation checklist, and the prompts to re-observe. Unsupported company claims remain placeholders until asserted or verified.

### P1 — Prompt relevance is opaque

A generated Buyer Prompt can look arbitrary. Competitors increasingly explain prompt demand or persona.

**v3 decision:** every prompt gets `whyTracked`, derived from market, segment, use case or comparison context. The largest lost prompt shows this rationale.

### P1 — Weekly cadence can look weaker than daily competitors

Daily tracking is easy to market, but AI outputs are noisy. AIX paid Core intentionally uses three repetitions and a fixed panel.

**v3 decision:** sell the design, not apologize for it: “fixed Core × 3 repetitions × weekly” is the trend product. Rotating Discovery is shown separately as exploration, never mixed into the trend line.

### P1 — Evidence is jargon

“Evidence” is useful internally but not always instantly understood in Japanese.

**v3 decision:** first occurrence is “比較材料（Evidence）”. Later UI may shorten it to Evidence.

### P1 — Home page does not make differentiation explicit enough

v2 explains what the product outputs but not why it is structurally different from prompt trackers.

**v3 decision:** add a “Why AIX is different” comparison strip:

- no prompt setup required;
- loss is a buyer-question outcome, not a visibility score;
- every conclusion opens to raw answer and citation;
- missing proof becomes a Change Pack and re-observation target.

## UX hierarchy for v3

### Home

1. buyer event and loss;
2. URL scan CTA;
3. tangible fictional output preview;
4. differentiation versus monitoring tools;
5. closed loop;
6. Watch / pricing;
7. repeated scan CTA.

### Free Result

1. lost-theme verdict;
2. biggest buyer loss;
3. why the competitor wins / missing proof;
4. first action;
5. competitive context;
6. measurement detail and raw observations;
7. Watch CTA.

### Watch

1. weekly executive brief;
2. Core trend;
3. changed buyer outcomes;
4. rotating Discovery findings (paid only);
5. Evidence tasks;
6. Change Pack;
7. billing.

## CTA rules

- Home primary: `候補外になる購買質問を無料で調べる`
  - reason: communicates output, not generic “start”.
- Home secondary: `架空企業の結果を見る`
  - reason: lets a cautious visitor inspect value before submitting a domain.
- Result primary: `この市場を14日間追跡する`
  - reason: converts a snapshot into a baseline relationship.
- Watch task CTA: `比較材料を確認する`
  - reason: concrete gap resolution beats profile completion.
- Change Pack CTA: `この変更案を作る`
  - reason: action is explicit and reversible; no automatic production write.
- Paid CTA: `固定Core観測を継続する`
  - reason: accurately describes the purchased recurring job.

## Success criteria

A v3 screen is rejected if it cannot answer these in under 10 seconds:

1. What buyer decision is AIX observing?
2. Where is the company losing?
3. What concrete proof is missing?
4. What is the next action?
5. What changes if I pay?

No overall AIX score is introduced. No universal ChatGPT rank is claimed. No before/after change is labelled causal without stronger evidence.