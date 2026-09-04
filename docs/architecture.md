# Arquitetura

Última atualização: 2026-09-04

## Stack

- Next.js 16.3 com App Router e React 19.
- TypeScript, Tailwind CSS 4 e componentes Shadcn UI.
- Zod para validação de entradas.
- Supabase Auth, Postgres e Storage.
- Resend para emails de alteração de status.
- Jest/Testing Library para testes e Playwright para testes end-to-end.

## Organização

A aplicação fica em `src/`. As rotas estão em `src/app/`, componentes compartilhados em `src/components/`, regras de domínio e validações em `src/lib/` e o módulo de ocorrências em `src/features/occurrences/`.

Os grupos de rotas `(public)`, `(morador)` e `(funcionario)` organizam áreas sem alterar a URL. Os layouts de morador e funcionário usam `requireUser` para exigir o perfil correspondente.

## Fluxo de dados

Para ações iniciadas pela interface, o fluxo preferencial é:

```text
Componente
  -> Server Action
  -> Service
  -> Data Access Layer
  -> Supabase
```

Leituras simples feitas durante a renderização seguem:

```text
Page Server Component
  -> Data Access Layer
  -> Supabase
```

Server Actions validam `FormData`, verificam autenticação e revalidam caminhos. Services aplicam permissões e orquestram operações, como remover a ocorrência quando o upload da foto falha. O Data Access Layer concentra consultas, mutações e acesso ao Storage.

## Autenticação e autorização

O Supabase Auth gerencia as senhas e sessões. Perfis e contatos ficam em `profiles` e `profile_contacts`. O papel do usuário é `resident` ou `staff`, e perfis desabilitados não podem acessar a aplicação.

O middleware moderno do Next.js fica em `src/proxy.ts` e atualiza a sessão Supabase. A autorização também é verificada no servidor por `requireUser`, Services e políticas RLS; componentes clientes não acessam o banco diretamente.

## Persistência

As migrações em `supabase/migrations/` criam:

- enums de papéis, categorias e status;
- perfis, contatos, ocorrências, fotos e comentários;
- triggers de `updated_at`, índices e funções auxiliares;
- RLS para leitura e mutação conforme perfil e autoria;
- o bucket privado `occurrence-photos` e suas políticas.

Ocorrências e comentários são excluídos logicamente por `deleted_at`. A relação entre ocorrência e foto é única, garantindo no máximo uma foto por ocorrência.

## Variáveis de ambiente

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública do Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave administrativa usada no servidor.
- `INITIAL_STAFF_EMAILS`: emails autorizados para cadastro inicial de funcionários, separados por vírgula.
- `RESEND_API_KEY`: chave do Resend.
- `RESEND_FROM`: remetente usado nas notificações de status.

As chaves privadas devem existir somente no ambiente do servidor.

## Convenções de páginas

Páginas são Server Components por padrão. Componentes clientes ficam restritos a formulários, estado local, eventos e APIs do navegador. Componentes específicos de uma rota devem ser colocados em `_components`; ações, services e acesso a dados podem ser colocados nas pastas homônimas próximas da página ou no módulo de feature quando forem compartilhados.
