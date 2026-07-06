---
name: sparc-lite
description: Creates mini-spec with acceptance criteria and edge cases for large features before coding. Use when starting new features, large refactors, or multi-file architectural changes. Skip for bugs, typos, and tasks covered by Level 1 gate only.
---

# SPARC-Lite (Level 2)

Structured specification before implementation on large work.

## When to use

- New feature touching 3+ files
- Large refactor or migration
- Architectural change
- User request is ambiguous or high-risk

## Steps

1. Search codebase and LEARNINGS for similar work.
2. Produce mini-spec with:
   - **Functional requirements** (bullets)
   - **≥3 acceptance criteria** (Given/When/Then)
   - **≥3 edge cases**
   - **Constraints** (performance, security, compatibility)
   - **Integration points**
3. Write spec to `docs/spec-{feature-slug}.md` in the **target project** (not global).
4. Run Level 1 pre-code-gate against the spec.
5. Present spec summary to user; proceed only after alignment.

## Spec template

```markdown
# Specification: {Feature}

## Requirements
- FR-1: ...

## Acceptance Criteria
- AC-1: Given ... When ... Then ...
- AC-2: Given ... When ... Then ...
- AC-3: Given ... When ... Then ...

## Edge Cases
- EC-1: ...
- EC-2: ...
- EC-3: ...

## Constraints
- ...

## Integration Points
- ...
```

See [reference.md](reference.md) for a filled example.
