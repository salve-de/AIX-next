# AIX — START HERE

Use this file as the entry point for any new implementation session.

Repository:

```text
salve-de/AIX-next
```

Branch:

```text
codex/aix-next-v2
```

## Read in this order

1. **Product / hard boundaries**
   - `docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`
2. **Exact implementation order / acceptance criteria**
   - `docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`
3. **Known current-code gaps**
   - `docs/AIX_CURRENT_IMPLEMENTATION_GAPS.md`
4. **Action-sharing reference patterns**
   - `docs/AIX_ACTION_HANDOFF_REFERENCE_PATTERNS.md`
5. Supporting strategy/UX
   - `docs/PRODUCT_STRATEGY.md`
   - `docs/UX_RATIONALE.md`

If an older handoff conflicts with these files, these files win.

## Product in one sentence

> **AI検索で競合に負けている場所を継続監視し、今週やるAI SEO Actionを実行可能な形まで作って担当者へ渡し、実施後に同じ条件で答え合わせする。**

## Hard boundary

> **Do not connect to or edit customer production websites.**

Do not solve execution by adding CMS/production GitHub/deploy access.

Solve it through:

```text
monitor
→ diagnose
→ prioritize
→ prepare Action Pack
→ recommend owner
→ share
→ customer implements
→ mark complete
→ remeasure
```

## Immediate implementation sequence

1. persistent Action Work Item;
2. owner/department recommendation;
3. task-oriented missing-fact requests;
4. Action Pack bound to work item;
5. private share page;
6. copy/PDF/share controls;
7. `実施済みにする`;
8. bind completion to comparable remeasurement;
9. Action-first weekly summary/notification;
10. Home/Pricing update so paid recurring value is obvious in one second.

## First-impression acceptance test

After ~1 second a cold user should say something close to:

> **“AI検索で競合に負けているところを見つけて、毎週何を直すか出してくれるサービス。”**

After 5–10 seconds:

> **“サイトは勝手に触らないけど、監視・分析・改善案・担当者共有・実施後の再測定までやる。”**

## GitHub policy

Do not reintroduce GitHub Actions unless explicitly requested.

Manual validation:

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

Then desktop/mobile visual review.
