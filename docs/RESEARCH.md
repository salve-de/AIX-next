# AIX Next — Research Basis

Research date: 2026-09-02

This document records the external evidence used to make the clean-room product decisions. Product design is not based on copying a prior AIX interface.

## 1. AI-assisted B2B buying is a real decision surface

Official and primary research used:

- Gartner, B2B buyer preference for rep-free buying and use of generative AI:  
  https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience
- Forrester, State of Business Buying:  
  https://www.forrester.com/press-newsroom/forrester-2026-the-state-of-business-buying/
- HubSpot, AI-search use in CRM evaluation:  
  https://www.hubspot.com/company-news/aeo-data-buyers-using-ai-search-more-likely-to-purchase

Product implication:

AIX Next is positioned around the pre-sales shortlist event, not around technical SEO terminology. The headline asks whether the company enters an AI-generated set of vendors.

## 2. Measurement alone is already crowded

Official product pages reviewed:

- Profound: https://www.tryprofound.com/
- Peec AI: https://peec.ai/
- Scrunch AI: https://scrunchai.com/
- Semrush AI Visibility: https://www.semrush.com/kb/1493-ai-visibility-toolkit
- Ahrefs Brand Radar: https://ahrefs.com/brand-radar
- HubSpot AEO: https://www.hubspot.com/products/aeo
- LLMOinsight: https://llmo-insight.jp/
- RecoIndex: https://recoindex.com/
- AI See You: https://www.ai-seeyou.com/

Product implication:

AIX Next does not differentiate by displaying mentions, adding another 0–100 score, or supporting the largest number of AI surfaces. The initial wedge is:

1. one URL instead of manual Prompt/competitor setup;
2. Buyer Prompt-level shortlist losses;
3. raw evidence and measurement conditions;
4. missing Evidence converted into a company task;
5. a fixed longitudinal panel.

## 3. A result must be auditable and probabilistic

Primary platform guidance reviewed:

- OpenAI Web Search tool:  
  https://developers.openai.com/api/docs/guides/tools-web-search
- Google Gemini grounding with Google Search:  
  https://ai.google.dev/gemini-api/docs/google-search
- Perplexity Sonar API:  
  https://docs.perplexity.ai/guides/getting-started
- Bing Webmaster Tools AI Performance:  
  https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c

Product implication:

- The UI says “AIX observation panel,” not universal ChatGPT rank.
- Failed/unconfigured calls reduce Measurement Completeness and do not count as brand losses.
- Exact Prompt, surface, model, time, raw response, Citation and repetition are retained.
- One before/after movement is not presented as causal proof.

## 4. There is no special AI-ranking switch

Primary search documentation reviewed:

- Google Search, AI features and website guidance:  
  https://developers.google.com/search/docs/appearance/ai-features
- Google Search spam policies:  
  https://developers.google.com/search/docs/essentials/spam-policies
- OpenAI publisher and developer FAQ / OAI-SearchBot:  
  https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

Product implication:

AIX Next does not sell `llms.txt`, Schema, a public AIX listing, or crawler access as a guaranteed rank increase. Technical accessibility is one diagnostic class. Owned evidence, third-party evidence, reputation, product fit and freshness are separate classes.

AIX Next also avoids:

- cloaking;
- AI-only factual claims;
- mass thin company pages;
- paid manipulation of independent rankings;
- fake reviews or forum posts.

## 5. Free-to-paid should expose value before registration

Research and benchmarks reviewed:

- ChartMogul / ProductLed SaaS Conversion Report:  
  https://chartmogul.com/reports/saas-conversion-report/
- Forrester business-buying research:  
  https://www.forrester.com/press-newsroom/forrester-2026-the-state-of-business-buying/

Product implication:

The funnel is:

```text
ungated URL scan
→ concrete loss + raw proof
→ email/account to save a 14-day Watch
→ paid continuation
```

AIX Next does not ask for a sales call, email or card before showing a company-specific result. The paid CTA is continuous monitoring, not a one-time PDF unlock.

## 6. Official provider APIs are the canonical MVP sources

Official pricing/technical pages reviewed:

- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Perplexity API pricing: https://docs.perplexity.ai/docs/getting-started/pricing

Product implication:

The MVP uses official APIs for the canonical measurement panel. Consumer-interface scraping is not required for launch. It can later be added as a separately labelled surface if contract, reliability and legal review support it.

## 7. Public-profile and automatic-execution layers are deliberately sequenced later

Primary guidance reviewed:

- GitHub App permissions:  
  https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app
- WordPress Application Passwords / REST authentication:  
  https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
- Japan Personal Information Protection Commission FAQ:  
  https://www.ppc.go.jp/all_faq_index/faq2-q2-6/
- Agency for Cultural Affairs, AI and copyright:  
  https://www.bunka.go.jp/seisaku/chosakuken/aiandcopyright.html

Product implication:

The clean-room MVP performs no customer-site write. A future execution layer must use least privilege, Draft/Pull Request first, explicit approval, an audit trail and rollback. Public company pages require domain ownership, evidence provenance, correction/deletion paths and a quality threshold.

## 8. Current product decision

Build now:

- zero-setup market discovery;
- auditable three-surface observation;
- competitive Buyer Prompt map;
- Evidence Gap;
- First Action;
- 14-day and weekly Watch;
- Stripe subscription boundary;
- private-by-default data model.

Do not build as the launch wedge:

- mass public company directory;
- automatic production publishing;
- daily noise-heavy monitoring;
- generic AI article factory;
- unsupported causal uplift forecast;
- all industries and all countries.
