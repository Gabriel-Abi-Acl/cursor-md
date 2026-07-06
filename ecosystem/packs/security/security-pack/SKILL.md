---
name: security-pack
description: Routes security-sensitive work to security-review subagent and applies OWASP-light checklist. Use when reviewing auth, crypto, user input handling, or dependency changes. Skip for docs-only and non-security refactors.
---

# Security Pack

## Triggers

- Auth, session, permission changes
- User input → SQL/shell/HTML rendering
- New dependencies or version bumps
- Secrets, env, credential handling

## Actions

1. Run code-review checklist with security focus.
2. Spawn `Task(subagent_type: "security-review")` for diffs >50 lines in sensitive areas.
3. Verify: no secrets in diff, input validated at boundaries, least privilege.

## OWASP-light checklist

- [ ] Injection (SQL, command, XSS)
- [ ] Broken auth / session handling
- [ ] Sensitive data exposure
- [ ] Insecure dependencies (if changed)
- [ ] SSRF / path traversal on user URLs/paths

## Deny patterns (advisory)

Do not commit: `.env`, `*.pem`, private keys, API tokens in source.
