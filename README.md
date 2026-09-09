# Rovan（ロヴァン）

正式サービス名は **Rovan**、日本語の読みは **ロヴァン**。

> **Rovanは、AIが購買前の利用者に対して御社をどう選び、どう説明しているかを監視する「AI購買監査」サービスです。**

2026-09-09時点の新しい商品契約は [`docs/AI_BUYING_AUDIT_PRODUCT_2026-09-09.md`](docs/AI_BUYING_AUDIT_PRODUCT_2026-09-09.md) を優先します。過去の「AIおすすめ獲得」「公開ページ中心」の文書は履歴として残りますが、現在の主商品定義ではありません。

## 現在のプロダクト契約

会社・商品・サービス名またはURLを起点に、Rovanは次を行います。

1. 公開情報から会社・商品・市場・競合を理解する。
2. 比較・価格・用途・対象顧客など、購入判断に近いBuyer Promptを優先する。
3. OpenAI / Gemini / Perplexityを同じ宣言条件で観測し、自社・競合・Citationを記録する。
4. 重要質問で自社が候補から落ちている場面を抽出する。
5. AI回答と対象企業の公式サイト本文に明確な事実矛盾がある場合だけ「AI誤情報」として表示する。
6. Watchで、候補落ち・候補入り回復・新しい競合・新しい誤情報・外部参照元の変化を継続監視する。
7. 問題が見つかった場合、対象ページ・見出し・本文・FAQ・根拠を含むChange Packを人間確認用に作る。

Rovanは全利用者のAI会話やAI内部順位を取得しません。候補外を実際の顧客流出とは扱いません。前後差だけで施策の因果効果を断定しません。

### 主役から外した機能

以下は削除せず補助機能・実験対象として残します。

- Rovan-hosted公開情報参照ページ
- `llms.txt` 下書き
- JSON-LD下書き

これらを公開するだけでAIの推薦・引用・順位が改善すると保証しません。

### 必須にしない接続

初期商品では以下を要求しません。

- GitHub接続
- WordPress管理者権限
- FTP
- 顧客CMSへの自動書き込み

無料診断とWatchは、公開情報の取得とAI観測を中心に動作します。

## Product loop

```text
Company / product name or URL
→ confirm the public site when name resolution is used
→ bounded public-site crawl
→ company / market / competitor discovery
→ prioritize commercially relevant Buyer Prompts
→ OpenAI / Gemini / Perplexity observations
→ candidate gaps / competitors / Citations
→ conservative fact-accuracy check against official pages
→ Watch anomaly detection
→ human-reviewable Change Pack when action is needed
→ comparable remeasurement
```

## What is implemented

### Public product

- URL / company / product / service input;
- public-site candidate confirmation for name input;
- streamed scan progress;
- fictional result and Watch samples;
- AI Buying Audit panel on the result surface;
- candidate-gap count for commercially important prompts;
- explicit AI-vs-official fact mismatches only when both source texts support the contradiction;
- external citation-domain summary;
- free diagnosis without automatic billing;
- paid Watch pricing and continuation;
- pricing, methodology, privacy, terms and data-rights surfaces.

### Scan engine

- URL normalization and SSRF guards;
- DNS and redirect revalidation;
- path-aware robots policy;
- sitemap and bounded crawl;
- company, brand, market, buyer, use-case and competitor discovery;
- Buyer Prompt generation;
- commercial-intent prioritization for buying audit;
- OpenAI web-search adapter;
- Gemini Google Search grounding adapter;
- Perplexity Sonar adapter;
- raw answers and Citations;
- deterministic shortlist extraction;
- Recommendation Coverage, First Choice Rate, Mention Coverage, Citation Coverage, Repeat Agreement and Measurement Completeness;
- candidate-risk and citation-dependency derivation;
- conservative fact-accuracy verification;
- Evidence and Action analysis;
- partial-result handling;
- per-IP and per-domain free-scan limits.

### Watch, execution and billing

- private Watch token;
- baseline and weekly history;
- comparable Core remeasurement;
- candidate-drop and recovery detection;
- new-competitor detection;
- new-fact-error detection;
- new-external-citation-domain detection;
- buying-audit alert email when actionable new risk appears;
- private company Evidence answers;
- Change Pack generator using only public or company-asserted facts;
- persisted Change Pack on Watch;
- optional AI-readable public-information draft;
- optional Rovan-hosted public company profile;
- market relation map, purchase-question demand proxy and page-level content-quality checks;
- AI visibility audit for crawler/indexability/site-quality signals;
- protected weekly scheduler route;
- Stripe Subscription Checkout and signed lifecycle webhook;
- Supabase persistence with local in-memory fallback.

Change Packs are drafts for human approval. Rovan does not directly publish to the customer site.

## Measurement boundary

Rovan reports an explicit observation panel. It does not claim an absolute position across every private AI conversation.

Free Scan:

```text
12 Buyer Prompts
× OpenAI / Gemini / Perplexity
× 1 repetition
= up to 36 observations
```

Paid Watch Core measurement currently retains the existing fixed panel design:

```text
50 fixed Core Prompts
× OpenAI / Gemini / Perplexity
× 3 repetitions
= up to 450 observations per full Core run
```

The Buying Audit UI prioritizes the commercially relevant subset instead of presenting all prompts as equally important. Failed and unconfigured provider calls reduce Measurement Completeness; they are not counted as negative recommendations.

## Pricing

Current validation price in the codebase:

- Free diagnosis: ¥0
- Watch: **¥19,800 / month (tax included)**

`STRIPE_PRICE_ID` is an external environment setting. Before production, it must be verified to point to the same ¥19,800 price. Changing `lib/pricing.ts` alone does not change a Stripe product price.

## Run locally

The current PR implementation is on `feature/ai-buying-audit` and targets `feature/positioning-autopilot`.

```bash
git clone https://github.com/salve-de/rovan.git
cd rovan
git checkout feature/ai-buying-audit
npm ci
cp .env.example .env.local
npm run dev -- -p 3001
```

Open:

```text
http://localhost:3001
http://localhost:3001/result?sample=1
http://localhost:3001/watch?sample=1
```

Fictional sample surfaces do not require provider credentials. Real scans require relevant provider configuration and must not be represented as verified until they complete.

## Environment

Use `.env.example` as the authoritative variable inventory. Do not commit secrets.

The product can use:

- OpenAI for discovery/search, fact checking and Change Pack generation;
- Gemini and Perplexity for additional AI observation surfaces;
- Supabase for durable scan/Watch/rate-limit/run persistence;
- Stripe for paid Watch billing;
- Resend/mail configuration for Watch notifications;
- `CRON_SECRET` for the protected Watch scheduler.

## Database

Apply every migration in `supabase/migrations/` in numeric order. Current repository sequence includes `001_core.sql` through `012_profile_automation.sql`.

Without Supabase, local development uses a single-process in-memory store. It is not suitable for multi-instance production.

## Autonomous Watch Scheduler

The repository includes a Cloud Run Jobs / Cloud Scheduler deployment path for long-running Watch measurements. Production deployment, quotas, parallelism and operating cost must be verified in the target Google Cloud project.

```bash
./scripts/deploy-cloud-run-job.sh
npm run watch:job
```

## Validation

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

or:

```bash
npm run check
```

A passing check is required before claiming a code change is release-ready.

## Current product decisions

- [`docs/AI_BUYING_AUDIT_PRODUCT_2026-09-09.md`](docs/AI_BUYING_AUDIT_PRODUCT_2026-09-09.md) — current product contract
- [`docs/CORE_PRODUCT_STRATEGY.md`](docs/CORE_PRODUCT_STRATEGY.md) — product strategy; update together with the current contract
- [`docs/MEASUREMENT.md`](docs/MEASUREMENT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/RELEASE_2026-09-07.md`](docs/RELEASE_2026-09-07.md) — prior release preparation record
- [`docs/ROVAN_BRAND_MIGRATION.md`](docs/ROVAN_BRAND_MIGRATION.md)

## Safety and truth boundaries

- public `http` / `https` URLs only;
- internal and metadata targets rejected;
- `robots.txt` respected;
- private result and Watch routes are noindex/noarchive/no-referrer/no-store where applicable;
- missing credentials never produce fabricated live observations;
- company Evidence is private by default;
- Buyer Prompts are not customers or leads;
- candidate gaps are not actual lost customers;
- fact errors require explicit AI-answer text and explicit contradictory official-site text;
- no universal rank, recommendation, Citation, inquiry or revenue guarantee;
- no causal claim from a simple before/after movement;
- no invented customer results, implementation times, certifications or ROI;
- no direct customer-site write without explicit approval and rollback design;
- AI-readable drafts and public profile pages do not guarantee AI recommendation, citation or search ranking.
