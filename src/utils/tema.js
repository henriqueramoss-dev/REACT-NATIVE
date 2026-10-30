
// Atalho para pegar uma cor do tema dentro dos arquivos style.js.
// Exemplo: background-color: ${cor("surface")};
const cor = (nome) => ({ theme }) => theme.colors[nome]


export {
    cor
}
