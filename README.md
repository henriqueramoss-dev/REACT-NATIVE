# Biblioteca — app mobile

Aplicativo em **React Native + Expo (SDK 54, React Navigation e styled-components)** que consome a API de biblioteca em Spring Boot do repositório [API-BIBLIOTECA](https://github.com/henriqueramoss-dev/API-BIBLIOTECA).

## Duas experiências, como no site

O app tem o mesmo desenho do site, com layout de celular. **O tipo do usuário decide a tela depois do login**: quem é da equipe da biblioteca (tipo Funcionário) abre o **painel de gestão**; clientes (Aluno, Professor e Visitante) abrem o **catálogo** e as **reservas**. O visitante pode ver o catálogo sem entrar.

O login gera uma **chave de API** (`POST /chaves-api`), que o app envia no cabeçalho `X-API-Key`. A senha nunca é guardada. Funcionário recebe uma chave ADMIN; cliente, LEITURA (só vê o catálogo e as próprias reservas, nunca dados de outras pessoas). Sair revoga a chave no servidor. Se a chave deixar de valer (revogada, ou a API reiniciou), o app volta para a tela de entrada.

### Área do cliente

| Tela | O que faz |
|---|---|
| Catálogo | Livros em duas colunas, com busca por título, filtro por categoria e a situação de cada livro (Disponível ou Indisponível). O botão Reservar leva ao login se o visitante não entrou |
| Livro | Ficha do livro (categoria, onde encontrar, editora, ano, páginas, ISBN) e o botão de reservar |
| Minhas reservas | Reservas aguardando retirada (com o último dia para retirar), empréstimos e devoluções; permite cancelar uma reserva |

Regras (as mesmas do site): a reserva separa o livro por 3 dias; cada pessoa pode ter até 3 reservas; livro emprestado ou já reservado por outra pessoa não pode ser reservado.

### Painel da biblioteca (equipe)

| Tela | O que faz |
|---|---|
| Início, Entrar e Criar conta | Boas-vindas; o cadastro cria só contas de **Aluno ou Visitante** (a API não aceita outros tipos no cadastro aberto) e já entra sozinho; a matrícula é gerada pela API |
| Configurações | Engrenagem no cabeçalho: tema claro/escuro/automático, capas reais de livros, lembretes de devolução (notificações locais), troca de senha e saída da conta |
| Painel | Empréstimos ativos, devolvidos, atrasados e reservados, totais de cada cadastro e atalhos |
| Empréstimos | Lista com filtro por status (`/emprestimos/buscar?status=`). Em uma reserva, o botão **Confirmar retirada** a transforma em empréstimo ativo por 14 dias |
| Livros | Lista com busca por título; ao tocar abre os **detalhes do livro**, com a situação (disponível ou emprestado) e o botão para registrar empréstimo |
| Autores, Categorias, Usuários e Carteirinhas | Lista com busca, atualização ao puxar a tela e carregamento de mais itens ao rolar |
| Formulário | Cadastro e edição de qualquer entidade: seleção de livro, usuário, categoria e autores, datas no formato DD/MM/AAAA e erros de validação da API exibidos em cada campo. No cadastro de usuário, a **senha de acesso** é definida aqui (sem ela, a pessoa não consegue entrar). A carteirinha já abre com emissão de hoje e validade de 1 ano |

Os botões seguem o nível de acesso da chave: criar e editar (ESCRITA) e excluir (ADMIN), sempre com confirmação.

## Como executar

1. O app já usa a API publicada em `https://api-biblioteca-xgsa.onrender.com`, que carrega um acervo de exemplo. Para entrar como cliente, use `beatriz@exemplo.com` / `Cliente12345`; para o painel, a conta do dono configurada na API (`BIBLIOTECA_DONO_EMAIL` e `BIBLIOTECA_DONO_SENHA`).
2. Instale as dependências e inicie o app:

   ```bash
   npm install
   npx expo start
   ```

3. Abra no Expo Go (versão compatível com o SDK 54), no emulador Android/iOS ou no navegador (tecla `w`).

### Endereço da API

Por padrão, o app usa a API publicada na Render, tanto no desenvolvimento quanto no app instalado:

```text
https://api-biblioteca-xgsa.onrender.com
```

Para usar outra API (por exemplo, uma que rode no seu computador, que o celular alcança pelo IP dele na rede Wi-Fi), crie um arquivo `.env` na raiz do projeto com a linha abaixo, trocando pelo endereço, e reinicie o Expo:

```bash
EXPO_PUBLIC_API_URL=https://api-biblioteca-xgsa.onrender.com
```

Na API gratuita da Render, a primeira abertura depois de um tempo parada leva cerca de 1 minuto.

## Visual de biblioteca e capas de livros

O app usa uma paleta de papel, couro e madeira (a mesma do site), títulos com serifa e ilustrações em SVG desenhadas no projeto: estante (abertura), livro aberto (entrar e criar conta), faixa de lombadas (painel), pilha de livros (listas vazias) e capas ilustradas (livros). As ilustrações ficam em `src/components/ilustracoes`.

As **capas reais** dos livros vêm do [Open Library](https://openlibrary.org), buscadas pelo ISBN (`src/utils/capas.js`). Se o livro não tiver capa lá, ou se estiver sem internet, aparece a capa ilustrada. O Open Library recebe o ISBN e o endereço de internet do aparelho; para evitar isso, desligue em **Configurações → Capas dos livros**.

## Armazenamento no aparelho e notificações

O app guarda no aparelho (AsyncStorage; no navegador, `localStorage`) apenas: o tema escolhido, a escolha das capas reais, a escolha dos lembretes e, depois de entrar, o `id`, o nome e o e-mail da conta. **A senha não é guardada.** Tocar em **Sair** apaga a conta do aparelho.

Os lembretes de devolução são notificações **locais** (`expo-notifications`): ao ligar a chave, o app pede permissão e agenda um aviso às 9h da véspera da devolução de cada empréstimo ativo. Eles são refeitos sempre que o painel abre. Não funcionam na versão web. No **Expo Go para Android** as notificações remotas não existem desde o SDK 53 e a biblioteca mostra um aviso; para testar os lembretes por lá, use um *development build*.

## Estrutura

```text
App.js                    navegação (React Navigation) e tema
index.js                  ponto de entrada do Expo
src/
  screens/<tela>/         uma pasta por tela: index.jsx (lógica) + style.js (estilos)
    inicio, login, cadastro, painel
    emprestimos, livros, autores, categorias, usuarios, carteirinhas   listagens
    livro-detalhes        detalhes do livro e situação de empréstimo
    formulario            cadastro/edição genérico
    configuracoes         tema, notificações, troca de senha e sair da conta
  components/<nome>/      componentes reutilizáveis, também com index.jsx + style.js
    resource-list, form-field, option-picker, status-badge, brand-mark ...
  services/
    biblioteca-api.ts     cliente HTTP (paginação HATEOAS e erros da API)
    resources.ts          campos, busca e exibição de cada entidade
  contexts/               tema (theme-context.tsx), conta logada (auth-context.jsx) e preferências (preferencias-context.jsx)
  utils/                  datas, diálogos, armazenamento no aparelho, lembretes, cores do tema, rotas e ícones
```

Veja `ESTRUTURA-DO-APP.md` para entender como as telas se organizam.

Para incluir um novo campo ou entidade, basta descrevê-lo em `src/services/resources.ts`: as telas de lista e de formulário são montadas a partir dessa descrição.

## Scripts

```bash
npm run lint      # ESLint (expo lint)
npx tsc --noEmit  # verificação de tipos
```
