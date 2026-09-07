# Rovan Autonomous Sales Network Strategy

- Status: Current strategic direction
- Date: 2026-09-07
- Scope: Distribution, partner economics, outbound ownership, anti-duplication, operator workload
- Applies to: Rovan / `feature/positioning-autopilot`

## 1. Core decision

Rovan must not depend on the owner sending hundreds or thousands of cold emails every month.

The distribution model is instead:

> Rovan discovers and diagnoses companies automatically, then distributes monetizable sales opportunities to independent users/partners who choose to contact those companies for recurring referral revenue.

The owner operates the platform. The network performs most outbound distribution.

This is not a minor affiliate feature. It is part of the product's distribution architecture.

```text
Public company discovery
→ Rovan pre-scan / qualification
→ sales opportunity created
→ eligible seller claims opportunity
→ Rovan generates company-specific diagnostic page + outreach draft
→ seller contacts the company from the seller's own business identity/channel
→ prospect views diagnostic result
→ prospect starts Rovan
→ billing and service delivery run automatically
→ commission is attributed and paid automatically
→ seller has an incentive to repeat
```

## 2. Why this model exists

A centralized outbound model creates a structural ceiling:

- one operator/domain becomes the source of very large outbound volume;
- deliverability and reputation risk become concentrated;
- sales volume grows in proportion to the operator's outreach capacity;
- every additional prospect increases operating work at the center.

Rovan should invert this.

The platform's job is to make a sales opportunity easy enough and economically attractive enough that many independent participants voluntarily distribute Rovan.

The participant does not need to love Rovan or use Rovan personally. A valid motivation is simply:

> "I can earn recurring income by finding a suitable business, sending a useful diagnosis, and causing a paid subscription."

That incentive alignment is intentional.

## 3. Two customer groups

Rovan has two economically important user groups.

### A. Companies buying Rovan

They want:

- to see where they are omitted from measured AI buying/comparison answers;
- to see which alternatives appear instead;
- to inspect citations and observable evidence gaps;
- to receive a concrete next action / Change Pack;
- to remeasure the same decision surface over time.

### B. Sellers / partners earning from Rovan

They want:

- companies that are likely to buy;
- proof they can show immediately;
- a sales page already personalized to the prospect;
- minimal research and proposal work;
- recurring revenue when a referred company remains subscribed.

The seller-side product must therefore be more than an affiliate link dashboard.

## 4. Seller product: Opportunity Feed

Rovan continuously creates an `Opportunity Feed` from companies that can be evaluated from lawful/publicly available information.

Each opportunity contains at least:

- company / service identity;
- source URL;
- Rovan fit score;
- measured AI omission / inclusion summary;
- observed competing candidates;
- evidence/citation gap summary;
- why the company may care commercially;
- estimated outreach priority;
- current claim state;
- outreach eligibility / suppression state.

The feed should rank opportunities by expected saleability, not by company fame.

A strong opportunity is one where:

1. the company sells a sufficiently valuable B2B product/service;
2. AI-assisted vendor comparison is plausible for its buyers;
3. Rovan can produce a meaningful measured difference;
4. a relevant public business contact path exists;
5. the company has not opted out / been suppressed;
6. another seller is not already actively working the same opportunity.

## 5. Claim system: prevent seller spam and internal cannibalization

Rovan must not allow fifty sellers to contact the same attractive company at once.

Use an exclusive claim lease.

Default rules:

- one active seller claim per company/domain;
- default claim window: 7 days;
- seller must record outreach within the claim window or the opportunity is released;
- meaningful prospect activity may extend the lease;
- explicit rejection / opt-out places the company into a network-wide suppression state;
- no immediate reassignment after rejection;
- cooldown applies before an unresponsive company can be offered again;
- repeated low-quality or duplicate outreach reduces seller privileges.

The claim system is a core platform feature, not an optional moderation tool.

## 6. Company-specific sales asset

A seller must not receive only a generic referral link.

For every claimed company, Rovan generates a prospect-specific sales asset based on actual measured/public evidence:

```text
/company-specific-diagnostic/<token>
```

The page should show, with Rovan's normal truth boundaries:

- the exact measured buying questions relevant to the prospect;
- where the prospect was included or omitted;
- observed competing candidates;
- citations / public evidence used;
- the most important evidence gap;
- the first recommended action;
- measurement time and conditions;
- a clear path into Free Scan / Watch / paid Rovan.

The seller's attribution is attached to this diagnostic asset.

The message being sold is therefore not:

> "Please buy Rovan."

It is:

> "I checked your company and there is a concrete result worth looking at."

This is the primary distribution advantage.

## 7. Outreach assistance

For a claimed opportunity, Rovan generates channel-specific drafts:

- email;
- LinkedIn / business DM where appropriate;
- short follow-up;
- longer explanation;
- QR / share link;
- optional PDF summary;
- embeddable diagnostic widget for eligible partners.

Rovan should make the work close to:

```text
Claim
→ review
→ send
```

rather than:

```text
Research
→ understand GEO/AEO
→ inspect competitors
→ create proposal
→ write copy
→ build landing page
→ track attribution
```

The latter work belongs to Rovan.

## 8. Sender-of-record principle

The distributed network only solves the concentration problem if the participant is the genuine sender of their own outreach.

Therefore, by default:

- the partner/user sends from their own business identity and permitted channel;
- Rovan supplies intelligence, diagnosis, copy, attribution and workflow;
- Rovan is not a hidden bulk-sending relay for the entire network;
- the sender remains responsible for the appropriateness of contacting the recipient;
- Rovan enforces network-wide suppression, duplication prevention and basic compliance gates.

A future connected-mail feature may assist the user's own send workflow, but it must preserve sender identity, consent/opt-out handling, limits, auditability and suppression rules.

## 9. Compensation model

The default economics are recurring because Rovan itself is recurring.

### Standard affiliate seller

- joining fee: ¥0;
- Rovan purchase required to participate: no;
- commission: 25% of attributable net subscription revenue;
- duration: while the referred customer remains an eligible paying customer;
- refunds / chargebacks / failed payments: commission reverses or does not vest;
- self-referrals and collusive referrals: excluded;
- payout: automated on a fixed monthly cycle after a fraud/refund hold period.

### Qualified agency / professional partner

A seller with demonstrated quality and multiple active customers may receive:

- commission: 30% of attributable net subscription revenue;
- bulk customer scanning / import;
- portfolio opportunity view;
- branded or co-branded diagnostic sharing where appropriate;
- higher claim capacity;
- partner analytics.

The rate is earned through customer quality and performance, not through recruiting downstream sellers.

## 10. No multi-level commission

Rovan does not pay Seller A because Seller A recruited Seller B who sold to a company.

Commission is tied to actual customer revenue attributable to the seller who caused the customer acquisition.

This preserves the economic focus:

> sell useful Rovan subscriptions to businesses

rather than:

> recruit more sellers in order to earn from their recruiting/sales tree.

The sales network may grow virally, but compensation remains single-level by default.

## 11. Seller quality / allocation

Rovan should rank sellers using observable operational quality.

Possible inputs:

- valid outreach rate;
- prospect diagnostic-view rate;
- positive/relevant response rate;
- paid conversion rate;
- refund/churn quality of acquired customers;
- complaint / opt-out / spam-report signals;
- duplicate-contact violations;
- claim abandonment rate.

Higher-quality sellers receive:

- earlier access to strong opportunities;
- larger simultaneous claim limits;
- higher-value segments;
- agency/partner tier eligibility.

Poor-quality behavior results in progressively lower access, not more volume.

## 12. Network-wide suppression and safety controls

Rovan must maintain centralized suppression even though outreach is decentralized.

At minimum:

- explicit opt-out is respected across the entire Rovan sales network;
- published "no sales / no solicitation" indications should block or downgrade outreach when reliably detectable;
- already-paying customers are excluded from prospecting;
- active opportunities cannot be simultaneously claimed by multiple sellers;
- bounced / invalid addresses are suppressed;
- prior material complaints are preserved;
- frequency caps apply to company/domain/contact level;
- sellers cannot evade suppression by releasing and reclaiming an opportunity.

This protects the prospect, the seller, and Rovan's reputation.

## 13. Rovan's own outbound role

Rovan may still perform limited owner-operated / automated outbound for:

- validating messaging;
- seeding the network;
- reaching strategic accounts;
- recruiting strong agencies / professional sellers;
- testing new segments.

But centralized cold outbound is not the intended long-term growth engine.

The preferred leverage is:

```text
Rovan acquires a strong seller
→ that seller already has or can reach many relevant companies
→ each company can become recurring Rovan revenue
→ the seller receives recurring commission
→ the seller has an incentive to continue
```

Recruiting a productive distributor can therefore be more valuable than contacting one end customer.

## 14. Agency portfolio mode

Agency / consultant / Web / SEO partners often already possess a portfolio of business clients.

Rovan should allow them to provide a permitted list of client/company URLs and automatically:

1. pre-scan the portfolio;
2. rank companies by Rovan opportunity;
3. generate client-specific diagnostic assets;
4. prepare outreach / explanation drafts;
5. track attribution and customer state;
6. pay recurring commission if the client subscribes.

This is the highest-leverage partner workflow because the partner starts with existing trust rather than cold traffic.

## 15. Customer referral loop

Paying Rovan customers should also be able to distribute Rovan.

Default customer-referral option:

- one active referred customer: 25% subscription credit;
- two: 50% credit;
- three: 75% credit;
- four or more: up to 100% of the referring customer's eligible Rovan subscription credited while the referred customers remain eligible and paying.

Customers who prefer cash recurring commission may join the standard seller program instead, subject to program rules.

This creates a second distribution loop without requiring the owner to perform more sales work.

## 16. Operator workload principle

Any implementation should be rejected or redesigned if revenue growth mechanically creates equivalent owner workload.

The owner should not need to routinely:

- write individual sales emails;
- hold mandatory sales calls;
- create custom proposals;
- calculate commissions manually;
- assign opportunities manually;
- resolve ordinary attribution manually;
- prepare weekly customer reports manually;
- perform client-specific SEO/content work manually;
- onboard every seller manually.

Automation should cover:

- opportunity creation;
- scoring;
- claim leases;
- diagnostic generation;
- sales-copy generation;
- attribution;
- billing;
- commission ledger;
- payout preparation;
- suppression;
- seller scoring;
- customer Watch / remeasurement;
- routine notifications.

Human escalation should be reserved for exceptional payment, fraud, legal, data-rights, abuse or system-failure cases.

## 17. Economic flywheel

The desired loop is:

```text
Better Rovan diagnosis
→ higher prospect trust / conversion
→ more seller commission
→ more motivated sellers
→ more qualified distribution
→ more customers
→ more recurring revenue and measured history
→ more resources/data to improve Rovan
→ better Rovan diagnosis
```

This is the strategic reason the seller network belongs inside the product rather than being treated as an external marketing campaign.

## 18. Implementation priority

Build in this order unless unit-economics or compliance evidence requires a change:

1. affiliate attribution and recurring commission ledger;
2. seller / partner accounts and dashboard;
3. company-specific attributable diagnostic links;
4. Opportunity Feed and Rovan-fit scoring;
5. exclusive claim leases + cooldown + network-wide suppression;
6. automatic outreach-draft generation;
7. seller quality score and opportunity allocation;
8. agency portfolio import / batch qualification;
9. customer subscription-credit referral loop;
10. connected sender workflows only after sender identity, auditability, opt-out and suppression controls are robust.

## 19. Non-negotiable truth boundaries

This distribution strategy does not relax Rovan's existing product rules.

Rovan must not:

- invent AI observations, citations, competitors or prospect problems;
- call a measured prompt omission a lost customer or lost revenue;
- guarantee AI recommendation, ranking, inquiry, contract or revenue;
- hide failed/unconfigured provider calls;
- fabricate customer-specific urgency;
- claim that distributed sending eliminates applicable email/advertising rules;
- circumvent an opt-out by assigning a different seller;
- create fake reviews/posts/endorsements;
- imply an official certification that does not exist.

Every prospect-specific sales asset must remain traceable to real Rovan measurements and public/confirmed evidence.

## 20. Strategic summary

The strongest version of Rovan is not:

> an AI-visibility SaaS with an affiliate page.

It is:

> an AI buyer-consideration product with a built-in autonomous distribution market: Rovan finds the companies, proves the opportunity, packages the pitch, prevents duplicate pursuit, attributes the sale, delivers the recurring product, and shares recurring revenue with the participant who acquired the customer.

The central design goal is aligned incentives:

- the company receives useful diagnostic evidence and ongoing Rovan value;
- the seller can earn recurring income without building the underlying product;
- the partner can monetize existing client relationships with low incremental work;
- Rovan pays acquisition cost primarily when revenue exists;
- the owner is not required to scale personal outbound activity in proportion to revenue.

This is the approved direction for future distribution-system design unless superseded by a later explicit owner decision.
