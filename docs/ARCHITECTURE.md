# AIX Next — Architecture

## Goals

- one URL creates a useful result without onboarding;
- long-running crawl and AI calls can fail independently;
- raw evidence remains auditable;
- private result links are not indexed;
- missing provider credentials never create fabricated observations;
- the UI runs locally in Codex with `npm install && npm run dev`;
- the durable backend can be moved independently from the presentation layer.

## Runtime

The clean-room implementation uses Next.js App Router with server-side route handlers. For local development it has an in-memory store. For multi-instance production it uses Supabase Postgres through server-side REST calls.

```text
Browser
  ↓
Next.js public UI
  ↓
Scan route / Watch routes
  ↓
Safe crawler → company discovery → prompt generation
  ↓
OpenAI / Gemini / Perplexity adapters
  ↓
normalization + metric engine + evidence analysis
  ↓
Supabase JSON records (or memory in local development)
```

## Separation of concerns

- `lib/url-security.ts`: URL normalization, DNS and SSRF checks.
- `lib/robots.ts`: path-level robots policy.
- `lib/crawler.ts`: page discovery and bounded extraction.
- `lib/discovery.ts`: company, market, competitor, prompt and evidence analysis.
- `lib/providers/*`: provider-specific API contracts.
- `lib/measurement.ts`: deterministic metrics and lost-prompt derivation.
- `lib/storage.ts`: persistence boundary.
- `lib/scan-runner.ts`: state machine and orchestration.
- `components/*`: presentation only.

## Scan state machine

```text
created
→ validating
→ crawling
→ discovering
→ prompting
→ measuring
→ analyzing
→ complete | partial | failed
```

A partial scan is a valid product state. Provider failures are shown, excluded from the recommendation denominator and included in Measurement Completeness.

## Security

### URL scanner

- `http` and `https` only;
- reject credentials and non-standard ports;
- reject localhost, private, link-local, documentation and metadata ranges;
- resolve DNS before each request;
- revalidate every redirect;
- cap redirects, response size, page count and timeout;
- respect path-level `robots.txt` rules;
- never bypass login or paywalls.

### Result privacy

- result and Watch routes receive `noindex`, `noarchive`, `no-referrer`, `no-store` headers;
- anonymous result identifiers are random and unlisted;
- company-provided evidence is private by default;
- service credentials stay in server-only environment variables.

### External writes

MVP does not write to a customer site. A later execution layer must require:

1. verified domain ownership;
2. an approved change pack;
3. least-privilege connector scopes;
4. preview and audit log;
5. rollback path.

GitHub execution creates a branch and pull request, never a direct main write. WordPress execution creates a Draft, never an automatic Publish.

## Data model

The MVP persists a scan as a complete auditable JSON snapshot and a Watch as a versioned history of snapshots. This minimizes early schema migration cost while retaining raw evidence. Normalized relational tables can be added when query volume justifies them.

Core records:

- scan;
- company discovery;
- prompt panel;
- observations;
- citations;
- evidence gaps;
- actions;
- Watch history;
- evidence answers;
- subscription state.

## Production dependencies

- OpenAI API for company discovery and one AI search surface;
- Gemini API for grounded search;
- Perplexity API for Sonar;
- Supabase for durable storage;
- Stripe for paid Watch;
- a scheduler that calls the protected Watch cron route.

All features fail closed when their credential is absent. Sample pages remain available without credentials.
