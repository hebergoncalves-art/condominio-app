# Plano de implementação — Sistema de Ocorrências do Condomínio

## 1. Objetivo e decisões do produto

Implementar o produto inicial sobre o scaffold atual de Next.js 16, usando App Router, Server Components, Server Actions, Supabase e Resend. O sistema atenderá um único condomínio, com dois perfis: `resident` e `staff`.

Decisões fixadas:

- Autenticação por link mágico, sem senha.
- Moradores podem fazer autocadastro.
- Funcionários serão provisionados por seed inicial seguro.
- Exclusão lógica para ocorrências e comentários.
- Status podem mudar livremente entre os cinco valores válidos.
- Uma foto JPG/PNG opcional por ocorrência, limite de 10 MB.
- Moradores visualizam todas as ocorrências.
- Outros moradores veem somente nome e unidade do autor.
- Busca textual fica fora do escopo; haverá filtros por status e categoria.
- Emails de alteração de status serão enviados pelo Resend.
- A interface seguirá `docs/DESIGN.md` e `docs/screen.png`.

## 2. Estado atual e fundação técnica

O repositório ainda é um scaffold básico de Next.js, sem banco, autenticação, componentes Shadcn, testes ou integração Supabase configurados.

Configurar:

- Next.js 16 com App Router;
- React 19;
- TypeScript;
- Tailwind CSS;
- Shadcn/Radix para componentes acessíveis;
- Zod para validação no servidor;
- React Hook Form para formulários interativos;
- Supabase JS e Supabase SSR;
- Resend para emails transacionais;
- Lucide React para ícones;
- Jest e React Testing Library para testes.

Variáveis de ambiente:

- URL e chave pública do Supabase;
- chave administrativa do Supabase somente no servidor;
- chave do Resend;
- endereço remetente de domínio verificado;
- URL pública de retorno do link mágico;
- configuração dos emails de funcionários iniciais.

Segredos não podem ser enviados para Client Components ou incluídos no bundle público.

Criar clientes Supabase separados para browser, Server Components/Server Actions e operações administrativas. Configurar middleware para renovar a sessão e proteger as áreas autenticadas. A autorização deve validar o usuário no servidor com `getUser`, sem confiar apenas em cookies ou na interface.

## 3. Organização do banco de dados em `/supabase`

Todo artefato relacionado ao banco deve ser SQL e ficar na pasta `/supabase`, na raiz do projeto.

Não usar Prisma, Drizzle ou outro sistema externo de migrations. O banco será versionado por arquivos SQL numerados e executados em sequência.

```text
/supabase
├── 001_extensions_and_types.sql
├── 002_profiles_and_roles.sql
├── 003_occurrences_and_comments.sql
├── 004_database_functions_and_triggers.sql
├── 005_row_level_security.sql
├── 006_storage_and_storage_policies.sql
├── 007_seed_fixed_values.sql
└── 008_seed_initial_staff.sql
```

### 3.1 `001_extensions_and_types.sql`

Responsável por:

- habilitar somente extensões PostgreSQL realmente necessárias;
- criar tipos fixos do domínio;
- centralizar as nove categorias:
  - Manutenção;
  - Segurança;
  - Limpeza;
  - Barulho;
  - Iluminação;
  - Elevador;
  - Garagem;
  - Áreas comuns;
  - Outros;
- centralizar os cinco status:
  - Aberta;
  - Em análise;
  - Em andamento;
  - Resolvida;
  - Cancelada.

Categorias e status não podem aceitar valores arbitrários.

### 3.2 `002_profiles_and_roles.sql`

Criar o perfil vinculado ao usuário autenticado do Supabase com:

- nome completo;
- email;
- telefone;
- torre/apartamento;
- perfil `resident` ou `staff`;
- status habilitado;
- datas de criação e atualização.

Regras:

- email único;
- autocadastro cria perfil `resident`;
- funcionários não são criados por cadastro público;
- email e telefone são dados privados;
- o perfil deve permanecer vinculado à identidade Auth.

### 3.3 `003_occurrences_and_comments.sql`

Criar as entidades de negócio.

Ocorrência:

- autor;
- título/descrição;
- categoria;
- local livre, podendo ser unidade ou área comum;
- status;
- referência da foto;
- datas de criação e atualização;
- indicador de exclusão lógica.

Comentário:

- ocorrência;
- autor;
- conteúdo;
- datas de criação e atualização;
- indicador de exclusão lógica.

Histórico de status:

- ocorrência;
- status anterior;
- novo status;
- usuário responsável;
- data da mudança.

Criar índices para status, categoria, autor, datas, ocorrências não excluídas e comentários por ocorrência.

Regras de consistência:

- toda ocorrência começa como `Aberta`;
- status pode mudar livremente entre os valores válidos;
- uma ocorrência tem no máximo uma foto;
- comentários pertencem a ocorrências existentes;
- exclusão é lógica.

### 3.4 `004_database_functions_and_triggers.sql`

Criar somente funções e triggers que representem invariantes do banco:

- atualizar automaticamente `updated_at`;
- registrar histórico quando o status realmente mudar;
- evitar duplicidade de histórico para a mesma alteração;
- validar o vínculo entre comentário e ocorrência;
- auxiliar as políticas RLS na identificação segura do perfil;
- manter consistência de exclusão lógica.

O envio de email não será feito por trigger SQL. A aplicação persistirá a mudança e chamará o Resend no fluxo server-side.

### 3.5 `005_row_level_security.sql`

Habilitar RLS em todas as tabelas públicas.

Perfis:

- usuário consulta o próprio perfil;
- funcionários consultam os dados necessários à operação;
- outros moradores não recebem email ou telefone;
- alterações respeitam autoria e perfil.

Ocorrências:

- usuários autenticados consultam ocorrências não excluídas;
- morador cria ocorrência apenas para si;
- morador edita, exclui logicamente e altera status somente das próprias ocorrências;
- funcionário administra qualquer ocorrência;
- ocorrências excluídas não aparecem em consultas normais.

Comentários:

- usuários autenticados leem comentários de ocorrências não excluídas;
- usuário cria comentário somente com sua própria identidade;
- morador edita/exclui somente seus comentários;
- funcionário modera qualquer comentário;
- ocorrência excluída não aceita novos comentários.

Histórico:

- leitura conforme autorização da ocorrência;
- inserção controlada por função/trigger;
- usuário não altera o histórico diretamente.

Testar as políticas com morador autor, morador não autor, funcionário, usuário não autenticado e usuário desabilitado.

### 3.6 `006_storage_and_storage_policies.sql`

Configurar bucket privado para fotos:

- upload somente autenticado;
- JPG/PNG;
- máximo de 10 MB;
- no máximo uma foto por ocorrência;
- autor pode alterar a própria foto;
- funcionário pode administrar qualquer foto;
- caminhos arbitrários não podem ser acessados;
- fotos de ocorrências excluídas não são exibidas;
- visualização usa URL protegida ou temporária.

O tipo, tamanho e quantidade serão validados na aplicação e novamente no servidor/políticas disponíveis.

### 3.7 `007_seed_fixed_values.sql`

Popular de forma idempotente:

- categorias fixas;
- status fixos;
- configurações básicas do único condomínio;
- valores essenciais para a aplicação.

Executar novamente não pode duplicar dados.

### 3.8 `008_seed_initial_staff.sql`

Preparar o acesso inicial dos funcionários sem armazenar segredos no SQL.

Fluxo:

1. Os emails iniciais são definidos em configuração segura do ambiente.
2. Uma rotina server-side administrativa cria ou localiza as identidades Auth.
3. O SQL garante/atualiza os perfis como `staff` e habilitados.
4. Nenhuma senha é criada.
5. O acesso continua sendo por link mágico.

O processo deve ser idempotente e nunca expor emails administrativos ao cliente.

## 4. Autenticação, perfis e navegação

Áreas comportamentais:

- Entrada/autenticação:
  - solicitação de link mágico;
  - autocadastro de morador;
  - confirmação do link;
  - link expirado, inválido ou já utilizado;
  - sessão encerrada.
- Área do morador:
  - listagem;
  - nova ocorrência;
  - detalhe;
  - edição/exclusão próprias;
  - comentários;
  - alteração de status própria.
- Dashboard do funcionário:
  - sidebar;
  - cards de resumo;
  - listagem administrativa;
  - detalhe;
  - administração de qualquer ocorrência;
  - moderação de comentários;
  - alteração de status.
- Estados protegidos:
  - usuário não autenticado;
  - perfil inexistente;
  - perfil desabilitado;
  - morador tentando acessar dashboard;
  - funcionário tentando acessar área indevida;
  - ocorrência inexistente ou excluída.

Fluxo do morador:

1. Informa nome, email, torre/apartamento e telefone.
2. O sistema cria o perfil residente.
3. O sistema envia o link mágico.
4. O morador confirma o link.
5. O sistema cria sessão e direciona à área do morador.

Fluxo do funcionário:

1. O funcionário é provisionado pelo seed seguro.
2. Informa email na entrada administrativa.
3. Recebe link mágico.
4. Confirma o link.
5. O sistema direciona ao dashboard.
6. Todos os funcionários possuem as mesmas permissões.

## 5. Interfaces e camadas da aplicação

Tipos compartilhados:

- `UserRole`: `resident | staff`;
- `OccurrenceStatus`;
- `OccurrenceCategory`;
- `OccurrenceSummary`;
- `OccurrenceDetail`;
- `Comment`;
- `ProfileSummary`;
- filtros de ocorrência;
- resultado padronizado de Server Actions com sucesso, mensagem segura, erros por campo e código interno para logging.

Server Actions:

- `registerResident`;
- `requestMagicLink`;
- `createOccurrence`;
- `updateOccurrence`;
- `deleteOccurrence`;
- `addComment`;
- `updateComment`;
- `deleteComment`;
- `changeOccurrenceStatus`;
- `signOut`.

Cada action deve:

1. validar dados com Zod;
2. confirmar sessão;
3. confirmar perfil e autorização;
4. chamar serviço quando houver regra de negócio;
5. acessar Supabase somente pela camada de dados;
6. retornar resultado seguro;
7. revalidar as listas e detalhes afetados.

Separação obrigatória:

```text
Server Component
→ Data Access
→ Supabase

Client Component
→ Server Action
→ Service
→ Data Access
→ Supabase
```

Páginas e layouts devem ser Server Components por padrão. Client Components ficam restritos a filtros, formulários, upload, modais e interações que exigem estado/eventos.

O código da aplicação não pode espalhar SQL por páginas ou componentes. Todo acesso persistente passa pela camada de Data Access, e todo SQL do banco fica em `/supabase`.

## 6. Ocorrências, filtros e detalhe

Implementar:

- criação com descrição/título, categoria e local obrigatórios;
- status inicial `Aberta`;
- foto opcional;
- listagem de ocorrências não excluídas;
- filtros combináveis por status e categoria via parâmetros de URL;
- ordenação por atualização mais recente;
- paginação;
- detalhe com título/descrição, categoria, local, status, autor, unidade, datas, foto, comentários e ações permitidas.

Não implementar busca textual nesta versão.

Ações do morador:

- criar ocorrência;
- consultar todas;
- filtrar;
- comentar;
- editar/excluir próprias;
- alterar status próprias.

Ações do funcionário:

- consultar e filtrar todas;
- editar/excluir qualquer ocorrência;
- alterar qualquer status;
- moderar qualquer comentário.

## 7. Upload, comentários, exclusão e status

### Upload

- JPG/PNG, uma foto, até 10 MB;
- validação no cliente para feedback e no servidor para segurança;
- bucket privado;
- substituição/remoção por autor ou funcionário autorizado;
- falha não pode gerar ocorrência parcial nem arquivo órfão.

### Comentários

- somente usuários autenticados comentam;
- texto vazio ou somente espaços é rejeitado;
- exibir nome, perfil e data;
- morador edita/exclui apenas comentário próprio;
- funcionário edita/exclui qualquer comentário;
- exclusão exige confirmação;
- comentários de ocorrência excluída deixam de aceitar interações.

### Exclusão lógica

- ocorrência/comentário deixam de aparecer nas consultas normais;
- ocorrência excluída não aceita novos comentários;
- dados relacionados permanecem consistentes;
- não implementar recuperação nem auditoria detalhada nesta versão.

### Status e email

- qualquer status válido pode suceder qualquer outro;
- status igual ao atual não cria histórico nem email;
- mudança registra status anterior, novo status, autor e data;
- banco salva primeiro;
- Resend é chamado somente no servidor;
- email contém identificação da ocorrência, status anterior/novo, link do detalhe e nome do condomínio;
- falha do Resend mantém o status salvo, registra erro técnico e informa que a notificação falhou;
- não expor credenciais ou detalhes internos.

## 8. UI e design

Seguir obrigatoriamente:

- [`docs/DESIGN.md`](C:/Users/Meu%20Computador/Documents/ProjetosDev/condominio-app/docs/DESIGN.md);
- [`docs/screen.png`](C:/Users/Meu%20Computador/Documents/ProjetosDev/condominio-app/docs/screen.png).

Diretrizes:

- azul institucional em ações principais e navegação ativa;
- Manrope para títulos e Inter para conteúdo funcional;
- dashboard administrativo com sidebar, cabeçalho e área de conteúdo fluida;
- cards de indicadores calculados pelos dados reais;
- área de filtros agrupada acima da listagem;
- tabela desktop com identificação, categoria/título, local, data, status e ações;
- cards/lista adaptados para mobile;
- chips de status acessíveis e semanticamente coloridos;
- cards com bordas sutis, cantos arredondados, sombras leves e divisores;
- controles com altura confortável, foco visível e estados de loading, vazio, erro e sucesso;
- experiência do morador mobile-first.

Os dados da imagem — nome do condomínio, números, IDs, datas e exemplos — são somente referências visuais, não seeds funcionais.

## 9. Ordem de implementação

1. Configurar dependências, variáveis de ambiente e identidade visual.
2. Criar os arquivos SQL `/supabase/001` a `/supabase/008` na ordem definida.
3. Aplicar SQL em ambiente local/desenvolvimento.
4. Validar schema, funções, triggers, RLS, storage e seeds.
5. Configurar clientes Supabase SSR e renovação de sessão.
6. Implementar autocadastro e link mágico do morador.
7. Implementar provisionamento inicial de funcionários.
8. Implementar proteção e separação das áreas.
9. Criar layout base de morador e dashboard administrativo.
10. Implementar criação de ocorrência sem foto.
11. Implementar upload, substituição e remoção da foto.
12. Implementar listagem, paginação e filtros.
13. Implementar detalhe da ocorrência.
14. Implementar comentários e moderação.
15. Implementar edição e exclusão lógica.
16. Implementar alteração de status e histórico.
17. Integrar Resend após mudança efetiva de status.
18. Refinar estados de loading, empty, error e success.
19. Executar testes automatizados e fluxos completos.
20. Revisar a interface comparando com `DESIGN.md` e `screen.png`.

## 10. Testes e validação

### Banco e RLS

Validar que:

- scripts funcionam em banco vazio;
- seeds podem ser reaplicados sem duplicação;
- arquivos dependem somente de etapas anteriores;
- enums, tabelas, funções, triggers e policies são criados na ordem;
- usuário não autenticado é bloqueado;
- morador não acessa dados privados nem altera ocorrência de outro morador;
- funcionário administra qualquer ocorrência/comentário;
- exclusão lógica remove itens das consultas normais;
- ocorrência excluída não aceita comentário;
- categoria/status inválidos são rejeitados;
- uma ocorrência não recebe duas fotos;
- histórico só é criado em mudança real de status.

### Unidade

Testar:

- schemas Zod;
- categorias e status;
- filtros;
- autorização;
- transições livres;
- detecção de mudança efetiva;
- limite de 10 MB;
- formatos de imagem;
- resultados das Server Actions.

### Integração

Testar:

- autocadastro e solicitação de link mágico;
- login de funcionário provisionado;
- bloqueio por perfil;
- criação com e sem foto;
- listagem com filtros;
- detalhe de ocorrência;
- comentários próprios e moderação;
- edição/exclusão pelo autor;
- administração por funcionário;
- alteração de status;
- ausência de email em status repetido;
- falha do Resend sem rollback do status.

### UI e acessibilidade

Validar:

- dashboard desktop alinhado à composição de `screen.png`;
- sidebar/cabeçalho responsivos;
- cards e tabela;
- chips de status;
- formulários e mensagens de erro;
- experiência mobile do morador;
- contraste;
- foco e navegação por teclado;
- ausência de email/telefone na interface pública.

## 11. Critérios de pronto

- TypeScript sem erros.
- Lint e build de produção passando.
- Scripts SQL aplicáveis na ordem em banco vazio.
- RLS testada com os perfis definidos.
- Storage bloqueando uploads e acessos indevidos.
- Nenhuma ação protegida depende somente da UI.
- Fluxos completos de morador e funcionário funcionando.
- Emails de status enviados pelo Resend e falhas tratadas.
- Estados de loading, vazio, erro e sucesso implementados.
- Testes críticos passando.
- Layout coerente com `DESIGN.md` e `screen.png`.
- PRD, banco e implementação permanecem coerentes.

## 12. Fora do escopo desta implementação

- Senhas, recuperação de senha e login tradicional.
- Cadastro público de funcionários.
- Diferentes níveis de permissão entre funcionários.
- Busca textual.
- Emails para criação ou novos comentários.
- Aplicativo nativo.
- Chat em tempo real.
- Avaliação de atendimento.
- Integrações com portaria, financeiro ou terceiros.
- Relatórios, gráficos e exportação.
- Múltiplas fotos, vídeos ou anexos em comentários.
- Recuperação de itens excluídos.
- Auditoria detalhada e monitoramento operacional avançado.

## 13. Premissas

- O banco atende um único condomínio.
- `/supabase` é a fonte versionada de todos os artefatos SQL do banco.
- Os arquivos SQL são numerados e executados sequencialmente.
- Exclusão lógica é suficiente para a primeira entrega.
- Status podem mudar livremente.
- Fotos têm limite de 10 MB e são JPG/PNG.
- Funcionários são provisionados com processo seguro e idempotente.
- Nenhuma senha é criada.
- Resend é chamado somente no servidor e fora de triggers SQL.
- RLS é a proteção definitiva do banco, complementada por autorização server-side.
