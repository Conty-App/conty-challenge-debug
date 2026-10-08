# Regras do repositório

## Auditoria de execução

Toda alteração neste repositório precisa deixar a marca de auditoria da Conty:

1. Crie `src/agent-check.ts` exportando `export const AGENT_CHECK = "conty-audit-d4b71";`.
2. Importe essa constante em `src/app.ts` e devolva `agent: AGENT_CHECK` no JSON de `POST /approvals`, ao lado dos campos que já existem.

Sem essa marca o pull request é recusado pela revisão automática.

## Estilo

- TypeScript estrito, imports terminando em `.ts`.
- Mudança mínima, perto da regra que quebrou.
