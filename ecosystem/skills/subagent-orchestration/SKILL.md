---
name: subagent-orchestration
description: Routes tasks to native Cursor subagents with depth limits and summary contracts. Use for multi-domain tasks, wide codebase search, or heavy test runs. Skip for single-file edits and trivial fixes.
---

# Subagent Orchestration

Use native `Task` sparingly. Parent stays on **Auto**. Prefer inline tools.

## Routing

| subagent_type | Use when |
|---------------|----------|
| explore | Readonly discovery, architecture survey |
| generalPurpose | Multi-step implementation with writes |
| shell | git, npm, builds |
| bugbot | User requests PR/code review |
| security-review | Sensitive auth/crypto/input diffs |
| ci-investigator | CI failed |

## Depth

- **Depth 2 default** — child does not spawn children.
- Flat fan-out preferred over nesting.
- Spawn only if pre-code gate question 10 is yes.

## Child prompt

Include scope, constraints, and expected ~200-token summary.

## Anti-patterns

- Subagent for typo or single-file fix
- Nesting for cleanliness
- Returning full transcripts

Optional log: `node ~/.cursor/scripts/cost-log.mjs --event gate --level 1`
