# AIX Next — Product Strategy

> **Current authority:** `docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`
>
> **Execution plan:** `docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`
>
> If this summary conflicts with the master, the master wins.

## Mission

AIX helps a B2B company systematically improve the stage before a buyer contacts sales: the moment the buyer asks ChatGPT, Gemini, Perplexity or another AI which vendors should be considered.

AIX is not primarily a rank tracker. It is a recurring AI-search improvement operating loop:

```text
find where the company is excluded
→ explain who is selected instead and what observable evidence differs
→ choose the most important improvement task
→ prepare the brief/draft/checklist needed to execute it
→ hand it to the correct person
→ record completion
→ rerun comparable questions
→ show what changed and choose the next task
```

## External product position

The intended first impression is:

> **AI検索で競合に負けている場所を毎週見つける。**
>
> **自社が候補から外れる比較質問、選ばれる競合、足りない根拠を特定。今週やる改善までAIXが作る。**

The product should make a visitor think:

- “AI SEOを継続的に強くするためのサービスだ”
- “競合に取られているAI比較の機会を取り戻すために使うんだ”
- “自分で毎週調査しなくても、次にやることが出てくる”

It must not imply:

- guaranteed AI traffic;
- guaranteed rank increases;
- direct control of ChatGPT/Gemini/Perplexity;
- automatic production-site editing.

## Core business problem

For many high-value B2B purchases:

```text
buyer has a need
→ asks AI for options/comparisons
→ AI forms a shortlist
→ buyer investigates shortlisted vendors
→ website / demo / contact / procurement
```

Ordinary analytics mostly observe what happens after a visit or contact. AIX observes a measurable sample of the comparison stage before that.

AIX must never label an excluded comparison question as a lost customer or lost revenue.

## Core customer job

> When AI compares vendors before buyers contact sales, keep showing my team where we are excluded, why competitors are selected instead, what we can realistically improve next, give us the material needed to execute it, and tell us what changed after we finish the work.

## What AIX owns

AIX should automate as much of the safe operational work as possible:

- scheduled AI observation;
- fixed comparison-question history;
- competitor tracking;
- citation/source tracking;
- relevant public-web comparison;
- evidence/information-gap detection;
- action prioritization;
- missing-fact requests;
- draft/brief/FAQ/checklist generation;
- recommended owner/department;
- shareable Action artifact;
- task status;
- completion history;
- comparable remeasurement;
- concise weekly notification.

## What AIX explicitly does not own

AIX does **not** connect to or edit customer production websites.

Do not require:

- CMS admin access;
- production GitHub write access;
- deployment access;
- automatic merges;
- automatic publishing.

The customer/team remains responsible for:

- factual confirmation;
- legal/brand approval;
- production publishing;
- real customer-review acquisition;
- real third-party coverage;
- product/service improvements.

The product ends at a high-quality implementation handoff, then begins again at remeasurement.

## Value ladder

### FIND

Answer:

> Where are we losing in AI comparison?

Outputs:

- panel-relative position;
- shortlisted comparison questions;
- excluded comparison questions;
- selected competitors.

### EXPLAIN

Answer:

> Why is this happening in the observed responses?

Outputs:

- exact comparison question;
- provider/model/run;
- raw answer;
- citations;
- competitor public proof;
- customer information gap;
- denominator/completeness.

### PRIORITIZE

Answer:

> What should the team do next?

Output one primary Action by default, ranked by:

- importance of related comparison questions;
- number of related tracked questions;
- evidence strength;
- confidence;
- implementation burden;
- whether the customer can actually control the surface.

### PREPARE

Answer:

> What exactly does the team need to execute this?

Create an Action Pack / improvement pack containing:

- why;
- target page/surface;
- required company facts;
- verified public facts;
- proposed title/heading;
- body/brief;
- FAQ;
- technical notes where relevant;
- publish checks;
- related comparison questions;
- recommended owner.

### SHARE

Answer:

> Who should do this and how do I hand it off?

Core handoff model:

- share link;
- copy;
- print/PDF;
- email later;
- recommended owner role;
- status.

A stakeholder should not need a full AIX account to execute one task.

### PROVE

Answer:

> After the team implemented the task, what moved under comparable measurement?

Outputs:

- baseline vs latest;
- newly shortlisted questions;
- newly excluded questions;
- citation/source changes;
- movement in related questions;
- next Action.

Never infer causality from simple before/after movement.

## Weekly paid operating model

Do not sell a “weekly report”. Sell a weekly AI SEO action cycle.

The default customer-facing summary is only:

```text
AI比較: 9位 → 7位
2つの比較質問で新しく候補入り
次にやること: 標準導入期間を公開する
```

The detailed product then explains:

1. what changed;
2. what remains important;
3. this week's primary Action;
4. what AIX prepared;
5. what fact/approval the customer still needs to provide;
6. who should own the task;
7. task/share/completion state;
8. detailed audit data only after the decision layer.

## Business model

### Free Scan

Purpose:

> **どこで負けているか分かる。**

- one URL;
- no account/card;
- comparison-question discovery;
- AI observations;
- named competitors;
- key information gaps;
- one primary Action.

### 14-day free monitoring

Purpose:

> **最初の改善後に、同じ比較質問が動いたか確認する。**

- company email;
- fixed comparable panel;
- baseline/latest;
- no card;
- no automatic paid conversion.

### AIX Monitor

Purpose:

> **毎週、競合差分を監視し、次にやるAI SEO Actionと共有できる成果物を更新する。**

Paid value must include recurring work removal, not merely more prompt volume:

- scheduled monitoring;
- stored comparable history;
- competitor/source change detection;
- action reprioritization;
- fact requests;
- Action Pack;
- recommended owner;
- handoff/share;
- completion state;
- remeasurement;
- concise notification.

Technical capacity (prompt count, repetitions, providers) is secondary specification, not the headline value.

## Why not just ChatGPT?

A one-off general AI can inspect a website and generate recommendations.

AIX only deserves to exist if it persists and operates the workflow:

```text
Company
× fixed comparison questions
× AI surfaces
× competitors
× citations
× evidence state
× Action
× owner
× task status
× weekly history
× completion
× remeasurement
```

The durable differentiation is continuity, comparable measurement, workflow state and handoff—not raw LLM intelligence.

## Product moat

Long-term structured history:

```text
Company × Market × Buyer Intent × AI Surface × Competitor
× Citation × Evidence State × Action × Owner × Completion
× Before/After × Confidence × optional first-party outcome
```

With enough valid history, AIX can improve Action prioritization based on comparable observed outcomes while preserving uncertainty.

## Product boundaries

AIX will not:

- claim to control external AI systems;
- claim a universal ChatGPT rank;
- call comparison-question counts customers/leads/revenue;
- guarantee recommendation/citation/traffic/inquiry/revenue;
- infer causation from simple before/after movement;
- edit or publish to customer production websites;
- generate fake reviews, fake case studies or fake media mentions;
- invent customer results, implementation times, certifications, pricing or ROI;
- become a CMS, auto-deployer, generic chatbot or generic project-management suite.

## UX hierarchy

### 0.1 second

Visual gist:

```text
AI search + competitors + improvement + URL input
```

### 1 second

Paid-value gist:

> “ここに払えば、AI検索で競合に負けている場所を継続監視して、次に何を直すか出してくれる。”

### 3–5 seconds

Operational loop:

```text
監視 → 改善Action → 担当者へ共有 → 実施 → 再測定
```

### 10 seconds

Substitution answer:

> “単発分析はChatGPTでもできるが、AIXは固定質問・競合・引用元・履歴・Action・担当者・完了・再測定を継続運用する。”

## Required implementation source

All implementation work should follow:

- `docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`
- `docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`

Do not implement from older handoffs when they conflict with these files.
