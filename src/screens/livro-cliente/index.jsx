import { useCallback, useState } from "react"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"

import StatusBadge from "../../components/status-badge"
import CapaDoLivro from "../../components/capa-do-livro"
import { useAppTheme } from "../../contexts/theme-context"
import { get } from "../../services/biblioteca-api"
import { autoresDe, useReservar } from "../../utils/use-reservar"

import {
    Container,
    Content,
    Loader,
    Message,
    CapaArea,
    Eyebrow,
    Title,
    Authors,
    Selo,
    Ficha,
    FichaLinha,
    FichaRotulo,
    FichaValor,
    Aviso,
    AvisoTexto,
    AvisoLink,
    PrimaryButton,
    PrimaryButtonText,
    Nota
} from "./style"

// Detalhes de um livro para o cliente, com o botão de reservar (mesma tela do site).
const LivroCliente = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const { colors } = useAppTheme()

    const id = route.params?.id

    const [livro, setLivro] = useState()
    const [fora, setFora] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    const carregar = useCallback(() => {

        const livroId = Number(id)

        if (!id || !Number.isInteger(livroId) || livroId < 1) {
            setError("Livro não encontrado.")
            setLoading(false)
            return
        }

        get("livros", livroId)
            .then((dados) => {
                setLivro(dados)
                setFora(!!dados.situacao && dados.situacao !== "DISPONIVEL")
                setError(undefined)
            })
            .catch((e) => {
                setLivro(undefined)
                setError(e.message)
            })
            .finally(() => setLoading(false))

    }, [id])

    // A SITUAÇÃO VEM NO PRÓPRIO LIVRO. SE A RESERVA FALHAR (ALGUÉM RESERVOU ANTES), RECARREGA PARA MOSTRAR A ATUAL.
    const { reservar, reservando, aviso, erro: erroReserva } = useReservar((livroId) => {

        if (livroId) setFora(true)
        else carregar()
    })

    useFocusEffect(carregar)

    if (loading) {
        return (
            <Container>
                <Loader color={colors.primary} />
            </Container>
        )
    }

    if (!livro) {
        return (
            <Container>
                <Message>
                    {error ?? "Livro não encontrado."}
                </Message>
            </Container>
        )
    }

    const ficha = [
        ["Categoria", livro.categoria?.nome ?? "—"],
        ...(livro.categoria?.localizacao ? [["Onde encontrar", livro.categoria.localizacao]] : []),
        ["Editora", livro.editora ?? "—"],
        ["Ano", String(livro.anoPublicacao)],
        ["Páginas", String(livro.numeroPaginas)],
        ["ISBN", livro.isbn]
    ]

    return (
        <Container>

            <Content>

                <CapaArea>
                    <CapaDoLivro livro={livro} largura={130} tamanho="L" />
                </CapaArea>

                <Eyebrow>
                    {livro.categoria?.nome?.toUpperCase()}
                </Eyebrow>

                <Title>
                    {livro.titulo}
                </Title>

                <Authors>
                    {autoresDe(livro)}
                </Authors>

                <Selo>
                    <StatusBadge
                        text={fora ? "Indisponível no momento" : "Disponível para reserva"}
                        tone={fora ? "warn" : "ok"}
                    />
                </Selo>

                <Ficha>
                    {ficha.map(([rotulo, valor], indice) => (
                        <FichaLinha key={rotulo} $primeiro={indice === 0}>

                            <FichaRotulo>
                                {rotulo}
                            </FichaRotulo>

                            <FichaValor>
                                {valor}
                            </FichaValor>

                        </FichaLinha>
                    ))}
                </Ficha>

                {aviso && (
                    <Aviso>

                        <AvisoTexto>
                            {aviso}
                        </AvisoTexto>

                        <AvisoLink onPress={() => navigation.navigate("MinhasReservas")}>
                            Ver minhas reservas
                        </AvisoLink>

                    </Aviso>
                )}

                {erroReserva && (
                    <Aviso $erro>
                        <AvisoTexto $erro>
                            {erroReserva}
                        </AvisoTexto>
                    </Aviso>
                )}

                <PrimaryButton
                    onPress={() => reservar(livro)}
                    disabled={fora || reservando === livro.id}
                    $desabilitado={fora || reservando === livro.id}
                >
                    <PrimaryButtonText>
                        {reservando === livro.id ? "Reservando..." : fora ? "Indisponível" : "Reservar para retirar na biblioteca"}
                    </PrimaryButtonText>
                </PrimaryButton>

                <Nota>
                    Você terá 3 dias para retirar. Cada pessoa pode ter até 3 reservas.
                </Nota>

            </Content>

        </Container>
    )
}

export default LivroCliente
