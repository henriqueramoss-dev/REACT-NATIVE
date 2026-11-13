
import { useWindowDimensions } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useNavigation } from "@react-navigation/native"

import BrandMark from "../../components/brand-mark"
import { Estante } from "../../components/ilustracoes"
import { useAppTheme } from "../../contexts/theme-context"

import {
    Container,
    Content,
    Brand,
    BrandName,
    Ilustracao,
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
    const { width } = useWindowDimensions()

    // A ESTANTE OCUPA A LARGURA DA TELA, ATÉ UM LIMITE
    const larguraEstante = Math.min(width - 40, 360)

    // ABRIR TELA DE LOGIN
    const handleLogin = () => {
        navigation.navigate("Login")
    }

    // ABRIR TELA DE CADASTRO
    const handleSignUp = () => {
        navigation.navigate("Cadastro")
    }

    // VER O CATÁLOGO SEM LOGIN (PARA RESERVAR, É PRECISO ENTRAR)
    const handleCatalogo = () => {
        navigation.navigate("Catalogo")
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

                <Ilustracao>
                    <Estante width={larguraEstante} />
                </Ilustracao>

                <Eyebrow>
                    BEM-VINDO
                </Eyebrow>

                <Title>
                    Seus livros e empréstimos em um só lugar.
                </Title>

                <Description>
                    Escolha um livro, reserve pelo app e retire na biblioteca.
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

                <DemoLink onPress={handleCatalogo}>
                    Ver o catálogo sem entrar
                </DemoLink>

            </Content>

        </Container>
    )
}

export default Inicio
