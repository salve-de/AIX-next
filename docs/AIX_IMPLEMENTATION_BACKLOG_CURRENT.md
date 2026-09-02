# AIX — Implementation Backlog (CURRENT)

> **Execution companion to `AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`.**
>
> This file is intentionally concrete. Implement in this order unless a blocking technical dependency requires otherwise.

---

# P0 — make the product operating model real

## P0-1. Add explicit Action Work Item state

### Goal

Stop treating `ActionCard` and `ChangePack` as static report output. They must become trackable work.

### Required implementation

Add persistent entities/types equivalent to:

```ts
type ActionStatus = "open" | "waiting_for_fact" | "ready_to_share" | "shared" | "done" | "dismissed";

type ActionOwnerRole = "marketing" | "customer_success" | "sales" | "product" | "engineering" | "web" | "pr" | "leadership" | "other";

type ActionWorkItem = {
  id: string;
  watchId: string;
  actionId: string;
  title: string;
  status: ActionStatus;
  ownerRole: ActionOwnerRole;
  ownerName?: string;
  ownerEmail?: string;
  relatedPromptIds: string[];
  evidenceGapIds: string[];
  changePackId?: string;
  dueAt?: string;
  sharedAt?: string;
  completedAt?: string;
  baselineMeasurementId: string;
  remeasureAfterCompletion: boolean;
  notes?: string;
};
```

### Storage

- Add Supabase migration.
- Local in-memory fallback must behave the same way.
- Never overwrite historical completion timestamps.

### Acceptance

A monitoring project can show one persistent Action as `open`, accept fact inputs, move to `ready_to_share`, be marked `shared`, then `done`.

---

## P0-2. Action owner recommendation

### Goal

The user should not need to understand who inside the company owns AI SEO work.

### Required mapping

- case study / customer proof → Marketing / Customer Success
- pricing / plan facts → Sales / Marketing
- implementation timeline → Customer Success / Product
- FAQ → Marketing / Product
- crawl/robots/sitemap → Web / Engineering
- structured data → Web / Engineering
- media / citations → PR / Marketing
- reviews / testimonials → Customer Success
- brand/entity consistency → Marketing / PR / Web
- product gap → Product / Leadership

### UI

Each Action displays:

> 推奨担当: Marketing / Customer Success

and allows override.

---

## P0-3. Missing-fact request UX

### Goal

Never ask the user to write an SEO brief.

### Required behavior

For every Action, derive the smallest set of facts AIX cannot safely verify.

Question types:

- short text;
- number/string;
- yes/no;
- select;
- `不明`;
- `非公開`.

Example:

```text
標準導入期間は？
[ 3〜5週間 ]
[ 非公開 ]
[ 不明 ]
```

When facts change:

- persist evidence;
- invalidate stale generated draft;
- regenerate only after explicit action or automated paid workflow;
- never invent missing facts.

---

## P0-4. User-facing Action Pack

### Goal

Replace “do this” recommendations with something a team can execute.

### Required output

- action title;
- why it matters;
- related comparison-question count;
- exact comparison questions;
- selected competitor/examples;
- observed citations/sources;
- target page/surface;
- recommended owner;
- required customer facts;
- verified public facts;
- proposed title/heading;
- proposed lead;
- body sections;
- FAQ;
- technical notes if relevant;
- publish/fact/legal checks;
- remeasurement target list.

### Naming

Internal type may remain `ChangePack`.

User-facing names:

- `今週のAction`
- `改善パック`
- `変更原稿`

Do not lead with “Change Pack”.

---

## P0-5. Shared Action page

### Goal

The marketing user should be able to hand one task to another person without giving them the whole AIX account.

### Route suggestion

```text
/action/share/<token>
```

### Required P0 features

- read-only task page;
- task title and why;
- target page;
- facts / draft / FAQ / checks;
- source links;
- related comparison questions;
- copy-all button;
- print/PDF;
- clear fictional/sample label for sample mode.

### Security

- random unguessable share token;
- private/noindex/noarchive/no-referrer;
- revocable;
- optional expiry later.

---

## P0-6. Mark Action complete and bind to remeasurement

### Goal

Close the loop without touching the customer site.

### UI

Button:

> **実施済みにする**

Confirmation:

> この変更を公開・実施しましたか？ 次回測定で関連する比較質問の変化を確認します。

### On complete

- set `completedAt`;
- preserve baseline measurement ID;
- preserve related prompt IDs;
- set `remeasureAfterCompletion=true`;
- show next scheduled measurement;
- include it in the next monitoring summary.

### After next comparable measurement

Allowed message:

> 実施後の次回測定で、関連8質問のうち2質問が新しく候補入りしました。

Do not claim causality.

---

## P0-7. Monitoring page hierarchy

### Top block

Exactly this decision order:

1. what changed;
2. this week's Action;
3. newly shortlisted/excluded questions;
4. unresolved important losses;
5. Action Pack / missing facts / sharing;
6. chart/history;
7. raw details.

### Weekly summary example

```text
AI比較: 9位 → 7位
2つの比較質問で新しく候補入り
次にやること: 標準導入期間を公開する
```

No activity-log-first UX.

---

## P0-8. Home paid-value rewrite

### Goal

0.1 sec = AI SEO category.

1 sec = recurring paid operational value.

### Hero direction

Headline candidate:

> **AI検索で、競合に負けている場所を毎週見つける。**

Subhead:

> **自社が候補から外れる比較質問、選ばれる競合、足りない根拠を特定。今週やる改善までAIXが作ります。**

Value rail:

```text
監視
→ 改善Action
→ 担当者へ共有
→ 実施
→ 再測定
```

Primary CTA:

> **無料で自社を診断**

Secondary:

> **実際の結果を見る**

### Acceptance

A cold viewer should answer after ~1 second:

> “AI検索で競合に負けているところを見つけて、継続的に何を直すか出してくれるサービス。”

---

## P0-9. Pricing rewrite

### Paid product name

`AIX Monitor`

`Founder Watch` is retired.

### Headline paid value

> **毎週、競合差分を監視し、次にやるAI SEO Actionを更新。**

### First three paid bullets

1. 競合に負けている比較質問と変化を毎週監視
2. 今週やる最優先Actionと改善パック
3. 担当者へ共有し、実施後に同じ質問で答え合わせ

Prompt/provider/repetition counts must be moved into `測定仕様`.

---

# P1 — reduce execution friction

## P1-1. Email task sharing

Action controls:

- recipient name;
- recipient email;
- optional note;
- send share link;
- record `sharedAt`.

Email subject example:

> `[AIX] 対応依頼: 標準導入期間を公開してください`

Email body should be short and link to the shared Action.

---

## P1-2. Action comments / notes

Need lightweight notes, not a general chat product.

Use cases:

- “法務確認中”
- “CSに導入期間を確認”
- “事例公開許諾待ち”

Do not build Slack-like messaging.

---

## P1-3. Due date / blockers

Optional due date.

Statuses:

- waiting for fact;
- ready to share;
- shared;
- done;
- dismissed.

Monitoring summary should surface blockers only when they prevent the highest-priority Action.

---

## P1-4. Relevant competitor public-web change feed

Track only changes tied to current comparison questions/gaps.

Examples:

- competitor added a case study;
- competitor added implementation timeline;
- competitor added a pricing page;
- competitor gained a newly observed cited page.

Do not ship a generic page-change firehose.

---

## P1-5. Notification compression

Default monitoring email:

```text
今週の変化
- AI比較: 9位 → 7位
- 新しく候補入り: 2質問
- 新しく候補外: 0質問

次にやること
標準導入期間を公開する
8つの比較質問に関連

[Actionを見る]
```

No long PDF attachment by default.

---

## P1-6. Result → monitoring conversion copy

Do not sell “monitoring” as more charts.

CTA block:

> **この改善を実施したあと、同じ比較質問で変化を確認する。**

Button:

> **14日間無料で追跡**

Explain:

- company email only;
- no card;
- no automatic paid conversion.

---

# P2 — optional integrations and moat

## P2-1. Notion/Jira/Trello/Slack handoff

Integrations are convenience only.

Do not make them required for core value.

Priority:

1. Notion export/share
2. Jira issue create
3. Trello card create
4. Slack share
5. generic webhook

Each integration links back to Action ID and keeps AIX as source of measurement/history.

---

## P2-2. First-party business-impact connectors

Potential future sources:

- Google Search Console AI-feature data where available;
- GA / analytics referral sessions;
- CRM source/contact data.

These must stay separate from prompt observations.

Do not infer revenue from prompt movement.

---

## P2-3. Action effectiveness learning

Long-term model:

```text
Action type
× company/market
× evidence gap
× related prompts
× completion
× later comparable movement
```

Use this to rank future recommended Actions.

Never present simple historical association as guaranteed causality.

---

# Non-goals

Do not implement:

- customer CMS connection;
- automatic website editing;
- production GitHub write/merge;
- auto-publishing;
- fake reviews;
- fake media mentions;
- autonomous PR spam;
- generic project management suite;
- chat-first interface;
- giant AI SEO score dashboard.

---

# Required tests

## Product comprehension test

After 1 second, cold user should say approximately:

> “AI検索で競合に負けてる場所を見つけて、毎週次に何を直すか出してくれる。”

## Paid-value test

After 5–10 seconds:

> “サイトは勝手に触らないけど、監視・分析・改善案・担当者共有・実施後の再測定までやる。”

## Substitution test

Ask:

> “Why not just use ChatGPT?”

UI/product should make the answer obvious:

> “ChatGPT is a one-off assistant. AIX stores the fixed competitive measurement system, weekly history, action state, owner/share workflow and remeasurement.”

---

# Validation before release

Run manually; GitHub Actions must not be reintroduced unless explicitly requested.

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

Then review desktop + mobile for:

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

Also review new Action/share surfaces once implemented.
