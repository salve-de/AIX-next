# AIX Next

> **Product source of truth**
>
> 1. [`docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`](docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md)
> 2. [`docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`](docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md)
>
> Do not implement conflicting behavior from older handoffs.

AIX Next is a Japanese B2B service for continuously finding the comparison questions where AI recommends competitors instead of a company, turning the observed difference into an executable AI SEO task, handing that task to the right person, and checking comparable questions again after the team implements it.

The current product model is:

```text
monitor AI comparison
→ diagnose competitor / information difference
→ prioritize one Action
→ prepare an Action Pack
→ recommend owner
→ share / hand off
→ customer implements through its normal workflow
→ mark complete
→ remeasure comparable questions
→ choose next Action
```

## Non-negotiable boundary

**AIX does not connect to or edit customer production websites.**

It must not require:

- CMS admin access;
- production GitHub write access;
- deployment access;
- automatic merges;
- automatic publishing.

AIX owns research, monitoring, prioritization, briefing, draft preparation, handoff, task state and remeasurement. The customer/team owns factual approval and production publication.

## Intended first impression

0.1 second:

> **AI SEO / ChatGPT競合改善のサービス。**

1 second:

> **ここに払えば、AI検索で競合に負けている場所を継続監視して、毎週次に何を直すか出してくれる。**

3–5 seconds:

```text
競合に負けている比較質問を発見
→ 理由を特定
→ 今週の改善Actionを作る
→ 担当者へ共有
→ 実施後に再測定
```

The user must not infer guaranteed traffic/ranking or automatic site editing.

## Why this is not just a ChatGPT prompt

A general AI can perform useful one-off analysis.

AIX only becomes defensible by persisting and operating:

```text
Company
× fixed comparison questions
× AI surfaces
× competitors
× citations
× evidence gaps
× Action
× owner
× task status
× completion
× weekly history
× comparable remeasurement
```

The product moat is continuity and operating state, not raw LLM generation.

## UX architecture

```text
Home / LP
  explain AI SEO value + recurring paid value + URL input
  ↓
Scan
  execute diagnosis only
  ↓
Result
  what is happening + first Action + comparison details
  ↓
14-day free monitoring
  check comparable movement after first improvement
  ↓
AIX Monitor
  weekly change → next Action → Action Pack → handoff → completion → remeasurement
```

## Current implemented surfaces

### Home and Scan

- Home URL input;
- fictional result preview;
- simplified scan progress;
- dedicated failure/rate-limit states;
- no radar/HUD requirement.

### Result

- one-page decision-first result;
- summary and first Action in the first viewport;
- important excluded comparison questions;
- named competitor comparison;
- observable information gaps;
- free monitoring CTA;
- collapsed raw AI answers/details;
- print/PDF support;
- mobile CTA;
- explicit partial-result state when no successful observations exist.

### Monitoring / AIX Monitor

- baseline and comparable history;
- newly shortlisted/excluded questions;
- important remaining losses;
- Action before chart;
- private company evidence input;
- generated draft/Change Pack using public or company-asserted facts;
- stale-pack invalidation;
- no direct publishing.

### Commercial / trust surfaces

- value-led pricing;
- compact document layouts for Privacy / Terms / Support / Commerce;
- production `/setup` hidden/not-found;
- billing/data pages private/noindex;
- GitHub Actions intentionally removed.

## Next implementation priority

The next product milestone is **not more charts** and **not website integration**.

Implement the workflow layer in [`docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`](docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md):

1. persistent Action Work Item;
2. owner/department recommendation;
3. missing-fact request UX;
4. user-facing Action Pack;
5. shareable Action page;
6. copy / PDF / share controls;
7. mark Action complete;
8. bind completion to comparable remeasurement;
9. compressed weekly notification;
10. Home/Pricing copy that makes this recurring paid value obvious.

## Measurement boundary

Free Scan example:

```text
12 comparison questions
× OpenAI / Gemini / Perplexity
× 1 repetition
= up to 36 observations
```

AIX Monitor core measurement may use a larger fixed panel and repeated observations, but prompt/provider volume is a technical specification rather than the paid value proposition.

Failed or unconfigured provider calls reduce measurement completeness. They are not negative recommendations.

## Run locally

Active implementation branch:

```text
codex/aix-next-v2
```

```bash
git clone https://github.com/salve-de/AIX-next.git
cd AIX-next
git checkout codex/aix-next-v2
npm ci
cp .env.example .env.local
npm run dev -- -p 3001
```

Sample surfaces:

```text
http://localhost:3001/result?sample=1
http://localhost:3001/watch?sample=1
```

Do not claim live provider results until a real URL scan has actually completed with the intended provider configuration.

## Environment / database

Use `.env.example` as the variable inventory. Never commit secrets.

Apply `supabase/migrations/` in numeric order. Future workflow-state migrations must preserve historical Action/completion/measurement relationships.

Without durable storage, local in-memory mode is development-only.

## Validation

GitHub Actions are intentionally not used on this branch. Run explicitly:

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

or:

```bash
npm run check
```

Do not call a change release-ready until these commands pass and desktop/mobile flows are visually reviewed.

## Product documents

### Authoritative

- [`docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`](docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md)
- [`docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`](docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md)

### Supporting

- [`docs/PRODUCT_STRATEGY.md`](docs/PRODUCT_STRATEGY.md)
- [`docs/UX_RATIONALE.md`](docs/UX_RATIONALE.md)
- [`docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md`](docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md)
- [`docs/B2B_AI_BUYER_BEHAVIOR_2026.md`](docs/B2B_AI_BUYER_BEHAVIOR_2026.md)
- [`docs/MEASUREMENT.md`](docs/MEASUREMENT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CHAT_HANDOFF_2026-09-02.md`](docs/CHAT_HANDOFF_2026-09-02.md)

## Truth / safety boundaries

- public `http` / `https` target URLs only;
- internal/metadata targets rejected;
- `robots.txt` respected;
- missing credentials never fabricate live observations;
- company-entered evidence is private by default;
- relevant evidence may be processed by configured AI providers only as disclosed;
- comparison questions are not customers/leads/revenue;
- no universal rank, recommendation, citation, traffic, inquiry or revenue guarantee;
- no causal claim from simple before/after movement;
- no invented customer results, implementation times, certifications, pricing or ROI;
- **no customer production-site editing or automatic publishing.**
