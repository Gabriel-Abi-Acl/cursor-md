---
name: pre-code-gate
description: Runs 10 internal pre-code questions before Write/Edit on medium tasks. Use when implementing features, fixing non-trivial bugs, or refactoring. Skip when fixing typos, comments only, user says just do it, or plan mode already approved.
---

# Pre-Code Gate (Level 1)

Run internally before coding on medium-complexity tasks.

## Skip when

- Typo or single-line fix
- Comment-only change
- User explicitly says "just do it"
- Plan mode output already approved
- Pure documentation with no logic change

## 10 questions

Answer each briefly before coding:

1. Does this code need to exist?
2. Does existing code already solve this?
3. Does a library solve this?
4. What is the smallest correct diff?
5. Is there a test proving the need?
6. Does this violate project conventions or ADRs?
7. Can configuration replace code?
8. What happens if we do nothing?
9. Is this reversible at low cost?
10. Do I need a subagent or can I solve inline?

## Required output (before Write/Edit)

```
Pre-Code Gate: PASS | SKIP | BLOCK
Reason: ...
Reuse candidate: [file:line or none]
Approach: [minimal description]
Subagent needed: yes/no
```

If BLOCK, stop and ask the user. If PASS, proceed with documented approach only.

See [reference.md](reference.md) for examples.
