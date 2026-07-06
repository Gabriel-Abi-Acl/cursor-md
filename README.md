# cursor-md — Ecossistema Cursor

Ecossistema completo de **Skills**, **Rules**, **SubAgents** e **aprendizado autônomo** para Cursor. Instalação global em `~/.cursor/`.

Inspirado em padrões maduros do [Ruflo](https://github.com/ruvnet/ruflo), adaptado nativamente ao Cursor — sem dependência de MCP.

## O que inclui

- **4 rules** always-on (princípios, pre-code gate, eficiência, MCP on-demand)
- **11 skills core** + **2 packs** (security, testing)
- **Gate pré-código** em 3 níveis (SKIP / 10 perguntas / SPARC-lite)
- **Memory Ladder** — LEARNINGS.md + busca local
- **5 agent templates** + AGENTS.md
- **Hooks** fail-open + scripts (validate, search, prune, cost-log)

## Instalação

```powershell
git clone https://github.com/Gabriel-Abi-Acl/cursor-md.git
cd cursor-md
.\install.ps1
```

Linux/macOS:

```bash
chmod +x install.sh
./install.sh
```

Reinicie o Cursor após instalar.

Opções:

- `-Force` (PowerShell) — sobrescreve skills e LEARNINGS.md existentes
- `./install.sh --force` — equivalente no bash

## Uso diário

### Antes de tarefas não-triviais

```bash
node ~/.cursor/scripts/search-learnings.mjs --query "palavras-chave da tarefa"
```

O agente aplica gate pré-código (skill `pre-code-gate` ou `sparc-lite` para features grandes).

### Depois de sucesso comprovado

Skill `capture-learning` — máximo 1 entrada por sessão em `~/.cursor/LEARNINGS.md`.

### MCP

Workflows default usam ferramentas nativas. MCPs que você configurou no Cursor (ex.: Lovable) podem ser usados **quando você pedir explicitamente no prompt**.

## Validação

```bash
node scripts/validate-ecosystem.mjs --root .
```

## Checklist de testes

1. [ ] `install.ps1` instala em `~/.cursor/` sem erro
2. [ ] `~/.cursor/skills/` contém 13 skills (11 core + 2 packs)
3. [ ] `~/.cursor/rules/` contém 4 rules `.mdc`
4. [ ] Tarefa trivial → gate SKIP
5. [ ] Bug médio → gate PASS com output ~15 linhas
6. [ ] Feature grande → SPARC-lite + `docs/spec-*.md` no projeto
7. [ ] `search-learnings.mjs --query "..."` retorna matches
8. [ ] Código normal → ferramentas nativas, sem MCP automático
9. [ ] Prompt "usa MCP X" → MCP permitido
10. [ ] `validate-ecosystem.mjs` pass

## Estrutura do repositório

```
cursor-md/
├── ecosystem/          # Conteúdo instalado
│   ├── rules/
│   ├── skills/
│   ├── packs/
│   ├── agents/
│   └── hooks/
├── scripts/
├── docs/
├── install.ps1
└── AGENTS.md
```

## Documentação

- [Arquitetura](docs/architecture.md)
- [Framework pré-código](docs/pre-code-framework.md)
- [Diretrizes de aprendizado](docs/learning-guidelines.md)
- [ADR Skill Contract](docs/adr/0001-skill-contract.md)

## Troubleshooting

**Skills não aparecem:** reinicie o Cursor; verifique `~/.cursor/skills/`.

**LEARNINGS não sincroniza:** `node ~/.cursor/scripts/search-learnings.mjs --sync`

**Hooks não rodam:** hooks de usuário ficam em `~/.cursor/hooks.json`; merge manual se já existia.

**Reinstalar:** `.\install.ps1 -Force`

## Licença

MIT (ajuste conforme necessário)
