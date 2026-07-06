# ADR 0001 — Skill Contract

## Status

Accepted

## Context

The cursor-md ecosystem needs structural consistency for skills, inspired by Ruflo `validate-plugin` but adapted for Cursor.

## Contract

Every skill directory MUST contain:

```
skill-name/
└── SKILL.md    # Required, <500 lines
```

Optional: `reference.md`, `scripts/`

### Frontmatter (required)

```yaml
---
name: kebab-case-name          # lowercase, hyphens, max 64 chars
description: Third-person WHAT + WHEN + SKIP WHEN (max 1024 chars)
---
```

### Core skill constraints

- No `mcp__` tool references in `ecosystem/skills/**`
- Description must include trigger conditions ("Use when...")
- Body uses progressive disclosure — details in reference.md

### Pack skills

- Live under `ecosystem/packs/{domain}/{skill-name}/`
- Installed to `~/.cursor/skills/` alongside core skills
- May reference subagent routing but not MCP tools

## Validation

```bash
node scripts/validate-ecosystem.mjs --root .
```

## Consequences

- Automated CI can reject malformed skills
- Agent discovery improves with consistent descriptions
- Zero MCP dependency in default workflows preserved
