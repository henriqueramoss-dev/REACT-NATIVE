# Testes automáticos no emulador (Maestro)

Cada arquivo `.yaml` é um roteiro que toca nos botões e confere as telas, como uma pessoa faria.

1. Instale o Maestro uma vez: https://docs.maestro.dev/getting-started/installing-maestro
2. Deixe o app aberto no emulador (`npm run android:emulador`).
3. Em outro terminal: `npm run teste:emulador` (roda os de visitante e cliente; o do dono precisa da senha) ou `maestro test .maestro/01-visitante.yaml`.

Os roteiros usam a API publicada (a primeira chamada pode demorar se a Render estiver dormindo) e as contas de exemplo:
cliente `beatriz@exemplo.com` / `Cliente12345` e dono `dono@biblioteca.com` (senha definida na Render).
Para o roteiro do dono, informe a senha: `maestro test -e SENHA_DONO=... .maestro/03-dono.yaml`.
