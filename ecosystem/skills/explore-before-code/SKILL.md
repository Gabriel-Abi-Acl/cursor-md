---
name: explore-before-code
description: Systematic codebase exploration with Grep, Glob, and Read before implementation. Use when starting unfamiliar tasks, debugging unknown areas, or before pre-code gate on medium tasks. Skip when file path and fix are already known.
---

# Explore Before Code

## Workflow

```
Task Progress:
- [ ] Grep keywords from task
- [ ] Glob likely file patterns
- [ ] Read top 3-5 relevant files
- [ ] Summarize findings before coding
```

## Rules

- Do not guess paths — search first.
- Batch Grep/Glob/Read in parallel when independent.
- Note reuse candidates with file:line for pre-code gate.
- For large codebases, use explore subagent (readonly) if context is wide.

## Output

```
Findings:
- Entry point: path:line
- Related: ...
- Reuse candidate: ... or none
- Open questions: ...
```
