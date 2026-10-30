# Estrutura do app

O app segue a mesma organização do projeto **fingo**: telas e componentes em JavaScript, cada um na sua pasta com um arquivo de lógica (`index.jsx`) e um de estilos (`style.js`), e a navegação centralizada no `App.js`.

## Telas e componentes

```text
src/screens/login/
  index.jsx    a tela: estados, funções (handleLogin...) e o que aparece
  style.js     os estilos, com styled-components
```

- O nome da pasta é o nome da tela em minúsculas (`livro-detalhes`); o componente tem o mesmo nome em PascalCase (`LivroDetalhes`).
- No `index.jsx`, as funções que reagem a toques começam com `handle` (`handleSignUp`, `handleDelete`) e os comentários ficam em português.
- No `style.js`, cada elemento é um componente (`Container`, `Title`, `Btn`...) exportado no fim do arquivo, e o `index.jsx` só monta esses componentes.

## Navegação

O `App.js` registra cada tela com um nome (`Inicio`, `Login`, `Painel`...). As telas não recebem funções de navegação: elas usam `useNavigation()`.

```jsx
const navigation = useNavigation()

navigation.navigate("Cadastro")                              // abre a tela
navigation.navigate("Formulario", { recurso: "livros", id }) // abre com parâmetros
navigation.replace("Painel")                                 // troca a tela atual
```

Os parâmetros chegam na tela por `useRoute().params`.

| Nome no `App.js` | Pasta |
|---|---|
| `Inicio` | `src/screens/inicio` |
| `Login` | `src/screens/login` |
| `Cadastro` | `src/screens/cadastro` |
| `Painel` | `src/screens/painel` |
| `Emprestimos`, `Livros`, `Autores`, `Categorias`, `Usuarios`, `Perfis` | `src/screens/<nome>` (listagens) |
| `LivroDetalhes` | `src/screens/livro-detalhes` |
| `Formulario` | `src/screens/formulario` |
| `Configuracoes` | `src/screens/configuracoes` (aberta pela engrenagem do painel) |

## Cores e tema claro/escuro

As cores ficam em `src/contexts/theme-context.tsx`. O `App.js` entrega essas cores aos estilos pelo `ThemeProvider` do styled-components, e o `style.js` pega cada uma com `cor("nome")`:

```js
const Title = styled.Text`
    color: ${cor("text")};
`
```

Quando o celular muda para o modo escuro, as cores trocam sozinhas.

## Conta, preferências e armazenamento

| Arquivo | O que guarda |
|---|---|
| `src/contexts/auth-context.jsx` | Quem entrou (`id`, nome e e-mail). Funções `entrar`, `guardar` e `sair`. A senha nunca é guardada |
| `src/contexts/preferencias-context.jsx` | A escolha dos lembretes de devolução |
| `src/contexts/theme-context.tsx` | O tema (claro, escuro ou automático) |
| `src/utils/armazenamento.js` | `lerValor`, `gravarValor` e `apagarValor`, em cima do AsyncStorage |
| `src/utils/lembretes.js` | Agenda os avisos de devolução (notificações locais) |

Qualquer tela lê esses dados com `useAuth()`, `usePreferencias()` e `useAppTheme()`.

## JavaScript e TypeScript

- **JavaScript** (`.js`, `.jsx`): telas, componentes, `App.js` e funções em `src/utils`.
- **TypeScript** (`.ts`, `.tsx`): só a parte de dados, `src/services` (cliente da API e descrição dos recursos) e o tema (`theme-context.tsx`).

Os dois tipos de arquivo se importam normalmente. O TypeScript não confere os arquivos JavaScript, então um erro de tipo neles só aparece quando o app roda.
