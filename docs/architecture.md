# Arquitetura — cursor-md

## Objetivo

Rules + Skills (e Task nativo só quando precisa) para **melhor código no Cursor**:

- Verificação **antes** de escrever (pre-code-gate / sparc-lite)
- Código **enxuto** (minimal-diff) e **validado** (validate-changes)
- Otimização **só com evidência** (optimize-code)
- Aprendizado = **skills `gen-*`**, não arquivo LEARNINGS

**Fora de escopo:** model lanes (Luna/Terra/Sol), AgentDB/MCP memory, swarm.

Parent permanece em **Auto**.

## Componentes

| Peça | Função |
|------|--------|
| Rules (4) | always-on: principles, gate, tokens, MCP on-demand |
| Core skills | fluxo de código |
| Packs | security-pack, testing-pack |
| gen-* | skills auto-mintadas |
| AGENTS.md | Task types leves |
| Scripts | validate-ecosystem, audit-skills, cost-log (gates) |
| Hooks | sessionStart lembrete pre-code-gate |

## Fluxo

```
Prompt → Rules → Gate (0/1/2) → Explore → Minimal implement → Validate
       → auto-skill-mint? → gen-* skill
```

## Skills core (resumo)

| Skill | Papel |
|-------|--------|
| pre-code-gate | 10 perguntas antes de codar |
| sparc-lite | mini-spec features grandes |
| explore-before-code | Grep/Glob/Read primeiro |
| minimal-diff | menor mudança correta |
| write-tests | TDD pragmático |
| validate-changes | lint/test pós-edit |
| optimize-code | profile-first |
| code-review | checklist review |
| subagent-orchestration | quando usar Task |
| auto-skill-mint | cria gen-* após sucesso |
| audit-generated-skills | audit/cleanup (você chama) |
| skill-builder | contrato de skills |

## MCP on-demand

Nativo por default; MCP só se o usuário pedir.

## Instalar

`.\install.ps1` → `~/.cursor/`. Reinicie o Cursor.
