---
name: minimal-diff
description: Enforces smallest correct change and rejects premature abstraction. Use when implementing or refactoring code. Skip when user explicitly requests full rewrite or prototype spike.
---

# Minimal Diff

## Principles

- Fix the stated problem only — no drive-by refactors.
- Extend existing functions before creating new modules.
- Three similar lines beat a premature helper.
- Delete dead code only when directly related to the task.

## Before each edit

Ask: "Can I solve this in fewer lines or fewer files?"

## Red flags (stop and simplify)

- New abstraction used once
- Wrapper around single call site
- Config for two options
- Generic utility without second consumer

## Output

State file count and line delta estimate before large edits.
