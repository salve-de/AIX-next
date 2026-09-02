# AIX — Action Handoff Reference Patterns

This document records adjacent-product patterns that support AIX's no-production-site-access model.

The purpose is **not** to copy competitor styling. It is to reuse mature interaction patterns for converting analysis into work another person can execute.

---

## 1. Semrush — audit issue → external work item → rerun

Reference:

- https://www.semrush.com/kb/541-site-audit-issues-report

Observed pattern:

- detect an issue;
- show the issue detail and fix guidance;
- allow the issue to be moved into an external work-management workflow (e.g. Trello in supported flows);
- rerun the audit later and compare issue state.

AIX implication:

```text
AI comparison issue
→ Action Pack
→ hand off externally
→ mark complete
→ rerun comparable questions
```

AIX does not need production-site credentials to create operational value.

---

## 2. Surfer — analysis/editor → share link → collaborator executes

Reference:

- https://docs.surferseo.com/en/articles/6944408-main-features-of-content-editor

Observed pattern:

- the product creates a working document/editor;
- the user shares the work with writers/collaborators;
- execution can happen without giving every stakeholder full ownership of the whole account/workspace.

AIX implication:

The Action artifact itself must be understandable outside the main dashboard.

A share page should contain enough context to execute one task:

- what to do;
- why;
- target page/surface;
- draft/brief;
- required facts;
- checks;
- source links.

Do not require the recipient to learn AIX terminology first.

---

## 3. Clearscope — report/draft sharing outside the account

Reference:

- https://www.clearscope.io/support/how-do-i-find-the-shared-report-link

Observed pattern:

- a report/draft can be shared by link;
- external collaborators can work from the artifact rather than navigating the full product.

AIX implication:

P0 should include a revocable, unguessable Action share link.

This is more important than building deep CMS integrations.

---

## 4. Ahrefs — auditable issue detail + export

Reference:

- https://help.ahrefs.com/en/articles/2646667-how-to-export-site-audit-report

Observed pattern:

- detailed audit data remains inspectable;
- reports can be exported for team/client workflows.

AIX implication:

Keep raw AI answers, citations and measurement conditions available for auditability, but place them after the decision/action layer.

Support:

- copy;
- print/PDF;
- structured export where useful.

---

## 5. Scrunch — AI gap → concrete content action/brief

References:

- https://helpcenter.scrunchai.com/en/articles/15871644-understanding-content-gaps-in-scrunch
- https://helpcenter.scrunchai.com/en/articles/15879296-understanding-the-signals-tab

Observed pattern:

- find AI/content gaps;
- convert gaps into concrete recommended actions;
- reduce the burden of translating metrics into editorial work.

AIX implication:

AIX must never stop at:

> “導入事例が足りません。”

It should continue to:

```text
which comparison questions are affected
→ what fact is missing
→ which owner should provide it
→ what page/surface should change
→ what draft/brief to use
→ what to check before publication
→ what to remeasure later
```

---

# 6. The AIX-specific extension beyond these references

The strongest AIX pattern is:

```text
Monitor
→ detect competitive loss
→ prioritize Action
→ prepare deliverable
→ share to owner
→ customer implements normally
→ mark complete
→ remeasure the same related questions
```

The share/work item remains tied to:

- specific comparison-question IDs;
- specific evidence gaps;
- source measurement ID;
- completion time;
- future comparable measurement.

This creates a closed loop without production-site access.

---

# 7. UI requirements derived from adjacent products

## Action list

Use rows/list, not decorative cards.

Columns/fields should prioritize:

- priority;
- task;
- why;
- owner;
- status;
- related question count;
- next action.

## Action detail

Top:

> What to do + why.

Then:

> facts needed + prepared deliverable.

Then:

> share / copy / PDF / completion.

Audit/source detail comes last.

## Share page

No marketing navigation is needed.

Header:

- AIX logo;
- task status;
- company/brand;
- “shared task” indicator.

Main content:

1. task;
2. why;
3. owner;
4. required facts;
5. prepared draft/brief;
6. source links;
7. checks;
8. copy/print actions.

## Completion

Completion should be explicit and reversible only by an authorized user.

After completion:

> “次回の比較測定で、関連質問の変化を確認します。”

---

# 8. What not to copy

Do not copy:

- competitor branding;
- competitor layouts pixel-for-pixel;
- generic AI neon visuals;
- giant feature-card grids;
- jargon-heavy dashboards.

Reuse only the underlying workflow patterns.
