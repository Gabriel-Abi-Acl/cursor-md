---
name: skill-builder
description: Creates new Cursor Agent Skills following official SKILL.md structure and ecosystem contract. Use when authoring a new skill or extending the cursor-md ecosystem. Skip when a rule or comment suffices.
---

# Skill Builder

## Structure

```
skill-name/
├── SKILL.md       # Required, <500 lines
├── reference.md   # Optional deep docs
└── scripts/       # Optional utilities
```

## Frontmatter (required)

```yaml
---
name: kebab-case-name
description: Third person WHAT + WHEN + SKIP WHEN. Max 1024 chars.
---
```

## Description rules

- Third person ("Processes...", not "I can...")
- Include trigger terms for discovery
- Include skip conditions

## Ecosystem constraints

- No MCP tool references in core skills
- Progressive disclosure: keep SKILL.md concise
- Validate: `node scripts/validate-ecosystem.mjs --root .`

## Workflow

1. Gather purpose, triggers, constraints
2. Draft name + description
3. Write SKILL.md body with steps/checklist
4. Add reference.md if >100 lines of detail needed
5. Run validate-ecosystem.mjs

See ecosystem contract: `docs/adr/0001-skill-contract.md`
