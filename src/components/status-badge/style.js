
import styled from "styled-components/native"


// Cor de fundo e do texto de cada tom (nomes das cores do tema).
const tons = {
    ok: { fundo: "successSoft", texto: "success" },
    warn: { fundo: "neutralSoft", texto: "textMuted" },
    danger: { fundo: "dangerSoft", texto: "danger" }
}


const Badge = styled.Text`
    overflow: hidden;

    padding: 3px 10px;

    border-radius: 999px;

    font-size: 12px;
    font-weight: bold;

    background-color: ${({ theme, $tone }) => theme.colors[tons[$tone].fundo]};
    color: ${({ theme, $tone }) => theme.colors[tons[$tone].texto]};
`


export {
    Badge
}
