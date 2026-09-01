# AIX Next Architecture

## 1. Goals

- run locally from GitHub with one command
- keep the frontend portable to ChatGPT Sites or another host
- keep long-running scans and secrets server-side
- support official AI search APIs first
- make raw observations auditable
- allow local development without an external database
- provide a production persistence path without changing domain logic

## 2. Runtime

```text
Browser
  → Next.js App Router
  → server Route Handlers
  → crawl / discovery / provider adapters
  → local atomic JSON store or Supabase REST
```

The initial implementation keeps the orchestration in Next.js Route Handlers so the whole product can be run on a PC. If a hosting environment cannot sustain long-running scans, `runScan` can be moved to a queue worker without changing the UI or domain types.

## 3. Frontend responsibilities

- acquisition page
- streaming progress
- report visualization
- Watch visualization
- Evidence entry
- pricing and legal surfaces

The frontend never receives provider keys, Supabase service keys or Stripe secrets.

## 4. Server responsibilities

- URL normalization and SSRF protection
- robots.txt and sitemap handling
- prioritized same-origin crawl
- company and market discovery
- Buyer Prompt generation
- provider calls
- candidate and Citation extraction
- metrics
- Evidence Gap and Action analysis
- persistence
- Watch scheduling
- Stripe Checkout and webhooks

## 5. Scan state machine

```text
queued
→ validating
→ crawling
→ discovering
→ prompting
→ measuring
→ analyzing
→ complete / partial / failed
```

Progress events are streamed as NDJSON. They are tied to real stages, not a fake countdown.

## 6. Persistence

### Local development

An atomic JSON file at `.data/aix-next.json` stores scans and Watches.

- suitable for one local Node process
- easy for Codex and the user to inspect
- no external credential required
- not suitable for multi-instance production

### Production

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured, the same store API writes to service-role-only tables.

The initial schema stores the complete record as JSONB. This intentionally optimizes for fast product iteration. Before high-volume analytics, observations should be normalized into dedicated tables.

## 7. Provider adapters

### OpenAI

- Responses API
- Web Search tool
- used for market discovery and one measurement surface
- raw output annotations converted to citations

### Gemini

- `generateContent`
- Google Search grounding
- grounding chunks converted to citations

### Perplexity

- Sonar Chat Completions
- citations array retained

Missing keys produce skipped observations. AIX does not fabricate provider results.

## 8. Security

### URL scanner

- only `http` and `https`
- credentials rejected
- non-standard ports rejected
- DNS checked before each fetch
- private, loopback, link-local and metadata IPs blocked
- redirects manually followed and rechecked
- timeout, response-size and redirect limits

### Private pages

- `noindex`, `noarchive`, `no-store`, `no-referrer`
- Watch requires a random token
- results use non-enumerable UUIDs

### Evidence

The current clean-room MVP accepts text and optional public source URL. File upload is deliberately deferred until a production private object-storage policy is connected.

### Billing

- Stripe-hosted Checkout
- signed webhook verification
- no card data stored by AIX

## 9. ChatGPT Sites

ChatGPT Sites can be used as the product’s frontend and publishing surface after compatibility validation. The code avoids Vercel-specific dependencies.

Long-running scans, weekly jobs, durable storage and provider credentials should remain behind an external server boundary while Sites is a changing beta surface.

## 10. Scaling path

1. local JSON store
2. Supabase JSONB persistence
3. normalized observation tables
4. queue-based scan worker
5. per-provider concurrency and budgets
6. organization membership and role-based access
7. Evidence file storage
8. approval-gated CMS/GitHub execution

## 11. Deliberate omissions from v1

- public Company Profile database
- automatic content publication
- direct GitHub main writes
- WordPress auto-publish
- consumer ChatGPT UI scraping
- daily tracking
- universal 0–100 score

These are omitted because they increase legal, trust and operational risk before the core buyer-market hypothesis is proven.
