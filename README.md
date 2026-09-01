# AIX Next

AIX Next is a clean-room rebuild of an AI buyer-intelligence product for Japanese B2B companies.

It starts with one company URL and answers one commercial question:

> When a buyer asks an AI to compare vendors, where does this company enter—or fall out of—the shortlist, which competitor replaces it, and what verifiable evidence is missing?

This repository does not inherit the previous AIX interface or component system. Product strategy, copy, information architecture, visual language, measurement rules and implementation were rebuilt from first principles.

## Product flow

```text
Company URL
→ bounded public-site crawl
→ company / brand / market / competitor discovery
→ Buyer Prompt panel
→ OpenAI / Gemini / Perplexity observations
→ shortlist outcomes and Citations
→ Evidence gaps and first action
→ 14-day Watch
→ weekly paid monitoring
```

## What is implemented

### Public product

- new visual landing page;
- native buyer → AI → shortlist product diagram;
- ungated URL scan;
- truthful streamed scan progress;
- fully fictional sample result;
- one-page result with measurement conditions, competitive field, lost prompts, raw answers, Citations, Evidence gaps and first action;
- 14-day Watch conversion;
- Watch trend, movement, Evidence tasks and paid continuation;
- pricing, methodology, privacy and terms pages;
- responsive desktop and mobile UI.

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

### Watch and billing

- private Watch token;
- baseline and weekly history;
- private company Evidence answers;
- protected weekly scheduler route;
- Stripe Subscription Checkout;
- signed Stripe lifecycle webhook;
- Supabase persistence with local in-memory fallback.

## Measurement boundary

AIX Next reports an explicit observation panel. It does not claim an absolute position across every private ChatGPT conversation.

Free Scan:

```text
12 Buyer Prompts
× OpenAI / Gemini / Perplexity
× 1 repetition
= up to 36 observations
```

Founder Watch:

```text
50 fixed Core Prompts
× OpenAI / Gemini / Perplexity
× 3 repetitions
= 450 weekly observations
```

Failed and unconfigured provider calls reduce Measurement Completeness. They are not counted as negative recommendations.

## Run locally in Codex

```bash
git clone https://github.com/salve-de/AIX-next.git
cd AIX-next
git checkout main
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

The complete fictional product experience works without API credentials:

```text
http://localhost:3000/result?sample=1
http://localhost:3000/watch?sample=1
```

A real URL scan needs at least the discovery model and one search provider key. For the intended three-surface result, set all three.

## Environment

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

OPENAI_API_KEY=
OPENAI_DISCOVERY_MODEL=gpt-5-mini
OPENAI_SEARCH_MODEL=gpt-5-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
PERPLEXITY_API_KEY=
PERPLEXITY_MODEL=sonar

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

CRON_SECRET=
RATE_LIMIT_SALT=
FREE_SCANS_PER_HOUR=4
```

Do not commit secrets.

## Database

Apply:

```text
supabase/migrations/001_core.sql
supabase/migrations/002_rate_limits.sql
```

Without Supabase, local development uses a single-process in-memory store. It is not suitable for multi-instance production.

## Scheduler

Call the following route with an Authorization header at least daily. It selects only due Watch records.

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

## Product decisions

See:

- [`docs/PRODUCT_STRATEGY.md`](docs/PRODUCT_STRATEGY.md)
- [`docs/UX_RATIONALE.md`](docs/UX_RATIONALE.md)
- [`docs/MEASUREMENT.md`](docs/MEASUREMENT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Safety

- public `http` / `https` URLs only;
- internal and metadata targets rejected;
- `robots.txt` respected;
- private result and Watch routes are noindex/noarchive/no-referrer/no-store;
- missing credentials never produce fabricated live observations;
- company Evidence is private by default;
- no universal rank or causal uplift guarantee;
- no direct customer-site write in the clean-room MVP.
