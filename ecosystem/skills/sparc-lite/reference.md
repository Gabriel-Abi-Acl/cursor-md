# SPARC-Lite Example (excerpt)

## Acceptance Criteria

- AC-1: Given unauthenticated user, when accessing /dashboard, then redirect to /login.
- AC-2: Given valid session, when accessing /dashboard, then render user stats within 200ms p95.
- AC-3: Given expired session, when accessing /dashboard, then clear cookie and redirect to /login.

## Edge Cases

- EC-1: Concurrent tab logout invalidates session in other tabs.
- EC-2: Malformed session token returns 401 without stack trace leak.
- EC-3: Database unavailable shows cached read-only dashboard or graceful error.
