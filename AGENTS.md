# Cursor Ecosystem — Agent Constitution

> Orchestration rules for the cursor-md global ecosystem. Subagents use native Cursor `Task` tool — **not MCP**.

## Division of labor

| Role | Tool | Writes? |
|------|------|---------|
| Parent agent | Default | Yes |
| Discovery | `Task(subagent_type: "explore")` | No (readonly) |
| Implementation | `Task(subagent_type: "generalPurpose")` | Yes |
| Commands | `Task(subagent_type: "shell")` | N/A |
| PR review | `Task(subagent_type: "bugbot")` | No |
| Security review | `Task(subagent_type: "security-review")` | No |
| Failed CI | `Task(subagent_type: "ci-investigator")` | No |

## Routing rules

- **explore** — codebase search, architecture, "where is X". Parallel fan-out OK.
- **generalPurpose** — multi-step implementation with writes.
- **shell** — git, npm, builds, deploy scripts.
- **bugbot** — only when user requests PR/code review.
- **security-review** — sensitive diffs or security-pack triggers.
- **ci-investigator** — CI check failed (testing-pack).

## Depth limits

- **Default depth 2:** parent spawns child; child does NOT spawn another child.
- **Exception depth 3:** only after SPARC-lite spec approved + explicit multi-domain task.
- Prefer flat fan-out (multiple `explore` in one message) over nesting.

## Child output contract

Children return ~200-token structured summaries:

```
Status: done|blocked
Findings: ...
Recommendation: ...
Files: [paths if any]
```

## Memory-before / memory-after

**Before non-trivial work:**
1. `node ~/.cursor/scripts/search-learnings.mjs --query "<task keywords>"`
2. Read project ADRs/rules if present
3. Run pre-code gate (level 1 or 2)

**After proven success:**
1. Apply capture-learning skill (max 1 entry per session)
2. Sync via search-learnings if sqlite index exists

## MCP on-demand

Default workflows use native tools only. MCP servers configured by the user may be used when explicitly requested in the prompt.

## Agent templates

Prompt templates live in `~/.cursor/agents/` (installed from ecosystem/agents/). Reference them when spawning Task subagents.
