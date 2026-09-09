---
name: skill-builder
description: Creates new Cursor Agent Skills following official SKILL.md structure and ecosystem contract. Use when authoring a new skill or extending the cursor-md ecosystem. Skip when a rule or comment suffices.
---

# Skill Builder

## Structure

```
skill-name/
├── SKILL.md       # Required, <500 lines
├── reference.md   # Optional
└── scripts/       # Optional
```

## Frontmatter (required)

```yaml
---
name: kebab-case-name
description: Third person WHAT + WHEN + SKIP WHEN. Max 1024 chars.
---
```

## Auto-minted skills (gen-*)

```yaml
---
name: gen-example-workflow
description: ... Use when ... Skip when ...
x-origin: auto-mint
x-created: YYYY-MM-DD
x-last-used: YYYY-MM-DD
x-use-count: 0
x-triggers: [keywords]
---
```

- Live under `ecosystem/skills/generated/<kebab>/`
- Install as `~/.cursor/skills/gen-<kebab>/`
- Created only via auto-skill-mint criteria
- Max 25 gen-* total

## Description rules

- Third person; include Use when / Skip when
- No `mcp__` tool references in core skills

## Workflow

1. Purpose, triggers, constraints
2. Draft name + description
3. Write SKILL.md
4. `node scripts/validate-ecosystem.mjs --root .`

See `docs/adr/0001-skill-contract.md` and `docs/auto-skills.md`.
