# Rovan continuation — 2026-09-02 17:00 JST

This note supersedes the UI-current-state portion of `CHAT_HANDOFF_2026-09-02.md`.

## Branch

- Repository: `salve-de/AIX-next`
- Branch: `codex/aix-next-v2`
- Branch head when this note was prepared: `2958357afeff9d985228006d9c3d1d0e7a46c3cb`
- The branch contains substantial implementation work after the original handoff commit `eb75456`; do not reset back to that commit.

## UX work completed in this continuation

### Home

The homepage copy and sample surface were tightened around a three-step buyer decision:

1. Find the company's position in AI comparison.
2. See which Buyer Prompts exclude the company and which competitor is selected instead.
3. Watch whether the position moves after improving the evidence.

The fictional sample now states the comparison more explicitly:

- `13社中9位`
- own shortlist `2 / 12`
- top competitor shortlist `7 / 12`
- excluded prompts `10 / 12`
- observation completeness `36 / 36`
- explicit fictional date/data marker

### Result

The duplicated KPI/"bottom line" section was removed from the visible decision path. The result flow is now intentionally:

```text
Conclusion
→ Excluded Buyer Prompts
→ Competitor Evidence
→ Information to Confirm
→ First Action
→ 14-day Free Watch CTA
→ Raw Observations (audit detail)
```

This keeps the Watch conversion immediately after the actionable diagnosis rather than burying it after raw provider output.

### Watch

The Watch surface was reduced so the same KPI set is not repeated twice. The primary value remains movement:

- rank before → now
- shortlisted Buyer Prompts before → now
- excluded Buyer Prompts before → now
- newly shortlisted prompts

The next surface is the time-series chart, followed by changed prompts, evidence requests, prioritized actions, and paid weekly Watch.

## Important constraints preserved

- Sample screens must remain explicitly fictional.
- Missing provider observations must not be invented.
- Percentages should not replace denominators where counts are available.
- Do not describe Buyer Prompt counts as lost customers.
- Watch is about measured movement, not a Day 0 / Day 1 activity diary.
- No auto-charge from the 14-day free Watch.
- Do not reset or overwrite newer branch work just because the original handoff names `d9fcf1b` / `eb75456`.

## Verification note

GitHub writes were performed directly on `codex/aix-next-v2`. No GitHub Actions workflow was triggered as part of this continuation. A local `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build` was not run from this chat environment because the runtime could not resolve github.com for a local clone. Run those commands from `/Users/satoushinya/project/AIX-next` before treating the current head as release-verified.
