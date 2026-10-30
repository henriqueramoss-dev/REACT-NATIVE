
import { Ionicons } from "@expo/vector-icons"

import { useAppTheme } from "../../contexts/theme-context"

import {
    Actions,
    IconButton,
    ExitButton,
    ExitText
} from "./style"

// Botões do cabeçalho do painel: engrenagem (configurações) e "Sair".
// Quem usa decide o que cada um faz (onSettings e onExit).
const HeaderActions = ({ onSettings, onExit }) => {

    const { colors } = useAppTheme()

    return (
        <Actions>

            <IconButton
                onPress={onSettings}
                accessibilityLabel="Configurações"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >

                <Ionicons
                    name="settings-outline"
                    size={22}
                    color={colors.headerText}
                />

            </IconButton>

            <ExitButton
                onPress={onExit}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >

                <ExitText>
                    Sair
                </ExitText>

            </ExitButton>

        </Actions>
    )
}

export default HeaderActions
