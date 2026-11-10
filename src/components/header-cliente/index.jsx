import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"

import {
    Actions,
    IconButton,
    ExitButton,
    ExitText
} from "../header-actions/style"

// Botões do cabeçalho do cliente. Logado: minhas reservas, configurações e "Sair". Visitante: "Entrar".
const HeaderCliente = () => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()
    const { sessao, sair } = useAuth()

    const handleExit = async () => {
        await sair()
        navigation.reset({ index: 0, routes: [{ name: "Inicio" }] })
    }

    if (!sessao) {
        return (
            <Actions>
                <ExitButton onPress={() => navigation.navigate("Login")}>
                    <ExitText>
                        Entrar
                    </ExitText>
                </ExitButton>
            </Actions>
        )
    }

    return (
        <Actions>

            <IconButton
                onPress={() => navigation.navigate("MinhasReservas")}
                accessibilityLabel="Minhas reservas"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name="bookmark-outline"
                    size={22}
                    color={colors.headerText}
                />
            </IconButton>

            <IconButton
                onPress={() => navigation.navigate("Configuracoes")}
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
                onPress={handleExit}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <ExitText>
                    Sair
                </ExitText>
            </ExitButton>

        </Actions>
    )
}

export default HeaderCliente
