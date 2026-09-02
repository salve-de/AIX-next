# AIX Next — B2B redesign handoff (SUPERSEDED)

> **Do not implement from this historical handoff.**
>
> The product model was refined after the screenshot review and subsequent discussion about:
>
> - the limits of AI SEO control;
> - why AIX must not edit customer production websites;
> - what paid weekly monitoring actually tracks;
> - what the customer should receive each week;
> - how recommendations become executable work without site access;
> - owner/department recommendation;
> - share links / copy / PDF / completion tracking;
> - comparable remeasurement;
> - why AIX must be more than a one-off ChatGPT analysis.

## Current source of truth

Read these two files before changing product behavior or UI:

1. `docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`
2. `docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`

Supporting summaries:

- `docs/PRODUCT_STRATEGY.md`
- `docs/UX_RATIONALE.md`

## Current one-line product model

> **AI検索で競合に負けている場所を継続監視し、今週やるAI SEO Actionを実行可能な形まで作って担当者へ渡し、実施後に同じ条件で答え合わせする。**

## Non-negotiable boundary

AIX does **not** connect to or edit customer production websites.

The operating loop is:

```text
monitor
→ diagnose
→ prioritize
→ prepare Action Pack
→ share to owner
→ customer implements through normal workflow
→ mark complete
→ remeasure
→ next action
```

## User-facing paid product

Use `AIX Monitor` / `継続モニタリング`.

`Founder Watch` is retired user-facing terminology.

## Validation

GitHub Actions must not be reintroduced unless explicitly requested.

Run manually:

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

Then visually review desktop + mobile.
