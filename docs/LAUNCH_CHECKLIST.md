# AIX Next — Commercial Launch Checklist

The codebase can run locally and the fictional product experience requires no credentials. Do not accept public paid subscriptions until every required item below is complete.

## 1. Brand and seller

- [ ] Confirm the public product name and domain.
- [ ] Configure `NEXT_PUBLIC_SITE_URL`.
- [ ] Configure `SELLER_LEGAL_NAME`.
- [ ] Configure `SELLER_REPRESENTATIVE`.
- [ ] Configure `SELLER_ADDRESS`.
- [ ] Configure `SELLER_EMAIL`.
- [ ] Optionally configure `SELLER_PHONE` and `SELLER_SUPPORT_HOURS`.
- [ ] Review `/commerce`, `/privacy`, `/terms`, `/support` with Japanese counsel.

## 2. AI providers

- [ ] Create a production OpenAI project and key.
- [ ] Confirm the current supported Web Search model and set `OPENAI_SEARCH_MODEL`.
- [ ] Confirm the current discovery model and set `OPENAI_DISCOVERY_MODEL`.
- [ ] Create a Gemini API key and enable billing.
- [ ] Confirm the current Google Search Grounding model and set `GEMINI_MODEL`.
- [ ] Create a Perplexity API key.
- [ ] Confirm the current Sonar model and set `PERPLEXITY_MODEL`.
- [ ] Set provider spending caps and alerts.
- [ ] Run a 100-company quality evaluation before public promotion.

## 3. Data

- [ ] Create the Supabase project.
- [ ] Apply migrations in numeric order.
- [ ] Store `SUPABASE_SERVICE_ROLE_KEY` only on the server.
- [ ] Confirm RLS has no anonymous access to Scan or Watch records.
- [ ] Confirm backups and point-in-time recovery policy.
- [ ] Test data export and deletion.
- [ ] Define free-result and paid-history retention periods.

## 4. Billing

- [ ] Create a monthly Stripe Product and Price for ¥29,800 before tax.
- [ ] Set `STRIPE_PRICE_ID`.
- [ ] Configure the Checkout domain and business information.
- [ ] Configure `/api/billing/webhook`.
- [ ] Store the signing secret as `STRIPE_WEBHOOK_SECRET`.
- [ ] Enable Stripe Customer Portal.
- [ ] Test checkout success, cancellation, failed payment and subscription deletion.
- [ ] Confirm invoice/tax behavior with accounting support.

## 5. Scheduler and operations

- [ ] Generate a strong `CRON_SECRET`.
- [ ] Call `/api/cron/watch` daily with the Bearer secret.
- [ ] Confirm a due Watch is selected only once.
- [ ] Configure provider outage alerts.
- [ ] Configure cost anomaly alerts.
- [ ] Set `RATE_LIMIT_SALT` to a random production secret.
- [ ] Verify per-IP and per-domain scan limits.
- [ ] Publish the final AIXNextBot URL and support contact.

## 6. Product quality gates

- [ ] Entity/brand match precision ≥95% on the target ICP.
- [ ] Competitor relevance ≥85%.
- [ ] Buyer Prompt relevance ≥85%.
- [ ] Recommendation extraction precision ≥98%.
- [ ] Citation extraction precision ≥99%.
- [ ] Scan failure rate <5% on eligible public B2B sites.
- [ ] Mobile overflow and keyboard-navigation checks pass.
- [ ] Every headline metric links back to raw observations.
- [ ] Failed provider calls never become negative recommendations.
- [ ] Sample pages remain explicitly fictional.

## 7. Go-to-market gates

- [ ] Recruit 20–50 founder companies in eligible B2B categories.
- [ ] Do not accept regulated/high-risk categories at launch.
- [ ] Track Result → Watch conversion.
- [ ] Track Watch → Paid conversion.
- [ ] Track Evidence Task completion.
- [ ] Track 30-day and 90-day retention.
- [ ] Track variable cost per completed Scan and paid Project.
- [ ] Stop or narrow the ICP if Watch → Paid remains below 5% after 200 qualified trials.

## 8. AI visibility delivery gates

- [ ] Confirm each live result stores the crawl/content/proof/measurement visibility audit.
- [ ] Confirm generated JSON-LD matches visible customer content before publication.
- [ ] Confirm `robots.txt`, noindex and sitemap checks are shown as observations, not rank promises.
- [ ] Confirm every AI-readable draft is reviewed by the customer and no customer site is changed automatically.
- [ ] If Search Console, Bing, GA4, GitHub or CMS integrations are added, require verified domain ownership, least privilege, preview, audit log and rollback before enabling writes.
- [ ] After a customer publishes a change, rerun the same Buyer Prompt panel and keep provider/model/date conditions with the comparison.

## Launch command

From a fresh Codex/local checkout:

```bash
git checkout main
git pull origin main
npm install
cp .env.example .env.local
npm run check
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/result?sample=1
http://localhost:3000/watch?sample=1
http://localhost:3000/setup
```
