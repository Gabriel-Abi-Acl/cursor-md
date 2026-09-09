---
name: auto-skill-mint
description: Creates gen-* Agent Skills from proven reusable workflows after task success. Use after successful delivery when a repeatable procedure should become a skill. Skip for one-off fixes, project-specific paths, or when an existing skill already covers the workflow.
---

# Auto Skill Mint

Replaces prose LEARNINGS. Memory of process becomes a discoverable **skill**, not a markdown diary.

## Budget

Max **25** skills with `name` starting with `gen-` (or `x-origin: auto-mint`) under `ecosystem/skills/generated/` and installed as `~/.cursor/skills/gen-<name>/`.

## Mint gate (all must pass, or user explicitly asks to mint)

| # | Criterion | Pass if |
|---|-----------|---------|
| 1 | Recurrence | Workflow will repeat (2+ sessions) or user asked to generalize |
| 2 | Transferable | Not tied to one repo path or one package.json |
| 3 | Uncovered | No existing skill has the same WHEN |
| 4 | Stable | Validate passed or user confirmed success |
| 5 | ROI | Saves future tokens (checklist / tool order), not generic advice |
| 6 | Budget | Count of gen-* skills < 25 |

If any fails → **do not mint** (optional: note why briefly).

## After success evaluation

```
Auto-Skill Mint: PASS | SKIP
Reasons: ...
Proposed name: gen-<kebab>
```

## Write location

```
ecosystem/skills/generated/<kebab-name>/SKILL.md
```

On install, directories copy to `~/.cursor/skills/gen-<kebab-name>/`. Name field must start with `gen-`.

## Frontmatter contract

```yaml
---
name: gen-example-workflow
description: Third person WHAT. Use when ... Skip when ...
x-origin: auto-mint
x-created: YYYY-MM-DD
x-last-used: YYYY-MM-DD
x-use-count: 0
x-triggers: [keyword1, keyword2]
---
```

## Body rules

- Under 150 lines preferred; under 500 hard limit
- Steps/checklist only — no essay, no project paths
- Same progressive disclosure as skill-builder

## On invoke of gen-* skill

Best-effort: bump `x-use-count` and set `x-last-used` to today when applying a generated skill.

## Anti-patterns

- Minting "prefer clean code" style lessons
- Duplicating pre-code-gate / minimal-diff
- Creating without running mint gate

See [docs/auto-skills.md](../../../docs/auto-skills.md) for audit workflow.
