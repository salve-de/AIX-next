# AIX Next

AIX Next is a Japanese B2B service for finding the comparison questions where AI recommends competitors instead of a company, turning the observed information gap into a concrete website change, and checking the same questions again after the change.

The user-facing promise is intentionally simple:

> ChatGPTで、競合に負けている質問がわかる。
>
> 会社URLを入れるだけ。候補外になる比較質問、代わりに選ばれる競合、その理由、まず直すべき1件まで診断する。

The commercial loop is:

```text
FIND where the company is excluded
→ EXPLAIN who is selected and what public comparison material differs
→ ACT on the highest-priority change
→ PROVE what moved under comparable remeasurement
```

AIX never converts comparison-question counts into customer or revenue counts and does not claim a universal ChatGPT rank.

## UX architecture

Page roles are separated even though the Home page contains the scan input:

```text
Home / LP
  explain what AIX is, what changes, why it matters, and show a real-looking sample
  ↓ URL submit
Scan
  execute the diagnosis; no marketing pitch
  ↓
Result
  current situation → important excluded questions → competitors → information gaps → first action
  ↓
14-day free monitoring
  rerun comparable questions and show what changed
  ↓
AIX Monitor
  weekly remeasurement → next action → editable Change Pack
```

The interface is light-first and report-oriented. Dark surfaces are limited mainly to the footer and major conversion bands. Internal implementation terms are kept out of the primary UI.

## What is implemented

### Home and scan

- first-view explanation of the service and its value;
- company URL input directly on Home;
- report-like fictional result preview in the first viewport;
- concise three-step value explanation;
- explanation of why AI comparison matters before a site visit;
- simplified four-step scan progress;
- dedicated rate-limit and scan-failure states;
- no radar/HUD-style AI animation.

### Result report

- one-page, decision-first report;
- top viewport contains both the current situation and the first action;
- important excluded comparison questions first, with the remainder collapsed;
- named competitor comparison;
- observable information gaps without claiming nonexistent facts;
- first action before detailed raw observations;
- 14-day free monitoring CTA;
- raw AI answers and measurement conditions collapsed under details;
- browser print/PDF layout;
- mobile sticky CTA after the report is opened;
- zero-successful-observation runs use a dedicated partial-result state rather than a fake ranking report.

### AIX Monitor

- baseline and comparable weekly history;
- newly shortlisted and newly excluded questions;
- remaining important losses before the chart;
- next action before long-term trend visualization;
- private company evidence inputs;
- Change Pack generation using only public or company-asserted facts;
- Change Pack title, lead, sections, FAQ and publish checks;
- stale Change Pack invalidation after company evidence changes;
- on-demand and post-measurement paid Change Pack generation when provider configuration is available;
- no direct publishing to the customer site.

### Commercial, account and trust surfaces

- value-led pricing: Free Scan / 14-day free monitoring / AIX Monitor;
- prompt counts and repetitions moved into expandable measurement specifications;
- Billing opened from the monitoring context instead of asking normal users for a token;
- Data Rights opened from the monitoring context, with token entry only as fallback;
- Privacy / Terms / Support / Commerce use a compact document layout rather than marketing heroes;
- unset seller fields are not presented as public product copy;
- `/setup` returns not-found in production and is development-only;
- private scan/result/monitoring/billing/data pages are noindex/noarchive and excluded from the sitemap/robots public surface.

### Measurement and infrastructure

- URL normalization and SSRF guards;
- DNS and redirect revalidation;
- path-aware robots policy;
- bounded site crawl;
- company, brand, market, use-case and competitor discovery;
- comparison-question generation;
- OpenAI web-search adapter;
- Gemini Google Search grounding adapter;
- Perplexity Sonar adapter;
- raw answers and citations;
- deterministic shortlist extraction;
- evidence-gap and action analysis;
- partial-result handling;
- per-IP and per-domain free-scan limits;
- Supabase persistence with in-memory local fallback;
- protected scheduler route for due monitoring runs;
- Stripe subscription Checkout and signed lifecycle webhook;
- optional email notifications.

## Measurement boundary

Free Scan:

```text
12 comparison questions
× OpenAI / Gemini / Perplexity
× 1 repetition
= up to 36 observations
```

AIX Monitor core measurement:

```text
50 fixed comparison questions
× OpenAI / Gemini / Perplexity
× 3 repetitions
= up to 450 observations per full core run
```

Failed or unconfigured provider calls reduce measurement completeness. They are not counted as negative recommendations.

## Run the current implementation locally

The active implementation is on `codex/aix-next-v2`, not `main`.

```bash
git clone https://github.com/salve-de/AIX-next.git
cd AIX-next
git checkout codex/aix-next-v2
npm ci
cp .env.example .env.local
npm run dev -- -p 3001
```

Open:

```text
http://localhost:3001
http://localhost:3001/result?sample=1
http://localhost:3001/watch?sample=1
```

The fictional sample surfaces do not require provider credentials. A real URL scan requires the relevant provider configuration and must not be represented as verified until it actually completes.

## Environment and database

Use `.env.example` as the authoritative variable inventory and never commit secrets.

Apply every SQL file in `supabase/migrations/` in numeric order. The current sequence includes `001_core.sql` through `009_watch_change_pack.sql`.

Without Supabase, local development uses a single-process in-memory store and is not suitable for multi-instance production.

## Scheduler

A scheduler may call the protected due-monitoring route. The route itself selects only due records and resumes chunked paid measurements when required.

```http
GET /api/cron/watch
Authorization: Bearer $CRON_SECRET
```

GitHub Actions are intentionally not used on this branch. Validation is run explicitly in the development environment.

## Validation

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

Do not claim a change is release-ready until these checks have actually passed and the desktop/mobile flows have been visually reviewed.

## Product decisions and research

- [`docs/PRODUCT_STRATEGY.md`](docs/PRODUCT_STRATEGY.md)
- [`docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md`](docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md)
- [`docs/B2B_AI_BUYER_BEHAVIOR_2026.md`](docs/B2B_AI_BUYER_BEHAVIOR_2026.md)
- [`docs/UX_RATIONALE.md`](docs/UX_RATIONALE.md)
- [`docs/MEASUREMENT.md`](docs/MEASUREMENT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CHAT_HANDOFF_2026-09-02.md`](docs/CHAT_HANDOFF_2026-09-02.md)

## Truth and safety boundaries

- public `http` / `https` target URLs only;
- internal and metadata targets rejected;
- `robots.txt` respected;
- missing credentials never create fabricated live observations;
- company-entered evidence is private by default;
- Change Pack generation may send relevant entered evidence to OpenAI as disclosed in Privacy;
- comparison questions are not customers, leads or lost revenue;
- no universal rank, recommendation, citation, inquiry or revenue guarantee;
- no causal claim from a simple before/after movement;
- no invented customer results, implementation times, certifications or ROI;
- no automatic customer-site publishing without an explicit future approval and rollback design.
