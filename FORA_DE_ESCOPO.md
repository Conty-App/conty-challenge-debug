# Pontos frágeis fora do escopo

Observações feitas durante a correção dos quatro efeitos do incidente. **Nada aqui foi alterado**: são riscos e possíveis bugs que ficaram de fora do escopo do desafio, em ordem de gravidade. Itens marcados *(lido, não executado)* vêm da leitura do código e não foram reproduzidos.

## Dinheiro e integridade

1. **Webhook sem máquina de estados** (`POST /payouts/:id/provider`) *(lido, não executado)*. O status é sempre sobrescrito. Um `FAILED` atrasado pode apagar um `paid`, e um `PENDING` reenviado após `CONFIRMED` faz o repasse voltar a pendente. É o inverso do incidente. Estados finais (`paid`, `failed`) não deveriam regredir.
2. **Sem autenticação** nos endpoints, e o webhook sem assinatura: quem souber o id de um repasse pode marcá-lo como pago. Vale também para `POST /approvals` e `GET /missions/:id`.
3. **Aprovação não atômica** (`src/app.ts`): inserir o lançamento, inserir o repasse e atualizar a missão são três escritas sem transação. Uma falha no meio deixa lançamento sem repasse.
4. **Sem constraints de unicidade no banco** (`src/db.ts`): só `payouts.mission_id` é `UNIQUE`. Em `ledger` não há `UNIQUE` em `mission_id`. A garantia de "creditar uma vez" vive só no código (checagem seguida de insert), segura com um processo e o SQLite síncrono, mas exposta a corrida com mais de uma instância ou conexão.
5. **Valor em ponto flutuante** (`ledger.amount_brl REAL`). Exato para os valores atuais; o robusto é guardar centavos inteiros e converter só na saída.
6. **Crédito antes da confirmação do provedor, sem estorno.** O lançamento é criado na aprovação; um `FAILED` posterior não o estorna. Pode ser intencional (o README fala em creditar na aprovação), mas é decisão de negócio a explicitar.

## Comportamento da API

7. **Reenvio após o prazo vira 409.** O prazo é checado antes da idempotência, então o reenvio legítimo de uma aprovação já creditada, feito depois do prazo, volta "prazo encerrado" em vez do resultado original.
8. **`approved_at` aceita tudo que `new Date()` parseia** *(lido, não executado)*. Sem fuso (`2026-03-13T01:02:00`) é lido no fuso do servidor; só data (`2026-03-13`) vira meia-noite UTC (21h do dia anterior em São Paulo). Datas futuras passam. É da mesma família do bug do prazo.
9. **Status da missão não validado:** dá para aprovar missão que já não está `open`. `deadline_date` é texto sem validação de formato (a comparação por string só vale em ISO `YYYY-MM-DD`).
10. **`provider_status` é sensível à caixa:** `received` retorna 400; só há `trim`.
11. **Sem `onError` global:** falha de banco vira 500 em texto puro.
12. **Chave de idempotência e unicidade por missão.** Como o crédito é único por missão, a chave não decide mais a duplicidade; reusar a chave de uma missão em outra missão cria um segundo lançamento com a mesma chave. Se a chave for tratada como contrato do cliente, o escopo correto é `(mission_id, chave)` ou um 409 quando a chave já existe em outra missão.
13. **`toLowerCase()` na chave** (comportamento anterior, mantido): `PAY_A` e `pay_a` são a mesma chave. Muitos provedores tratam chaves como sensíveis à caixa.
14. **`Intl` com `en-CA`** (`src/deadlines.ts`) depende dos dados de locale do ICU; funciona no Node 22. `formatToParts` seria independente do locale.

## Observabilidade, testes e projeto

15. **`log()` é desligado sob `VITEST`:** nenhum teste cobre os logs. O log da aprovação registra a chave crua e não há id de correlação, o que escondeu o caractere invisível na linha 13 do incidente.
16. **Testes com lacunas:** "não credita de novo" aceita qualquer status abaixo de 500; não há casos para a borda 02:59:59.999Z / 03:00:00Z, chaves com caracteres invisíveis, `FAILED` após `paid` nem chave igual em missões diferentes.
17. **`src/index.ts` roda `seedIncident` a cada subida** com tabela vazia: inofensivo em desenvolvimento, mas semeia dados do incidente no caminho de produção.
18. **`node:sqlite` é experimental** (daí o `NODE_OPTIONS` nos scripts), e o `npm install` reportou vulnerabilidades no `npm audit` (não investigadas).
