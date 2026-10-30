
import { useState } from "react"
import { Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { usePreferencias } from "../../contexts/preferencias-context"
import { trocarSenha } from "../../services/biblioteca-api"
import { avisar } from "../../utils/dialogs"
import { cancelarLembretes, pedirPermissao, sincronizarLembretes } from "../../utils/lembretes"

import {
    Container,
    Content,
    SectionTitle,
    Card,
    AccountName,
    AccountEmail,
    Hint,
    Options,
    Option,
    OptionText,
    SwitchRow,
    SwitchTexts,
    SwitchTitle,
    SwitchDescription,
    Switch,
    Label,
    Input,
    FieldError,
    PrimaryButton,
    PrimaryButtonText,
    SecondaryButton,
    SecondaryButtonText
} from "./style"

const TEMAS = [
    { value: "light", label: "Claro" },
    { value: "dark", label: "Escuro" },
    { value: "system", label: "Automático" }
]

const Configuracoes = () => {

    const navigation = useNavigation()
    const { colors, mode, setMode } = useAppTheme()
    const { usuario, sair } = useAuth()
    const { notificacoes, setNotificacoes } = usePreferencias()

    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmacao, setConfirmacao] = useState("")
    const [erros, setErros] = useState({})
    const [salvando, setSalvando] = useState(false)
    const [ocupado, setOcupado] = useState(false)

    const naWeb = Platform.OS === "web"

    // SAIR DA CONTA E VOLTAR PARA A ABERTURA
    const handleLogout = () => {
        sair()
        navigation.reset({ index: 0, routes: [{ name: "Inicio" }] })
    }

    // ABRIR O LOGIN (QUANDO NÃO HÁ CONTA)
    const handleLogin = () => {
        navigation.navigate("Login")
    }

    // LIGAR OU DESLIGAR OS LEMBRETES DE DEVOLUÇÃO
    const handleNotifications = async (ligar) => {

        if (!ligar) {
            setNotificacoes(false)
            await cancelarLembretes().catch(() => {})
            return
        }

        setOcupado(true)

        try {

            const permissao = await pedirPermissao()

            if (permissao === "negada") {
                avisar("Permissão negada", "Para receber lembretes, permita as notificações do app nas configurações do aparelho.")
                return
            }

            const agendados = await sincronizarLembretes(usuario?.id)

            setNotificacoes(true)

            avisar(
                "Lembretes ativados",
                agendados === 0
                    ? "Não há devoluções próximas. Os avisos serão agendados quando você abrir o painel."
                    : `${agendados} lembrete(s) agendado(s): você será avisado na véspera da devolução, às 9h.`
            )

        } catch (e) {
            avisar("Não foi possível ativar", e.message)
        } finally {
            setOcupado(false)
        }
    }

    // CONFERE OS CAMPOS ANTES DE ENVIAR (A API CONFERE DE NOVO)
    const validar = () => {

        const novos = {}

        if (!senhaAtual) novos.senhaAtual = "Informe a senha atual."

        if (novaSenha.length < 8 || novaSenha.length > 72) novos.novaSenha = "A nova senha deve ter de 8 a 72 caracteres."
        else if (novaSenha === senhaAtual) novos.novaSenha = "A nova senha deve ser diferente da atual."

        if (confirmacao !== novaSenha) novos.confirmacao = "A confirmação não é igual à nova senha."

        return novos
    }

    // TROCAR A SENHA
    const handleChangePassword = async () => {

        const novos = validar()

        setErros(novos)

        if (Object.keys(novos).length) return

        setSalvando(true)

        try {

            // (usuario?.id com interrogação: estas funções são criadas mesmo quando não há conta)
            await trocarSenha(usuario?.id, senhaAtual, novaSenha)

            setSenhaAtual("")
            setNovaSenha("")
            setConfirmacao("")

            avisar("Senha alterada", "Use a nova senha no próximo login.")

        } catch (e) {

            // A API devolve o erro no campo certo (ex.: senhaAtual incorreta)
            const doServidor = e.campos ?? {}

            if (Object.keys(doServidor).length) setErros(doServidor)
            else avisar("Não foi possível trocar a senha", e.message)

        } finally {
            setSalvando(false)
        }
    }

    return (
        <Container>

            <Content keyboardShouldPersistTaps="handled">

                <SectionTitle>
                    Conta
                </SectionTitle>

                <Card>

                    {usuario ? (
                        <>
                            <AccountName>
                                {usuario.nome}
                            </AccountName>

                            <AccountEmail>
                                {usuario.email}
                            </AccountEmail>

                            <SecondaryButton onPress={handleLogout}>
                                <SecondaryButtonText>
                                    Sair da conta
                                </SecondaryButtonText>
                            </SecondaryButton>
                        </>
                    ) : (
                        <>
                            <Hint>
                                Você está no modo protótipo, sem conta. Entre para trocar a senha.
                            </Hint>

                            <PrimaryButton onPress={handleLogin}>
                                <PrimaryButtonText>
                                    Entrar
                                </PrimaryButtonText>
                            </PrimaryButton>
                        </>
                    )}

                </Card>

                <SectionTitle>
                    Aparência
                </SectionTitle>

                <Card>

                    <Options>

                        {TEMAS.map((tema) => {

                            const escolhido = mode === tema.value

                            return (
                                <Option
                                    key={tema.value}
                                    $active={escolhido}
                                    onPress={() => setMode(tema.value)}
                                    accessibilityRole="radio"
                                    accessibilityState={{ checked: escolhido }}
                                >
                                    <OptionText $active={escolhido}>
                                        {tema.label}
                                    </OptionText>
                                </Option>
                            )
                        })}

                    </Options>

                    <Hint>
                        {"\"Automático\" acompanha o modo do aparelho. A escolha fica salva neste aparelho."}
                    </Hint>

                </Card>

                <SectionTitle>
                    Notificações
                </SectionTitle>

                <Card>

                    <SwitchRow>

                        <SwitchTexts>

                            <SwitchTitle>
                                Lembretes de devolução
                            </SwitchTitle>

                            <SwitchDescription>
                                {naWeb
                                    ? "Disponível apenas no aplicativo do celular."
                                    : "Um aviso às 9h na véspera da devolução de cada livro emprestado."}
                            </SwitchDescription>

                        </SwitchTexts>

                        <Switch
                            value={notificacoes && !naWeb}
                            onValueChange={handleNotifications}
                            disabled={naWeb || ocupado}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor="#FFFFFF"
                            accessibilityLabel="Lembretes de devolução"
                        />

                    </SwitchRow>

                </Card>

                <SectionTitle>
                    Trocar senha
                </SectionTitle>

                <Card>

                    {usuario ? (
                        <>
                            <Label>
                                Senha atual
                            </Label>

                            <Input
                                $error={!!erros.senhaAtual}
                                value={senhaAtual}
                                onChangeText={setSenhaAtual}
                                placeholder="Digite a senha atual"
                                placeholderTextColor={colors.placeholder}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            {erros.senhaAtual && (
                                <FieldError>
                                    {erros.senhaAtual}
                                </FieldError>
                            )}

                            <Label>
                                Nova senha
                            </Label>

                            <Input
                                $error={!!erros.novaSenha}
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                                placeholder="De 8 a 72 caracteres"
                                placeholderTextColor={colors.placeholder}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            {erros.novaSenha && (
                                <FieldError>
                                    {erros.novaSenha}
                                </FieldError>
                            )}

                            <Label>
                                Confirmar nova senha
                            </Label>

                            <Input
                                $error={!!erros.confirmacao}
                                value={confirmacao}
                                onChangeText={setConfirmacao}
                                placeholder="Repita a nova senha"
                                placeholderTextColor={colors.placeholder}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            {erros.confirmacao && (
                                <FieldError>
                                    {erros.confirmacao}
                                </FieldError>
                            )}

                            <PrimaryButton
                                onPress={handleChangePassword}
                                disabled={salvando}
                            >
                                <PrimaryButtonText>
                                    {salvando ? "Salvando..." : "Salvar nova senha"}
                                </PrimaryButtonText>
                            </PrimaryButton>
                        </>
                    ) : (
                        <Hint>
                            Entre com uma conta para trocar a senha.
                        </Hint>
                    )}

                </Card>

            </Content>

        </Container>
    )
}

export default Configuracoes
