import { useCallback, useEffect, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import StatusBadge from "../../components/status-badge"
import CapaDoLivro from "../../components/capa-do-livro"
import { PilhaDeLivros } from "../../components/ilustracoes"
import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { cancelarReserva, list } from "../../services/biblioteca-api"
import { formatDate, RESOURCES, today } from "../../services/resources"
import { avisar, confirmar } from "../../utils/dialogs"
import { autoresDe } from "../../utils/use-reservar"

import {
    Container,
    Lista,
    Topo,
    Title,
    Subtitle,
    Cartao,
    Corpo,
    Titulo,
    Detalhe,
    BotaoCancelar,
    BotaoCancelarTexto,
    BotaoPrimario,
    BotaoPrimarioTexto,
    Loader,
    Vazio,
    VazioTexto,
    Erro,
    ErroTexto
} from "./style"

// A SITUAÇÃO DE CADA ITEM, COM A DATA QUE IMPORTA (RETIRAR, DEVOLVER...)
const situacao = (e) => {

    if (e.status === "RESERVADO") {

        if (e.retirarAte && e.retirarAte < today()) {
            return { texto: "Prazo de retirada vencido", tom: "danger", detalhe: `Era até ${formatDate(e.retirarAte)}` }
        }

        return { texto: "Aguardando retirada", tom: "info", detalhe: `Retire na biblioteca até ${formatDate(e.retirarAte)}` }
    }

    if (e.status === "ATIVO") return { texto: "Emprestado", tom: "ok", detalhe: `Devolver até ${formatDate(e.dataPrevistaDevolucao)}` }
    if (e.status === "ATRASADO") return { texto: "Devolução atrasada", tom: "danger", detalhe: `Era até ${formatDate(e.dataPrevistaDevolucao)}` }

    return { texto: "Devolvido", tom: "warn", detalhe: `Em ${formatDate(e.dataDevolucao)}` }
}

// Reservas e empréstimos de quem está logado (mesma tela do site).
const MinhasReservas = () => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()
    const { sessao } = useAuth()

    const [itens, setItens] = useState([])
    const [pagina, setPagina] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [carregando, setCarregando] = useState(true)
    const [carregandoMais, setCarregandoMais] = useState(false)
    const [atualizando, setAtualizando] = useState(false)
    const [erro, setErro] = useState()

    const requisicao = useRef(0)

    const carregar = useCallback(async (proxima, modo) => {

        const id = ++requisicao.current

        if (modo === "inicio") setCarregando(true)
        if (modo === "mais") setCarregandoMais(true)
        if (modo === "atualizar") setAtualizando(true)

        try {

            const dados = await list("reservas/minhas", RESOURCES.emprestimos.embeddedKey, { page: proxima, size: 10, sort: "id,desc" })

            if (id !== requisicao.current) return

            setItens((atual) => (modo === "mais" ? [...atual, ...dados.items] : dados.items))
            setPagina(dados.number)
            setTotalPaginas(dados.totalPages)
            setErro(undefined)

        } catch (e) {

            if (id === requisicao.current) setErro(e.message)

        } finally {

            if (id === requisicao.current) {
                setCarregando(false)
                setCarregandoMais(false)
                setAtualizando(false)
            }
        }

    }, [])

    useFocusEffect(
        useCallback(() => {
            if (sessao) carregar(0, "inicio")
        }, [sessao, carregar])
    )

    // SEM LOGIN, VOLTA PARA A TELA DE ENTRADA
    useEffect(() => {
        if (!sessao) navigation.replace("Login", { voltar: true })
    }, [sessao, navigation])

    const cancelar = async (item) => {

        const ok = await confirmar("Cancelar reserva", `Cancelar a reserva de "${item.livro?.titulo}"?`, "Cancelar reserva")

        if (!ok) return

        try {
            await cancelarReserva(item.id)
            carregar(0, "atualizar")
        } catch (e) {
            avisar("Não foi possível cancelar", e.message)
        }
    }

    const aoChegarNoFim = () => {
        if (!carregando && !carregandoMais && !erro && pagina < totalPaginas - 1) carregar(pagina + 1, "mais")
    }

    return (
        <Container>

            <Lista
                data={itens}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={() => carregar(0, "atualizar")}
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={aoChegarNoFim}
                ListHeaderComponent={
                    <Topo>

                        <Title>
                            Minhas reservas
                        </Title>

                        <Subtitle>
                            Livros que você reservou ou pegou emprestados.
                        </Subtitle>

                    </Topo>
                }
                ListEmptyComponent={
                    carregando ? (
                        <Loader color={colors.primary} />
                    ) : erro ? (
                        <Erro onPress={() => carregar(0, "inicio")}>

                            <ErroTexto>
                                {erro}
                            </ErroTexto>

                            <ErroTexto>
                                Tocar para tentar novamente
                            </ErroTexto>

                        </Erro>
                    ) : (
                        <Vazio>

                            <PilhaDeLivros width={150} />

                            <VazioTexto>
                                Você ainda não reservou nenhum livro.
                            </VazioTexto>

                            <BotaoPrimario onPress={() => navigation.navigate("Catalogo")}>
                                <BotaoPrimarioTexto>
                                    Ver o catálogo
                                </BotaoPrimarioTexto>
                            </BotaoPrimario>

                        </Vazio>
                    )
                }
                ListFooterComponent={carregandoMais ? <Loader color={colors.primary} /> : null}
                renderItem={({ item }) => {

                    const s = situacao(item)

                    return (
                        <Cartao>

                            <CapaDoLivro livro={item.livro} largura={56} />

                            <Corpo>

                                <Titulo numberOfLines={2}>
                                    {item.livro?.titulo}
                                </Titulo>

                                <Detalhe numberOfLines={1}>
                                    {autoresDe(item.livro)}
                                </Detalhe>

                                <StatusBadge
                                    text={s.texto}
                                    tone={s.tom}
                                />

                                <Detalhe>
                                    {s.detalhe}
                                </Detalhe>

                            </Corpo>

                            {item.status === "RESERVADO" && (
                                <BotaoCancelar onPress={() => cancelar(item)}>
                                    <BotaoCancelarTexto>
                                        Cancelar
                                    </BotaoCancelarTexto>
                                </BotaoCancelar>
                            )}

                        </Cartao>
                    )
                }}
            />

        </Container>
    )
}

export default MinhasReservas
