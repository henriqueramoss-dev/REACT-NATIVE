
import { StatusBar } from "expo-status-bar"
import { useNavigation } from "@react-navigation/native"

import BrandMark from "../../components/brand-mark"
import { useAppTheme } from "../../contexts/theme-context"

import {
    Container,
    Content,
    Brand,
    BrandName,
    Eyebrow,
    Title,
    Description,
    PrimaryButton,
    PrimaryButtonText,
    SecondaryButton,
    SecondaryButtonText,
    DemoLink
} from "./style"

const Inicio = () => {

    const navigation = useNavigation()
    const { resolvedMode } = useAppTheme()

    // ABRIR TELA DE LOGIN
    const handleLogin = () => {
        navigation.navigate("Login")
    }

    // ABRIR TELA DE CADASTRO
    const handleSignUp = () => {
        navigation.navigate("Cadastro")
    }

    // ENTRAR NO PAINEL SEM LOGIN (PROTÓTIPO)
    const handleDemo = () => {
        navigation.navigate("Painel")
    }

    return (
        <Container>

            <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />

            <Content>

                <Brand>

                    <BrandMark />

                    <BrandName>
                        Biblioteca
                    </BrandName>

                </Brand>

                <Eyebrow>
                    BEM-VINDO
                </Eyebrow>

                <Title>
                    Seus livros e empréstimos em um só lugar.
                </Title>

                <Description>
                    Consulte o acervo, acompanhe seus empréstimos e encontre novos livros.
                </Description>

                <PrimaryButton onPress={handleLogin}>
                    <PrimaryButtonText>
                        Entrar
                    </PrimaryButtonText>
                </PrimaryButton>

                <SecondaryButton onPress={handleSignUp}>
                    <SecondaryButtonText>
                        Criar conta
                    </SecondaryButtonText>
                </SecondaryButton>

                <DemoLink onPress={handleDemo}>
                    Ver protótipo sem login
                </DemoLink>

            </Content>

        </Container>
    )
}

export default Inicio
