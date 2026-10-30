# Biblioteca — app mobile

Aplicativo em **React Native + Expo (SDK 54, React Navigation e styled-components)** que consome a API de biblioteca em Spring Boot do repositório [API-DE-JAVA-](https://github.com/henriqueramoss-dev/API-DE-JAVA-).

## Telas

| Tela | O que faz |
|---|---|
| Início, Entrar e Criar conta | Boas-vindas; o login confere e-mail e senha na API (`POST /auth/login`) e o cadastro cria **Usuário (com senha) + Perfil** |
| Configurações | Engrenagem no cabeçalho do painel: tema claro/escuro/automático, lembretes de devolução (notificações locais), troca de senha e saída da conta |
| Painel | Empréstimos ativos, devolvidos e atrasados, totais de cada cadastro e atalhos |
| Empréstimos | Lista com filtro por status (`/emprestimos/buscar?status=`) |
| Livros | Lista com busca por título; ao tocar abre os **detalhes do livro**, com a situação (disponível ou emprestado) e o botão para registrar empréstimo |
| Autores, Categorias, Usuários e Perfis | Lista com busca, atualização ao puxar a tela e carregamento de mais itens ao rolar |
| Formulário | Cadastro e edição de qualquer entidade: seleção de livro, usuário, categoria e autores, datas no formato DD/MM/AAAA e erros de validação da API exibidos em cada campo |

Todas as listas permitem excluir registros, com confirmação.

## Como executar

1. Inicie a API (`biblioteca-api` no repositório API-DE-JAVA-). Ela deve responder em `http://localhost:8080`.
2. Instale as dependências e inicie o app:

   ```bash
   npm install
   npx expo start
   ```

3. Abra no Expo Go (versão compatível com o SDK 54), no emulador Android/iOS ou no navegador (tecla `w`).

### Endereço da API

Por padrão, o app procura a API no mesmo computador que está rodando o Expo, na porta 8080. Isso funciona no Expo Go do celular quando ele e o computador estão na mesma rede Wi-Fi.

Para usar outro endereço, crie um arquivo `.env` na raiz do projeto com a linha abaixo (trocando pelo IP do seu computador) e reinicie o Expo:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

## Armazenamento no aparelho e notificações

O app guarda no aparelho (AsyncStorage; no navegador, `localStorage`) apenas: o tema escolhido, a escolha dos lembretes e, depois de entrar, o `id`, o nome e o e-mail da conta. **A senha não é guardada.** Tocar em **Sair** apaga a conta do aparelho.

Os lembretes de devolução são notificações **locais** (`expo-notifications`): ao ligar a chave, o app pede permissão e agenda um aviso às 9h da véspera da devolução de cada empréstimo ativo. Eles são refeitos sempre que o painel abre. Não funcionam na versão web. No **Expo Go para Android** as notificações remotas não existem desde o SDK 53 e a biblioteca mostra um aviso; para testar os lembretes por lá, use um *development build*.

## Estrutura

```text
App.js                    navegação (React Navigation) e tema
index.js                  ponto de entrada do Expo
src/
  screens/<tela>/         uma pasta por tela: index.jsx (lógica) + style.js (estilos)
    inicio, login, cadastro, painel
    emprestimos, livros, autores, categorias, usuarios, perfis   listagens
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
