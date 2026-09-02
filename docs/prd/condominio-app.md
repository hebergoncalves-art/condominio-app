# PRD — Sistema de Ocorrências do Condomínio

> Tipo: PRD inicial · Data: 2026-09-02
> **Status:** Aguardando implementação
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

Sistema web para registrar, acompanhar e resolver ocorrências do condomínio. Moradores acessam por um link mágico enviado ao email, sem criar senha. Funcionários acessam a mesma forma de autenticação, mas utilizam uma área administrativa própria.

O morador poderá cadastrar uma ocorrência, consultar todas as ocorrências do condomínio, filtrar a listagem, abrir detalhes, comentar, editar, excluir e alterar o status de uma ocorrência criada por ele. Funcionários poderão visualizar e administrar todas as ocorrências e comentários.

## 2. Problema que resolve

Ocorrências do condomínio podem ser comunicadas informalmente, sem histórico, responsável ou acompanhamento claro. Isso dificulta a triagem, o retorno ao morador e a comprovação do que foi resolvido.

O sistema centraliza os registros, permite anexar evidência visual, mantém comentários e deixa explícita a evolução de cada ocorrência.

## 3. Público-alvo

- Moradores do condomínio, incluindo pessoas de diferentes torres e apartamentos.
- Funcionários do condomínio responsáveis por acompanhar, atualizar e resolver ocorrências.

## 4. Objetivo do recorte atual

Entregar um fluxo completo e simples de gestão de ocorrências, desde o cadastro de moradores e autenticação por email até o registro, consulta, interação e administração de ocorrências.

O recorte prioriza rastreabilidade, facilidade de acesso pelo morador e uma operação administrativa suficiente para o condomínio acompanhar o trabalho.

## 5. Funcionalidades

**Essenciais:**

- Cadastro de moradores com nome completo, email, torre/apartamento e telefone, sem senha.
- Acesso de moradores e funcionários por link mágico enviado ao email.
- Separação entre área do morador e dashboard de funcionários.
- Cadastro de ocorrência com título/descrição, categoria, local, foto opcional e status inicial.
- Categorias fixas: Manutenção, Segurança, Limpeza, Barulho, Iluminação, Elevador, Garagem, Áreas comuns e Outros.
- Local informado como torre/apartamento ou área comum.
- Listagem de todas as ocorrências do condomínio para moradores.
- Filtros por status e categoria.
- Tela de detalhe da ocorrência.
- Comentários em ocorrências por moradores e funcionários.
- Edição e exclusão de ocorrência pelo morador autor.
- Administração de qualquer ocorrência e comentário por funcionários.
- Alteração de status por funcionários e pelo morador autor.
- Email ao morador relacionado quando o status da ocorrência for alterado.

**Desejáveis:**

- Ordenação por data de criação e atualização.
- Indicação visual de autor, data e horário nos comentários.
- Confirmação antes de excluir uma ocorrência ou comentário.
- Estados de carregamento, vazio, erro e sucesso nas ações principais.

## 6. Fora do escopo

- Senhas, recuperação de senha ou autenticação por usuário e senha.
- Cadastro e gerenciamento de categorias pelo usuário.
- Diferentes níveis de permissão entre funcionários.
- Notificações por email para criação de ocorrência ou novo comentário.
- Aplicativo nativo para celular.
- Chat em tempo real.
- Avaliação do atendimento ou pesquisa de satisfação.
- Integração com portaria, financeiro, manutenção externa ou outros sistemas.
- Relatórios avançados, gráficos e exportação de dados.
- Anexos múltiplos ou outros tipos de arquivo além de uma foto por ocorrência.

## 7. Regras de negócio

- R1: O acesso de moradores e funcionários ocorre por link mágico enviado ao email cadastrado.
- R2: O morador não precisa e não pode definir uma senha para usar o sistema.
- R3: O cadastro do morador exige nome completo, email, torre/apartamento e telefone.
- R4: Torre/apartamento e local podem ser informados livremente pelo morador; o sistema deve preservar o texto informado.
- R5: Cada ocorrência pertence ao morador que a criou e possui uma categoria fixa, local, descrição, data, status e, opcionalmente, uma foto.
- R6: O status inicial de toda ocorrência é `Aberta`.
- R7: Os status válidos são `Aberta`, `Em análise`, `Em andamento`, `Resolvida` e `Cancelada`.
- R8: Moradores podem visualizar todas as ocorrências do condomínio.
- R9: O morador pode editar ou excluir apenas ocorrências criadas por ele.
- R10: O morador pode alterar o status apenas das ocorrências criadas por ele.
- R11: Funcionários podem visualizar, editar, excluir e alterar o status de qualquer ocorrência.
- R12: Moradores e funcionários autenticados podem adicionar comentários.
- R13: Funcionários podem editar e excluir qualquer comentário; o morador pode editar e excluir os próprios comentários.
- R14: Toda alteração de status deve disparar um email ao morador autor da ocorrência, quando houver email válido.
- R15: Uma ocorrência excluída não deve continuar aparecendo nas listagens ou na busca normal do sistema.
- R16: Categoria deve ser escolhida entre as opções fixas; valores arbitrários não são aceitos.
- R17: Deve existir no máximo uma foto associada a cada ocorrência.

## 8. Fluxos principais

### Fluxo 1 — Cadastro e acesso do morador

1. O morador informa nome completo, email, torre/apartamento e telefone.
2. O sistema valida os dados e cria ou atualiza o cadastro, conforme a regra de identificação por email.
3. O morador solicita acesso informando o email cadastrado.
4. O sistema envia um link mágico para esse email.
5. O morador acessa o link dentro do prazo de validade.
6. O sistema autentica o morador e exibe a área do morador.

### Fluxo 2 — Cadastro de ocorrência

1. O morador acessa a opção de nova ocorrência.
2. Informa descrição/título, categoria e local.
3. Opcionalmente adiciona uma foto válida.
4. Envia o formulário.
5. O sistema valida os dados, cria a ocorrência com status `Aberta` e exibe confirmação.
6. A ocorrência passa a aparecer na listagem geral.

### Fluxo 3 — Consulta e interação com ocorrência

1. O usuário autenticado acessa a listagem.
2. Visualiza as ocorrências disponíveis.
3. Filtra por status e/ou categoria, podendo remover os filtros.
4. Abre uma ocorrência para consultar detalhes e comentários.
5. Adiciona, edita ou exclui um comentário conforme sua permissão.
6. Se for o morador autor, pode editar, excluir ou alterar o status da ocorrência.

### Fluxo 4 — Administração por funcionário

1. O funcionário acessa o link da área administrativa.
2. Informa seu email cadastrado e recebe um link mágico.
3. Após a autenticação, acessa o dashboard.
4. Consulta e filtra todas as ocorrências.
5. Abre uma ocorrência, edita seus dados, altera o status ou a exclui.
6. Pode moderar, editar ou excluir qualquer comentário.
7. Ao alterar o status, o sistema envia email ao morador autor.

## 9. Critérios de aceite

- O morador consegue se cadastrar informando nome completo, email, torre/apartamento e telefone, sem informar senha.
- O usuário com email cadastrado recebe um link mágico e consegue acessar a área correspondente ao seu perfil.
- O usuário sem cadastro não consegue acessar as áreas protegidas apenas informando um email não reconhecido.
- O morador consegue criar uma ocorrência com categoria, local e descrição obrigatórios, além de uma foto opcional.
- O sistema rejeita categoria fora da lista fixa e rejeita mais de uma foto por ocorrência.
- Toda ocorrência nova é criada com status `Aberta`.
- O morador consegue visualizar todas as ocorrências e filtrá-las por status e categoria.
- O detalhe exibe dados da ocorrência, autor, status, foto quando existente e comentários.
- Moradores e funcionários autenticados conseguem adicionar comentários.
- O morador consegue editar e excluir apenas suas próprias ocorrências.
- O morador autor consegue alterar o status de sua ocorrência.
- Um funcionário consegue editar, excluir e alterar o status de qualquer ocorrência.
- Um funcionário consegue editar ou excluir qualquer comentário; o morador consegue editar ou excluir apenas os próprios comentários.
- Quando o status muda, o sistema envia uma notificação por email ao morador autor.
- A listagem informa claramente quando não há resultados para os filtros escolhidos.
- Falhas de validação, autenticação, upload ou persistência exibem uma mensagem compreensível e não criam dados incompletos.

## 10. Stack

- Next.js 16 com App Router.
- React 19.
- TypeScript.
- Tailwind CSS.
- Componentes de interface acessíveis com Shadcn UI.
- Zod para validação de entradas.
- Supabase para autenticação por link mágico, banco de dados e armazenamento da foto.
- Serviço de email integrado ao fluxo de autenticação e às notificações de alteração de status.

## 11. Justificativa da stack

A stack já está iniciada no projeto e é adequada para um sistema web com páginas públicas protegidas, dashboard e formulários. O Supabase reduz a complexidade de autenticação sem senha, persistência e armazenamento de imagens. Next.js permite renderizar listagens e detalhes no servidor, mantendo no cliente apenas filtros e interações necessárias.

## 12. Referências de UI e design

As telas devem seguir as referências visuais fornecidas pelo projeto:

- [DESIGN.md](../DESIGN.md) — fonte principal do sistema visual, incluindo identidade “Civic Horizon”, cores, tipografia, espaçamentos, bordas, elevação, componentes e diretrizes para dashboard administrativo e experiência do morador.
- [screen.png](../screen.png) — referência visual do layout do dashboard de gestão de ocorrências.

### Diretrizes visuais obrigatórias

- Usar o azul institucional como cor primária para ações principais, navegação ativa e elementos de destaque.
- Usar Manrope em títulos e Inter em textos funcionais, tabelas, filtros e informações densas.
- Manter o dashboard administrativo com navegação lateral, área de conteúdo fluida e hierarquia visual clara.
- Representar indicadores resumidos em cards no topo do dashboard, sem transformar os números demonstrativos da imagem em requisitos de negócio.
- Usar filtros de busca, status e categoria em uma área visualmente agrupada antes da listagem.
- Exibir ocorrências em tabela ou lista estruturada com identificação, categoria/título, local, data, status e ações.
- Usar chips de status com cores semânticas e acessíveis: alerta para pendentes/em análise, azul para estados intermediários, verde para resolvidas e vermelho apenas para situações de erro ou cancelamento quando aplicável.
- Usar cards com bordas sutis, cantos arredondados, sombras leves e divisores para separar conteúdo sem excesso visual.
- Garantir controles com altura mínima confortável para toque e estados visíveis de foco, carregamento, vazio, erro e sucesso.
- Aplicar abordagem mobile-first na área do morador, mantendo a navegação e as ações essenciais fáceis de usar em telas pequenas.

### Interpretação da referência

O conteúdo exibido em `screen.png`, como nome do condomínio, números de ocorrências, datas, IDs, textos de exemplo e itens de menu, é apenas referência de composição visual. Os dados reais, categorias, status e ações devem seguir este PRD.

## 13. Fases de construção

### Fase 1 — Base de acesso e perfis

Objetivo: permitir que moradores e funcionários sejam identificados e acessem a área correta sem senha.

Specs:

- Spec 01 — Cadastro e identificação de moradores
- Spec 02 — Acesso por link mágico e separação de áreas
- Spec 03 — Cadastro e acesso de funcionários

### Fase 2 — Registro de ocorrências

Objetivo: permitir o registro de problemas com informações suficientes para triagem.

Specs:

- Spec 04 — Criação de ocorrência
- Spec 05 — Upload e visualização da foto da ocorrência

### Fase 3 — Consulta e filtros

Objetivo: tornar o histórico de ocorrências consultável por moradores e funcionários.

Specs:

- Spec 06 — Listagem geral e filtros de ocorrências
- Spec 07 — Detalhe da ocorrência e histórico de comentários

### Fase 4 — Interação e gestão

Objetivo: permitir o acompanhamento colaborativo e a administração do ciclo de vida da ocorrência.

Specs:

- Spec 08 — Comentários e moderação
- Spec 09 — Edição e exclusão de ocorrências
- Spec 10 — Alteração de status e notificação por email

### Fase 5 — Validação do produto

Objetivo: validar os caminhos principais, permissões e estados de erro antes da entrega.

Specs:

- Spec 11 — Validação dos fluxos, permissões e estados de interface

## 14. Specs funcionais detalhadas

### Spec 01 — Cadastro e identificação de moradores

- **Fase:** Fase 1 — Base de acesso e perfis
- **Objetivo (o quê):** Permitir cadastrar um morador com seus dados básicos e associar suas futuras ações ao cadastro correto.
- **Intenção (por quê):** Criar uma identidade mínima, sem senha, para garantir autoria, comunicação e controle de permissões.
- **Contexto:** O projeto é um produto inicial sem cadastro existente. O cadastro será usado pelos fluxos de acesso, ocorrências, comentários e notificações.
- **Atores:** Morador; funcionário autorizado a auxiliar ou cadastrar um morador, se esse fluxo for disponibilizado.
- **Descrição do comportamento:** O sistema apresenta formulário para nome completo, email, torre/apartamento e telefone. Após validação, cria o cadastro. Email identifica o morador para o acesso sem senha. Se o email já existir, o sistema não cria duplicidade e informa o caminho adequado para continuar ou atualizar os dados.
- **Entradas e saídas:** Entram dados de identificação informados no formulário. Sai um cadastro confirmado e uma mensagem de sucesso ou erro.
- **Dados/entidades envolvidos (conceitual):** Morador: nome completo, email, torre/apartamento, telefone, perfil e datas de criação/atualização.
- **Estados e transições:** Não cadastrado → cadastro pendente de validação → cadastrado. Cadastro existente → atualização solicitada → dados atualizados, quando permitido.
- **Regras de negócio:** Email é obrigatório e deve identificar um único morador. Não há senha. Torre/apartamento e telefone são obrigatórios neste recorte.
- **Validações:** Nome completo não pode estar vazio; email deve ter formato válido; torre/apartamento e telefone devem conter valores não vazios; dados devem ser normalizados sem apagar a informação útil do usuário.
- **Fluxo do usuário (passo a passo):**
  1. Morador abre o cadastro.
  2. Preenche os quatro campos.
  3. Envia os dados.
  4. O sistema valida e informa o resultado.
- **Casos de borda e erros:** Email inválido, campos vazios, email já cadastrado ou falha de persistência devem impedir cadastro incompleto e mostrar mensagem acionável.
- **Impacto no existente:** Nenhum; o projeto não possui cadastro funcional.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um formulário válido, quando o morador enviar, então o sistema cria um único cadastro sem solicitar senha.
  - Dado um email já cadastrado, quando o morador tentar cadastrar novamente, então o sistema não duplica o cadastro.
  - Dado um campo obrigatório vazio, quando o formulário for enviado, então o sistema rejeita a operação e indica o campo.
- **Definição de pronto:** Cadastro criado, duplicidade tratada, validações testadas e mensagens de sucesso/erro disponíveis.
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** Recuperação de senha, importação em massa e gerenciamento de funcionários.

### Spec 02 — Acesso por link mágico e separação de áreas

- **Fase:** Fase 1 — Base de acesso e perfis
- **Objetivo (o quê):** Autenticar usuários por link mágico e direcioná-los à área de morador ou à área administrativa correspondente ao perfil.
- **Intenção (por quê):** Remover a necessidade de senhas sem deixar o sistema aberto a qualquer email.
- **Contexto:** Depende do cadastro de perfis e será usado por todas as ações protegidas.
- **Atores:** Morador; funcionário.
- **Descrição do comportamento:** O usuário informa o email. O sistema verifica se há cadastro habilitado, envia link mágico com validade limitada e, após o clique, cria sessão autenticada. O usuário é direcionado à área compatível com seu perfil. Links expirados, usados ou inválidos devem ser recusados.
- **Entradas e saídas:** Entra email e, depois, token do link. Sai sessão autenticada, redirecionamento e mensagens de resultado.
- **Dados/entidades envolvidos (conceitual):** Usuário: email, perfil, status de acesso e sessão; link de acesso: token, validade e uso.
- **Estados e transições:** Desconectado → email informado → link enviado → link validado → autenticado; link enviado → expirado ou utilizado → acesso recusado.
- **Regras de negócio:** Apenas emails cadastrados e habilitados podem receber acesso. Moradores não entram no dashboard administrativo. Funcionários não dependem de senha.
- **Validações:** Email válido, cadastro existente, perfil permitido, token íntegro, não expirado e não utilizado.
- **Fluxo do usuário (passo a passo):**
  1. Usuário informa email.
  2. Solicita acesso.
  3. Recebe e abre o link.
  4. O sistema valida o link e cria a sessão.
  5. O sistema redireciona conforme o perfil.
- **Casos de borda e erros:** Email não cadastrado, link expirado, link já utilizado, solicitação repetida e falha de email devem gerar respostas seguras sem revelar dados desnecessários.
- **Impacto no existente:** Introduz o controle de acesso do produto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um email habilitado, quando o usuário solicitar acesso, então recebe um link mágico.
  - Dado um link válido, quando o usuário o abrir, então recebe uma sessão e a área correta.
  - Dado um link expirado, quando o usuário tentar utilizá-lo, então o sistema nega acesso e oferece nova solicitação.
- **Definição de pronto:** Acesso dos dois perfis funciona, áreas são separadas e tokens inválidos não autenticam usuários.
- **Dependências:** Spec 01 — cadastro de usuários e perfis.
- **Fora do escopo desta spec:** Alteração de perfil pelo próprio usuário e autenticação social.

### Spec 03 — Cadastro e acesso de funcionários

- **Fase:** Fase 1 — Base de acesso e perfis
- **Objetivo (o quê):** Disponibilizar funcionários habilitados para acessar o dashboard com as mesmas permissões entre si.
- **Intenção (por quê):** Garantir que a operação administrativa tenha um espaço protegido e que qualquer funcionário autorizado consiga tratar ocorrências.
- **Contexto:** Usa o mesmo acesso por link mágico, mas com perfil administrativo.
- **Atores:** Funcionário responsável pelo cadastro inicial; funcionário cadastrado.
- **Descrição do comportamento:** O sistema mantém o perfil de funcionário com nome e email. Funcionários habilitados acessam o dashboard por link mágico e veem todas as ocorrências. Todos têm o mesmo conjunto de permissões neste recorte.
- **Entradas e saídas:** Entram nome, email e solicitação de acesso. Sai perfil administrativo habilitado ou acesso recusado.
- **Dados/entidades envolvidos (conceitual):** Funcionário: nome, email, perfil, status habilitado e datas de acesso.
- **Estados e transições:** Não habilitado → habilitado → autenticado; habilitado → desabilitado → acesso recusado.
- **Regras de negócio:** Não há níveis distintos de funcionário. Cadastro de funcionário não deve ser aberto a qualquer pessoa sem uma operação administrativa segura.
- **Validações:** Email válido, cadastro autorizado, perfil de funcionário e status habilitado.
- **Fluxo do usuário (passo a passo):**
  1. Um responsável cadastra ou habilita o funcionário.
  2. O funcionário informa seu email na entrada administrativa.
  3. Recebe e abre o link mágico.
  4. Acessa o dashboard.
- **Casos de borda e erros:** Funcionário não habilitado, email inexistente, link inválido ou sessão expirada devem impedir acesso e mostrar mensagem genérica.
- **Impacto no existente:** Introduz a área administrativa e o perfil de funcionário.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um funcionário habilitado, quando abrir um link válido, então acessa o dashboard.
  - Dado um funcionário habilitado, quando consultar uma ocorrência, então pode administrá-la.
  - Dado um email sem perfil de funcionário, quando tentar acessar o dashboard, então o sistema nega o acesso.
- **Definição de pronto:** Funcionário habilitado acessa, funcionário não habilitado é bloqueado e permissões são uniformes.
- **Dependências:** Spec 02 — acesso por link mágico.
- **Fora do escopo desta spec:** Hierarquia, auditoria avançada e gestão completa de funcionários.

### Spec 04 — Criação de ocorrência

- **Fase:** Fase 2 — Registro de ocorrências
- **Objetivo (o quê):** Permitir ao morador registrar um problema com informações suficientes para que o condomínio identifique e acompanhe a situação.
- **Intenção (por quê):** Substituir comunicações informais por registros pesquisáveis e atribuídos a um autor.
- **Contexto:** O morador já está autenticado. A ocorrência será exibida na listagem geral e no dashboard.
- **Atores:** Morador autenticado.
- **Descrição do comportamento:** O formulário solicita título ou descrição, categoria fixa e local. O local permite indicar torre/apartamento ou área comum. A ocorrência é salva com status `Aberta` e vínculo ao morador autenticado. Após sucesso, o sistema exibe confirmação e permite acessar o detalhe.
- **Entradas e saídas:** Entram dados textuais, categoria e local. Sai ocorrência criada, status inicial e confirmação.
- **Dados/entidades envolvidos (conceitual):** Ocorrência: autor, título/descrição, categoria, local, status, datas, foto opcional e histórico de alterações.
- **Estados e transições:** Rascunho do formulário → enviada → criada como `Aberta`; envio inválido → rejeitado.
- **Regras de negócio:** Categoria é fixa; local pode ser unidade ou área comum; status inicial é `Aberta`; autoria vem da sessão, não de um campo editável.
- **Validações:** Campos obrigatórios preenchidos, categoria pertencente à lista, limite de tamanho textual e usuário autenticado.
- **Fluxo do usuário (passo a passo):**
  1. Morador abre nova ocorrência.
  2. Preenche descrição, categoria e local.
  3. Opcionalmente anexa foto.
  4. Envia.
  5. Sistema valida, salva e mostra confirmação.
- **Casos de borda e erros:** Sessão expirada, categoria inválida, textos vazios, falha de persistência ou upload devem manter o formulário recuperável e não criar ocorrência parcial.
- **Impacto no existente:** Cria o fluxo central do produto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um morador autenticado e formulário válido, quando enviar, então uma ocorrência é criada com status `Aberta`.
  - Dado categoria inválida ou campo obrigatório vazio, quando enviar, então a ocorrência não é criada.
  - Dado local de área comum ou de torre/apartamento, quando enviar, então o valor informado é preservado.
- **Definição de pronto:** Criação funciona com e sem foto, valida entradas, vincula autoria e define status inicial.
- **Dependências:** Spec 02 e Spec 01.
- **Fora do escopo desta spec:** Alteração de status, comentários e relatórios.

### Spec 05 — Upload e visualização da foto da ocorrência

- **Fase:** Fase 2 — Registro de ocorrências
- **Objetivo (o quê):** Permitir anexar e consultar uma foto opcional relacionada à ocorrência.
- **Intenção (por quê):** Dar ao condomínio evidência visual do problema sem tornar o cadastro obrigatório ou pesado.
- **Contexto:** Complementa a Spec 04 e deve respeitar o armazenamento seguro de arquivos.
- **Atores:** Morador autor; funcionário.
- **Descrição do comportamento:** O usuário seleciona no máximo uma imagem JPG ou PNG dentro do limite definido pelo produto. O sistema valida antes de armazenar, associa a imagem à ocorrência e mostra prévia ou imagem no detalhe. Em edição, o autor ou funcionário pode substituir ou remover a foto.
- **Entradas e saídas:** Entra um arquivo de imagem opcional. Sai foto armazenada e referência visual no detalhe, ou mensagem de erro.
- **Dados/entidades envolvidos (conceitual):** Foto: ocorrência associada, nome/tipo, tamanho, localização segura e datas.
- **Estados e transições:** Sem foto → selecionada → validada → armazenada; foto armazenada → substituída ou removida.
- **Regras de negócio:** Máximo de uma foto; apenas JPG/PNG; foto é opcional; somente usuários autorizados podem alterar a foto.
- **Validações:** Tipo real do arquivo, tamanho máximo, quantidade, upload autenticado e vínculo à ocorrência autorizada.
- **Fluxo do usuário (passo a passo):**
  1. Usuário escolhe uma imagem no formulário.
  2. Sistema informa se ela atende aos limites.
  3. Ao salvar a ocorrência, armazena e associa a imagem.
  4. Usuário consulta a imagem no detalhe.
- **Casos de borda e erros:** Arquivo inválido, grande demais, upload interrompido, imagem indisponível ou substituição falha devem deixar a ocorrência sem alteração indevida e informar o problema.
- **Impacto no existente:** Adiciona armazenamento de imagens ao produto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado uma imagem JPG/PNG dentro do limite, quando a ocorrência for salva, então a imagem fica associada a ela.
  - Dado um segundo arquivo, quando o usuário tentar anexá-lo, então o sistema rejeita ou exige substituição explícita.
  - Dado um arquivo inválido, quando o usuário tentar enviá-lo, então o sistema não o armazena.
- **Definição de pronto:** Upload, consulta, substituição, remoção e falhas estão tratados.
- **Dependências:** Spec 04.
- **Fora do escopo desta spec:** Galeria, múltiplas imagens, vídeos e edição de imagem.

### Spec 06 — Listagem geral e filtros de ocorrências

- **Fase:** Fase 3 — Consulta e filtros
- **Objetivo (o quê):** Exibir todas as ocorrências do condomínio e permitir filtragem por status e categoria.
- **Intenção (por quê):** Dar transparência aos moradores e permitir que usuários encontrem rapidamente ocorrências relevantes.
- **Contexto:** Moradores veem todas as ocorrências; funcionários veem as mesmas ocorrências com ações administrativas.
- **Atores:** Morador autenticado; funcionário autenticado.
- **Descrição do comportamento:** A listagem apresenta ocorrências resumidas com descrição/título, categoria, local, status, autor e datas. Filtros independentes de status e categoria podem ser combinados e removidos. A tela mantém a seleção na navegação e informa quando não há resultados.
- **Entradas e saídas:** Entram filtros opcionais. Sai lista filtrada, contagem ou estado vazio/erro.
- **Dados/entidades envolvidos (conceitual):** Ocorrência resumida: identificação, categoria, local, status, autor e datas.
- **Estados e transições:** Carregando → resultados; carregando → vazio; carregando → erro; filtros alterados → nova lista.
- **Regras de negócio:** Apenas ocorrências não excluídas aparecem; moradores podem consultar todas; ações exibidas dependem do perfil e autoria.
- **Validações:** Filtros devem aceitar apenas status e categorias válidos; usuário deve estar autenticado.
- **Fluxo do usuário (passo a passo):**
  1. Usuário abre a listagem.
  2. Consulta ocorrências.
  3. Seleciona status e/ou categoria.
  4. Sistema atualiza a lista.
  5. Usuário abre um item para ver detalhes.
- **Casos de borda e erros:** Nenhuma ocorrência, filtro sem resultado, falha de leitura e sessão expirada devem ter estados claros.
- **Impacto no existente:** Cria a principal tela de consulta do produto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado ocorrências cadastradas, quando o usuário abrir a listagem, então visualiza todas as não excluídas.
  - Dado um filtro de status e categoria, quando aplicá-los, então apenas ocorrências compatíveis aparecem.
  - Dado nenhum resultado, quando o filtro for aplicado, então a tela informa que não há ocorrências correspondentes.
- **Definição de pronto:** Listagem, filtros combinados, estados vazio/erro e navegação ao detalhe funcionam para os dois perfis.
- **Dependências:** Spec 04 e Spec 02.
- **Fora do escopo desta spec:** Busca textual, gráficos e exportação.

### Spec 07 — Detalhe da ocorrência e histórico de comentários

- **Fase:** Fase 3 — Consulta e filtros
- **Objetivo (o quê):** Exibir o contexto completo de uma ocorrência e seu histórico de comentários.
- **Intenção (por quê):** Concentrar as informações necessárias para entender o problema e acompanhar sua resolução.
- **Contexto:** Acessada pela listagem e utilizada pelas specs de comentários e gestão.
- **Atores:** Morador autenticado; funcionário autenticado.
- **Descrição do comportamento:** O detalhe exibe descrição/título, categoria, local, status, autor, datas, foto e comentários em ordem cronológica. Mostra ações disponíveis conforme perfil e autoria. Ocorrência inexistente, excluída ou não autorizada deve apresentar estado apropriado.
- **Entradas e saídas:** Entra identificador da ocorrência. Sai dados completos e ações permitidas.
- **Dados/entidades envolvidos (conceitual):** Ocorrência completa; morador autor; foto; comentários com autor, conteúdo e datas.
- **Estados e transições:** Solicitação → carregando → detalhe exibido; solicitação → não encontrado; comentário novo → histórico atualizado.
- **Regras de negócio:** Moradores podem abrir qualquer ocorrência; ações de edição/exclusão/status dependem da autoria; funcionários têm controle geral.
- **Validações:** Identificador válido, sessão autenticada e ocorrência existente e não excluída.
- **Fluxo do usuário (passo a passo):**
  1. Usuário seleciona uma ocorrência.
  2. Sistema carrega dados e comentários.
  3. Usuário consulta foto e histórico.
  4. Usuário executa uma ação permitida ou retorna à lista.
- **Casos de borda e erros:** Identificador inválido, ocorrência excluída durante a consulta e falha de leitura devem mostrar mensagem sem expor dados internos.
- **Impacto no existente:** Cria o ponto de integração dos fluxos de interação.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado uma ocorrência existente, quando o usuário abrir o detalhe, então vê seus dados e comentários.
  - Dado uma ocorrência excluída ou inexistente, quando o usuário abrir seu endereço, então recebe estado de não encontrado.
  - Dado um morador não autor, quando abrir o detalhe, então pode consultar, mas não vê ações exclusivas do autor.
- **Definição de pronto:** Detalhe completo, permissões visíveis corretamente e estados de erro cobertos.
- **Dependências:** Spec 06 e Spec 04.
- **Fora do escopo desta spec:** Edição, comentários e alteração de status; esses comportamentos são detalhados em specs próprias.

### Spec 08 — Comentários e moderação

- **Fase:** Fase 4 — Interação e gestão
- **Objetivo (o quê):** Permitir conversa contextual na ocorrência e controlar alterações e exclusões conforme autoria.
- **Intenção (por quê):** Evitar comunicação dispersa e manter esclarecimentos junto ao registro do problema.
- **Contexto:** Comentários aparecem no detalhe da ocorrência.
- **Atores:** Morador autenticado; funcionário autenticado.
- **Descrição do comportamento:** Usuário autenticado escreve e publica comentário em uma ocorrência existente. O comentário mostra autor e data. O autor morador pode editar/excluir o próprio comentário; funcionários podem editar/excluir qualquer comentário. O sistema pede confirmação para exclusão e atualiza o histórico após sucesso.
- **Entradas e saídas:** Entra texto do comentário e identificador da ocorrência. Sai comentário persistido ou mensagem de validação/erro.
- **Dados/entidades envolvidos (conceitual):** Comentário: ocorrência, autor, perfil, conteúdo, datas de criação/atualização e estado de exclusão.
- **Estados e transições:** Campo vazio → edição; texto válido → publicado; publicado → editado ou excluído; falha → mantido sem alteração.
- **Regras de negócio:** Apenas autenticados comentam; moradores controlam os próprios comentários; funcionários controlam todos; comentários devem pertencer a ocorrências existentes.
- **Validações:** Texto não vazio, tamanho máximo, sessão válida, ocorrência válida e permissão para editar/excluir.
- **Fluxo do usuário (passo a passo):**
  1. Usuário abre o detalhe.
  2. Escreve comentário.
  3. Publica.
  4. Consulta ou edita o próprio comentário quando permitido.
  5. Confirma exclusão quando necessário.
- **Casos de borda e erros:** Texto vazio, ocorrência excluída, sessão expirada, permissão negada e falha de gravação não devem apagar ou publicar parcialmente o comentário.
- **Impacto no existente:** Adiciona colaboração ao detalhe da ocorrência.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado usuário autenticado e texto válido, quando publicar, então o comentário aparece na ocorrência com autoria e data.
  - Dado comentário de outro morador, quando esse morador tentar editá-lo ou excluí-lo, então o sistema nega a ação.
  - Dado funcionário autenticado, quando moderar qualquer comentário, então a alteração permitida é concluída.
- **Definição de pronto:** Criar, editar, excluir, ordenar e proteger comentários estão funcionando.
- **Dependências:** Spec 07 e Spec 02.
- **Fora do escopo desta spec:** Menções, anexos em comentários, reações e chat em tempo real.

### Spec 09 — Edição e exclusão de ocorrências

- **Fase:** Fase 4 — Interação e gestão
- **Objetivo (o quê):** Permitir corrigir informações ou remover ocorrências por seus autores e funcionários autorizados.
- **Intenção (por quê):** Corrigir erros de registro e dar ao condomínio capacidade de remover conteúdo indevido ou duplicado.
- **Contexto:** Ações partem do detalhe da ocorrência. Funcionários podem agir sobre qualquer ocorrência; moradores apenas sobre as próprias.
- **Atores:** Morador autor; funcionário.
- **Descrição do comportamento:** Usuário autorizado abre edição, altera campos permitidos e salva após validação. Para excluir, confirma a intenção. O sistema remove a ocorrência da consulta normal, trata sua foto e impede novos comentários nela.
- **Entradas e saídas:** Entram alterações de título/descrição, categoria, local e foto, ou confirmação de exclusão. Sai ocorrência atualizada/removida e mensagem de resultado.
- **Dados/entidades envolvidos (conceitual):** Ocorrência, autor, categoria, local, status, foto e comentários relacionados.
- **Estados e transições:** Existente → edição → atualizada; existente → exclusão confirmada → excluída; ação não autorizada → rejeitada.
- **Regras de negócio:** Morador só edita/exclui a própria; funcionário edita/exclui qualquer; categoria continua fixa; exclusão não deve deixar o item na listagem normal.
- **Validações:** Permissão, identificador, campos obrigatórios, categoria válida e consistência do anexo.
- **Fluxo do usuário (passo a passo):**
  1. Usuário autorizado abre edição ou exclusão.
  2. Altera dados ou confirma remoção.
  3. Sistema valida a permissão e a entrada.
  4. Salva a edição ou conclui a exclusão.
  5. Atualiza o detalhe/listagem.
- **Casos de borda e erros:** Concorrência, ocorrência já excluída, sessão expirada, falha de foto ou persistência devem impedir mudanças parciais.
- **Impacto no existente:** Afeta listagem, detalhe, comentários e foto.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado o autor da ocorrência, quando salvar uma edição válida, então os dados atualizados aparecem no detalhe.
  - Dado morador não autor, quando tentar editar ou excluir, então o sistema nega a ação.
  - Dado exclusão confirmada, quando concluída, então a ocorrência não aparece na listagem normal nem aceita novos comentários.
- **Definição de pronto:** Permissões, edição, confirmação, exclusão e consistência com foto/comentários estão cobertas.
- **Dependências:** Spec 04, Spec 05 e Spec 07.
- **Fora do escopo desta spec:** Recuperação de ocorrência excluída e trilha de auditoria detalhada.

### Spec 10 — Alteração de status e notificação por email

- **Fase:** Fase 4 — Interação e gestão
- **Objetivo (o quê):** Permitir alterar o status da ocorrência e notificar o morador autor por email.
- **Intenção (por quê):** Tornar o andamento visível e garantir que o morador receba retorno quando o estado mudar.
- **Contexto:** Morador autor e funcionário podem alterar status. A notificação é enviada somente em alteração efetiva de status.
- **Atores:** Morador autor; funcionário.
- **Descrição do comportamento:** Usuário autorizado escolhe um dos cinco status válidos e confirma. O sistema salva a mudança, atualiza a interface e envia email ao morador autor. Repetir o mesmo status não deve gerar nova notificação. Falha no envio deve ser registrada e comunicada sem desfazer automaticamente a alteração persistida, salvo se a política do produto definir transação conjunta.
- **Entradas e saídas:** Entra ocorrência, novo status e sessão. Sai ocorrência atualizada, histórico/feedback e tentativa de notificação.
- **Dados/entidades envolvidos (conceitual):** Ocorrência, status anterior/novo, autor, momento da alteração e notificação de email.
- **Estados e transições:** `Aberta` ↔ `Em análise`/`Em andamento`/`Resolvida`/`Cancelada`, conforme decisão autorizada; status sem mudança → nenhuma transição.
- **Regras de negócio:** Apenas autor ou funcionário altera status; novo valor deve ser válido; mudança efetiva dispara email; todos os funcionários têm a mesma permissão.
- **Validações:** Sessão, autoria/perfil, ocorrência existente, status permitido e email do morador.
- **Fluxo do usuário (passo a passo):**
  1. Usuário autorizado abre o seletor de status.
  2. Escolhe novo status.
  3. Confirma a alteração.
  4. Sistema salva e atualiza o detalhe/listagem.
  5. Sistema tenta enviar email ao morador autor.
- **Casos de borda e erros:** Status inválido, ocorrência excluída, permissão negada, email ausente/ inválido e falha de envio devem gerar feedback claro; uma falha de email não deve ocultar a situação real da ocorrência.
- **Impacto no existente:** Afeta listagem, detalhe e comunicação com o morador.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado autor ou funcionário autenticado, quando selecionar um status diferente, então a ocorrência passa ao novo status.
  - Dado status igual ao atual, quando confirmar, então o sistema não cria alteração nem envia email redundante.
  - Dado mudança efetiva e email válido, quando a operação for concluída, então o morador recebe notificação do novo status.
- **Definição de pronto:** Todos os status são aceitos, permissões são respeitadas, alterações refletem nas listas e emails são tratados.
- **Dependências:** Spec 07 e Spec 02.
- **Fora do escopo desta spec:** Notificações por criação/comentário, preferências de email e automações de status.

### Spec 11 — Validação dos fluxos, permissões e estados de interface

- **Fase:** Fase 5 — Validação do produto
- **Objetivo (o quê):** Validar ponta a ponta os fluxos críticos do morador e do funcionário, incluindo erros e permissões.
- **Intenção (por quê):** Evitar que o sistema pareça funcional, mas permita acesso indevido ou deixe dados inconsistentes.
- **Contexto:** Reúne as specs anteriores para validação integrada, sem adicionar uma funcionalidade de negócio nova.
- **Atores:** Morador autor, morador não autor, funcionário e usuário não autenticado.
- **Descrição do comportamento:** Validar cadastro/acesso, criação com e sem foto, listagem/filtros, detalhe, comentários, edição/exclusão, mudança de status, email e estados vazio, carregando e erro. As permissões devem ser verificadas por ação e não apenas pela interface visível.
- **Entradas e saídas:** Entram cenários válidos e inválidos. Saem evidências de que cada critério de aceite é reproduzível e de que erros não corrompem o estado.
- **Dados/entidades envolvidos (conceitual):** Usuário, perfil, sessão, ocorrência, foto, comentário, status e notificação.
- **Estados e transições:** Abrange todas as transições descritas nas specs 01 a 10, incluindo falhas e recuperação.
- **Regras de negócio:** Todas as regras R1–R17 devem ser verificadas.
- **Validações:** Autenticação, autorização, entradas inválidas, duplicidade, limites de foto, status/categoria e consistência após erro.
- **Fluxo do usuário (passo a passo):**
  1. Executar cenários de morador.
  2. Executar cenários de funcionário.
  3. Repetir ações com usuário sem permissão.
  4. Simular entradas inválidas e falhas relevantes.
  5. Confirmar listagens, detalhes, emails e mensagens.
- **Casos de borda e erros:** Nenhum resultado, link expirado, sessão expirada, duplicidade, upload inválido, ocorrência excluída e falha de email devem possuir comportamento definido.
- **Impacto no existente:** Valida todo o produto inicial.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado morador não autor, quando tentar alterar ocorrência de outro morador, então a operação é recusada no servidor e a ocorrência permanece intacta.
  - Dado funcionário autenticado, quando editar qualquer ocorrência e comentário, então as alterações permitidas são refletidas.
  - Dado falha em uma ação, quando o usuário tentar novamente, então não há registros duplicados ou parcialmente gravados.
- **Definição de pronto:** Fluxos críticos, permissões, validações, estados de interface e notificações foram verificados e não há critério de aceite pendente.
- **Dependências:** Specs 01 a 10.
- **Fora do escopo desta spec:** Teste de carga em escala de produção, auditoria de segurança externa e monitoramento operacional avançado.

## 15. Ordem recomendada de implementação

1. Spec 01 — Cadastro e identificação de moradores
2. Spec 02 — Acesso por link mágico e separação de áreas
3. Spec 03 — Cadastro e acesso de funcionários
4. Spec 04 — Criação de ocorrência
5. Spec 05 — Upload e visualização da foto da ocorrência
6. Spec 06 — Listagem geral e filtros de ocorrências
7. Spec 07 — Detalhe da ocorrência e histórico de comentários
8. Spec 08 — Comentários e moderação
9. Spec 09 — Edição e exclusão de ocorrências
10. Spec 10 — Alteração de status e notificação por email
11. Spec 11 — Validação dos fluxos, permissões e estados de interface

Essa ordem estabelece primeiro identidade e acesso, depois o registro central, consulta, interação e administração. Assim, cada spec recebe as entidades e permissões de que depende antes de ser implementada, reduzindo retrabalho e evitando fluxos incompletos.

## Análise crítica do recorte

- O escopo é viável para um produto inicial, desde que o dashboard não seja ampliado com relatórios, métricas ou outros módulos de condomínio.
- A decisão de permitir que moradores vejam todas as ocorrências favorece transparência, mas exige cuidado para não expor telefone ou outros dados pessoais desnecessários na listagem e no detalhe.
- Como moradores podem excluir ocorrências e alterar status, o produto deve deixar claro no futuro se haverá histórico/auditoria; esse recurso foi mantido fora do escopo para preservar a primeira entrega.
- A permissão para funcionários editarem e excluírem qualquer comentário exige uma interface clara de moderação, mesmo sem níveis diferentes de funcionário.
- O envio de email na alteração de status depende de configuração de um provedor de email; o PRD define o comportamento, mas não escolhe um fornecedor específico.
- O cadastro livre de torre/apartamento facilita a entrada inicial, porém pode produzir variações de texto. Uma padronização ou cadastro prévio das unidades pode ser considerada em outro recorte.
