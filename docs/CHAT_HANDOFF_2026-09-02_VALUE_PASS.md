# Rovan — Value Proposition / Product Loop Handoff (2026-09-02)

> **資料の位置づけ:** これは過去の引き継ぎ資料です。現行の名称、料金、North Star、公開範囲は [`AGENTS.md`](../AGENTS.md)、[`docs/CORE_PRODUCT_STRATEGY.md`](CORE_PRODUCT_STRATEGY.md)、[`docs/CONTINUOUS_VALUE_RETENTION.md`](CONTINUOUS_VALUE_RETENTION.md) を優先します。以下の価格・ブランチ・実装状態は現在の事実を示しません。

## This file supersedes the earlier 2026-09-02 handoff for product positioning and current implementation state

Repository:

```text
salve-de/AIX-next
```

Active branch:

```text
codex/aix-next-v2
```

Implementation head immediately before this handoff file was created:

```text
2acb8a9b4d421732826141d652e2808ec0986186
```

Do **not** return to the old `eb75456` handoff state. The branch has moved substantially since then.

Do **not** switch to `main` for current product work. The active implementation remains `codex/aix-next-v2`.

---

## 1. Product positioning is now different from the old "AI rank tracker" framing

The most important product decision from the value-proposition research is:

> Rovan is not primarily a dashboard for measuring AI rank.

The external job is:

> **ChatGPTで、競合に負けている質問がわかる。**
> **自社が候補に入るために、何を直すかまで出す。**

The complete product loop is:

```text
FIND
which buying questions exclude the company
→ EXPLAIN
which competitor is selected and what evidence differs
→ ACT
turn the highest-priority gap into a human-reviewable Change Pack
→ PROVE
rerun the comparable panel and see what moved
```

The commercial objective is not an abstract AI score. It is to increase the opportunity for the company to enter the buyer's consideration set before sales contact.

Strict boundary:

- a lost Buyer Prompt is **not** a lost customer;
- prompt counts must never be converted into leads or revenue without first-party attribution evidence;
- before/after movement does not prove causality;
- Rovan does not guarantee rank, recommendation, Citation, inquiry, contract or revenue.

---

## 2. Why this value proposition was chosen

### 2026 B2B buyer behavior

Current external research supports the premise that AI is increasingly used before a vendor site visit or sales conversation, while human validation remains important.

Key research is captured in:

```text
docs/B2B_AI_BUYER_BEHAVIOR_2026.md
```

It includes:

- G2 2026 Answer Economy research: 51% of surveyed B2B software buyers said they start research with an AI chatbot more often than Google; 71% use AI chatbots somewhere in research; GenAI chatbots were the leading reported shortlist influence in that study.
- Gartner May 2026: 45% of surveyed B2B buyers used GenAI, primarily for vendor/product information; 69% preferred validating AI-generated insights with sales reps.
- McKinsey 2026 Global B2B Pulse: buyers use many channels across the journey, so Rovan must improve real, consistent evidence rather than optimize for AI in isolation.

These percentages are market evidence, not customer-specific ROI assumptions.

### Competitive category research

Research is captured in:

```text
docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md
```

Relevant products/adjacent categories include:

- Ahrefs Brand Radar;
- Semrush AI Visibility Toolkit;
- Scrunch;
- Profound;
- Klue;
- Crayon.

The category already proves there is willingness to pay for AI visibility / prompt tracking / competitive monitoring. Rovan should not try to win on prompt volume alone. The stronger differentiation is:

```text
lost buying question
→ evidence difference
→ executable change
→ comparable remeasurement
```

---

## 3. 0.1-second / 1–3-second / 5–10-second UX rule

Do not interpret the 0.1-second requirement as "a user can semantically understand a new category in 100 ms." Research on visual first impressions supports very fast visual gist, not full comprehension.

The UX hierarchy is now:

### ~0.1 second

The first view must visually read as:

```text
ChatGPT
+ company vs competitor
+ concrete result
+ URL input
```

### 1–3 seconds

The user should understand:

> This finds the questions where my company loses to competitors in AI comparison.

### 5–10 seconds

The user should understand:

> It tells me why, what to change first, and whether the same comparison improved afterward.

### 30–60 seconds

Trust layer:

- prompt panel;
- providers;
- denominators;
- date/time;
- raw answers;
- citations;
- missing observations;
- methodology boundaries.

The full rule is documented in:

```text
docs/UX_RATIONALE.md
```

---

## 4. Homepage current structure

`app/page.tsx`

The first viewport now contains:

- service label: `ChatGPT競合診断 · 会社URLだけ`;
- headline: `ChatGPTで、競合に負けている質問がわかる。`;
- value promise: `自社が候補に入るために、何を直すかまで出します。`;
- concrete explanation using "おすすめの○○会社は？" / "A社とB社ならどっち？";
- URL input;
- micro-loop: `自社が外れる質問を発見 → 直す場所を1つに絞る → 同じ質問で再測定`;
- right-side fictional result showing rank, excluded prompts, top competitor, actual buying question and first Action.

Immediately after the hero:

1. `WHAT CHANGES` — FIND / EXPLAIN / ACT / PROVE;
2. `WHY IT MATTERS` — buyer asks AI → shortlist → site/evaluation/contact;
3. actual output preview;
4. free Watch / improvement verification.

Old generic "four free features" repetition was removed.

Relevant styles:

```text
app/instant-clarity.css
app/value-proposition.css
```

---

## 5. Result page current decision flow

`components/result-client.tsx`

The result now follows:

```text
Verdict
→ action bridge
→ excluded buying questions
→ competitor evidence
→ information gap
→ first Action
→ free comparable Watch
→ raw observations
```

The action bridge explicitly shows:

```text
X prompts excluded
→ biggest evidence gap
→ first Action
→ comparable remeasurement
```

The page states that excluded prompt counts are not customer counts.

The free Watch CTA is framed as:

> `この改善が効いたか、14日間無料で確かめる。`

---

## 6. Watch is now improvement verification, not monitoring activity

`components/watch-client.tsx`

The first question is:

> `前回の改善は効いたか。`

The page shows:

- baseline → current rank;
- shortlisted prompt movement;
- excluded prompt movement;
- newly won/lost buying questions;
- Citation changes;
- next Evidence gap;
- next Actions;
- Change Pack;
- paid weekly continuation.

The comparable-measurement note explicitly says movement alone does not prove causality.

---

## 7. Change Pack is now a real connected product capability

This is one of the most important changes in this pass.

A Change Pack converts analysis into a human-reviewable draft containing:

- target/action;
- proposed title;
- lead;
- body sections;
- FAQ;
- facts used;
- related Buyer Prompts;
- publish checks.

### Type model

`lib/types.ts`

Added:

- `ChangePackFact`;
- `ChangePackItem`;
- `ChangePack`;
- `WatchRecord.changePack`.

### Persistence

`lib/storage.ts`

Watch reads/writes `change_pack`.

Migration:

```text
supabase/migrations/009_watch_change_pack.sql
```

All migrations through 009 are now required.

### Automatic generation

`lib/watch-measurement.ts`

Paid Watch attempts Change Pack generation after a completed measurement and public-site crawl.

Generation failure does not invalidate the completed measurement.

### On-demand generation

`app/api/change-pack/route.ts`

Paid active Watch can generate the latest Change Pack on demand.

The API returns an existing pack only when it belongs to the latest measurement and no newer company Evidence exists.

### Evidence invalidation

`app/api/evidence/route.ts`

When company Evidence changes, the existing Change Pack is invalidated so an old draft is not shown as current.

### Public sample

`/watch?sample=1` includes a clearly fictional Change Pack so a prospective buyer can understand the paid output before purchasing.

---

## 8. Change Pack safety / truth controls

`lib/change-pack.ts`

Current protections include:

- crawled page content and all externally supplied strings are explicitly treated as untrusted data; instructions embedded in them must not be followed;
- only public page facts or company-asserted Evidence may be used as facts;
- company-asserted `factsUsed` are retained only when label/value exactly match submitted Evidence;
- public `factsUsed` are retained only when `sourceUrl` is one of the actual crawled page URLs;
- invalid `factsUsed` are dropped;
- every pack gets a mandatory publish check to compare facts/numbers with the original source;
- Rovan does not automatically publish Change Pack content.

Remaining limitation:

> Generated prose can still contain an unsupported inference even when `factsUsed` is constrained. Human review remains mandatory. A future stronger implementation can add a second claim-level verification pass that maps every factual sentence to an approved fact/source.

Do not claim the current generator is fully hallucination-proof.

---

## 9. Pricing value ladder

`app/pricing/page.tsx`

Do not sell provider/prompt quotas as the main value.

Current value ladder:

```text
FREE SCAN
find where we lose
→ 14-DAY WATCH
verify whether the first improvement moves
→ FOUNDER WATCH
repeat what moved → what to change next every week
```

Founder Watch remains:

```text
¥29,800 / month, before tax, one brand
```

The product page makes clear that this price is for the ongoing improvement loop, not just a dashboard.

Do not claim this price has been fully validated by customer WTP research. Category pricing supports plausibility, not optimality.

---

## 10. Privacy / Terms / commercial truth surfaces

Updated:

```text
app/privacy/page.tsx
app/terms/page.tsx
app/commerce/page.tsx
app/setup/page.tsx
components/site-footer.tsx
app/sitemap.ts
```

Important privacy disclosure:

- company Evidence is not generally published;
- paid Change Pack generation may send the necessary Evidence content to OpenAI for processing;
- users must not submit data they do not have the right to process externally.

The footer now links:

- sample result;
- Watch sample;
- pricing;
- methodology;
- privacy;
- terms;
- commercial disclosure;
- data rights;
- support.

---

## 11. Strategy/documentation sources updated

Use these as current product-thinking sources:

```text
docs/PRODUCT_STRATEGY.md
docs/UX_RATIONALE.md
docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md
docs/B2B_AI_BUYER_BEHAVIOR_2026.md
README.md
```

The earlier `docs/CHAT_HANDOFF_2026-09-02.md` is historical context and does not contain the latest value-proposition / Change Pack implementation.

---

## 12. Validation status — important

The changed files were statically reviewed through the GitHub connector and the cross-file wiring was inspected:

```text
types
→ storage
→ DB migration
→ paid measurement generation
→ on-demand API
→ Evidence invalidation
→ Watch UI
```

However, the current environment could not clone GitHub into the local verification container because DNS resolution for `github.com` failed.

Therefore, **do not claim** that this value pass has already passed:

```text
npm run lint
npm test
npm run typecheck
npm run build
```

These still need to be executed in the local `/Users/satoushinya/project/AIX-next` worktree or another environment with repository/network access.

Do not use GitHub Actions to substitute for this; the user explicitly does not want GitHub Actions used for this workflow.

---

## 13. Required next verification sequence

From the existing local worktree:

```bash
cd /Users/satoushinya/project/AIX-next
git fetch origin
git checkout codex/aix-next-v2
git pull --ff-only origin codex/aix-next-v2
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run dev -- -p 3001
```

Then inspect at minimum:

```text
http://localhost:3001/
http://localhost:3001/result?sample=1
http://localhost:3001/watch?sample=1
http://localhost:3001/pricing
http://localhost:3001/privacy
```

Desktop and mobile screenshots are required before declaring the UX finished.

For production-like verification, also apply migration 009 and test a real paid/active Watch Change Pack with intentionally non-sensitive company Evidence.

---

## 14. Remaining highest-priority product opportunities

### P0 — full local build and screenshot QA

Do this before more decorative redesign.

### P1 — first-party business impact layer

Optional future integrations:

- GA4 AI-referral sessions;
- AI-referral demo/contact conversions;
- CRM self-reported source such as ChatGPT/AI search;
- supporting branded/direct traffic context.

Keep these separate from Buyer Prompt counts.

### P1 — prompt business-intent weighting

Rovan already has prompt importance and clusters. High-intent comparison/vendor-selection questions should eventually matter more than generic mentions. Do not simply maximize raw prompt count.

### P1 — claim-level Change Pack verifier

Before any future direct publishing integration, add a verifier that maps every factual claim in generated prose to an allowed public or company-confirmed fact.

### P2 — action/outcome learning moat

Long-term dataset:

```text
Evidence gap
× Action type
× target page
× market/company type
× before/after comparable shortlist outcome
× confidence
× optional first-party business outcome
```

This can improve Action ranking over time without pretending that simple before/after movement proves causality.
