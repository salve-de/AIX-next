# AIX Next — B2B product redesign handoff (2026-09-02)

This document supersedes the earlier visual handoffs for the current implementation on `codex/aix-next-v2`.

## Product definition

AIX is not sold as an AI rank tracker or a generic AI SEO dashboard.

The user-facing promise is:

> ChatGPTで、競合に負けている質問がわかる。
>
> 会社URLを入れるだけ。自社が候補から外れる比較質問、代わりに選ばれる競合、その理由、まず直すべき1件まで診断する。

The product loop is:

```text
Find excluded comparison questions
→ Explain the competitor and observable information gap
→ Choose the first change
→ Create a human-reviewable draft where paid
→ Rerun comparable questions
→ Show what changed and choose the next action
```

Never convert comparison-question counts into customers, leads, lost revenue or guaranteed opportunity.

## Page-role decision

Home and Scan are separated by role, but Home contains the URL input.

### Home `/`

Job: explain what AIX is, what changes for the user, why it matters, and make trying it frictionless.

Current sequence:

1. first-view value proposition + URL input + real-looking fictional report preview;
2. three customer outcomes: where losing / why / first action;
3. why AI comparison before a site visit matters;
4. 14-day free remeasurement explanation;
5. final URL CTA.

Do not re-add a duplicate feature-card or duplicate report-preview section.

### Scan `/scan`

Job: execute the diagnosis only.

Current UI is four plain progress steps. Do not reintroduce radar/HUD visuals or implementation jargon.

Rate-limit and failure cases have dedicated states with Retry / Sample result / Back to URL input. Zero-observation runs must not masquerade as a normal ranking report.

### Result `/result`

Job: make a decision, not browse a dashboard.

Current order:

1. summary and first action in the same first viewport;
2. important excluded comparison questions;
3. named competitors;
4. observable information gaps;
5. first action;
6. 14-day free comparable remeasurement;
7. raw AI answers and measurement conditions only when expanded.

Result includes browser print/PDF support and a mobile bottom CTA.

### Monitoring `/watch`

User-facing name: 継続モニタリング / AIX Monitor. Internal route and type names may still contain `watch`.

Current order:

1. what changed since baseline;
2. newly shortlisted / newly excluded questions;
3. important remaining losses and next action;
4. editable Change Pack;
5. company-only evidence inputs;
6. long-term chart;
7. AIX Monitor commercial continuation.

Do not move the chart above the decisions again.

### Pricing `/pricing`

Free: find where the company is losing.

14-day free monitoring: verify what changed after a change.

AIX Monitor: weekly “what changed → what to fix next” with Change Pack.

Prompt/repetition counts are technical specifications behind details, not the primary purchase reason. `Founder Watch` is retired user-facing terminology.

### Setup `/setup`

Development-only. It returns not-found in production. Never publish provider/Stripe/readiness state to customers.

### Billing `/billing`

Opened from a monitoring URL with the target token already in the URL. Normal users are not asked to type a token. Stripe Customer Portal manages payment method, invoices, renewal and cancellation.

### Data rights `/data-rights`

Opened from monitoring context with a token. Token input is fallback only. Page is private/noindex.

### Privacy / Terms / Support / Commerce

Use compact document layouts. These are documents, not marketing pages. Do not add giant dark heroes, AI-style slogans or internal environment-variable instructions.

Unset seller fields must not be shown as `SELLER_*` or “未設定” to customers.

## Visual direction

Ordinary trusted B2B SaaS/report product first.

- white / light gray is the primary product surface;
- dark is limited mainly to footer and major conversion bands;
- green is an accent, not a glowing AI effect;
- 8–12px radii;
- restrained shadows;
- tables and rows for analytical data instead of card walls;
- document pages use compact headings and readable text columns;
- desktop and mobile keep the same information priority.

Avoid:

- dark neon AI HUDs;
- giant headings on every page;
- English uppercase labels as the main meaning carrier;
- Buyer Prompt / Evidence / Raw Observation as primary user vocabulary;
- repeated sections that explain the same result;
- feature counts as the primary pricing value.

Preferred user vocabulary:

- Buyer Prompt → 比較質問
- Evidence Gap → 比較材料の差 / 確認できない情報
- Citation → 引用元
- First Action → まず直すこと / 最優先の改善
- Watch → 継続モニタリング (route may remain `/watch`)
- Founder Watch → AIX Monitor

## Trust boundaries

- samples must be explicitly fictional;
- provider failures are missing observations, not losses;
- a result with zero successful observations uses a partial/failure state;
- rank is panel-relative, not universal;
- no customer/revenue inference from prompt counts;
- Change Pack is a draft for human review and is never automatically published;
- company evidence may be sent to OpenAI for Change Pack generation only as disclosed in Privacy;
- Setup, Scan, Result, Monitoring, Billing and Data Rights are not public search surfaces.

## GitHub / validation policy

GitHub Actions workflows were removed from `codex/aix-next-v2` and should not be reintroduced unless explicitly requested.

Validation must be run explicitly in the development environment:

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

Then visually review at minimum:

```text
/
/scan?url=example.com
/result?sample=1
/watch?sample=1
/pricing
/methodology
/privacy
/terms
/support
/commerce
/data-rights
/billing
```

at desktop and mobile widths.

## Current verification caveat

The redesign was written to GitHub through the connected GitHub API. In the ChatGPT execution container, outbound DNS/network access to `github.com` is unavailable, so a clean local clone and actual `npm run check` could not be executed there. Do not mark the redesign release-ready until the commands above pass in the real local worktree and the new screenshots are reviewed.
