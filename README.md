# Biblioteca — app mobile

Aplicativo em **React Native + Expo (SDK 54, Expo Router)** que consome a API de biblioteca em Spring Boot do repositório [API-DE-JAVA-](https://github.com/henriqueramoss-dev/API-DE-JAVA-).

## Telas

| Tela | O que faz |
|---|---|
| Início, Entrar e Criar conta | Boas-vindas; o login é demonstrativo (a API ainda não tem autenticação) e o cadastro cria **Usuário + Perfil** na API |
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

## Estrutura

```text
app/                      telas (Expo Router: cada arquivo é uma rota)
  formulario.tsx          cadastro/edição genérico (?recurso=livros&id=1)
  livro-detalhes.tsx      detalhes do livro e situação de empréstimo
  livros.tsx, autores.tsx ...  listagens
components/               lista, campos de formulário e seletor de opções
services/
  biblioteca-api.ts       cliente HTTP (paginação HATEOAS e erros da API)
  resources.ts            campos, busca e exibição de cada entidade
contexts/theme-context.tsx  tema claro/escuro
```

Para incluir um novo campo ou entidade, basta descrevê-lo em `services/resources.ts`: as telas de lista e de formulário são montadas a partir dessa descrição.

## Scripts

```bash
npm run lint      # ESLint (expo lint)
npx tsc --noEmit  # verificação de tipos
```
