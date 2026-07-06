# Diretrizes de Aprendizado

## Memory Ladder

| Degrau | Onde | Escopo |
|--------|------|--------|
| 0 | Rules + código do repo | Trivial |
| 1 | `~/.cursor/LEARNINGS.md` | Cross-project (global) |
| 2 | `docs/adr/`, `.cursor/rules/` no projeto | Project-specific |
| 3 | `~/.cursor/learnings-index.json` + sqlite | Busca por keywords |

## Antes da tarefa (memory-before)

```bash
node ~/.cursor/scripts/search-learnings.mjs --query "palavras-chave"
```

Leia matches relevantes + ADRs do projeto aberto.

## Depois do sucesso (memory-after)

Use skill `capture-learning` — máximo **1 entrada por sessão**.

### Verdict checklist

- [ ] Testes passaram ou usuário confirmou
- [ ] Generaliza cross-project (não é path específico)
- [ ] Evidência documentada
- [ ] Confidence: high | medium

### Formato

```
- [YYYY-MM-DD] pattern: ... | context: ... | evidence: ... | confidence: high
```

Sync:

```bash
node ~/.cursor/scripts/search-learnings.mjs --sync
```

## O que armazenar

- Padrões reutilizáveis entre projetos
- Anti-patterns genéricos com evidência
- Preferências de ferramenta validadas

## O que NÃO armazenar

- Paths/nomes específicos de projeto
- Workarounds temporários
- Conclusões não validadas
- Secrets, credenciais, PII
- Regras que contradizem defaults sensatos do agente

## Manutenção

```bash
node ~/.cursor/scripts/prune-learnings.mjs --dry-run
node ~/.cursor/scripts/prune-learnings.mjs --apply
```

Máximo 80 entradas ativas; dedup automático.
