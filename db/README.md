# Banco de Dados

Este projeto ja esta preparado para usar `Supabase/Postgres`.

## Como a troca foi preparada

- A regra de negocio continua em [lib/server-store.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/server-store.ts)
- A leitura e escrita passam pelo contrato em [lib/data/contracts.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/contracts.ts)
- O adaptador local continua em [lib/data/json-store.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/json-store.ts)
- O adaptador SQL de producao esta em [lib/data/database-store.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/database-store.ts)
- A conexao SQL fica em [lib/db.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/db.ts)

## Variaveis

- `DATA_PROVIDER=json`
- `DATABASE_URL=...`

## Fluxo recomendado com Supabase

1. Criar o projeto no Supabase
2. Copiar a `Transaction pooler connection string`
3. Aplicar [schema.sql](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/db/schema.sql)
4. Rodar `npm run db:migrate:json` se quiser importar os dados locais
5. Trocar `DATA_PROVIDER=database`

## Observacao

- O adaptador usa o pacote `postgres` com `prepare: false`, escolha alinhada com ambientes serverless e pooler transacional do Supabase.
