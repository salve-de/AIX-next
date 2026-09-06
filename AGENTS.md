# ROVAN: latest owner decisions and implementation handoff

Before product changes, read `docs/ROVAN_HANDOFF_2026-09-06.md`, then its linked conversation decisions, original 34-task implementation plan, execution supplement, and task state.

Current product policy: **zero mandatory customer work, optional meaningful direction, real work and outcomes made visible, minimal routine owner operations**. Optional direction must change prioritization without changing historical fixed measurements. Do not interpret older Zero Effort text as banning optional choices, or generated drafts as completed external changes.

The handoff's dated product decisions supersede conflicting older product plans, not unrelated security, repository, or framework rules. Prices, customer segments, workload limits, and retention effects are hypotheses. The documentation PR does not implement runtime features or authorize an automatic production deployment. Read the current code and verify completion instead of trusting old Issue checkboxes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
