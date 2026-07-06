# Arquitetura do Ecossistema cursor-md

## Visão geral

Ecossistema de Skills, Rules, SubAgents e aprendizado para Cursor — instalado globalmente em `~/.cursor/`. Inspirado em padrões do [Ruflo](https://github.com/ruvnet/ruflo), sem replicar escala (350 skills, MCP AgentDB).

## Componentes

| Componente | Local | Função |
|----------|-------|--------|
| Rules | `~/.cursor/rules/*.mdc` | Constituição always-on |
| Skills | `~/.cursor/skills/*/SKILL.md` | Workflows especializados |
| Packs | security-pack, testing-pack | Domínios security/testing |
| Agents | `~/.cursor/agents/*.md` | Templates de prompt Task |
| LEARNINGS | `~/.cursor/LEARNINGS.md` | Memória curada cross-project |
| Scripts | `~/.cursor/scripts/*.mjs` | search, prune, validate, cost-log |
| Hooks | `~/.cursor/hooks.json` | Lembretes fail-open |

## MCP On-Demand

- Workflows default: ferramentas nativas (Read, Grep, Edit, Task, Shell)
- MCP configurado pelo usuário no Cursor: **permitido quando pedido explicitamente no prompt**
- Ecossistema **não depende** de MCP nem instala claude-flow/AgentDB

## Subagents ≠ MCP

Subagents (`Task`) são nativos do Cursor. Custo principal = tokens do modelo, não taxa de MCP.

## Comparação com Ruflo

| Ruflo | cursor-md |
|-------|-----------|
| 350+ skills | 11 core + 2 packs |
| AgentDB MCP | LEARNINGS.md + index local |
| SPARC 5 fases | Gate 3 níveis + SPARC-lite |
| 37 plugins | Monorepo único |
| Task depth 4-5 | Depth 2 (3 excepcional) |

## Cherry-pick do Ruflo

- Progressive disclosure
- WHAT + WHEN + SKIP WHEN
- Orchestrator vs leaf
- validate-plugin → validate-ecosystem.mjs
- memory-before / memory-after
- Verdict checklist

## Excluído

AgentDB MCP, ReasoningBank MCP, swarm, witness Ed25519.

## Fluxo operacional

```
Prompt → Gate (0/1/2) → Explore → Implement → Validate → Capture-learning
```

## Custo

- Sem taxa por MCP
- Controle via gates, skip conditions, subagents sob demanda
- `cost-log.mjs` registra spawns e gate levels localmente
