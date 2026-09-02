# AIX Next — current handoff redirect (2026-09-02)

> **Do not resume from the historical `eb75456` / `d9fcf1b` implementation or from the intermediate value-pass UI.**

The current implementation and UX source of truth is:

```text
docs/CHAT_HANDOFF_2026-09-02_B2B_REDESIGN.md
```

GitHub:

```text
https://github.com/salve-de/AIX-next/blob/codex/aix-next-v2/docs/CHAT_HANDOFF_2026-09-02_B2B_REDESIGN.md
```

Repository / branch:

```text
salve-de/AIX-next
codex/aix-next-v2
```

Current product promise:

> **ChatGPTで、競合に負けている質問がわかる。会社URLを入れるだけ。候補外になる比較質問、代わりに選ばれる競合、その理由、まず直すべき1件まで診断し、改善後を同じ質問で確認する。**

The active branch uses the redesigned page roles:

```text
Home / LP with URL input
→ Scan execution
→ decision-first Result
→ 14-day free comparable monitoring
→ AIX Monitor + Change Pack
```

GitHub Actions are intentionally not used on this branch.

Before calling the current redesign release-ready, run in the real local worktree:

```bash
npm run lint
npm test
npm run typecheck
npm run build
```

and visually review the new desktop/mobile flows. The ChatGPT execution container used for this redesign cannot resolve/connect to `github.com`, so a clean-clone build was not executable there.
