---
name: audit-generated-skills
description: Inventories auto-minted gen-* skills, classifies active stale and duplicate entries, and removes unused ones after confirmation. Use when the user asks to audit generated skills, clean up skills, or review efficiency of auto-created skills. Skip for core skill review only.
---

# Audit Generated Skills

User-facing governance for auto-minted skills.

## Trigger examples

- "Audit generated skills"
- "Remove unused gen skills"
- "What gen-* skills do I have?"

## Steps

1. Run inventory:
   ```bash
   node ~/.cursor/scripts/audit-skills.mjs
   # or from repo: node scripts/audit-skills.mjs --root .
   ```
2. Also scan `~/.cursor/skills/` for folders matching `gen-*` or frontmatter `x-origin: auto-mint`.
3. Classify each:
   - **active** — `x-use-count` > 0 and `x-last-used` within 90 days
   - **stale** — never used, or last-used > 90 days
   - **duplicate** — description overlaps a core skill WHEN/Use when
4. Present a table: name | use-count | last-used | class | recommendation
5. Propose removals/merges. **Delete only** when:
   - User confirms, or
   - User said "remove stale" / "delete unused"
6. Delete skill directories (repo `ecosystem/skills/generated/` and matching `~/.cursor/skills/gen-*`)
7. Recount; ensure total gen-* ≤ 25

## Output format

```
Audit Generated Skills
Total gen-*: N / 25
Active: ...
Stale: ...
Duplicate: ...
Removed: ...
Kept: ...
```

## Do not

- Delete core skills (pre-code-gate, minimal-diff, etc.)
- Delete without classification
- Mint new skills during audit (use auto-skill-mint separately)
