# ChatGPT Sites Delivery Boundary

Rovan keeps GitHub as the canonical source and avoids putting durable business logic behind a presentation-only dependency.

## Role of ChatGPT Sites

ChatGPT Sites can be used as the public presentation and interaction surface for:

- landing page;
- URL input;
- scan progress;
- result;
- Watch;
- pricing and trust pages.

## Role of the durable backend

The following remain server-side and portable:

- secret provider credentials;
- crawl and SSRF controls;
- long-running scan orchestration;
- retries and budgets;
- weekly scheduling;
- raw AI responses and Citations;
- Watch history;
- billing state;
- audit and deletion.

## Architecture decision

The current Next.js application is the complete local/Codex implementation and the reference behavior. Before a production Sites release:

1. import the GitHub project into the Sites workflow;
2. confirm framework compatibility;
3. verify server environment variables;
4. verify external API calls and streaming responses;
5. verify private/noindex result behavior;
6. verify Stripe redirect and webhook return URLs;
7. verify mobile layout and accessibility;
8. keep the API contract portable if the Sites runtime cannot host a required background process.

## Why this boundary exists

Rovan performs multi-page crawling, multiple provider calls, retries, weekly scans and private evidence retention. These operations should not be coupled to a beta UI surface. The product remains deployable and testable from GitHub even if the presentation host changes.

Official references:

- https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites
- https://learn.chatgpt.com/docs/sites
