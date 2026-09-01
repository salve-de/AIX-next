# AIX Next Roadmap and Release Gates

## Phase 0 — Clean-room product foundation

Implemented in the first branch:

- fresh visual identity and information architecture
- free URL scan flow
- fictional demo
- visual scan progress
- one-page report
- Watch experience
- official provider adapters
- local and Supabase-ready persistence
- Stripe checkout/webhook foundation
- measurement and strategy documentation
- CI

## Phase 1 — Live beta readiness

Required before inviting paying companies:

- configure production OpenAI, Gemini and Perplexity keys
- apply Supabase migration
- configure Stripe recurring price and webhook
- configure production domain and legal seller information
- execute 100-company blind evaluation
- verify provider response parsers against current APIs
- set a real AIXSignalBot contact URL
- add transactional Watch email
- add admin failure and cost console

Gate:

- entity precision ≥ 95%
- competitor relevance ≥ 85%
- Buyer Prompt relevance ≥ 85%
- recommendation extraction precision ≥ 98%
- scan failure < 5%
- free scan p95 variable cost ≤ ¥400

## Phase 2 — Founder Watch

- invite 20–50 qualified Japanese B2B companies
- capture Evidence task completion
- run weekly Core panels
- build monthly executive report
- measure self-serve support burden

Gate:

- Result → Watch ≥ 15%
- Watch → paid ≥ 8%
- Evidence completion ≥ 30%
- 90-day paid retention ≥ 70%
- variable gross margin ≥ 70%

## Phase 3 — Exact Change Briefs

- turn Actions into target page, required facts, heading, copy, FAQ and schema suggestions
- record company approval and publication date
- attach remeasurement prompts

Gate:

- ≥ 40% of high-priority Actions are implemented by customers

If Action adoption is lower, do not build automation. Improve the decision and evidence workflow first.

## Phase 4 — Approval-gated execution

- GitHub App with selected repository permissions
- branch and Pull Request only
- WordPress Application Password integration
- Draft only
- change log and rollback instructions

No direct main merge or automatic WordPress publication at launch.

## Phase 5 — First-party demand language

- Google Search Console
- site search
- CRM loss reasons
- sales-call notes
- customer-support questions

Purpose: reduce dependence on AI-generated Buyer Prompts and incorporate real buyer language.

## Phase 6 — Public authority layer

Only after AIX has proprietary measurement data and an operational correction process:

- claimed company profiles
- category benchmarks using a shared panel
- public methodology and update date
- correction/removal workflow
- noindex quality gate for thin profiles

Paid status must never alter an independent measurement rank.

## Phase 7 — Action-to-Outcome intelligence

- intervention log
- comparable prompt clusters
- holdout prompts where possible
- confidence intervals
- company and category benchmarks

Only here may AIX begin estimating which Actions are associated with repeatable observed improvement.

## No-go conditions

Narrow or stop the product if, after qualified traffic and adequate sample size:

- market discovery remains below 90% precision
- generated Buyer Prompts are not recognized as relevant by buyers
- Result → Watch remains below 10%
- Watch → paid remains below 5% after 200 qualified trials
- Evidence task completion remains below 15%
- paid users treat the product as a one-time report
- variable cost destroys the planned gross margin
