# AIX — Current Implementation Gaps

> Compare current branch behavior against:
>
> - `AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`
> - `AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`

This file is a starting-point audit, not a replacement for code inspection.

---

# P0 current gaps

## 1. Persistent Action workflow does not yet exist

Current state:

- `ActionCard` is analysis output;
- `ChangePack` is generated output;
- monitoring does not have a durable work-item lifecycle equivalent to `open → waiting_for_fact → ready_to_share → shared → done`.

Needed:

- Action Work Item type;
- durable DB migration;
- storage functions;
- status transitions;
- completion timestamp;
- baseline measurement binding;
- related prompt IDs preserved for remeasurement.

Likely files:

- `lib/types.ts`
- `lib/storage.ts`
- new migration under `supabase/migrations/`
- new workflow helpers under `lib/`
- `components/watch-client.tsx`

---

## 2. No owner/department recommendation in the task workflow

Current state:

AIX can recommend an Action but does not persist who should normally own it.

Needed:

- owner-role classifier/mapping;
- default owner role on work item;
- override field;
- optional owner name/email.

UI should show:

> 推奨担当: Marketing / Customer Success

---

## 3. Missing-fact inputs are still evidence-oriented rather than task-oriented

Current state:

Company evidence can be entered, but the UX is not yet a minimal guided fact request for the current Action.

Needed:

- derive only the facts required by the highest-priority Action;
- structured short questions;
- `不明` / `非公開` choices;
- connect answers to the Action;
- invalidate/regenerate the draft as already supported for stale Change Packs.

---

## 4. No core share-link Action artifact

Current state:

There is no dedicated external/shared Action page tied to one work item.

Needed P0:

- private share token;
- `/action/share/<token>` or equivalent;
- read-only Action detail;
- copy;
- print/PDF;
- revocation;
- noindex/noarchive/no-referrer.

No recipient should need the full AIX dashboard just to execute one task.

---

## 5. No explicit “implemented/done” workflow connected to remeasurement

Current state:

AIX remeasures on schedule, but a specific customer-completed Action is not yet bound to the next comparable measurement.

Needed:

- `実施済みにする`;
- confirmation copy;
- completion time;
- preserve source/baseline measurement;
- related prompt set;
- next comparable result message.

---

## 6. Monitoring page still needs full Action-centric workflow integration

Current state:

The monitoring page has movement, remaining losses, next Action and Change Pack concepts.

Still needed:

```text
weekly summary
→ primary Action
→ required facts
→ owner
→ share controls
→ status
→ completion
→ related remeasurement
```

Chart/history must remain below the decision/work layer.

---

## 7. Home still has an intermediate `ux3` competitor-layout pass

Current files include:

- `app/competitor-layout-pass.css`
- `app/page.tsx` using `ux3-*` classes
- `components/product-visuals.tsx` using `ux3-*` preview classes
- `app/layout.tsx` importing the competitor layout pass

The `ux3` pass was introduced during parallel work and contains choices such as very large hero typography and user-visible internal wording that may conflict with the final master.

Before the next UI implementation pass:

- reconcile or remove `ux3` rules;
- test the 0.1-second category gist;
- test the 1-second recurring paid-value inference;
- keep ordinary B2B/light-first visual direction;
- do not let the Home degrade back into “rank dashboard” or “AI HUD”.

Required cold-user target:

> “AI検索で競合に負けてるところを見つけて、毎週何を直すか出してくれるサービス。”

---

## 8. Home paid value must explicitly show the no-site-access workflow

Needed visual/copy rail:

```text
監視
→ 改善Action
→ 担当者へ共有
→ 実施
→ 再測定
```

The current Home explains diagnosis and remeasurement, but the final product needs to make **handoff + customer execution** part of the paid-value mental model.

Do not imply automatic production editing.

---

## 9. Pricing must be rechecked after Action workflow ships

AIX Monitor should be sold as:

> 毎週、競合差分を監視し、次にやるAI SEO Actionと共有できる成果物を更新する。

The paid plan must visibly include:

- scheduled monitoring;
- next Action;
- improvement pack;
- owner recommendation;
- share/handoff;
- completion/remeasurement.

Prompt/provider counts remain secondary measurement specifications.

---

# P1 current gaps

## 10. Email Action handoff

Not implemented as a task-sharing workflow.

Needed:

- recipient name/email;
- note;
- send share URL;
- record shared timestamp.

---

## 11. Action notes / blockers / due date

Not implemented as lightweight workflow state.

Do not build a general-purpose project manager.

Only support what improves Action completion.

---

## 12. Relevant competitor public-web change feed

Current monitoring is primarily measurement-oriented.

Future feed should surface only changes linked to tracked questions/gaps, not a generic website-change stream.

---

## 13. Weekly notification needs Action-first compression

Target:

```text
AI比較: 9位 → 7位
新しく候補入り: 2質問
次にやること: 標準導入期間を公開する

[Actionを見る]
```

No long “weekly report” by default.

---

# P2 future gaps

## 14. Optional external handoff integrations

Not required for core PMF.

Later:

- Notion;
- Jira;
- Trello;
- Slack;
- generic webhook.

These never replace AIX's own Action history and measurement state.

---

## 15. First-party business-impact data

Potential future integrations:

- Google Search Console AI-feature data where available;
- analytics/referral data;
- CRM source data.

These must remain separate from comparison-question counts and cannot be used to manufacture causal ROI claims.

---

# Explicit anti-gap: do NOT “solve” execution by editing the customer website

Do not address the workflow gap by adding:

- CMS credentials;
- WordPress write access;
- production GitHub access;
- auto-merge;
- auto-publish.

The correct solution is better Action preparation, handoff, status and remeasurement.

---

# First implementation sequence from current code

1. add Action Work Item types/storage/migration;
2. generate/persist owner role;
3. bind current Action/ChangePack to work item;
4. add Action status + missing-fact UX on monitoring page;
5. add private share route/page;
6. add copy/PDF/revoke/share controls;
7. add `実施済みにする` and remeasurement binding;
8. update monitoring weekly summary;
9. update Home to make recurring workflow obvious;
10. update Pricing to sell this workflow;
11. then implement email sharing and lightweight blockers.
