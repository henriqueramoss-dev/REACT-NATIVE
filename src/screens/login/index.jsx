
import { useState } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"

import BrandMark from "../../components/brand-mark"
import { LivroAberto } from "../../components/ilustracoes"
import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { avisar } from "../../utils/dialogs"

import {
    Container,
    Content,
    Brand,
    BrandName,
    Ilustracao,
    Title,
    Description,
    Form,
    Label,
    Input,
    Btn,
    BtnTitle,
    AccountText,
    RegisterLink,
    Notice
} from "./style"

const Login = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const { colors } = useAppTheme()
    const { entrar, aviso } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [carregando, setCarregando] = useState(false)

    // CONFERE E-MAIL E SENHA NA API (O LOGIN GERA A CHAVE DE API) E ABRE A TELA CERTA:
    // PAINEL PARA A EQUIPE DA BIBLIOTECA, CATÁLOGO PARA CLIENTES
    const handleLogin = async () => {

        if (!email.trim() || !password) {
            avisar("Campos incompletos", "Informe seu e-mail e sua senha.")
            return
        }

        setCarregando(true)

        try {

            const sessao = await entrar(email, password)

            if (sessao.tipo === "FUNCIONARIO") {
                navigation.reset({ index: 0, routes: [{ name: "Painel" }] })
            } else if (route.params?.voltar && navigation.canGoBack()) {
                // VEIO DE "RESERVAR": VOLTA PARA O LIVRO
                navigation.goBack()
            } else {
                navigation.reset({ index: 0, routes: [{ name: "Catalogo" }] })
            }

        } catch (e) {

            avisar("Não foi possível entrar", e.message)

        } finally {
            setCarregando(false)
        }
    }

    // ABRIR TELA DE CADASTRO
    const handleSignUp = () => {
        navigation.navigate("Cadastro")
    }

    return (
        <Container>

            <Content>

                <Brand>

                    <BrandMark />

                    <BrandName>
                        Biblioteca
                    </BrandName>

                </Brand>

                <Ilustracao>
                    <LivroAberto width={190} />
                </Ilustracao>

                <Title>
                    Entrar
                </Title>

                <Description>
                    Entre para reservar livros e acompanhar suas reservas. A equipe da biblioteca entra por aqui também.
                </Description>

                <Form>

                    <Label>
                        E-mail
                    </Label>

                    <Input
                        placeholder="seu@email.com"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Label>
                        Senha
                    </Label>

                    <Input
                        placeholder="Digite sua senha"
                        placeholderTextColor={colors.placeholder}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Btn
                        onPress={handleLogin}
                        disabled={carregando}
                    >

                        <BtnTitle>
                            {carregando ? "Entrando..." : "Entrar"}
                        </BtnTitle>

                    </Btn>

                </Form>

                <AccountText>
                    Ainda não tem cadastro?{" "}
                    <RegisterLink onPress={handleSignUp}>
                        Criar conta
                    </RegisterLink>
                </AccountText>

                {aviso && (
                    <Notice>
                        {aviso}
                    </Notice>
                )}

                <Notice>
                    Contas criadas antes da senha existir (ou direto na lista de Usuários, sem senha) não conseguem entrar:
                    crie uma nova conta ou peça à biblioteca para definir sua senha.
                </Notice>

            </Content>

        </Container>
    )
}

export default Login
