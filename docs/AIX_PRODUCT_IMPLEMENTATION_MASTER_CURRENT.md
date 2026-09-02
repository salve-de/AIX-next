# AIX — Product & Implementation Master (CURRENT)

> **STATUS: AUTHORITATIVE PRODUCT SOURCE OF TRUTH**
>
> This document supersedes earlier product-positioning, UX and implementation interpretations where they conflict with it.
>
> Repository: `salve-de/AIX-next`
>
> Active branch: `codex/aix-next-v2`

---

## 0. One-sentence product definition

AIX is a **managed AI-search improvement operating system for B2B companies**.

It continuously finds the buyer comparison questions where AI recommends competitors instead of the customer, explains the observable difference, converts the highest-priority gap into an executable task/draft that can be handed to the right person, and remeasures the same questions after the customer implements the change.

Japanese user-facing summary:

> **AI検索で競合に負けている場所を見つけ、今週やるAI SEO改善を完成形に近い状態まで作り、実施後に同じ条件で答え合わせする。**

AIX is **not** a universal ChatGPT rank controller and **does not connect to or edit the customer's production website**.

---

# 1. What AIX is actually selling

AIX is not primarily selling:

- a rank;
- a visibility score;
- a prompt dashboard;
- a weekly PDF;
- generic AI SEO advice;
- an AI chatbot that answers one question.

AIX is selling a repeatable operating loop:

```text
MONITOR
where the company is losing in AI comparison

→ DIAGNOSE
who is being selected and what observable evidence differs

→ PRIORITIZE
choose the single most important improvement task

→ PREPARE
create the brief/draft/checklist needed to execute that task

→ SHARE
send it to the correct internal/external owner

→ COMPLETE
mark the task done when the company has implemented it

→ REMEASURE
rerun comparable AI questions and see what moved

→ REPEAT
choose the next task
```

The paid value is therefore:

> **You do not have to become an AI SEO specialist and manually inspect multiple AI surfaces every week. AIX keeps the improvement queue current and tells your team what to do next.**

---

# 2. The exact mental model and emotions the UI must create

The product must deliberately produce specific thoughts in the visitor.

## 2.1 0.1 second — category gist

The user should visually infer:

> **AI SEO / ChatGPT search improvement service.**

The first viewport must visibly contain:

- ChatGPT / AI search;
- company vs competitor context;
- a concrete result;
- a clear improvement/action cue;
- a URL input.

Do not require the user to decode AEO / GEO / LLMO / Buyer Intelligence jargon.

## 2.2 1 second — paid-value inference

The user should infer:

> **If I pay here, this service keeps finding where competitors beat us in AI search and keeps telling us what to improve.**

Acceptable emotional interpretation:

- “AI SEOをガチれるサービスだ”
- “競合に取られているAI比較の機会を取り戻すためのサービスだ”
- “毎週、自社のAI検索改善担当が付く感じだ”
- “自分で全部調べなくても、次にやることが出てくる”

Do **not** create the false inference:

- “Paying AIX guarantees more AI traffic.”
- “AIX can force ChatGPT to rank us first.”
- “AIX silently edits my site and magically increases rankings.”

## 2.3 3–5 seconds — operational understanding

The visitor should understand this loop:

```text
競合に負けている質問を発見
→ 理由を特定
→ 今週やる改善を作成
→ 担当者へ共有
→ 実施後に再測定
```

## 2.4 10 seconds — why pay instead of using ChatGPT manually

The user should understand:

> A single ChatGPT conversation can analyze a site once. AIX continuously stores the same questions, providers, competitors, citations, weekly history, actions and completion status so the improvement loop runs without rebuilding the workflow manually every week.

## 2.5 Desired emotions

### Competitive pressure

> “Competitors are being selected before us. I want to take those comparison opportunities back.”

### Hidden-opportunity anxiety

> “This happens before the website visit, so GA/CRM may not show what we are missing.”

### Relief / delegation

> “I do not have to become an AI SEO expert. AIX will keep the work queue current.”

### Progress / control

> “We can see what changed after each completed improvement instead of guessing.”

---

# 3. Hard product boundary: AIX does NOT edit customer websites

This is a non-negotiable product decision.

AIX must not require:

- CMS admin access;
- WordPress credentials;
- production GitHub access;
- direct deployment access;
- automatic merges;
- automatic production writes;
- silent schema/content changes.

## Why

Direct website modification introduces disproportionate risk:

- customer security reviews;
- permission complexity;
- CMS/framework variance;
- bad deploy/rollback risk;
- fact/legal approval risk;
- brand/editorial governance;
- unclear liability for incorrect public claims;
- longer onboarding and sales cycles.

AIX should instead own the work **up to the publication boundary**.

## AIX owns

- monitoring;
- competitor analysis;
- citation/source analysis;
- evidence-gap detection;
- task prioritization;
- fact-request forms;
- draft generation;
- implementation brief;
- role/owner recommendation;
- shareable task page;
- export/copy/email;
- completion tracking;
- comparable remeasurement.

## Customer/team owns

- factual confirmation;
- legal/brand approval;
- publishing;
- third-party outreach;
- acquiring real reviews/testimonials;
- product/service improvements;
- implementation inside production systems.

This is not a weakness. The product value is to eliminate the research, prioritization and briefing work while leaving the risky final write under customer control.

---

# 4. What AIX can and cannot influence in AI SEO

## 4.1 High-control surfaces

AIX can strongly help the customer improve **customer-controlled public information**:

- product/service descriptions;
- target segment clarity;
- pricing/plan clarity where publishable;
- implementation process/timeline where factual;
- use cases;
- feature comparisons;
- FAQ;
- customer case-study structure;
- public proof and citations available on owned pages;
- entity consistency;
- technical crawl/indexability observations;
- structured-data recommendations;
- internal-link recommendations;
- pages missing answerable comparison information.

## 4.2 Medium/low-control surfaces

AIX can identify and recommend actions around:

- third-party citations;
- review coverage;
- media coverage;
- customer references;
- community mentions;
- partner pages;
- directories/comparison sites.

But it cannot fabricate these or force third parties to publish them.

## 4.3 No-control surfaces

AIX does not control:

- ChatGPT/OpenAI ranking logic;
- Gemini/Google ranking logic;
- Perplexity ranking logic;
- model updates;
- private conversation context;
- competitor changes;
- actual customer satisfaction;
- product quality;
- real third-party reputation;
- guaranteed traffic or revenue.

## Marketing boundary

Allowed:

> **AI検索で競合に負けている場所を減らすための改善を継続的に回す。**

Not allowed:

> **AIXに払えばChatGPT流入が必ず増える。**

---

# 5. Why ChatGPT / Gemini alone is not enough

AIX must be designed so the answer to “ChatGPTでよくない？” is clear.

## 5.1 What a general AI can do well

A user can ask ChatGPT or Gemini once:

> “このサイトのAI SEO改善点を教えて。”

That can produce useful one-off analysis.

If AIX only does:

```text
URL
→ LLM analysis
→ generic recommendations
```

then AIX is weak and highly substitutable.

## 5.2 What AIX must own that a one-off chat does not

AIX must persist and operate:

```text
Company
× fixed comparison questions
× AI surface
× provider/model/run
× competitor
× citation/source
× evidence gap
× action
× owner
× status
× shared artifact
× baseline/latest
× week/history
```

Every cycle should automatically answer:

- What changed since last week?
- Which questions newly became shortlisted?
- Which questions newly became excluded?
- Which competitor gained/lost visibility?
- Which new citation/source appeared?
- Which public proof gap remains unresolved?
- Which previous task was completed?
- What is the next highest-priority task?
- What deliverable does the team need to execute it?
- What should be remeasured after completion?

This continuity, task state and comparable history are the product moat—not the raw LLM generation capability.

---

# 6. Weekly operating model — what AIX actually tracks

Do not call the primary paid deliverable a “weekly report”.

The paid experience is a **weekly AI SEO action cycle**.

AIX may inspect a large internal dataset, but users receive a compressed decision surface.

## 6.1 AI-side monitoring

Track where technically available and methodologically comparable:

- shortlist inclusion per comparison question;
- shortlist exclusion per comparison question;
- relative panel position;
- first-choice company;
- named competitors;
- competitor recommendation frequency;
- citations/source URLs;
- newly observed citations;
- new competitors;
- changes in repeat agreement/stability;
- measurement completeness;
- provider failures/missing observations.

## 6.2 Public-web monitoring

Track useful changes such as:

- relevant customer-owned pages;
- relevant competitor pages;
- new or changed case studies;
- newly visible pricing/plan facts;
- implementation/timeline facts;
- FAQ changes;
- relevant third-party sources/citations;
- crawl/indexability changes where observable;
- content/evidence previously missing but now discoverable.

Do not build a noisy general-purpose web-change feed. Only surface changes connected to tracked comparison questions or evidence gaps.

## 6.3 AIX workflow state

Track:

- current highest-priority actions;
- action owner/role;
- task status;
- company facts requested;
- company facts submitted;
- generated deliverables;
- shared recipient/link/export status where implemented;
- completion date;
- target questions for remeasurement;
- before/after measurement IDs;
- next recommended action.

---

# 7. What the customer should see each week

The user-facing summary should be extremely short first, with detail behind it.

## 7.1 Three-line weekly summary

Example:

> **AI比較：9位 → 7位**
>
> **2つの比較質問で新しく候補入り**
>
> **次にやること：標準導入期間を公開する**

This is the top of the monitoring page and the notification email.

## 7.2 “What changed?” block

Show only meaningful deltas:

- newly shortlisted questions;
- newly excluded questions;
- new competitor movement;
- new citation/source URLs;
- relevant public-web changes.

## 7.3 “This week’s action” block

One primary action by default.

Example:

### 標準導入期間を公開する

**Why**

- related to 8 tracked comparison questions;
- competitor has publishable/comparable evidence;
- customer public site does not expose equivalent evidence clearly.

**Target**

- service page / implementation page / FAQ.

**What AIX has prepared**

- required facts;
- recommended page/section;
- title/heading;
- body outline or copy;
- FAQ;
- publish checks;
- comparison questions to remeasure.

**What the customer must do**

- answer missing factual questions;
- send the task to the correct owner;
- publish through their normal workflow;
- mark complete.

## 7.4 Never dump all internal monitoring by default

AIX may monitor hundreds of observations. The customer should not receive hundreds of rows unless they open details.

Default priority:

```text
Conclusion
→ one action
→ meaningful changes
→ unresolved high-priority items
→ detailed audit data
```

---

# 8. Turn recommendations into executable work

“導入事例を追加してください” is not a sufficient product output.

AIX must reduce the user's cognitive work.

For every high-priority action, create an **Action Pack** (internal type may remain `ChangePack`).

## 8.1 Action Pack required fields

- action title;
- why it matters;
- related comparison-question count;
- exact related comparison questions;
- selected competitor/examples;
- observed source/citation evidence;
- target page/surface;
- recommended owner role;
- facts required from the customer;
- facts already verified from public sources;
- proposed heading/title;
- proposed lead/body sections;
- proposed FAQ;
- implementation notes where technical;
- publish/fact/legal checks;
- remeasurement target questions;
- current status.

## 8.2 Fact request UX

AIX should never make the user write a long SEO brief.

Ask only the missing facts AIX cannot verify.

Examples:

- 標準導入期間は？
- 公開可能な導入企業の規模は？
- 利用部門は？
- 公開可能な成果は？
- 料金は公開可能？
- 認証/規格は公式に確認可能？

Prefer:

- choices;
- short text;
- yes/no;
- “不明 / 非公開” options.

Then AIX converts the answers into the actual deliverable.

## 8.3 Recommended action-owner mapping

AIX should suggest who normally owns the work.

| Action type | Recommended owner |
|---|---|
| Case study / customer proof | Marketing / Customer Success |
| Pricing / plan facts | Sales / Marketing |
| Implementation timeline | Customer Success / Product |
| Product FAQ | Marketing / Product |
| Crawl / robots / sitemap issue | Web / Engineering |
| Structured data | Web / Engineering |
| Third-party media / citations | PR / Marketing |
| Reviews / testimonials | Customer Success |
| Brand/entity inconsistency | Marketing / PR / Web |
| Product limitation exposed by comparison | Product / Leadership |

The user should not need to decide which department owns every AI SEO task from scratch.

---

# 9. Sharing and handoff are core product features

Because AIX does not edit the site, handoff quality is part of the product—not an export afterthought.

Every Action Pack should support, in priority order:

## P0

- **共有リンク** — read-only task page;
- **コピー** — copy ready-to-use text/brief;
- **PDF / print** — portable review artifact;
- **完了にする** — records implementation status and schedules/marks remeasurement target.

## P1

- **担当者へメール** — send task summary and share link;
- owner name/email field;
- comments/notes;
- due date;
- “blocked / waiting for fact / ready / done” status.

## P2 / optional integrations

- Notion export/share;
- Jira issue creation;
- Trello card creation;
- Slack share;
- generic webhook / CSV.

Do not make integrations mandatory for the product to work.

## Comparable market pattern

This follows mature adjacent products:

- Semrush turns audit issues into external work items (e.g. Trello) instead of editing production directly;
- Surfer shares Content Editor work with writers/collaborators;
- Clearscope supports shareable report/draft links;
- Ahrefs supports exportable audit/report workflows;
- Scrunch converts AI content gaps into a usable brief/work item.

AIX should go one step further by tying the shared task back to a specific set of comparison questions and subsequent remeasurement.

---

# 10. Core page architecture

## 10.1 Home `/`

**Purpose**

Make the user understand the category, paid value and next action immediately.

**Must communicate**

0.1 sec:

> AI SEO / ChatGPT competitor improvement.

1 sec:

> Paying keeps the competitive AI-search improvement queue running.

**Recommended first-view copy direction**

Headline:

> **AI検索で、競合に負けている場所を毎週見つける。**

Supporting value:

> **自社が候補から外れる比較質問、選ばれる競合、足りない根拠を特定。今週やる改善までAIXが作ります。**

Micro-proof / paid inference:

> **毎週：監視 → 改善Action → 担当者へ共有 → 実施後に再測定**

CTA:

> **無料で自社を診断**

Secondary:

> **実際の結果を見る**

Do not lead with “13社中9位” alone. Rank is proof, not the product promise.

## 10.2 Scan `/scan`

**Purpose**: execute diagnosis only.

User does not need sales copy here.

Show:

1. company/public site reading;
2. competitor/comparison-question setup;
3. AI observation;
4. result/action preparation.

Failure/rate-limit states are explicit and separate from result.

## 10.3 Result `/result`

**Purpose**: make the first decision.

Order:

1. **What is happening?** — summary;
2. **What should we do first?** — first action in same viewport;
3. **Where are we losing?** — important comparison questions;
4. **Who is winning?** — named competitors;
5. **Why?** — observed evidence/information gaps;
6. **What exactly should be changed/shared?** — free action brief / paid Action Pack preview;
7. **How do we verify?** — 14-day free comparable monitoring CTA;
8. **Audit detail** — raw responses/citations/conditions collapsed.

Never put raw observations before the decision.

## 10.4 Monitoring `/watch`

User-facing name: **継続モニタリング / AIX Monitor**.

Purpose:

> “What changed, what do we do next, and did the previous completed work correspond with a comparable movement?”

Order:

1. three-line summary;
2. this week's primary Action;
3. newly shortlisted / newly excluded questions;
4. important remaining losses;
5. Action Pack and missing fact requests;
6. task status / owner / share controls;
7. chart/history;
8. raw detailed observations.

The chart must never outrank the action.

## 10.5 Pricing `/pricing`

Sell value stages, not provider quota.

### Free Scan

> **どこで負けているか分かる**

### 14-day free monitoring

> **最初の改善後に、同じ比較質問が動いたか確認する**

### AIX Monitor

> **毎週、競合差分を監視し、次にやるAI SEO Actionと共有できる成果物を更新する**

Technical capacity (prompt count, repetitions, providers) belongs in a secondary “測定仕様” area.

## 10.6 Setup `/setup`

Development/admin only. Production must return not-found or require admin authentication.

## 10.7 Billing `/billing`

Opened from monitoring context. No normal manual token entry.

Purpose only:

- payment method;
- invoice/history;
- renewal;
- cancellation.

## 10.8 Data Rights `/data-rights`

Opened from monitoring context where possible.

Purpose:

- export;
- delete;
- explain scope.

## 10.9 Support `/support`

Purpose:

- company/market correction;
- competitor correction;
- citation/observation issue;
- company fact correction;
- billing;
- data/export/delete;
- crawler exclusion.

If entered from a result/monitoring page, prefill context IDs instead of asking the user to locate them manually.

## 10.10 Privacy / Terms / Commerce

Compact ordinary document layout. No marketing hero/HUD.

Must accurately disclose:

- public web crawling;
- provider processing;
- company evidence processing for Action Pack generation;
- storage and deletion;
- no automatic customer-site publication;
- measurement uncertainty;
- no ranking/traffic/revenue guarantee.

---

# 11. User-facing terminology

Preferred:

| Internal / technical | User-facing |
|---|---|
| Buyer Prompt | 比較質問 |
| Evidence Gap | 情報差 / 確認できない比較材料 |
| Citation | 引用元 |
| Watch | 継続モニタリング |
| Founder Watch | **Retired. Use AIX Monitor** |
| Change Pack | 改善パック / 今週のAction / 変更原稿 |
| Raw Observation | AI回答の詳細 |
| Core Prompt | 固定質問 |
| Discovery Prompt | 探索質問 |
| Recommendation Coverage | 候補入り状況 |

Internal database/type/route names may remain stable if changing them has no user value.

---

# 12. Data model required for the no-site-access operating model

The current `WatchRecord`/`ChangePack` model should evolve toward explicit task state.

Recommended additions:

```ts
type ActionStatus =
  | "open"
  | "waiting_for_fact"
  | "ready_to_share"
  | "shared"
  | "done"
  | "dismissed";

type ActionOwnerRole =
  | "marketing"
  | "customer_success"
  | "sales"
  | "product"
  | "engineering"
  | "web"
  | "pr"
  | "leadership"
  | "other";

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

Recommended share entity:

```ts
type ActionShare = {
  id: string;
  workItemId: string;
  token: string;
  permission: "view" | "comment";
  expiresAt?: string;
  createdAt: string;
};
```

Do not overload `evidence` or `changePack` to represent workflow completion.

---

# 13. Measurement and remeasurement rules

## Comparable measurement is mandatory for “what changed”

Only compare when relevant conditions match:

- panel kind;
- prompt IDs/version;
- locale/country;
- provider set where possible;
- repetition design;
- extraction version where materially relevant.

If the panel changed materially, show a new baseline rather than fake improvement.

## After task completion

When a work item is marked `done`:

1. record `completedAt`;
2. preserve the baseline measurement ID;
3. flag related prompts for next comparable measurement;
4. on next valid run, calculate movement only for comparable related prompts;
5. show correlation/sequence, not causality.

Allowed:

> “完了後の次回測定で、関連8質問のうち2質問が新しく候補入りしました。”

Not allowed:

> “この変更によって2質問の順位が上がりました。”

unless a stronger causal design exists.

---

# 14. Notification model

Do not send long weekly report emails by default.

Default email/notification:

Subject example:

> `[AIX] 2つの比較質問で新しく候補入り。次は導入期間です。`

Body:

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

Detailed tables stay in the product.

---

# 15. Pricing value logic

AIX Monitor should only command a meaningful subscription price if the product removes recurring work.

Paid plan must materially provide:

- scheduled monitoring;
- stored comparable history;
- competitor/source changes;
- automatic action reprioritization;
- company fact requests;
- Action Pack generation;
- owner recommendation;
- shareable task artifact;
- task completion state;
- remeasurement after completion;
- concise notifications.

If paid only provides “more prompts / more charts”, the product is too easy to replace with generic AI tools and cheaper rank trackers.

---

# 16. Competitive/adjacent product patterns to reuse

Do not copy visual styling; reuse mature workflow patterns.

## Semrush

Pattern:

> audit issue → assign/export to external work management → later rerun audit.

Lesson:

AIX does not need production-site permissions to create operational value.

## Surfer

Pattern:

> analysis/editor → share link → writer/collaborator executes.

Lesson:

Shared artifact quality is a first-class product surface.

## Clearscope

Pattern:

> report/draft → share with people outside the account.

Lesson:

Do not require every internal stakeholder to become an AIX user just to execute one task.

## Ahrefs

Pattern:

> auditable issue detail + exports/reports.

Lesson:

Keep raw evidence available, but place it after the decision/action layer.

## Scrunch

Pattern:

> AI visibility/content gap → concrete content action/brief.

Lesson:

The category is moving from dashboard-only monitoring toward action. AIX should differentiate by adding assignment/share/status and comparable remeasurement.

---

# 17. Product anti-goals

Do not build AIX into:

- a CMS;
- a website builder;
- an auto-deployer;
- an autonomous content publisher;
- a generic task manager;
- a general chatbot wrapper;
- a giant SEO dashboard with hundreds of vanity metrics;
- a magical “AI ranking manipulation” product;
- a fake-review/PR spam generator.

The product should remain narrowly focused on:

> **AI comparison monitoring → prioritized improvement work → handoff → completion → remeasurement.**

---

# 18. Release acceptance test — product comprehension

Before any release, show the first viewport to a person who has not seen AIX.

Ask after 1 second:

1. What does this product do?
2. Why would a company pay?

Target answer should be close to:

> “AI検索/ChatGPTで競合に負けているところを見つけて、毎週何を直すか出してくれるサービス。”

Reject the release if the answer is primarily:

- “AIの順位を見るツール”
- “なんかAI分析するサービス”
- “SEOダッシュボード”
- “何をしてくれるのか分からない”

---

# 19. Release acceptance test — paid-value comprehension

After 5–10 seconds, the visitor should be able to explain:

> “AIX自身がサイトを勝手に変えるわけではない。でも、監視・競合分析・優先順位・必要情報の質問・変更原稿・担当者共有・実施後の答え合わせまでやってくれる。”

If the UI implies automatic site editing, correct it.

If the UI makes the customer think they must interpret a technical report and invent the implementation plan themselves, correct it.

---

# 20. Current implementation rule

Until the workflow layer described above is fully implemented, do not market unimplemented features as live capability.

It is acceptable to show them as:

- `開発中`;
- `coming next`;
- a clearly labeled product preview;
- internal roadmap only.

Never present a mock Action Share / assignment / completion flow as if it already executed against a real customer.

---

# 21. Source documents

This master incorporates and supersedes conflicting interpretations in:

- `docs/PRODUCT_STRATEGY.md`
- `docs/UX_RATIONALE.md`
- `docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md`
- `docs/B2B_AI_BUYER_BEHAVIOR_2026.md`
- `docs/CHAT_HANDOFF_2026-09-02_B2B_REDESIGN.md`

When in doubt, this file wins.
