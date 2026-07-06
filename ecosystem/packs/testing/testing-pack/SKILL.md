---
name: testing-pack
description: Extended TDD workflow and ci-investigator routing for failed CI. Use when CI fails, test coverage is required by spec, or complex test setup is needed. Skip for docs-only changes.
---

# Testing Pack

## Extended TDD workflow

1. Map SPARC-lite ACs to test cases before implementation.
2. Red → green → refactor for each AC.
3. Prefer integration test over mock-heavy unit when behavior is user-facing.

## CI failure routing

When user reports CI failure:

```
Task(subagent_type: "ci-investigator", prompt: "Investigate failed check: {name}. Root cause and minimal fix.")
```

## Test discovery

Check: `package.json` scripts, `Makefile`, `.github/workflows/`, `pytest.ini`, `vitest.config.*`

## Output

```
AC → test mapping: ...
CI root cause: ...
Fix: ...
```
