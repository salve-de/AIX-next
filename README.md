# AIX Next

AIX Next is an AI buyer-consideration improvement product for Japanese B2B companies.

It starts with a company, service, product name, or URL and answers the commercial question that matters before a buyer contacts sales:

> When a buyer asks ChatGPT or another AI to compare vendors, which buying questions exclude this company, which competitor is selected instead, what observable evidence explains the difference, what should the company change first, and did the same decision surface improve after that change?

The product loop is:

```text
FIND where the company is excluded
→ EXPLAIN who wins and why
→ ACT with a human-reviewable Change Pack
→ PROVE what moved under comparable remeasurement
```

AIX does not treat Buyer Prompt counts as customers or revenue and does not claim a universal ChatGPT rank.

## Product flow

```text
Company / product name or URL
→ public-site candidate resolution when a name is entered
→ user confirms the public site to diagnose
→ bounded public-site crawl
→ company / brand / market / competitor discovery
→ Buyer Prompt panel
→ OpenAI / Gemini / Perplexity observations
→ shortlist outcomes and Citations
→ Evidence gaps and first Action
→ 14-day Watch
→ paid weekly remeasurement
→ Change Pack (title / lead / sections / FAQ / publish checks)
→ optional AI-readable public-information draft (`llms.txt` / JSON-LD)
→ next comparable measurement
```

## What is implemented

### Public product

- outcome-led landing page with a first-viewport fictional result;
- ungated scan from a company, service, product name, or URL;
- public-site candidate search for name input, with explicit candidate confirmation before crawling;
- streamed scan progress;
- fully fictional result and Watch samples;
- one-page result showing excluded Buyer Prompts, competitors, Citations, Evidence gaps and first Action;
- explicit bridge from diagnosis → Action → remeasurement;
- 14-day free Watch conversion;
- Watch focused on improvement verification rather than activity logging;
- Founder Watch pricing and paid continuation;
- responsive desktop and mobile UI;
- pricing, methodology, privacy, terms and data-rights surfaces.

### Scan engine

- URL normalization and SSRF guards;
- DNS and redirect revalidation;
- path-aware robots policy;
- sitemap and bounded crawl;
- company, brand, market, buyer, use-case and competitor discovery;
- Buyer Prompt generation;
- OpenAI web-search adapter;
- Gemini Google Search grounding adapter;
- Perplexity Sonar adapter;
- raw answers and Citations;
- deterministic shortlist extraction;
- Recommendation Coverage, First Choice Rate, Mention Coverage, Citation Coverage, Repeat Agreement and Measurement Completeness;
- Evidence and Action analysis;
- partial-result handling;
- per-IP and per-domain free-scan limits.
- per-IP name-resolution limits to protect paid search usage.

### Watch, execution and billing

- private Watch token;
- baseline and weekly history;
- private company Evidence answers;
- comparable Core remeasurement;
- movement tracking for newly shortlisted / newly excluded Buyer Prompts;
- Change Pack generator using only public or company-asserted facts;
- persisted Change Pack on Watch;
- on-demand paid Change Pack endpoint;
- automatic Change Pack generation after paid Watch measurement when provider configuration is available;
- AI-readable public-information draft generated from crawled pages, with `llms.txt` and JSON-LD downloads;
- optional AIX-hosted public company profile with preview, explicit publish/revoke, expiry, official-source links, HTML/JSON/Markdown output and a dedicated sitemap;
- market relation map, purchase-question demand proxy and page-level content-quality checks derived from the same public scan;
- AI visibility audit that checks crawler access, indexability, sitemap/canonical signals, page clarity, buyer facts, public proof and measurement completeness;
- stale Change Pack invalidation after Evidence updates;
- protected weekly scheduler route;
- Stripe Subscription Checkout;
- signed Stripe lifecycle webhook;
- Supabase persistence with local in-memory fallback.

Change Packs are drafts for human approval. AIX does not directly publish to the customer site.

## Measurement boundary

AIX reports an explicit observation panel. It does not claim an absolute position across every private AI conversation.

Free Scan:

```text
12 Buyer Prompts
× OpenAI / Gemini / Perplexity
× 1 repetition
= up to 36 observations
```

Founder Watch Core measurement:

```text
50 fixed Core Prompts
× OpenAI / Gemini / Perplexity
× 3 repetitions
= up to 450 observations per full Core run
```

Failed and unconfigured provider calls reduce Measurement Completeness. They are not counted as negative recommendations.

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

The fictional sample surfaces do not require provider credentials. A real URL scan requires the relevant provider configuration and must not be represented as verified until it has actually completed. Name input requires at least one configured public-search provider (OpenAI, Gemini, or Perplexity); the UI asks the user to confirm the returned public-site candidate before crawling.

## Environment

Use `.env.example` as the authoritative variable inventory. Do not commit secrets.

The product can use:

- OpenAI for discovery/search and Change Pack generation;
- Gemini and Perplexity for additional AI observation surfaces;
- Supabase for durable scan/Watch/rate-limit/run persistence;
- Stripe for Founder Watch billing;
- mail configuration for Watch notifications where configured;
- `CRON_SECRET` for the protected Watch scheduler.

## Database

Apply every migration in `supabase/migrations/` in numeric order. Do not stop at the original core migrations; later migrations add Watch idempotency, Stripe identifiers, claim leases, durable measurement runs, finalize semantics and persisted Change Packs.

Current sequence includes `001_core.sql` through `010_public_profiles.sql`.

Without Supabase, local development uses a single-process in-memory store. It is not suitable for multi-instance production.

## Scheduler

Call the protected Watch route according to the intended scheduler configuration. It selects only due Watch records and resumes chunked paid measurements when required.

```http
GET /api/cron/watch
Authorization: Bearer $CRON_SECRET
```

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

A passing check is required before claiming a code change is release-ready.

## Product decisions and research

- [`docs/PRODUCT_STRATEGY.md`](docs/PRODUCT_STRATEGY.md)
- [`docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md`](docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md)
- [`docs/UX_RATIONALE.md`](docs/UX_RATIONALE.md)
- [`docs/MEASUREMENT.md`](docs/MEASUREMENT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CHAT_HANDOFF_2026-09-02.md`](docs/CHAT_HANDOFF_2026-09-02.md)

## Safety and truth boundaries

- public `http` / `https` URLs only;
- internal and metadata targets rejected;
- `robots.txt` respected;
- private result and Watch routes are noindex/noarchive/no-referrer/no-store where applicable;
- missing credentials never produce fabricated live observations;
- company Evidence is private by default;
- Buyer Prompts are not customers or leads;
- no universal rank, recommendation, Citation, inquiry or revenue guarantee;
- no causal claim from a simple before/after movement;
- no invented customer results, implementation times, certifications or ROI;
- no direct customer-site write without explicit approval and rollback design;
- AI-readable drafts are human-reviewed aids; they do not guarantee AI recommendation, citation or search ranking.
