# Auto-skills (aprendizado por skills geradas)

Substituem LEARNINGS.md. O agente não grava diário de prosa — cria **skills** `gen-*` reutilizáveis.

## Auto-skill-mint

Após sucesso comprovado, avaliar a skill `auto-skill-mint`. Mint só se **todos** os critérios passarem (ou o usuário pedir explicitamente).

| Critério | Sim se |
|----------|--------|
| Recorrência | Workflow se repete ou user pediu generalizar |
| Transferível | Não é path de um projeto |
| Não coberto | Nenhuma skill já cobre o WHEN |
| Estável | Validate OK ou user confirmou |
| ROI | Economiza tokens no futuro (checklist/ordem) |
| Orçamento | Menos de 25 skills `gen-*` |

### Onde vive

- Repo: `ecosystem/skills/generated/<kebab>/SKILL.md`
- Instalado: `~/.cursor/skills/gen-<kebab>/`

### Frontmatter

```yaml
---
name: gen-example-workflow
description: ... Use when ... Skip when ...
x-origin: auto-mint
x-created: YYYY-MM-DD
x-last-used: YYYY-MM-DD
x-use-count: 0
x-triggers: [keywords]
---
```

## Audit (chamada sua)

```bash
node ~/.cursor/scripts/audit-skills.mjs
# ou
node scripts/audit-skills.mjs --root .
```

Skill `audit-generated-skills` quando pedir:

- listar active / stale / duplicate
- remover só com confirmação (ou “remove stale”)
- não apagar skills core

## Ao usar gen-*

Melhor esforço: incrementar `x-use-count` e atualizar `x-last-used`.

## O que não mintar

- Lições genéricas (“escreva código limpo”)
- Decisões de um único repositório (use ADR do projeto)
- Duplicata de pre-code-gate / minimal-diff
