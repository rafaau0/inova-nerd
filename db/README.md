# Banco de Dados

Este projeto ja esta preparado para trocar a persistencia local em JSON por um adaptador de banco.

## Como a troca foi preparada

- A regra de negocio continua em [lib/server-store.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/server-store.ts)
- A leitura e escrita agora passam por um contrato unico em [lib/data/contracts.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/contracts.ts)
- O adaptador atual e o JSON em [lib/data/json-store.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/json-store.ts)
- O ponto de troca do provedor esta em [lib/data/index.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/index.ts)
- O esqueleto do adaptador de banco esta em [lib/data/database-store.ts](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/lib/data/database-store.ts)

## Variaveis previstas

- `DATA_PROVIDER=json`
- `DATABASE_URL=...`

## Proximo passo recomendado

1. Escolher o banco, de preferencia `Postgres`
2. Aplicar o schema de [schema.sql](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/db/schema.sql)
3. Implementar `createDatabaseDataStore()`
4. Trocar `DATA_PROVIDER` para `database`
