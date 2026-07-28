---
name: subagent-orchestration
description: Routes tasks to native Cursor subagents with depth limits, model lanes, and summary contracts. Use for multi-domain tasks, wide codebase search, or heavy test runs. Skip for single-file edits and trivial fixes.
---

# Subagent Orchestration

Subagents use native `Task` tool — **not MCP**. Parent stays on **Auto**; pass `model:` only per `model-routing.mdc`.

## Routing (subagent_type)

| subagent_type | Use when |
|---------------|----------|
| explore | Readonly discovery, "where is X", architecture survey |
| generalPurpose | Multi-step implementation with writes |
| shell | git, npm, builds, CI commands |
| bugbot | User requests PR/code review |
| security-review | Sensitive diff, security-pack triggers |
| ci-investigator | CI failed (testing-pack) |

## Model lanes (`model:` on Task)

| Trigger | model slug |
|---------|------------|
| Micro scoped / repetitive | `gpt-5.6-luna-medium` |
| Level 1 / medium plan / partial hypothesis | `gpt-5.6-terra-high` |
| Hard framed (clear constraints + dominant hypothesis + clear done) | `gpt-5.6-sol-high` |
| Hard open (multi-hypothesis / costly miss) | `gpt-5.6-sol-xhigh` |
| Auth/crypto/secrets / high ambiguity / max quality | `claude-opus-5-thinking-high` |
| Level 0 / cheap explore / post-plan exec | _(omit model — Auto)_ |

**Forbidden:** `gpt-5.6-terra-medium`, `gpt-5.6-sol-medium`. Never silently downgrade. One premium per phase; never Sol+Opus in parallel.

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
- Premium `model:` without a lane trigger

Log spawns optionally: `node ~/.cursor/scripts/cost-log.mjs --event subagent --type explore --model gpt-5.6-terra-high`
