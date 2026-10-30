
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "../../contexts/theme-context"

import {
    Brand,
    BrandText
} from "./style"

// Título do cabeçalho do painel: ícone de livro + nome da Biblioteca.
const HeaderBrand = () => {

    const { colors } = useAppTheme()

    return (
        <Brand>

            <Ionicons
                name="book-outline"
                size={20}
                color={colors.headerText}
            />

            <BrandText>
                Biblioteca
            </BrandText>

        </Brand>
    )
}

export default HeaderBrand
