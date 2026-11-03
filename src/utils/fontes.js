
import { Platform } from "react-native"

// Fonte com serifa para os títulos (ar de livro). Usa as fontes que já vêm no aparelho.
const FONTE_TITULO = Platform.select({
    ios: "Georgia",
    android: "serif",
    // UMA FONTE SÓ: o styled-components não aceita lista com vírgulas em font-family
    default: "Georgia"
})


export {
    FONTE_TITULO
}
