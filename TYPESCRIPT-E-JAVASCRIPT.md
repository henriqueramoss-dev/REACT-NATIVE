# TypeScript e JavaScript no app

O app mistura os dois de propósito, para ficar mais fácil de ler:

| Linguagem | Extensão | Onde | Por quê |
|---|---|---|---|
| **JavaScript** | `.js` e `.jsx` | Telas e funções simples | Sem tipos, só o básico do React Native |
| **TypeScript** | `.ts` e `.tsx` | Comunicação com a API, descrição dos recursos, formulários e listas | Os tipos evitam erros em código mais complexo |

## Arquivos em JavaScript

| Arquivo | O que faz |
|---|---|
| `utils/dates.js` | Funções de data: `maskDate`, `brToIso`, `isoToBr`, `formatDate`, `isValidIsoDate` e `today` |
| `utils/dialogs.js` | `confirmar` e `avisar` (caixas de diálogo) |
| `components/brand-mark.jsx` | A "tag" `<BrandMark />` (símbolo da Biblioteca) |
| `components/status-badge.jsx` | A "tag" `<StatusBadge text="Ativo" tone="ok" />` (selo de status) |
| `app/index.jsx` | Tela de abertura |
| `app/login.jsx` | Tela de entrar |

## Arquivos em TypeScript

Todo o resto: `services/*`, `contexts/theme-context.tsx`, `styles/*`, `components/form-field.tsx`, `components/option-picker.tsx`, `components/resource-list.tsx`, `components/use-options.ts`, `components/resource-icons.ts` e as demais telas em `app/`.

## Como funciona a mistura

- Os dois tipos de arquivo se importam normalmente, sem escrever a extensão: `import BrandMark from '@/components/brand-mark'`.
- O Expo já aceita JavaScript e TypeScript no mesmo projeto (`allowJs` ligado na configuração base).
- Os arquivos JavaScript **não são checados** pelo TypeScript. Um erro de tipo neles só aparece quando o app roda.
- Para converter um arquivo de JavaScript para TypeScript, troque a extensão (`.jsx` → `.tsx`) e acrescente os tipos que o `npx tsc --noEmit` pedir.
