# AIX Next — CURRENT HANDOFF REDIRECT

> **Do not resume from historical implementation handoffs or intermediate redesign documents.**

The current product and implementation source of truth is:

```text
docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md
docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md
```

Repository / branch:

```text
salve-de/AIX-next
codex/aix-next-v2
```

## Current product model

> **AI検索で競合に負けている場所を継続監視し、今週やるAI SEO Actionを実行可能な形まで作って担当者へ渡し、実施後に同じ条件で答え合わせする。**

## Critical boundary

AIX does **not** connect to or edit customer production websites.

The product owns:

```text
monitor
→ diagnose
→ prioritize
→ prepare Action Pack
→ recommend owner
→ share
→ track completion
→ remeasure
```

The customer/team owns production publication and factual/legal approval.

## Why this matters

AIX must not degrade into:

- a one-off AI SEO report;
- a generic ChatGPT wrapper;
- a rank-only dashboard;
- an auto-publishing CMS.

The paid value is recurring workflow and continuity:

```text
fixed questions
× AI surfaces
× competitors
× citations
× evidence gaps
× Action
× owner
× status
× completion
× before/after history
```

## User-facing paid product

Use:

- `AIX Monitor`
- `継続モニタリング`
- `今週のAction`
- `改善パック`

Retire:

- `Founder Watch`

## GitHub Actions

GitHub Actions are intentionally not used and must not be reintroduced unless explicitly requested.

## Validation before release

Run manually:

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

Then review desktop and mobile flows, including any new Action/share/status surfaces.
