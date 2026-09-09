# cursor-md — Skills de código para Cursor

Pacote global de **Rules**, **Skills** e orquestração leve de **Task** (nativo). Foco: melhor código (gate pré-escrita, diff mínimo, validação). Parent em **Auto**.

**Não inclui** model lanes nem LEARNINGS — aprendizado via skills `gen-*`.

## Inclui

- **4 rules** always-on
- **12 skills core** + **2 packs** + pasta `generated/` para gen-*
- Gate pré-código (3 níveis)
- **auto-skill-mint** + **audit-generated-skills**
- Hooks fail-open + scripts validate / audit / cost-log

## Instalação

```powershell
cd cursor-md
.\install.ps1
# Reinstalar tudo: .\install.ps1 -Force
```

```bash
./install.sh
# ./install.sh --force
```

Reinicie o Cursor. O install remove órfãos antigos (`model-routing.mdc`, skill `capture-learning`).

## Uso diário

1. Descreva a tarefa — rules disparam o gate em trabalho não-trivial.
2. Force fluxos: *"use pre-code-gate"*, *"use sparc-lite"*, *"minimal-diff"*.
3. Após sucesso reutilizável: o agent deve avaliar **auto-skill-mint** (ou peça *"mint skill se pass criteria"*).
4. Periodicamente: *"audit generated skills"* ou:
   ```bash
   node ~/.cursor/scripts/audit-skills.mjs
   ```

### MCP

Só quando você pedir explicitamente (ex.: Lovable).

## Skills (explicação rápida)

| Skill | O que faz |
|-------|-----------|
| `pre-code-gate` | 10 perguntas; PASS/SKIP/BLOCK antes de Write |
| `sparc-lite` | Mini-spec + ACs para features grandes |
| `explore-before-code` | Explora repo antes de codar |
| `minimal-diff` | Menor mudança correta |
| `write-tests` | Testes para comportamento crítico |
| `validate-changes` | Lints/tests/checklist pós-edit |
| `optimize-code` | Otimiza só com métrica |
| `code-review` | Review estruturado |
| `subagent-orchestration` | Quando spawnar Task |
| `auto-skill-mint` | Cria `gen-*` se critérios OK |
| `audit-generated-skills` | Lista/remove gen-* (você chama) |
| `skill-builder` | Formato de SKILL.md |
| `security-pack` | OWASP light + security-review |
| `testing-pack` | TDD/CI investigator |

## Validação

```bash
node scripts/validate-ecosystem.mjs --root .
```

## Checklist pós-install

1. [ ] `~\.cursor\skills\` tem skills core (sem capture-learning)
2. [ ] `~\.cursor\rules\` tem 4 `.mdc` (sem model-routing)
3. [ ] validate-ecosystem pass
4. [ ] Tarefa trivial → gate SKIP
5. [ ] Bug médio → gate PASS
6. [ ] *"audit generated skills"* corre (0 gens no início OK)

## Docs

- [Arquitetura](docs/architecture.md)
- [Pré-código](docs/pre-code-framework.md)
- [Auto-skills](docs/auto-skills.md)
- [ADR skill contract](docs/adr/0001-skill-contract.md)

## Troubleshooting

**Skill antiga capture-learning / model-routing:** rode `.\install.ps1` de novo (remove órfãos).

**Demais gen-* demais:** `audit-generated-skills` ou `node scripts/audit-skills.mjs`.

**LEARNINGS.md ainda em ~/.cursor:** o projeto não usa mais; pode apagar manualmente.

## Licença

MIT (ajuste se necessário)
