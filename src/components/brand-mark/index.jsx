
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "../../contexts/theme-context"

import {
    Mark
} from "./style"

// Símbolo da Biblioteca: o mesmo ícone de livro do menu do site.
const BrandMark = () => {

    const { colors } = useAppTheme()

    return (
        <Mark>

            <Ionicons
                name="book-outline"
                size={22}
                color={colors.headerText}
            />

        </Mark>
    )
}

export default BrandMark
