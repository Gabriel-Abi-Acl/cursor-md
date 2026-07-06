# Pre-Code Gate Examples

## SKIP example

User: "Fix typo in README line 5"
→ Gate: SKIP — single-line, no logic.

## PASS example

User: "Add email validation to signup form"
→ Reuse candidate: `src/utils/validate.ts:12` (existing phone validator pattern)
→ Approach: extend validate.ts, add 3 lines to signup schema, one test.

## BLOCK example

User: "Rewrite entire auth system"
→ BLOCK — needs SPARC-lite (Level 2) before any code.
