# Rovan — Value Proposition Research (2026-09-02)

> **資料の位置づけ:** 2026-09-02時点の調査スナップショット。現行のNorth Star、公開範囲、料金、実装状態は [`AGENTS.md`](../AGENTS.md) と [`docs/CORE_PRODUCT_STRATEGY.md`](CORE_PRODUCT_STRATEGY.md) を優先する。以下の提案や「implemented」は、この調査時点の記録であり、現在の動作を単独で証明しない。

## Executive conclusion

Rovan should not be positioned as an "AI rank tracker" or a generic "AI SEO" dashboard.

The strongest product promise is:

> Find the buyer questions where AI recommends a competitor instead of you, show the observable evidence gap behind that outcome, turn the highest-priority gap into a human-reviewable website change, and rerun the same panel to see what moved.

In Japanese product copy, the shortest useful framing is:

> ChatGPTで、競合に先に選ばれている質問を見つける。候補入りを増やすために、何を直すべきかまで出す。

The business value is not the rank itself. The rank is evidence that exposes an otherwise invisible pre-sales consideration problem.

---

## 1. The buyer-value mechanism

For many B2B purchases, the relevant flow is increasingly:

```text
Buyer has a problem
→ asks AI for options / comparisons / recommendations
→ AI forms a shortlist
→ buyer investigates shortlisted vendors
→ website / review / sales contact / demo / procurement
```

Traditional web analytics mostly start after the visit. If the brand is omitted at the AI-shortlist stage and the buyer never visits the site, GA/CRM cannot directly show that missed comparison event.

Rovan is therefore most useful at the boundary immediately before the visit or sales contact:

```text
Which buying question excluded us?
→ Who appeared instead?
→ What public evidence was available for them but not verifiable for us?
→ What is the smallest useful change to test?
→ Did the same buyer-question panel improve after the change?
```

Important boundary: a lost Buyer Prompt is **not a lost customer**. Rovan must never convert prompt counts into customer or revenue counts without first-party attribution evidence.

---

## 2. What the current market already proves

### Ahrefs Brand Radar

Official positioning: "Make AI recommend your brand." Ahrefs tracks AI mentions, competitor performance, citations, buyer custom prompts and AI traffic/bot activity. Current official pricing includes custom-prompt packages and higher-priced AI indexes.

Sources:
- https://ahrefs.com/brand-radar
- https://help.ahrefs.com/en/articles/11064852-what-is-brand-radar-and-how-to-use-it
- https://ahrefs.com/pricing

Lesson for Rovan: buyers will pay for prompt tracking and competitor benchmarking, but Rovan should avoid competing only on prompt volume. Ahrefs has much larger data scale.

### Semrush AI Visibility Toolkit

Official pricing currently starts at $99/month per domain (annual billing) and includes AI visibility, 25 custom tracked prompts, competitor analysis, prompt research and AI-readiness site audit.

Sources:
- https://www.semrush.com/pricing/ai/
- https://ja.semrush.com/pricing/ai/

Lesson for Rovan: visibility + competitor + audit is already becoming a standard bundle. Rovan needs a sharper workflow from a lost buying question to an executable change and remeasurement.

### Scrunch

Scrunch's Content Gaps workflow explicitly identifies questions customers ask AI that the site does not adequately answer, then lets users choose whether to create a new article, add FAQ content or update a page.

Sources:
- https://helpcenter.scrunchai.com/en/articles/15871644-understanding-content-gaps-in-scrunch
- https://helpcenter.scrunchai.com/en/articles/11691414-top-5-ai-content-optimization-problems

Lesson for Rovan: the category is moving from monitoring to execution. Rovan should surface the already-implemented Change Pack rather than leave it as hidden backend capability.

### Profound

Profound's product direction combines visibility/insights with agents and iterative optimization. Its public customer stories also frame success in downstream outcomes such as AI-referred traffic, inquiries, signups, subscriptions and revenue, although these are vendor case studies rather than universal causal evidence.

Sources:
- https://www.tryprofound.com/
- https://www.tryprofound.com/agents
- https://www.tryprofound.com/customers

Lesson for Rovan: the long-term value stack is measurement → action → remeasurement → optional business-impact attribution.

### Adjacent competitive-intelligence products: Klue and Crayon

Klue and Crayon do not primarily sell "more monitoring." Their category framing is about winning competitive deals, understanding why the company loses, and turning intelligence into actions for revenue teams.

Sources:
- https://klue.com/
- https://www.crayon.co/

Lesson for Rovan: competitive intelligence becomes valuable when it changes a decision. Rovan should sell "recover AI consideration opportunities" rather than "monitor AI rankings."

---

## 3. 0.1-second UX: what is and is not realistic

Peer-reviewed visual-perception research has shown that people can form stable visual-aesthetic impressions of a webpage in roughly 50 ms. Follow-up work also found that lower visual complexity and familiar/prototypical layouts improve immediate impressions.

This does **not** mean a person semantically understands a new B2B category in 50 ms.

The correct design requirement is:

- 0.1 second: visual gist — this is a business tool about ChatGPT + competitors + a rank/result.
- 1–3 seconds: semantic category — it finds the buying questions where competitors are selected instead of the company.
- 5–10 seconds: business value — it tells the user what to change and how improvement will be verified.
- 30–60 seconds: trust — methodology, denominators, raw observations, citations and measurement boundaries.

Implication: first view needs large concrete nouns, a familiar input, a visible result, and one outcome promise. Internal vocabulary such as Buyer Intelligence, Evidence OS, AEO or LLMO should never be required for first understanding.

---

## 4. Rovan value ladder

### FIND — reveal the invisible loss surface

Output:
- candidate coverage under the measured panel;
- excluded Buyer Prompts;
- shortlisted Buyer Prompts;
- competitor selected instead.

User value:
- turns "AI search might matter" into a concrete list of buying situations where the company is absent.

### EXPLAIN — make the loss auditable

Output:
- exact AI response;
- competitor citations;
- public evidence gap;
- provider/time/denominator/completeness.

User value:
- makes the result inspectable instead of asking the customer to trust an opaque AI score.

### ACT — turn diagnosis into an editable change

Output:
- highest-priority Action;
- related Buyer Prompt count;
- target page;
- Change Pack: proposed title, lead, sections, FAQ, facts used and publish checks.

User value:
- removes the "I know the problem, but what do I actually change?" gap.

### PROVE — rerun the same decision surface

Output:
- baseline vs latest rank;
- shortlisted/lost question movements;
- newly won/lost prompts;
- citation changes;
- next gap and next Action.

User value:
- converts optimization from one-off advice into a repeatable improvement loop.

---

## 5. What Rovan should promise on each surface

### Homepage

Primary promise:

> ChatGPTで、競合に先に選ばれている質問を見つける。

Secondary promise:

> 候補入りを増やすために、何を直すべきかまで出します。

Visible proof in first viewport:
- 13社中9位;
- 候補外 10/12;
- top competitor 7/12;
- one actual buyer question;
- one observable evidence gap;
- one next Action.

### Result

The result must answer in sequence:

```text
Where are we losing?
→ Who is winning?
→ What evidence explains the difference?
→ What single thing should we change first?
→ How will we know if it worked?
```

### Watch

Watch is not an activity log. It is an improvement-verification surface:

```text
Did the previous change work?
→ Which buying situations moved?
→ Which gaps remain?
→ What should we change next?
```

### Pricing

Pricing should sell the loop, not quotas:

- Free Scan = find the loss.
- 14-day Watch = verify whether the first improvement moves.
- paid Weekly Watch = keep comparing the same panel and reviewing the next proposed improvement every week.

Prompt counts/providers/repetitions are important proof and capacity details, but they are not the primary reason to buy.

---

## 6. Product gaps after this research

### P0 — surface Change Pack as a real product output

Backend Change Pack generation already exists and creates human-reviewable headings, leads, page sections, FAQs and publish checks from public/confirmed facts. It must be persisted and shown in Watch.

Implemented in the 2026-09-02 value-proposition pass:
- persisted `changePack` on Watch;
- migration for `change_pack` JSONB;
- automatic generation after paid Watch measurement;
- on-demand `/api/change-pack` generation;
- Watch UI for editable Change Pack preview;
- stale Change Pack invalidation when company evidence changes.

### P1 — connect Rovan to first-party business impact

Future optional integrations should connect AI-referral traffic and conversions to Rovan without pretending that prompt counts equal leads.

Candidate first-party signals:
- GA4 sessions from AI referrers;
- demo/contact conversions attributed to AI referrers;
- CRM self-reported source such as "ChatGPT / AI search";
- branded/direct traffic change as supporting context, not proof of causality.

This should be an optional business-impact layer, not a prerequisite for the core product.

### P1 — prioritize prompts by business importance, not just count

Rovan already stores prompt importance and clusters. Future ranking should distinguish high-intent vendor-comparison questions from broad informational questions. A single high-value comparison prompt may matter more than several low-intent mentions.

### P2 — build an action-outcome evidence base

Long-term moat:

```text
Evidence gap
× action type
× target page
× market / company type
× before / after shortlist outcomes
× confidence
```

This can eventually help Rovan predict which changes are most likely to improve a comparable decision surface, while still avoiding causal claims from simple before/after observations.

---

## 7. Non-negotiable truth boundaries

Rovan must not claim:
- a universal or absolute ChatGPT rank;
- that a lost prompt equals a lost customer;
- that adding a specific page guarantees an AI recommendation;
- that a before/after movement proves causality;
- invented customer results, implementation times, certifications or ROI;
- automatic publication without explicit human approval.

Rovan should state exactly what it does know:
- the prompt panel;
- provider/model/time;
- repeated observations;
- recommendation/omission outcome;
- citations and public evidence observed;
- missing or unverified evidence;
- the recommended next test;
- movement under comparable remeasurement.

---

## Final positioning

Rovan is an **AI buyer-consideration improvement system** for high-value B2B companies.

Externally, do not lead with that category label. Lead with the concrete job:

> ChatGPTで、競合に先に選ばれている質問を見つける。なぜ負けるかを特定し、直す原稿まで作り、同じ質問で改善したか確かめる。
