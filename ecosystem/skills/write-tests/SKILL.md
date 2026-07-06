---
name: write-tests
description: Pragmatic test-first workflow for critical behavior and bug fixes. Use when adding logic, fixing regressions, or SPARC-lite ACs need verification. Skip for docs-only, config-only, or prototype spikes user will discard.
---

# Write Tests

## When test-first

- Bug fix with reproduction case
- New public API or behavior change
- SPARC-lite acceptance criteria
- Security-sensitive logic

## When test-after

- Typo, copy, styling
- User says speed over coverage for spike

## Workflow

1. Identify behavior to lock in (one sentence).
2. Write failing test or reproduction step.
3. Implement minimal fix.
4. Confirm test passes; avoid testing implementation details.

## Output

List tests added/updated and which AC or bug they cover.
