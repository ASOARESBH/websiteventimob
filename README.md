# Ventimob — Portal Imobiliário Híbrido

Portal público da Ventimob, uma PropTech que conecta clientes, corretores e imobiliárias no Brasil e no Paraguai. O projeto combina busca universal de imóveis, páginas de anúncio e profissionais, captação de leads, painel CMS e API preparada para integração com o ERP/APP Ventimob.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 + componentes Radix/shadcn
- Express + tRPC
- Drizzle ORM + MySQL/MariaDB
- OAuth Manus para autenticação do ecossistema
- Vitest para testes de backend

## Executar localmente

```bash
pnpm install
pnpm dev
```

O servidor inicia em modo de desenvolvimento e disponibiliza o portal em `http://localhost:3000` (ou na porta definida pelo ambiente).

## Validar alterações

```bash
pnpm check
pnpm test
pnpm build
```

Os testes cobrem autenticação, configurações do CMS, países/moedas, busca de imóveis, perfis de corretores e criação de leads.

## Variáveis de ambiente

A infraestrutura WebDev fornece as variáveis de ambiente do banco e autenticação. Para um ambiente próprio, configure pelo menos:

```env
DATABASE_URL=mysql://usuario:senha@host:3306/ventimob
JWT_SECRET=uma-chave-secreta-forte
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
```

Nunca versionar `.env`, senhas, tokens ou números reais de WhatsApp.

## Estrutura principal

```text
client/
  src/components/     Componentes visuais reutilizáveis
  src/contexts/       Localização, país, moeda e idioma
  src/pages/          Home, busca, imóvel, corretores, imobiliárias, admin
server/
  db.ts               Queries e mutations de domínio
  routers.ts          Contratos tRPC
  seed.ts             Dados demonstrativos para desenvolvimento
  _core/              Infraestrutura Express, OAuth, tRPC e Vite
drizzle/
  schema.ts           Modelo MySQL multipaís
  migrations/         Migrações Drizzle
```

## Dados demonstrativos

O `server/seed.ts` cadastra países, configurações do CMS, corretores, imobiliárias e imóveis de exemplo. Em produção, desabilite ou substitua o seed por uma rotina de migração/importação do ERP.

## Rotas públicas principais

- `/` — Home com busca universal
- `/busca` — Resultados, filtros e mapa
- `/imovel/:slug` — Detalhes e captura de lead
- `/corretores` e `/corretor/:slug` — Canais profissionais
- `/imobiliarias` e `/imobiliaria/:slug` — Canais corporativos
- `/para-corretores` — Credenciamento de profissionais
- `/para-imobiliarias` — Solução corporativa
- `/login-corretor` — Entrada para o ERP/APP
- `/admin` — CMS centralizado da demonstração

## API REST para ERP/APP

A camada tRPC é usada internamente pelo portal. A API REST de integração está preparada em:

- `GET /api/v1/properties`
- `GET /api/v1/properties/:identifier`
- `GET /api/v1/brokers`
- `GET /api/v1/agencies`
- `POST /api/v1/leads`

Antes de expor a API em produção, adicionar autenticação por token/JWT, rate limiting, CORS restritivo, auditoria e validação de origem.

## Fluxo de branches recomendado

- `main` — versão estável e publicável
- `develop` — integração de alterações
- `feature/<descricao>` — novas funcionalidades
- `fix/<descricao>` — correções isoladas

Commits devem ser pequenos e descritivos, preferencialmente no formato `feat:`, `fix:`, `docs:`, `test:` ou `chore:`.

## HostGator / PHP + MySQL

O pacote compatível com hospedagem compartilhada está disponível no artefato separado `ventimob_hostgator_package.zip`, contendo schema MySQL, conexão PDO, `admin.php`, API PHP e manual de implantação. O frontend WebDev e o pacote PHP compartilham o mesmo modelo de dados e devem receber uma política explícita de fonte de verdade antes da entrada em produção.
