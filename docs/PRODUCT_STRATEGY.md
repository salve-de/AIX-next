# Rovan — Product Strategy

## Mission

Rovan helps a B2B company improve the moment before a buyer contacts sales: the moment the buyer asks an AI which vendors should be considered.

The product is not primarily an AI rank tracker. It is a buyer-consideration improvement loop:

```text
Find where the company is excluded
→ explain who is selected instead and why
→ turn the biggest evidence gap into a concrete change
→ rerun the same buying questions
→ see what moved and choose the next change
```

## External positioning

Do not lead with internal category names such as AI Buyer Intelligence, AEO, GEO or LLMO. The first screen must state the job directly:

> ChatGPTで、競合に先に選ばれている質問を見つける。
> 候補入りを増やすために、何を直すべきかまで出す。

The visible first-viewport proof should include a concrete rank, prompt denominator, competitor, excluded buyer question and first Action.

## The business problem

For many high-value B2B purchases, evaluation can begin before a buyer visits the company website:

```text
Buyer has a need
→ asks AI for vendors / comparisons / recommendations
→ AI forms a shortlist
→ buyer investigates shortlisted vendors
→ website / demo / contact / procurement
```

GA and CRM mostly observe what happens after a visit or contact. If the company is omitted from the AI shortlist and the buyer never visits, that specific pre-visit comparison event is normally invisible to those systems.

Rovan observes that decision surface. It does **not** claim that every omitted Buyer Prompt is a lost customer or lost revenue.

## Core questions

Rovan must answer five questions without requiring the customer to design the measurement system first:

1. In which buying questions does the company enter or fall out of the AI shortlist?
2. Which competitors are selected instead?
3. What observable citations or public evidence support that difference?
4. What is the single highest-priority change to test next?
5. Under the same measurement conditions, did the result improve after the change?

## Initial customer

Japanese, high-value, non-regulated B2B companies where one qualified lead has meaningful value and buyers compare vendors before contacting sales.

Priority segments:

- B2B SaaS;
- IT and implementation services;
- HR, finance operations, sales and back-office software;
- professional and consulting services;
- niche industrial B2B products with public product information.

Excluded at launch:

- medical diagnosis or treatment;
- investment or financial-product recommendations;
- legal advice;
- local restaurant/hotel discovery;
- frequently changing retail inventory;
- products where unsafe recommendations create material harm.

## Core job

> When buyers use AI to compare vendors before contacting sales, show me the questions where my company falls out of the shortlist, the competitor and evidence that replace it, the smallest useful change to make next, and whether the same buying questions improve after that change.

## Value ladder

### FIND — expose the lost consideration surface

Outputs:
- measured market position;
- shortlisted Buyer Prompts;
- excluded Buyer Prompts;
- competitor selected instead.

Value:
- turns a vague concern about AI search into a concrete list of buying situations to investigate.

### EXPLAIN — make the loss auditable

Outputs:
- exact prompt;
- provider/model/run;
- raw answer;
- competitor citations;
- evidence gap;
- denominator and measurement completeness.

Value:
- the customer can inspect why Rovan reached its conclusion instead of trusting a black-box score.

### ACT — remove the gap between diagnosis and implementation

Outputs:
- one highest-priority Action;
- number of related Buyer Prompts;
- target page or surface;
- Change Pack with proposed title, lead, sections, FAQ, facts used and publish checks.

Value:
- the customer does not have to translate a dashboard into a content brief from scratch.

Change Packs are human-reviewable drafts. Rovan must not invent facts and must not publish to the customer site without explicit approval.

### PROVE — remeasure the same decision surface

Outputs:
- baseline vs latest rank;
- shortlisted/lost prompt movement;
- newly won/lost Buyer Prompts;
- citation changes;
- next gap and next Action.

Value:
- optimization becomes a repeatable loop rather than a one-time report.

## Product promise

Rovan provides an explicit, repeatable observation panel. It does not promise a universal ChatGPT rank, guaranteed citation, guaranteed shortlist inclusion, causal revenue uplift or a complete representation of every private consumer AI conversation.

## Differentiation

### Zero-setup market discovery

The user starts with one company URL. Rovan derives the operating company, brand, product category, buyer, use cases, likely substitutes and Buyer Prompt panel.

### Buyer-loss model instead of generic visibility score

The primary unit is a buying question with a recorded outcome:

- company recommended;
- competitor recommended;
- company omitted;
- citations used;
- stability across repeated runs.

Prompt counts must never be labeled as customers, leads or revenue.

### Evidence operating system

Rovan converts missing public information into a specific, testable request:

> Average implementation time could not be verified. This evidence gap is related to 11 tracked buying questions.

The user is asked only for facts the system cannot find.

### Executable Change Pack

The strongest Action is translated into a draft the customer can actually review and use:

- proposed page/title;
- lead;
- body sections;
- FAQ;
- confirmed facts used;
- publish checks;
- related Buyer Prompts.

This closes the largest gap in pure visibility dashboards: knowing what is wrong but not knowing what to change.

### Auditability

Every metric can be traced to the exact prompt, provider, time, response, citation, extraction version and denominator.

### Longitudinal Watch

A fixed Core panel is rerun weekly. Discovery prompts are kept separate so changing the questions cannot masquerade as improvement.

Watch is an improvement-verification surface, not a diary of system activity.

## Business model

### Free Scan — FIND + EXPLAIN

- no account or card;
- one URL;
- 12 Buyer Prompts;
- OpenAI, Gemini and Perplexity;
- one run per prompt and surface;
- market position;
- excluded prompts;
- competitor/citation evidence;
- top evidence gaps;
- one highest-priority Action.

Customer question answered:

> Where am I losing, and what should I look at first?

### 14-day Watch — PROVE the first improvement

- company email after the result;
- fixed panel and comparable rerun;
- evidence inbox;
- baseline vs latest movement;
- no card;
- no automatic paid conversion.

Customer question answered:

> After I changed something, did the same buying questions move?

### Founder Watch — ACT + PROVE continuously

- ¥29,800/month before tax;
- one brand;
- 50 fixed Core prompts plus Discovery prompts;
- three AI surfaces and repeated observations;
- weekly measurement;
- full answers and citations;
- evidence inbox;
- Change Pack;
- reprioritized Actions;
- 12-month history.

Customer question answered:

> What should I change next, and is the improvement loop continuing to work?

Prompt/provider quotas are proof and capacity details, not the headline value proposition.

## North-star and supporting metrics

### North-star: Paid Project Activation

Within 14 days of payment:
- a valid comparable Core measurement completes;
- at least one Evidence task or Change Pack action is reviewed;
- the customer reaches a second measurement or scheduled next measurement.

This tests whether Rovan actually enters the customer's operating loop.

### Supporting product metrics

- **Buyer Prompt Shortlist Coverage** — share of comparable Core prompts where the company is shortlisted.
- **Prompt Recovery Rate** — previously excluded Core prompts that become shortlisted in a comparable later measurement.
- **Action-to-Remeasure Completion** — Action/Change Pack reviewed and followed by comparable remeasurement.
- **Evidence Resolution Rate** — high-priority evidence gaps resolved or verified.

These are product-operating metrics, not guaranteed business outcomes.

### Optional future business-impact metrics

When a customer connects first-party analytics, Rovan may additionally show:
- AI-referral sessions;
- AI-referral demo/contact conversions;
- CRM-reported AI source;
- supporting branded/direct traffic trends.

These signals must remain separate from prompt counts. Rovan must not infer that a prompt movement caused revenue merely because both changed after an Action.

## Long-term moat

The durable asset is not the interface. It is the structured history:

```text
Company × Market × Buyer Intent × AI Surface × Competitor
× Citation × Evidence State × Action × Change Pack
× Before/After × Confidence × optional first-party business outcome
```

With sufficient observations, Rovan can eventually rank Actions by outcomes observed in comparable companies rather than generic SEO advice, while preserving uncertainty and avoiding unsupported causal claims.

## Revenue-outcome advisory extension (2026-09-03)

AI推薦は目的ではなく、認知・候補入り・訪問・問い合わせ・商談・受注へつながる接点の一つである。Rovanは顧客サイト、広告、CRM、第三者プロフィールを自動変更するサービスにはしない。顧客が会社名・商品名・サービス名またはURLを入れるだけで、AIが競合を選ぶ買い手の質問、公開根拠の不足、売上に近い改善の優先順位を返し、顧客が必要な施策を判断できることを価値にする。

「AISEOで有利になる」は、順位上昇の保証ではなく、AIに選ばれるための判断を他社より早く・具体的にできるという意味で使う。RovanはAISEO Opportunity（候補外、競合、引用、根拠差）とSales Opportunity（顧客の不安、証拠、CTA、次の検証）を一枚にまとめ、Change PackとWatchで任意の変更を再確認する。

唯一、Rovan側の公開情報を増やす案として、所有者が明示的に参加した企業だけに検証済み公開プロフィールを提供する実験を検討する。出典、更新日、訂正・削除、スポンサー表示を必須にし、掲載順・AI推薦・売上を販売しない。大量ページや偽レビューは作らない。詳細な方法・公式根拠・実装順は [`docs/AISEO_ADVISOR_NO_EXECUTION_2026-09-03.md`](AISEO_ADVISOR_NO_EXECUTION_2026-09-03.md) に記録する。

## UX hierarchy

### 0.1 second — visual gist

The page should visually read as:

```text
ChatGPT + company vs competitors + rank/result + URL input
```

Do not require the visitor to understand AEO/GEO/LLMO terminology.

### 1–3 seconds — category understanding

The visitor should understand:

> This finds the buyer questions where AI recommends competitors instead of us.

### 5–10 seconds — value understanding

The visitor should understand:

> It tells us why, what to change first, and whether the result improves after the change.

### 30–60 seconds — trust

The visitor should be able to inspect:
- exact prompts;
- providers;
- denominators;
- raw answers;
- citations;
- measurement time;
- missing observations;
- methodology boundaries.

## Product boundaries

Rovan will not:

- claim to control external AI systems;
- claim a universal or absolute ChatGPT rank;
- label Buyer Prompts as lost customers;
- convert prompt counts into revenue without first-party attribution;
- guarantee recommendation, citation, inquiry or revenue increases;
- infer causation from a simple before/after movement;
- sell paid ranking placement as independent measurement;
- generate fake reviews or forum posts;
- invent customer results, implementation times, certifications, pricing or ROI;
- make direct production changes without explicit approval and rollback;
- treat one API observation as every consumer AI experience.

## Research reference

See `docs/VALUE_PROPOSITION_RESEARCH_2026-09-02.md` for the market, adjacent-category and UX research supporting this strategy.
