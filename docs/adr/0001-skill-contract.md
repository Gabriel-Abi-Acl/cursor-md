# ADR 0001 — Skill Contract

## Status

Accepted (updated: gen-* auto-mint)

## Context

Structural consistency for Cursor skills. No MCP dependency. No LEARNINGS prose memory.

## Contract

Every skill directory:

```
skill-name/
└── SKILL.md    # Required, <500 lines
```

### Frontmatter

```yaml
---
name: kebab-case-name
description: Third-person WHAT + WHEN + SKIP WHEN
---
```

### Generated skills

```yaml
---
name: gen-example
description: ...
x-origin: auto-mint
x-created: YYYY-MM-DD
x-last-used: YYYY-MM-DD
x-use-count: 0
---
```

- Path: `ecosystem/skills/generated/<kebab>/`
- Install: `~/.cursor/skills/gen-<kebab>/`
- Budget: max 25 gen-*

### Core constraints

- No `mcp__` in core skills
- Description includes Use when / Skip when
- No model-routing constitution in this repo

## Validation

```bash
node scripts/validate-ecosystem.mjs --root .
node scripts/audit-skills.mjs --root .
```
