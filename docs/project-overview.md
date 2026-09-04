# Visão geral do projeto

Última atualização: 2026-09-04

## Produto

O CondoManager é um sistema web para registrar, acompanhar e resolver ocorrências de um condomínio. Moradores e funcionários acessam áreas distintas com email e senha.

## Funcionalidades implementadas

- Cadastro de moradores com nome, email, senha, torre/apartamento e telefone.
- Cadastro inicial de funcionários limitado por `INITIAL_STAFF_EMAILS`.
- Autenticação por email e senha com separação por perfil.
- Listagem paginada de ocorrências para moradores e funcionários.
- Filtros por status e categoria.
- Criação de ocorrência por morador com título, descrição, categoria e local.
- Upload opcional de uma foto JPG ou PNG de até 5 MB.
- Visualização de detalhes, autor, status, foto e comentários.
- Edição e exclusão de ocorrências pelo autor ou por funcionários.
- Alteração de status pelo autor ou por funcionários.
- Comentários para usuários autenticados.
- Edição e exclusão de comentários próprios por moradores e de qualquer comentário por funcionários.
- Notificação por email ao morador quando o status muda, quando o serviço de email está configurado.

## Regras principais

As categorias são fixas: manutenção, segurança, limpeza, barulho, iluminação, elevador, garagem, áreas comuns e outros. Os status são aberta, em análise, em andamento, resolvida e cancelada.

Ocorrências e comentários usam exclusão lógica. Cada ocorrência pode ter no máximo uma foto. O acesso aos dados é protegido por autenticação e políticas RLS do Supabase.

## Áreas da aplicação

- `/`: apresentação pública do sistema.
- `/cadastro`: cadastro de moradores.
- `/cadastro-funcionario`: primeiro acesso de funcionários autorizados.
- `/login`: autenticação.
- `/morador/ocorrencias`: área do morador.
- `/morador/ocorrencias/nova`: criação de ocorrência.
- `/morador/ocorrencias/[id]`: detalhe e interação do morador.
- `/admin`: dashboard de funcionários.
- `/admin/ocorrencias/[id]`: detalhe e administração por funcionário.

## Fonte de dados

O Supabase Auth gerencia credenciais. O Postgres armazena perfis, contatos, ocorrências, fotos e comentários. O Storage mantém as fotos no bucket privado `occurrence-photos`.
