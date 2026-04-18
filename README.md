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
- Senha inicial: altere imediatamente apos a primeira subida

## Variaveis de ambiente

Crie um `.env.local` baseado em `.env.example`:

```env
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_WEBHOOK_SECRET=COLE_A_CHAVE_SECRETA_DO_WEBHOOK
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=COLE_UM_SEGREDO_LOCAL
DATA_PROVIDER=json
DATABASE_URL=postgres://user:password@localhost:5432/inovanerd
FILE_STORAGE_PROVIDER=local
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=
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
- `npm run db:setup`
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

## Producao

- Em producao, use `DATA_PROVIDER=database`, `SESSION_SECRET` forte, `MP_WEBHOOK_SECRET` e storage externo.
- O catalogo agora roda em runtime para nao travar o build por dependencia de banco durante o prerender.
- O webhook do Mercado Pago valida a assinatura `x-signature` e consulta o pagamento na API antes de atualizar o pedido.
- Login e cadastro agora usam hash `scrypt` e migram hashes antigos automaticamente no proximo login.
- O upload de imagens aceita `FILE_STORAGE_PROVIDER=supabase` com bucket publico no Supabase Storage.
- `/api/health` retorna `503` quando faltarem dependencias criticas de producao.

## Deploy

### Vercel

1. Importe o repositorio na Vercel.
2. Configure as variaveis:
   - `MP_ACCESS_TOKEN`
   - `MP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `SESSION_SECRET`
   - `DATA_PROVIDER=database`
   - `DATABASE_URL`
   - `FILE_STORAGE_PROVIDER=supabase`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`
3. Aplique [db/schema.sql](/C:/Users/RAFAEL/Documents/PROGRAMAÃ‡ÃƒO/DEV-INOVANERD/db/schema.sql) no banco.
4. Crie um bucket publico no Supabase Storage com o nome usado em `SUPABASE_STORAGE_BUCKET`.
5. Gere a chave secreta do webhook nas integracoes do Mercado Pago e salve em `MP_WEBHOOK_SECRET`.
6. Rode o healthcheck em `/api/health` e confirme `ok: true`.
7. Teste o checkout do Mercado Pago em sandbox antes de trocar para credenciais reais.

### Checklist de deploy

- `npm run lint`
- `npm test`
- `npm run build`
- configurar `NEXT_PUBLIC_APP_URL` com a URL final
- configurar `MP_ACCESS_TOKEN`
- configurar `MP_WEBHOOK_SECRET`
- configurar `SESSION_SECRET`
- configurar `DATABASE_URL`
- configurar `FILE_STORAGE_PROVIDER=supabase`
- configurar o bucket do Supabase Storage
- validar `/api/health`
- trocar a senha inicial do admin
- testar login, admin e fluxo de compra
