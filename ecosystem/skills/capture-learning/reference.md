# Capture Learning Examples

## Good

```
- [2026-07-02] pattern: Extend adapter interface instead of wrapper class | context: adding 3rd provider to existing adapter | evidence: tests auth/providers.test.ts pass, -120 LOC vs wrapper | confidence: high
```

## Bad (reject)

```
- [2026-07-02] pattern: Always edit src/foo/bar.ts first
→ project-specific path
```

```
- [2026-07-02] pattern: Use library X for everything
→ no evidence, over-general
```
