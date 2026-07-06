---
name: code-review
description: Reviews code for correctness, security, and maintainability using structured checklist. Use for pull request review, self-review before commit, or when user asks for code review. Skip for trivial one-line changes.
---

# Code Review

## Checklist

- **Correctness:** logic, edge cases, error handling
- **Security:** injection, auth, secrets, unsafe defaults
- **Maintainability:** naming, size, coupling
- **Tests:** coverage of changed behavior
- **Scope:** diff matches stated intent

## Severity labels

- **Critical:** must fix before merge
- **Suggestion:** consider improving
- **Nice:** optional

## Output format

Use severity labels. Reference file:line for each finding.

For PR reviews, consider bugbot subagent when user requests deep review.
