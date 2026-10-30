
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import BrandMark from "../../components/brand-mark"
import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { avisar } from "../../utils/dialogs"

import {
    Container,
    Content,
    Brand,
    BrandName,
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
    const { colors } = useAppTheme()
    const { entrar } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [carregando, setCarregando] = useState(false)

    // CONFERE E-MAIL E SENHA NA API E ABRE O PAINEL
    const handleLogin = async () => {

        if (!email.trim() || !password) {
            avisar("Campos incompletos", "Informe seu e-mail e sua senha.")
            return
        }

        setCarregando(true)

        try {

            await entrar(email, password)

            navigation.replace("Painel")

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

                <Title>
                    Entrar
                </Title>

                <Description>
                    Acesse o aplicativo para consultar o acervo e seus empréstimos.
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

                <Notice>
                    Contas criadas antes da senha existir (ou direto na lista de Usuários) ainda não têm senha:
                    crie uma nova conta para entrar.
                </Notice>

            </Content>

        </Container>
    )
}

export default Login
