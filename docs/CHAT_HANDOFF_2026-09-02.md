# AIX Next — handoff redirect (2026-09-02)

> **This original handoff has been superseded. Do not resume implementation from the old `eb75456` / `d9fcf1b` state described in the historical version of this file.**

The current source of truth for the product direction, value proposition, implementation changes, Change Pack wiring, privacy boundaries and remaining verification work is:

```text
docs/CHAT_HANDOFF_2026-09-02_VALUE_PASS.md
```

GitHub:

```text
https://github.com/salve-de/AIX-next/blob/codex/aix-next-v2/docs/CHAT_HANDOFF_2026-09-02_VALUE_PASS.md
```

Repository / branch:

```text
salve-de/AIX-next
codex/aix-next-v2
```

The active implementation is **not** on `main`.

## Current product in one sentence

> **ChatGPTで、競合に負けている質問がわかる。自社が候補に入るために、何を直すかまで出し、同じ質問で改善後の変化を確認する。**

Current product loop:

```text
FIND excluded buying questions
→ EXPLAIN selected competitor and evidence gap
→ ACT with a human-reviewable Change Pack
→ PROVE what moved under comparable remeasurement
```

Important truth boundaries remain unchanged:

- Buyer Prompt counts are not customers, leads or revenue.
- AIX does not claim a universal ChatGPT rank.
- Before/after movement does not prove causality.
- Samples are fictional.
- Missing provider results are never fabricated.
- Change Packs are drafts and are not automatically published.

## Local verification

The intended local worktree remains:

```text
/Users/satoushinya/project/AIX-next
```

Use the current branch and run the full check before claiming release readiness:

```bash
cd /Users/satoushinya/project/AIX-next
git fetch origin
git checkout codex/aix-next-v2
git pull --ff-only origin codex/aix-next-v2
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run dev -- -p 3001
```

Then inspect:

```text
http://localhost:3001/
http://localhost:3001/result?sample=1
http://localhost:3001/watch?sample=1
http://localhost:3001/pricing
```

The current chat environment could not perform this local build because its container could not resolve `github.com`. That is a verification limitation, not a product claim. Do not substitute GitHub Actions for this workflow.
