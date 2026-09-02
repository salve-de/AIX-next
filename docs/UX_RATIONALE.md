# AIX Next — UX Rationale

> **Authoritative product source:** `docs/AIX_PRODUCT_IMPLEMENTATION_MASTER_CURRENT.md`
>
> **Implementation order:** `docs/AIX_IMPLEMENTATION_BACKLOG_CURRENT.md`
>
> This document explains UX intent. If it conflicts with the master, the master wins.

## The five questions every screen must answer

1. **What is this?**
2. **Why should I care/pay?**
3. **What happened to my company?**
4. **What should I do next?**
5. **What changed after we did it?**

Anything that does not help answer one of these should be questioned.

---

# 1. Deliberate user perception

## 0.1 second

The first visual impression should be:

> **AI SEO / ChatGPT競合改善のサービス。**

Required visible cues:

- AI search / ChatGPT;
- company vs competitor;
- a concrete result;
- improvement/action cue;
- URL input.

## 1 second

The paid-value inference should be:

> **ここに払えば、AI検索で競合に負けている場所を継続的に見つけて、毎週次に何を直すか出してくれる。**

This is more important than understanding the measurement mechanics.

## 3–5 seconds

The visitor should understand:

```text
競合に負けている比較質問を発見
→ 理由を特定
→ 今週の改善Actionを作る
→ 担当者へ共有
→ 実施後に再測定
```

## 10 seconds

The visitor should understand why this is not merely ChatGPT:

> **単発分析ではなく、固定質問・競合・引用元・履歴・Action・担当者・完了・再測定を継続運用する。**

---

# 2. Desired emotions

## Competitive urgency

> “競合がAI比較で先に選ばれている。取り返したい。”

## Hidden-loss awareness

> “サイト訪問前の比較なら、普通のGAだけでは見えていない。”

## Relief

> “AI SEOを自分で研究し続けなくても、次の仕事が整理される。”

## Control

> “何をやったか、次に何をやるか、実施後に何が変わったかが残る。”

Do not manufacture fear with unsupported revenue-loss claims.

---

# 3. Global UX principles

1. **Outcome before mechanism.**
2. **Action before chart.**
3. **One primary Action before a long issue list.**
4. **Customer language before internal terminology.**
5. **Shareable work before production integration.**
6. **Ask only for facts AIX cannot verify.**
7. **Never make the user write an SEO brief from scratch.**
8. **Keep raw evidence available after the decision layer.**
9. **Never imply AIX edits the customer's website.**
10. **Never imply payment guarantees rankings/traffic/revenue.**

---

# 4. Home

## Job

In one viewport, answer:

- what AIX is;
- why a company pays;
- what AIX keeps doing over time;
- how to try it.

## Recommended message hierarchy

### Headline

> **AI検索で、競合に負けている場所を毎週見つける。**

### Subhead

> **自社が候補から外れる比較質問、選ばれる競合、足りない根拠を特定。今週やる改善までAIXが作ります。**

### Operational rail

```text
監視
→ 改善Action
→ 担当者へ共有
→ 実施
→ 再測定
```

### CTA

> **無料で自社を診断**

Secondary:

> **実際の結果を見る**

## What to avoid

- “AI Buyer Intelligence” as the primary explanation;
- a giant rank as the only promise;
- “Buyer Prompt”, “Evidence”, “Change Pack” before meaning is clear;
- dark neon AI HUDs;
- decorative feature-card walls;
- repeating the same sample twice;
- implying the site is automatically edited.

---

# 5. Scan

The user already decided to try the product. Stop selling.

Show only useful progress:

1. 会社と公開情報を確認
2. 競合と比較質問を整理
3. AIの回答を確認
4. 改善点をまとめる

No radar/HUD.

Failures/rate limits become dedicated states:

- clear reason;
- retry timing if known;
- retry;
- sample result;
- back to URL entry.

A run with zero successful AI observations must never display a normal rank report.

---

# 6. Result

## First viewport

Must answer both:

> **何が起きている？**

and

> **まず何をする？**

Example:

```text
NEXORA Cloud のAI比較診断

13社中9位
12の比較質問のうち10問で候補外

まず直すこと
企業規模別の導入実績を公開する
10の比較質問に関連
```

Measurement metadata stays compact.

## Order

1. summary;
2. first Action;
3. important excluded comparison questions;
4. named competitors;
5. observed information gaps;
6. what the user/team needs to execute;
7. 14-day comparable monitoring CTA;
8. raw AI answers/citations/methodology collapsed below.

Do not make the user read a long report before discovering the Action.

---

# 7. Monitoring / AIX Monitor

This is not a “weekly report”.

It is the customer's **weekly AI SEO action surface**.

## First block

```text
AI比較: 9位 → 7位
2つの比較質問で新しく候補入り
次にやること: 標準導入期間を公開する
```

## Order

1. meaningful movement;
2. this week's primary Action;
3. new wins/losses;
4. important remaining losses;
5. missing fact requests;
6. Action Pack;
7. recommended owner + handoff controls;
8. task status;
9. chart/history;
10. raw details.

The chart is evidence of movement, not the product's main action.

---

# 8. Action Pack UX

AIX must not stop at:

> “導入事例を追加してください。”

It should produce:

- why;
- target;
- related comparison questions;
- competitor/source context;
- missing facts;
- verified facts;
- owner suggestion;
- title/heading;
- lead/body/brief;
- FAQ;
- technical implementation notes where relevant;
- publish/fact checks;
- remeasurement targets.

## Missing-fact forms

Ask only what AIX cannot verify.

Prefer short structured inputs.

Always provide `不明` / `非公開` where appropriate.

## Completion

Button:

> **実施済みにする**

Explanation:

> **次回測定で、関連する比較質問の変化を確認します。**

Do not imply AIX published the change.

---

# 9. Sharing UX

Because AIX deliberately does not connect to production websites, sharing is a core execution surface.

P0 controls:

- **共有リンク**
- **コピー**
- **PDF / 印刷**
- **実施済みにする**

P1:

- **担当者へメール**
- owner name/email;
- note;
- due date;
- blocker/status.

A shared recipient should be able to understand and execute one Action without learning the whole AIX product.

---

# 10. Pricing

Sell recurring work removal.

## Free

> **どこで負けているか分かる。**

## 14-day free monitoring

> **最初の改善後に、同じ比較質問が動いたか確認する。**

## AIX Monitor

> **毎週、競合差分を監視し、次にやるAI SEO Actionと共有できる成果物を更新する。**

Do not headline:

- number of prompts;
- provider count;
- repetitions;
- raw observation volume.

Those belong in `測定仕様`.

`Founder Watch` is retired.

---

# 11. Page-role boundaries

## Setup

Development/admin only. Never public readiness theater.

## Billing

Opened from monitoring context. No normal manual token input.

## Data Rights

Export/delete only. Context should be prefilled where possible.

## Support

Problem categories and context-aware help. Do not ask users to find technical IDs when the current route already has them.

## Privacy / Terms / Commerce

Ordinary compact documents. No giant marketing Hero.

---

# 12. Language rules

Preferred:

| Internal | User-facing |
|---|---|
| Buyer Prompt | 比較質問 |
| Evidence Gap | 情報差 / 確認できない比較材料 |
| Citation | 引用元 |
| Watch | 継続モニタリング |
| Change Pack | 改善パック / 今週のAction / 変更原稿 |
| Raw Observation | AI回答の詳細 |
| Core Prompt | 固定質問 |
| Discovery Prompt | 探索質問 |

Avoid vague AI copy:

- “AIが理解する”
- “Boost visibility”
- “Optimize your presence”
- “Autopilot” unless the actual workflow matches the promise.

---

# 13. Release comprehension gate

Before release, cold-test the first viewport.

After one second, target response:

> **“AI検索で競合に負けているところを見つけて、毎週何を直すか出してくれるサービス。”**

After 5–10 seconds, target response:

> **“サイトは勝手に触らないけど、監視・分析・改善案・担当者共有・実施後の再測定までやる。”**

Reject the design if users mainly answer:

- “順位を見るツール”
- “AI分析ツール”
- “何をしてくれるのか分からない”
- “AIXが勝手にサイトを書き換えるサービス”
