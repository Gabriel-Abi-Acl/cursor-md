# Cursor Ecosystem — Agent Constitution

> Rules and skills for better code in Cursor. Subagents use native `Task` only when needed — prefer inline work. Parent stays on Auto.

## Native Task types (optional)

| Use when | subagent_type |
|----------|----------------|
| Wide readonly discovery | `explore` |
| Multi-step implementation | `generalPurpose` |
| git, npm, builds | `shell` |
| User-requested PR review | `bugbot` |
| Sensitive security diff | `security-review` |
| Failed CI check | `ci-investigator` |

## Depth limits

- **Default depth 2:** parent spawns child; child does not spawn.
- Prefer flat fan-out over nesting.
- Skip Task for single-file and trivial edits.

## Child summary (~200 tokens)

```
Status: done|blocked
Findings: ...
Recommendation: ...
Files: [...]
```

## Coding flow

1. Pre-code gate (or SPARC-lite for large work)
2. Explore if paths unknown
3. Implement minimal diff
4. Validate changes
5. If a reusable workflow emerged: auto-skill-mint criteria → optional `gen-*` skill

## MCP

Native tools by default. MCP only when the user asks explicitly.

## Agent templates

`~/.cursor/agents/` — prompt templates for Task when spawning.
