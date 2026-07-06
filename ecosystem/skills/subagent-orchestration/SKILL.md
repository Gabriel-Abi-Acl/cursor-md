---
name: subagent-orchestration
description: Routes tasks to native Cursor subagents with depth limits and summary contracts. Use for multi-domain tasks, wide codebase search, or heavy test runs. Skip for single-file edits and trivial fixes.
---

# Subagent Orchestration

Subagents use native `Task` tool — **not MCP**.

## Routing

| subagent_type | Use when |
|---------------|----------|
| explore | Readonly discovery, "where is X", architecture survey |
| generalPurpose | Multi-step implementation with writes |
| shell | git, npm, builds, CI commands |
| bugbot | User requests PR/code review |
| security-review | Sensitive diff, security-pack triggers |
| ci-investigator | CI failed (testing-pack) |

## Depth

- **Default depth 2:** parent → child. Child does NOT spawn children.
- **Exception depth 3:** SPARC-lite approved + explicit multi-domain task only.
- Prefer parallel `explore` in one message over nesting.

## Child prompt template

Include from `~/.cursor/agents/{role}.md`:
- Task scope and constraints
- Expected output format (~200 tokens)
- Files already identified

## Anti-patterns

- Subagent for typo fix
- Nesting "for cleanliness"
- Returning full transcripts from children
- Spawning when inline Grep/Read suffices

Log spawns optionally: `node ~/.cursor/scripts/cost-log.mjs --event subagent --type explore`
