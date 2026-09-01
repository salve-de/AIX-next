# AIX Next UX Decision Log

Every primary interaction must answer four questions:

1. What user uncertainty exists at this point?
2. What is the smallest next commitment?
3. Why is the control placed here?
4. Which product metric proves the choice works?

## 1. Header

| Control | Location | Intent | Why here | Success metric |
|---|---|---|---|---|
| デモ | Header | Let a skeptical visitor see the real product shape without submitting company data | Buyers often need proof before giving a URL; the link is visible but less prominent than the scan CTA | Demo open rate; Demo → Scan |
| 測定方法 | Header | Resolve credibility concerns | Measurement trust is a purchase blocker, but it should not interrupt the primary message | Methodology open rate from report |
| 料金 | Header | Serve high-intent visitors who are already evaluating cost | Persistent and conventional location | Pricing → Scan |
| 無料診断 | Header pill | Return the visitor to the highest-value action | It remains visible after scrolling but is visually subordinate to the hero form | Header CTA → Scan start |

## 2. Hero

### Headline

> AIの推薦候補から、静かに外れていないか。

Intent: expose an invisible commercial loss. It is framed as a question because the user does not yet know the answer.

### URL field

Why URL first:

- it is the only input AIX needs to begin
- it proves the zero-configuration differentiation
- it avoids an onboarding form before value
- a company URL is less sensitive than CRM, analytics or CMS access

### Primary button

> 無料で市場をスキャン

Why this wording:

- “市場” promises more than a technical site audit
- “スキャン” implies the system will work, rather than asking the user to configure prompts
- “無料” removes price ambiguity at the exact commitment point
- “AI SEO診断” is avoided because the output includes competitors, buyer questions and evidence, not only SEO

Why the button is inside the field container:

- URL and action are one cognitive unit
- users do not need to scan the page for the next step
- on mobile it becomes a full-width second row for a larger tap target

Success metrics:

- Landing → URL focus
- URL focus → valid submit
- Scan start rate

### Reassurance row

Placed immediately below the button because the next objections are predictable:

- Will I have to register?
- Will I be charged?
- Will AIX access private data?
- Will the result become public?

The row contains only four answers. More badges would reduce credibility.

### Secondary button

> 90秒で分かるデモを見る

Why secondary:

- it is for visitors not ready to submit a URL
- it must not compete visually with the free scan
- “90秒” defines the effort, while “デモ” makes fictional data explicit

## 3. Hero visual

The visual is not decoration. It explains the complete causal chain:

```text
Buyer question
→ three AI surfaces
→ competitor is shortlisted
→ company is excluded
→ AIX identifies missing Evidence
```

This is placed above the fold because the product is unfamiliar. A screenshot of a dense dashboard would require explanation; the flow diagram explains what the dashboard means.

## 4. Four-output proof band

Placed immediately after the hero to translate the abstract flow into four concrete deliverables:

1. market position
2. lost buying questions
3. cited sources
4. next action

Each item has an icon and one-line explanation. There is no CTA because this band should increase comprehension, not create a competing path.

## 5. Product dashboard section

### “実際の画面で確認する”

Placed after the dashboard visual because the visitor has now seen enough to understand what will open. Earlier placement would lead to a sample with no context.

The button is a text link rather than a filled CTA because the primary conversion remains the user’s own URL scan.

## 6. Product loop

The four steps are shown as one connected diagram:

1. Observe
2. Compare
3. Find missing Evidence
4. Turn it into an improvement action

No button is placed inside the process diagram. A button after every step would imply separate tools rather than one product loop.

## 7. Watch section

### “Watchのデモを見る”

Placed after the trend chart and recurring-event cards. The visitor should first understand why monitoring is different from the free snapshot.

The button is filled and light because this section has a dark background and represents the paid recurring product.

## 8. Evidence section

### “分かる範囲で回答する”

The button appears only after:

- the missing fact is named
- the number of related Buyer Prompts is shown
- example affected questions are visible

This order converts a generic profile-completion request into a commercially justified task.

The wording does not demand precision the company may not yet have. AIX can retain the answer as `company_asserted` until proof is supplied.

## 9. Pricing section

### “料金と契約条件を見る”

The button does not say “Start Autopilot.” The initial product does not automatically publish changes. It opens transparent commercial terms before any paid commitment.

The price is shown on the homepage to prevent a sales-call-only funnel and to qualify self-serve buyers.

## 10. Final CTA

The URL form is repeated only once, after the full explanation. Its purpose is to convert visitors who needed evidence before acting.

It uses the same label as the hero. Changing labels would make the visitor wonder whether it starts a different product.

## 11. Scan progress

### Stop button

Placed after the step list, not in the header, because accidental cancellation is costly. It remains available but is not visually dominant.

### No fake timer

AIX reports actual stages and partial findings. It never advances solely because time has passed. This protects trust when provider APIs are slow.

## 12. Report

### Executive decision map first

The first report visual shows:

```text
question → AI surfaces → winner vs company → AIX explanation
```

This precedes metrics because an executive must understand what the numbers represent.

### Raw answer disclosure

Raw answers are available under each lost Prompt. They are collapsed by default to prevent a long first read, but they are never locked behind an enterprise plan.

### “無料Watchを開始”

Placed after:

1. the loss
2. the supporting citations
3. the missing Evidence
4. the priority action

At this point the user knows what will be monitored. Asking for email earlier would gate the proof.

The form asks only for company email. It does not ask for role, team size, phone or a sales meeting.

## 13. Watch

### Evidence save button

Each Evidence task has its own local save action. A global “Save all” would force users to complete every field or fear losing partial progress.

### Paid continuation button

> AIX Watchを継続

Placed after the user has seen a repeated measurement and recurring tasks. The purchase is framed as continuing work already demonstrated, not buying an abstract future promise.

The free trial does not collect a card. This reduces distrust for a new brand and ensures the paid click is deliberate.

## 14. Button hierarchy

1. Primary: mint filled — current highest-value action
2. Secondary: white filled on dark surfaces — contextual product exploration
3. Tertiary: text link — learn more or inspect details
4. Destructive: never styled as primary

A screen must not contain more than one filled primary action in the same visual region.

## 15. Mobile rules

- The URL button becomes full width.
- KPI cards become 2×2 or 1×1.
- Dense visual diagrams simplify; they do not become horizontally scrollable.
- Raw answers remain collapsible.
- The paid CTA appears after product proof, not as a permanent sticky banner on first load.

## 16. A/B tests after launch

Test only one product hypothesis at a time:

1. Headline: invisible exclusion vs competitor loss
2. Button: 市場をスキャン vs 推薦状況を調べる
3. Demo link before vs after URL form
4. 14-day Watch email form inline vs modal
5. Founder price shown on homepage vs pricing page only

Do not test visual color before the funnel has enough traffic to test message comprehension.
