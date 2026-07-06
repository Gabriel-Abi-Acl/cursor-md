---
name: validate-changes
description: Post-implementation validation with lints, tests, and diff review checklist. Use after Write or Edit before marking task complete. Skip when only Read or Grep was used with no file changes.
---

# Validate Changes

## Checklist

- [ ] Linter on changed files (if project has linter)
- [ ] Tests for changed modules
- [ ] Diff review: scope matches gate/spec
- [ ] No secrets, debug logs, or commented-out code left
- [ ] No unrelated file changes

## Commands

Discover from project: `package.json`, `Makefile`, `pyproject.toml`, etc.
Run the smallest relevant test/lint command — not full suite unless needed.

## Output

```
Validation: pass|fail
Lint: ...
Tests: ...
Diff scope: ok|too-large
Blockers: ...
```

Spawn validator subagent or shell subagent for heavy test runs if needed.
