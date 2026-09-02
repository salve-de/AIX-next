# AIX / AIX Next — chat handoff (2026-09-02)

## Start here

The current product to run and continue is this worktree:

```text
/Users/satoushinya/project/AIX-next
```

It is on local branch `codex/aix-next-v2`, at `d9fcf1b`, which is based on
`origin/build/clean-room-v2` of `salve-de/AIX-next`.

Run it with:

```bash
cd /Users/satoushinya/project/AIX-next
npm run dev -- -p 3001
```

Open:

```text
http://localhost:3001
http://localhost:3001/result?sample=1
http://localhost:3001/watch?sample=1
```

Port `3000` was already in use by another local app. Keep AIX Next on `3001`
unless that other app has deliberately been stopped.

The app was checked locally on 2026-09-02: `/` and `/result?sample=1` both
returned HTTP 200. The fictional sample works without credentials. Do not
claim that a live scan works until the required provider credentials are
configured and a real URL is tested.

## Repository map

There are two related but separate GitHub repositories. Do not mix them up.

| Product | GitHub | Local location | Current factual state |
| --- | --- | --- | --- |
| AIX | `salve-de/AIX` | `/Users/satoushinya/project/AIX` | GitHub `main` was confirmed at `1744792` (`Make AIX visually self-explanatory across Home, Scan, Result and Watch`). The local checkout was still at `d70fd2` when last inspected. |
| AIX Next | `salve-de/AIX-next` | `/Users/satoushinya/project/AIX-next` | This is the active implementation worktree. The root checkout at `/Users/satoushinya/project/AIX/AIX-next` is `main`, and intentionally contains only `README.md`. |

The implementation for AIX Next is **not** on `main`. It is on
`build/clean-room-v2`; this worktree uses local branch `codex/aix-next-v2`
tracking that remote branch. The previous `AIX-next-v2` worktree was moved
from `/Users/satoushinya/project/AIX/AIX-next-v2` to the project root path
above on 2026-09-02.

## Product objective

AIX is a URL-led buyer-intelligence product for Japanese B2B companies. Its
value is not generic "AI SEO" advice. It must answer, in a way that can be
acted on:

1. When a buyer asks an AI to compare vendors, is this company shortlisted?
2. Which competitor is selected instead?
3. What observable evidence explains that result?
4. What is the single highest-priority thing to improve?
5. Is the company improving over time?

The intended flow is:

```text
Company URL
→ public-site crawl
→ company / market / competitor discovery
→ Buyer Prompt panel
→ OpenAI / Gemini / Perplexity observations
→ shortlist outcomes and citations
→ evidence gaps and first action
→ 14-day Watch / paid ongoing monitoring
```

The product must report an explicit measurement panel, not pretend to know an
absolute position in all private AI conversations. A sample must be visibly
fictional. Missing provider observations must remain missing, never invented.

## Non-negotiable UX and copy direction from the user

The user repeatedly rejected a generic, overly explanatory, "AI consulting"
site. Preserve these decisions in any next iteration.

### Homepage

- The first 0.1 seconds must communicate the concrete outcome: **in AI
  comparison, how many companies are there and where does this company rank?**
- A strong direction accepted in prior review was:

  ```text
  AI検索で、あなたの会社は何社中何位か。
  ChatGPTなどで競合が選ばれている購買質問と、
  あなたが候補から外れる理由まで無料で調べます。
  ```

- The URL input must be central and obvious.
- Directly below the hero, show a credible visual sample of the actual output.
  Text-only feature descriptions are insufficient. A user should understand
  `13社中9位`, `自社 2/12`, `競合トップ 7/12`, a real buyer question, and the
  competing recommendation at a glance.
- Keep the home page short: hero, actual sample, what the free scan answers,
  then a concise Autopilot/Watch decision surface. Do not duplicate the same
  pitch in multiple sections.
- The header should point to a sample result or login, not a premature
  `Autopilotを始める` CTA.

### Result page

- A free result should be one clear scroll, not five tabs.
- Lead with a conclusion, for example:

  ```text
  AI比較で、13社中9位です。
  12の購買質問のうち、候補に入ったのは2問だけです。
  ```

- Pair every percentage with its denominator. `17%` alone is weak; show
  `2 / 12` or `6 / 36`.
- Never write `失っている顧客 12件` when the figure is actually a count of
  prompts or themes. Use `候補外になった購買質問 10 / 12`.
- Name competitors in a sample only when the screen is unmistakably labelled
  fictional. Avoid placeholder labels such as `競合A`.
- Show compact measurement conditions near the conclusion: providers, prompt
  count, date/time, and completeness. This makes it an observation rather
  than an opaque AI score.
- Sequence: conclusion → candidate-excluded buyer questions → competitor
  evidence → information to confirm → highest-priority action → free Watch.
- Use direct headings. Avoid meta-copy such as `〜は見せず、〜だけで見せる`,
  internal process explanation, or vague claims like `AIが根拠にした情報を残す`.

### Scan progress

- After URL submission, do not leave a blank wait. Show clear progress such
  as company understanding, competitor discovery, Buyer Prompt creation,
  AI-surface observations, citation checking, evidence gaps, and first action.
- The progress language should tell the user what useful work is happening,
  not expose implementation jargon for its own sake.

### Watch and paid conversion

- Do not show a diary-like Day 0 / Day 1 activity log as the primary value.
- Lead with movement that a decision-maker can interpret, for example:

  ```text
  AI比較での順位: 9位 → 7位
  候補に入った質問: 2 → 3
  候補外の質問: 10 → 8
  新しく候補入り: +3質問
  ```

- The CTA should be direct and close to the decision surface:
  `この順位を、14日間無料で追跡する。` / `無料Watchを開始`.
- The paid Autopilot path must not require repeated, unexplained clicks.
- Avoid long slogans such as `AIX Autopilotを、止めない。` or generic claims
  such as `あなたの確認で、次の測定が強くなる。`.

### Visual style

- Minimal, confident, consultant-like, and flat. Do not make it feel like a
  suspicious AI landing page or a pile of cards.
- Dense but readable outcome panels are better than decorative feature cards.
- Mobile must be checked alongside desktop. In particular, use a 2×2 KPI grid
  where appropriate and avoid excessive vertical gaps or repeated content.
- Before a major visual rewrite, capture the complete desktop and mobile flow
  and obtain a hard independent critique. The user explicitly requested full
  screenshot review after earlier UI changes felt unclear.

## What has already happened in this chat

1. An earlier local prototype was created in
   `/Users/satoushinya/Documents/Codex/2026-09-01/new-chat/work` and iterated
   against the direction above. It is separate from AIX Next and should not be
   mistaken for the active clean-room codebase.
2. Complete PC and mobile screenshots of the earlier prototype's home, result
   tabs, and Watch were passed to another ChatGPT for critique. Its main
   verdict: reduce the homepage, make numerical outcomes unambiguous, name
   competitors in samples, make free results one scroll, and make Watch about
   improvement rather than activity. The direction above incorporates that
   critique.
3. `salve-de/AIX` was fetched only. Its GitHub `main` is newer than the local
   checkout. It was not pulled, modified, or started after that comparison.
4. AIX Next v2 was installed with `npm ci` and started successfully from the
   current worktree. `next dev` generated local development files.

## Current local state and care points

- Do not commit these generated development changes unless there is a deliberate
  reason to do so:

  ```text
  M next-env.d.ts
  M tsconfig.json
  ?? AGENTS.md
  ?? CLAUDE.md
  ```

  They were generated by `next dev`, not authored product work.

- There is no `.env.local` with provider credentials in the active worktree.
  The fictional sample is the correct verification surface until credentials
  are intentionally configured.
- Avoid direct site changes, auto-merge, or billing changes. The product's
  intended model is approval-gated execution and explicit measurement
  boundaries.
- Do not claim live provider results, market position, or customer impact from
  sample screens.

## Recommended next action

1. Open the current AIX Next home, sample result, and sample Watch on desktop
   and mobile.
2. Compare the implementation against the UX requirements in this handoff.
3. Make only the smallest coherent visual/copy changes needed to close the
   remaining gaps; preserve the explicit fictional-sample and measurement
   boundaries.
4. Run `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build` for
   any actual code change, then test the full visible flow in the browser.

