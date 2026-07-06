---
name: capture-learning
description: Appends curated cross-project learnings to LEARNINGS.md with verdict checklist and sqlite sync. Use after proven success when a reusable pattern emerged. Skip for project-specific decisions, unvalidated guesses, or temp workarounds.
---

# Capture Learning

Max **1 entry per session**. Project-specific items go to project ADRs, not LEARNINGS.

## Verdict checklist (all required)

- [ ] Tests passed or user confirmed success
- [ ] Pattern generalizes across projects (not path-specific)
- [ ] Evidence documented (PR, test names, outcome)
- [ ] Confidence: high | medium (medium needs extra evidence)
- [ ] Does not contradict sensible defaults

**Reject if:** project paths, secrets, unvalidated conclusion, one-off workaround.

## Steps

1. Classify: Pattern | Anti-pattern | Tool preference
2. Draft entry:
   ```
   - [YYYY-MM-DD] pattern: ... | context: ... | evidence: ... | confidence: high
   ```
3. Append to `~/.cursor/LEARNINGS.md` under correct section.
4. Sync index:
   ```bash
   node ~/.cursor/scripts/search-learnings.mjs --sync
   ```

## After append

Run prune if >80 entries: `node ~/.cursor/scripts/prune-learnings.mjs --dry-run`

See [reference.md](reference.md) for good vs bad entries.
