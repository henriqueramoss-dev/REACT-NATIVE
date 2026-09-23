# Organização do projeto

O projeto foi separado para deixar cada arquivo com uma responsabilidade mais clara.

## app/
Contém somente as telas e a lógica principal de interação.

Exemplo:
- `app/agenda-barbeiro.tsx`
- `app/avaliacoes.tsx`
- `app/cadastro.tsx`

## styles/
Contém os estilos de cada tela.

Exemplo:
- `styles/agenda-barbeiro.styles.ts`
- `styles/avaliacoes.styles.ts`
- `styles/cadastro.styles.ts`
- `styles/management.styles.ts` - estilos compartilhados das telas administrativas

A tela importa o estilo assim:

```ts
import styles from '@/styles/cadastro.styles';
```

## data/
Contém dados de exemplo, listas e configurações que antes ficavam misturados com as telas.

Exemplo:
- `data/barber-schedule.ts` - agenda e dias de trabalho
- `data/booking.ts` - datas e horários disponíveis
- `data/reviews.ts` - avaliações de exemplo
- `data/dashboard.ts` - módulos dos painéis
- `data/auth.ts` - textos de cliente e barbeiro
- `data/catalog.ts` - serviços e planos
- `data/barber-management.ts` - dados locais das telas administrativas

## types/
Contém tipos compartilhados.

Exemplo:
- `types/user.ts` - tipo `UserRole`

## utils/
Contém funções auxiliares que podem ser usadas em mais de uma tela.

Exemplo:
- `utils/formatters.ts` - formatação de telefone, CEP e horário
- `utils/user-role.ts` - validação do tipo de usuário

## Regra simples para continuar o projeto

- Tela e eventos do usuário: `app/`
- Estilos: `styles/`
- Dados/listas de exemplo: `data/`
- Tipos TypeScript compartilhados: `types/`
- Funções auxiliares: `utils/`

Essa separação mantém o projeto organizado sem criar uma arquitetura complicada demais.


## Telas administrativas do barbeiro

O painel do barbeiro agora possui rotas funcionais para:

- `app/servicos-barbeiro.tsx`
- `app/produtos.tsx`
- `app/planos-barbeiro.tsx`
- `app/funcionarios.tsx`
- `app/clientes.tsx`
- `app/financeiro.tsx`
- `app/relatorios.tsx`
- `app/notificacoes.tsx`

Nesta etapa, essas telas funcionam com estado local (`useState`). A organização foi preparada para trocar os dados locais por Supabase depois sem precisar reorganizar as telas novamente.
