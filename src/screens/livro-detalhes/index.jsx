
import { useCallback, useState } from "react"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"

import StatusBadge from "../../components/status-badge"
import { useAppTheme } from "../../contexts/theme-context"
import { get, list, remove } from "../../services/biblioteca-api"
import { formatDate, RESOURCES } from "../../services/resources"
import { avisar, confirmar } from "../../utils/dialogs"

import {
    Container,
    Content,
    Loader,
    Message,
    Eyebrow,
    Title,
    Authors,
    DetailLabel,
    DetailValue,
    Situation,
    SituationRow,
    SituationTitle,
    SituationInfo,
    PrimaryButton,
    PrimaryButtonText,
    SecondaryButton,
    SecondaryButtonText,
    DeleteLink
} from "./style"

const LivroDetalhes = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const { colors } = useAppTheme()

    const id = route.params?.id

    const [livro, setLivro] = useState()
    const [emprestimoAtual, setEmprestimoAtual] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [situacaoErro, setSituacaoErro] = useState(false)

    // RECARREGA AO VOLTAR DA EDIÇÃO DO LIVRO OU DO CADASTRO DE EMPRÉSTIMO
    useFocusEffect(
        useCallback(() => {

            const livroId = Number(id)

            if (!id || !Number.isInteger(livroId) || livroId < 1) {
                setLivro(undefined)
                setError("Livro não encontrado.")
                setLoading(false)
                return
            }

            get("livros", livroId)
                .then(async (data) => {

                    setLivro(data)
                    setError(undefined)

                    // HISTÓRICO DE EMPRÉSTIMOS DO LIVRO (GET /livros/{id}/emprestimos), DO MAIS RECENTE AO MAIS ANTIGO
                    try {

                        const emprestimos = await list(`livros/${data.id}/emprestimos`, RESOURCES.emprestimos.embeddedKey, {
                            size: 100,
                            sort: "id,desc"
                        })

                        setEmprestimoAtual(emprestimos.items.find((e) => e.status !== "DEVOLVIDO"))
                        setSituacaoErro(false)

                    } catch {

                        // SEM A CONSULTA NÃO DÁ PARA SABER SE O LIVRO ESTÁ EMPRESTADO: DESCARTA O DADO ANTIGO
                        setEmprestimoAtual(undefined)
                        setSituacaoErro(true)
                    }
                })
                .catch((e) => {

                    // O LIVRO PODE TER SIDO EXCLUÍDO OU A API ESTAR FORA: NÃO MOSTRA O REGISTRO ANTIGO
                    setLivro(undefined)
                    setEmprestimoAtual(undefined)
                    setError(e.message)
                })
                .finally(() => setLoading(false))

        }, [id])
    )

    // EXCLUIR O LIVRO
    const handleDelete = async () => {

        if (!livro) return

        const ok = await confirmar("Excluir livro", `Deseja excluir "${livro.titulo}"?`)

        if (!ok) return

        try {

            await remove("livros", livro.id)

            if (navigation.canGoBack()) navigation.goBack()
            else navigation.replace("Livros")

        } catch (e) {
            avisar("Não foi possível excluir", e.message)
        }
    }

    // (livro?.id com interrogação: estas funções são criadas antes de o livro chegar da API)

    // REGISTRAR UM EMPRÉSTIMO PARA ESTE LIVRO
    const handleNewLoan = () => {
        navigation.navigate("Formulario", { recurso: "emprestimos", livroId: String(livro?.id) })
    }

    // ABRIR O EMPRÉSTIMO ATUAL
    const handleViewLoan = () => {
        navigation.navigate("Formulario", { recurso: "emprestimos", id: String(emprestimoAtual?.id) })
    }

    // EDITAR O LIVRO
    const handleEdit = () => {
        navigation.navigate("Formulario", { recurso: "livros", id: String(livro?.id) })
    }

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

    const disponivel = !emprestimoAtual
    const badge = emprestimoAtual ? RESOURCES.emprestimos.badge?.(emprestimoAtual) : undefined

    return (
        <Container>

            <Content>

                <Eyebrow>
                    {livro.categoria?.nome?.toUpperCase()}
                </Eyebrow>

                <Title>
                    {livro.titulo}
                </Title>

                <Authors>
                    {livro.autores.map((autor) => autor.nome).join(", ") || "Autor não informado"}
                </Authors>

                <DetailLabel>
                    Ano de publicação
                </DetailLabel>

                <DetailValue>
                    {livro.anoPublicacao}
                </DetailValue>

                <DetailLabel>
                    ISBN
                </DetailLabel>

                <DetailValue>
                    {livro.isbn}
                </DetailValue>

                <DetailLabel>
                    Situação
                </DetailLabel>

                <Situation>

                    {situacaoErro ? (
                        <SituationInfo>
                            Não foi possível consultar os empréstimos deste livro.
                        </SituationInfo>
                    ) : disponivel ? (
                        <SituationTitle $disponivel>
                            Disponível para empréstimo
                        </SituationTitle>
                    ) : (
                        <>
                            <SituationRow>

                                <SituationTitle>
                                    Emprestado
                                </SituationTitle>

                                {badge && (
                                    <StatusBadge
                                        text={badge.text}
                                        tone={badge.tone}
                                    />
                                )}

                            </SituationRow>

                            <SituationInfo>
                                Com {emprestimoAtual?.usuario?.nome} · devolução prevista em{" "}
                                {formatDate(emprestimoAtual?.dataPrevistaDevolucao)}
                            </SituationInfo>
                        </>
                    )}

                </Situation>

                {situacaoErro ? null : disponivel ? (
                    <PrimaryButton onPress={handleNewLoan}>
                        <PrimaryButtonText>
                            Registrar empréstimo
                        </PrimaryButtonText>
                    </PrimaryButton>
                ) : (
                    <PrimaryButton onPress={handleViewLoan}>
                        <PrimaryButtonText>
                            Ver empréstimo
                        </PrimaryButtonText>
                    </PrimaryButton>
                )}

                <SecondaryButton onPress={handleEdit}>
                    <SecondaryButtonText>
                        Editar livro
                    </SecondaryButtonText>
                </SecondaryButton>

                <DeleteLink onPress={handleDelete}>
                    Excluir livro
                </DeleteLink>

            </Content>

        </Container>
    )
}

export default LivroDetalhes
