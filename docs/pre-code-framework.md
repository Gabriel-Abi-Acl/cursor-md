# Framework Pré-Código

O ecossistema cursor-md usa **3 níveis** de gate antes de escrever código.

## Nível 0 — SKIP

**Quando:** typo, comentário, usuário diz "just do it", plano já aprovado, fix de uma linha.

**Ação:** codar direto, sem checklist.

## Nível 1 — Gate médio (skill `pre-code-gate`)

**Quando:** bug não-trivial, feature pequena/média, refactor local.

**10 perguntas** (internas, não interativas salvo BLOCK):

1. Esse código precisa existir?
2. Já existe código que resolve isso?
3. Existe biblioteca que resolve?
4. Qual o menor diff correto?
5. Existe teste que prova a necessidade?
6. Viola convenções ou ADRs do projeto?
7. Configuração substitui código?
8. O que acontece se não fizermos nada?
9. É reversível com baixo custo?
10. Preciso de subagent ou resolvo inline?

**Output obrigatório (~15 linhas):**

```
Pre-Code Gate: PASS | SKIP | BLOCK
Reason: ...
Reuse candidate: [file:line or none]
Approach: ...
Subagent needed: yes/no
```

## Nível 2 — SPARC-lite (skill `sparc-lite`)

**Quando:** feature nova grande, refactor amplo, mudança arquitetural.

**Entrega:**

- ≥3 acceptance criteria (Given/When/Then)
- ≥3 edge cases
- Constraints explícitos
- Arquivo `docs/spec-{feature}.md` no **projeto alvo**
- Depois: gate Nível 1 + implementação

## Fluxo resumido

```
Tarefa → classificar nível → (spec se L2) → gate → explore → codar → validate
```

## Exemplos

| Pedido | Nível |
|--------|-------|
| "Corrige typo no README" | 0 SKIP |
| "Validação de email no signup" | 1 PASS |
| "Reescrever módulo de autenticação" | 2 SPARC-lite |
