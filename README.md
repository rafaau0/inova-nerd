# INOVANERD

Loja em `Next.js 16` com `React 19`, checkout integrado ao Mercado Pago, autenticacao local por sessao, area do cliente e painel administrativo.

## Principais recursos

- Catalogo com busca, filtros e favoritos
- Carrinho local com cupons e checkout
- Integracao com Mercado Pago via Checkout Pro
- Cadastro, login e sessao por cookie
- Area Minha Conta com pedidos do usuario
- Painel admin para produtos, cupons e pedidos
- Persistencia local em arquivos JSON dentro de `data/`
- Sitemap, robots e paginas institucionais

## Credenciais iniciais

- Admin: `admin@inovanerd.com.br`
- Senha: `admin123`

## Variaveis de ambiente

Crie um `.env.local` baseado em `.env.example`:

```env
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATA_PROVIDER=json
DATABASE_URL=postgres://user:password@localhost:5432/inovanerd
CORREIOS_ACCESS_TOKEN=COLE_O_TOKEN_DA_API_PRECO
CORREIOS_ORIGIN_CEP=75700000
CORREIOS_SERVICE_CODE=03220
CORREIOS_SERVICE_NAME=SEDEX
```

Para producao, use `.env.production.example` como referencia.

### Frete dinamico via Correios

- O checkout consulta a API oficial de preco dos Correios em tempo real quando o `CEP` de entrega esta completo.
- `Catalao/GO` continua com `frete gratis`.
- Se as credenciais dos Correios nao estiverem configuradas ou a cotacao falhar, o sistema cai para a estimativa local para nao travar a venda.
- A API oficial de preco dos Correios e restrita a clientes com contrato e usa `Bearer Token`.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm test`
- `npm run db:migrate:json`

## Estrutura de dados local

- `data/products.json`
- `data/coupons.json`
- `data/orders.json`
- `data/users.json`
- `data/sessions.json`

## Observacoes

- O painel admin usa persistencia local em JSON, ideal para desenvolvimento, demos e prototipos.
- O projeto agora ja possui uma camada de adaptador de dados pronta para receber banco.
- O provedor atual e controlado por `DATA_PROVIDER`.
- `DATA_PROVIDER=json` usa os arquivos em `data/`.
- `DATA_PROVIDER=database` agora usa `Supabase/Postgres` via `DATABASE_URL`.
- O schema inicial sugerido esta em [db/schema.sql](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/db/schema.sql).
- O guia da migracao esta em [db/README.md](/C:/Users/RAFAEL/Documents/PROGRAMAÇÃO/DEV-INOVANERD/db/README.md).

## Deploy

### Vercel

1. Importe o repositorio na Vercel.
2. Configure as variaveis:
   - `MP_ACCESS_TOKEN`
   - `NEXT_PUBLIC_APP_URL`
3. Rode o healthcheck em `/api/health`.
4. Teste o checkout do Mercado Pago em sandbox antes de trocar para credenciais reais.

### Checklist de deploy

- `npm run lint`
- `npm test`
- `npm run build`
- configurar `NEXT_PUBLIC_APP_URL` com a URL final
- configurar `MP_ACCESS_TOKEN`
- validar `/api/health`
- testar login, admin e fluxo de compra
