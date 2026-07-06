---
name: optimize-code
description: Profile-first performance optimization without premature tuning. Use when user reports slowness, bundle size issues, or explicit performance requirements. Skip during initial implementation unless perf is in SPARC-lite constraints.
---

# Optimize Code

## Rules

1. **Measure first** — profile, benchmark, or cite user-reported metric.
2. **One bottleneck at a time** — verify improvement after each change.
3. **Preserve correctness** — tests must pass before/after.
4. **Document trade-off** — memory vs CPU, complexity vs speed.

## Anti-patterns

- Caching without measured miss cost
- Micro-optimizing cold paths
- Adding memoization to cheap pure functions

## Output

```
Baseline: [metric]
Change: ...
After: [metric]
Verdict: improved|no-change|revert
```
