# AIX Next Research Basis

Research date: 2026-09-02

This document records the external sources that shaped the clean-room product. Product decisions are based primarily on official vendor, platform and policy documentation.

## 1. Buyer behavior

### Gartner

Official press release: 67% of B2B buyers prefer a representative-free experience; GenAI is increasingly used in buying.

- https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience

Implication:

- URL-first self-serve experience
- no mandatory sales call before value
- price and contract boundary shown publicly

### Forrester

State of Business Buying 2026.

- https://www.forrester.com/press-newsroom/forrester-2026-the-state-of-business-buying/

Implication:

- trial and product proof must reduce purchase risk
- result must be shareable internally without requiring a salesperson

### HubSpot

Official AEO buyer research and product positioning.

- https://www.hubspot.com/company-news/aeo-data-buyers-using-ai-search-more-likely-to-purchase
- https://www.hubspot.com/products/aeo

Implication:

- the commercial problem is pre-sales vendor discovery, not “learning LLMO”
- measurement alone is becoming inexpensive

## 2. Conversion model

### ChartMogul / ProductLed

- https://chartmogul.com/reports/saas-conversion-report/

Implication:

- show value before signup
- use a 14-day Watch after the report
- do not require a card for an unknown early-stage brand
- target an initial Watch-to-paid conversion of at least 8%

## 3. Competitive landscape

### Profound

- https://www.tryprofound.com/pricing
- https://www.tryprofound.com/features/answer-engine-insights

Strength:

- enterprise analytics
- prompt tracking
- answer-engine insights
- agents and execution direction

AIX response:

- do not compete on enterprise dashboard breadth
- remove prompt and competitor setup for the initial user
- focus on unknown Japanese B2B entities and Evidence workflow

### Peec AI

- https://peec.ai/
- https://peec.ai/pricing

Strength:

- accessible tracking
- competitive and source analysis
- actions

AIX response:

- turn Evidence gaps into specific company questions
- expose the buyer question as the unit of value

### Scrunch

- https://scrunchai.com/
- https://scrunchai.com/pricing/

Strength:

- site diagnostics
- agent experience and implementation direction

AIX response:

- first prove which buyer market and Evidence gap matter
- delay site-writing permissions until Action adoption is proven

### Ahrefs Brand Radar

- https://ahrefs.com/brand-radar
- https://ahrefs.com/ai-visibility-checker

Strength:

- large search and prompt datasets
- broad brand visibility index

AIX response:

- acknowledge that generated prompts are not direct demand data
- keep Core and Discovery panels separate
- later connect first-party Search Console, sales and support language

### Semrush AI Visibility

- https://www.semrush.com/kb/1493-ai-visibility-toolkit

Strength:

- existing SEO workflow and distribution

AIX response:

- avoid building another SEO suite
- focus on pre-sales shortlist losses and proof gaps

### AI See You and RecoIndex

- https://www.ai-seeyou.com/
- https://recoindex.com/

Strength:

- recommendation index, public profiles or knowledge infrastructure
- fixed prompt methodology and public output

AIX response:

- public profiles are a later network layer, not the initial paid value
- a public ranking must use the same panel for every company

### Japan

- https://llmo-insight.jp/
- https://llmo-insight.jp/pricing

Implication:

- simple Japanese AI visibility tracking already has low-price competition
- AIX must sell market construction, Evidence and recurring decision support

## 4. Official AI APIs

### OpenAI

- https://developers.openai.com/api/docs/guides/tools-web-search
- https://developers.openai.com/api/docs/pricing
- https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

Decisions:

- use official Web Search API as a canonical observation surface
- retain citations and raw answers
- do not imply that an API observation is every consumer ChatGPT session
- distinguish OAI-SearchBot from model-training crawlers

### Gemini

- https://ai.google.dev/gemini-api/docs/google-search
- https://ai.google.dev/gemini-api/docs/pricing

Decisions:

- use Google Search grounding
- retain grounding chunks
- monitor search-request cost because one prompt may fan out

### Perplexity

- https://docs.perplexity.ai/docs/getting-started/pricing
- https://docs.perplexity.ai/guides/search-quickstart

Decisions:

- use Sonar as a third official search-backed surface
- retain returned citations

## 5. Search policy

### Google Search Central

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/essentials/spam-policies

Decisions:

- do not sell special AI markup as a ranking shortcut
- visible content and structured data must agree
- do not build mass thin company pages
- do not serve materially different claims to crawlers and humans

### Bing Webmaster Tools

- https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c

Decisions:

- citations are not a universal quality or authority score
- changes cannot automatically be attributed to one intervention
- AIX must show measurement completeness and raw evidence

## 6. Payments and permissions

### Stripe

- https://stripe.com/jp/pricing
- https://stripe.com/jp/payments/checkout

Decisions:

- card data stays with Stripe
- paid conversion begins only after the Watch value is visible
- no automatic conversion from free Watch

### GitHub App permissions

- https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app

Decision:

- future execution creates a Pull Request with least privilege
- no direct main write or automatic merge

### WordPress Application Passwords

- https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/

Decision:

- future WordPress execution creates a Draft first
- credentials must be revocable and scoped to a dedicated account

## 7. ChatGPT Sites

- https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites
- https://learn.chatgpt.com/docs/sites

Decision:

- keep the frontend portable and compatible with a Sites import workflow
- keep long-running jobs, provider secrets and durable data behind a server boundary while Sites remains a changing beta surface

## 8. Final research conclusion

The market does not need another generic AI visibility checker.

The underserved sequence is:

```text
unknown company URL
→ buyer market and substitutes
→ exact lost purchase questions
→ cited evidence supporting the winner
→ missing company facts
→ recurring remeasurement
```

That sequence defines AIX Next.
