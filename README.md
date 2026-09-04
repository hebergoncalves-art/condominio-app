# CondoManager

Última atualização: 2026-09-04

Sistema web para registrar, acompanhar e resolver ocorrências de um condomínio. Moradores podem criar e acompanhar ocorrências; funcionários administram os registros e comentários em uma área protegida.

## Requisitos

- Node.js compatível com o Next.js 16.
- Um projeto Supabase configurado.
- CLI do Supabase, caso as migrações sejam executadas localmente.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`. Os demais comandos disponíveis são:

# CondoManager

Última atualização: 2026-09-04

Sistema web para registrar, acompanhar e resolver ocorrências de um condomínio. Moradores podem criar e acompanhar ocorrências; funcionários administram os registros e comentários em uma área protegida.

## Requisitos

- Node.js compatível com o Next.js 16.
- Um projeto Supabase configurado.
- CLI do Supabase, caso as migrações sejam executadas localmente.

## Instalação

```bash
npm install
```

Crie um arquivo `.env.local` com:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
INITIAL_STAFF_EMAILS=funcionario@example.com
RESEND_API_KEY=
RESEND_FROM=
```

`INITIAL_STAFF_EMAILS` aceita vários emails separados por vírgula. Apenas esses emails podem concluir o cadastro inicial de funcionário. As chaves privadas não devem ser expostas ao navegador.

## Banco e Storage

As migrações ficam em `supabase/migrations/` e devem ser aplicadas em ordem lexicográfica. Para um Supabase local:

```bash
supabase start
supabase db reset
```

O reset cria tabelas, índices, políticas RLS e o bucket privado `occurrence-photos`. O envio de email exige `RESEND_API_KEY` e `RESEND_FROM`.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`. Os demais comandos disponíveis são:

```bash
npm run build
npm run start
npm run lint
npm run typecheck
npm test
npm run test:e2e
```

## Rotas principais

- `/`: página pública.
- `/cadastro`: cadastro de morador.
- `/cadastro-funcionario`: cadastro inicial de funcionário autorizado.
- `/login`: entrada por email e senha.
- `/morador/ocorrencias`: listagem e filtros do morador.
- `/morador/ocorrencias/nova`: nova ocorrência.
- `/morador/ocorrencias/[id]`: detalhe, comentários e gestão pelo autor.
- `/admin`: dashboard de funcionários.
- `/admin/ocorrencias/[id]`: administração de uma ocorrência.

## Estrutura

- `src/app/`: rotas e Server Actions do App Router.
- `src/components/`: componentes compartilhados e componentes Shadcn UI.
- `src/features/occurrences/`: Services e Data Access Layer de ocorrências.
- `src/lib/`: autenticação, validações, domínio, email e clientes Supabase.
- `supabase/migrations/`: schema, Storage e políticas RLS.
- `e2e/`: testes de fluxos públicos.

Leia [docs/project-overview.md](docs/project-overview.md) para o escopo funcional e [docs/architecture.md](docs/architecture.md) para as decisões de organização e persistência.

## Commits

As mensagens de commit seguem o formato Conventional Commits. O hook `commit-msg` rejeita mensagens fora do padrão, por exemplo:

```text
feat: adicionar filtro por status
fix: corrigir upload de foto
docs: atualizar instruções locais
```

O hook `pre-commit` executa Prettier nos arquivos staged, o typecheck e os testes.
