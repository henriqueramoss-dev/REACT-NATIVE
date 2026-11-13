import { useCallback, useEffect, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import StatusBadge from "../../components/status-badge"
import CapaDoLivro from "../../components/capa-do-livro"
import { FaixaDeLombadas, PilhaDeLivros } from "../../components/ilustracoes"
import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { usePreferencias } from "../../contexts/preferencias-context"
import { list } from "../../services/biblioteca-api"
import { RESOURCES } from "../../services/resources"
import { sincronizarLembretes } from "../../utils/lembretes"
import { autoresDe, useReservar } from "../../utils/use-reservar"

import {
    Container,
    Faixa,
    Grade,
    Topo,
    Eyebrow,
    Title,
    Subtitle,
    SearchArea,
    SearchInput,
    Categorias,
    Chip,
    ChipText,
    Aviso,
    AvisoTexto,
    AvisoLink,
    Cartao,
    CartaoCapa,
    CartaoInfo,
    CartaoTitulo,
    CartaoDetalhe,
    Botao,
    BotaoTexto,
    Loader,
    Vazio,
    VazioTexto,
    Erro,
    ErroTexto,
    Espaco
} from "./style"

const TAMANHO = 12

// Página inicial do cliente: escolher um livro do acervo e reservá-lo para retirar na biblioteca.
// Mesma tela do catálogo do site, em duas colunas.
const Catalogo = () => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()
    const { usuario } = useAuth()
    const { notificacoes } = usePreferencias()

    const [rascunho, setRascunho] = useState("")
    const [termo, setTermo] = useState("")
    const [categoria, setCategoria] = useState("")
    const [categorias, setCategorias] = useState([])
    const [livros, setLivros] = useState([])
    const [pagina, setPagina] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [indisponiveis, setIndisponiveis] = useState(new Set())
    const [carregando, setCarregando] = useState(true)
    const [carregandoMais, setCarregandoMais] = useState(false)
    const [atualizando, setAtualizando] = useState(false)
    const [erro, setErro] = useState()

    const requisicao = useRef(0)

    // CADA LIVRO JÁ VEM COM A "SITUACAO" CALCULADA PELA API. AO RESERVAR, MARCA O LIVRO NA HORA;
    // SE A RESERVA FALHAR (ALGUÉM RESERVOU ANTES), RECARREGA PARA MOSTRAR A SITUAÇÃO ATUAL.
    const { reservar, reservando, aviso, erro: erroReserva } = useReservar((id) => {

        if (id) setIndisponiveis((atual) => new Set(atual).add(id))
        else carregar(0, "atualizar")
    })

    useEffect(() => {
        list("categorias", RESOURCES.categorias.embeddedKey, { size: 100 })
            .then((p) => setCategorias(p.items))
            .catch(() => {})
    }, [])

    const carregar = useCallback(async (proxima, modo) => {

        const id = ++requisicao.current

        if (modo === "inicio") setCarregando(true)
        if (modo === "mais") setCarregandoMais(true)
        if (modo === "atualizar") setAtualizando(true)

        try {

            const embedded = RESOURCES.livros.embeddedKey

            const dados = categoria
                ? await list(`categorias/${categoria}/livros`, embedded, { page: proxima, size: TAMANHO, sort: "titulo" })
                : await list("livros", embedded, { page: proxima, size: TAMANHO, sort: "titulo", search: { titulo: termo } })

            // RESPOSTA ANTIGA (O CLIENTE JÁ MUDOU A BUSCA)
            if (id !== requisicao.current) return

            setLivros((atual) => (modo === "mais" ? [...atual, ...dados.items] : dados.items))
            setIndisponiveis((atual) => {
                const novos = dados.items.filter((l) => l.situacao && l.situacao !== "DISPONIVEL").map((l) => l.id)
                return new Set(modo === "mais" ? [...atual, ...novos] : novos)
            })
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

    }, [categoria, termo])

    // RECARREGA AO ABRIR, AO VOLTAR PARA A TELA E QUANDO A BUSCA OU A CATEGORIA MUDAM
    useFocusEffect(
        useCallback(() => {
            carregar(0, "inicio")
        }, [carregar])
    )

    // COM OS LEMBRETES LIGADOS, REFAZ OS AVISOS DE DEVOLUÇÃO DO CLIENTE AO ABRIR O CATÁLOGO
    useFocusEffect(
        useCallback(() => {

            if (notificacoes && usuario?.id) sincronizarLembretes(usuario.id).catch(() => {})

        }, [notificacoes, usuario?.id])
    )

    // ESPERA O CLIENTE PARAR DE DIGITAR ANTES DE BUSCAR
    useEffect(() => {

        const timer = setTimeout(() => setTermo(rascunho.trim()), 400)

        return () => clearTimeout(timer)

    }, [rascunho])

    const escolherCategoria = (id) => {
        setRascunho("")
        setTermo("")
        setCategoria(id)
    }

    const aoChegarNoFim = () => {
        if (!carregando && !carregandoMais && !erro && pagina < totalPaginas - 1) carregar(pagina + 1, "mais")
    }

    const cabecalho = (
        <>
            <Faixa>
                <FaixaDeLombadas height={44} />
            </Faixa>

            <Topo>

                <Eyebrow>
                    BIBLIOTECA
                </Eyebrow>

                <Title>
                    Escolha seu próximo livro
                </Title>

                <Subtitle>
                    Reserve pelo app e retire na biblioteca em até 3 dias.
                </Subtitle>

                <SearchArea>

                    <Ionicons
                        name="search"
                        size={17}
                        color={colors.textMuted}
                    />

                    <SearchInput
                        value={rascunho}
                        onChangeText={(texto) => { setCategoria(""); setRascunho(texto) }}
                        placeholder="Buscar por título"
                        placeholderTextColor={colors.textMuted}
                        returnKeyType="search"
                        onSubmitEditing={() => setTermo(rascunho.trim())}
                    />

                    {rascunho !== "" && (
                        <Ionicons
                            name="close"
                            size={18}
                            color={colors.textMuted}
                            onPress={() => setRascunho("")}
                            accessibilityLabel="Limpar busca"
                        />
                    )}

                </SearchArea>

                {categorias.length > 0 && (
                    <Categorias>

                        <Chip
                            $active={!categoria}
                            onPress={() => escolherCategoria("")}
                        >
                            <ChipText $active={!categoria}>
                                Todos
                            </ChipText>
                        </Chip>

                        {categorias.map((c) => (
                            <Chip
                                key={c.id}
                                $active={String(c.id) === categoria}
                                onPress={() => escolherCategoria(String(c.id))}
                            >
                                <ChipText $active={String(c.id) === categoria}>
                                    {c.nome}
                                </ChipText>
                            </Chip>
                        ))}

                    </Categorias>
                )}

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

            </Topo>
        </>
    )

    return (
        <Container>

            <Grade
                // COM UM NÚMERO ÍMPAR DE LIVROS, UM ESPAÇO VAZIO MANTÉM O ÚLTIMO CARTÃO NA LARGURA DE UMA COLUNA
                data={livros.length % 2 === 1 ? [...livros, { id: "espaco", espaco: true }] : livros}
                numColumns={2}
                keyExtractor={(livro) => String(livro.id)}
                ListHeaderComponent={cabecalho}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        onRefresh={() => carregar(0, "atualizar")}
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={aoChegarNoFim}
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
                                {termo || categoria ? "Nenhum livro encontrado." : "O acervo ainda não tem livros."}
                            </VazioTexto>

                        </Vazio>
                    )
                }
                ListFooterComponent={carregandoMais ? <Loader color={colors.primary} /> : null}
                renderItem={({ item: livro }) => {

                    if (livro.espaco) return <Espaco />

                    const fora = indisponiveis.has(livro.id)

                    return (
                        <Cartao>

                            <CartaoCapa
                                onPress={() => navigation.navigate("LivroCliente", { id: String(livro.id) })}
                                accessibilityLabel={`Ver ${livro.titulo}`}
                            >
                                <CapaDoLivro livro={livro} largura={96} />
                            </CartaoCapa>

                            <CartaoInfo
                                onPress={() => navigation.navigate("LivroCliente", { id: String(livro.id) })}
                                activeOpacity={0.7}
                            >

                                <CartaoTitulo numberOfLines={2}>
                                    {livro.titulo}
                                </CartaoTitulo>

                                <CartaoDetalhe numberOfLines={1}>
                                    {autoresDe(livro)}
                                </CartaoDetalhe>

                                <CartaoDetalhe numberOfLines={1}>
                                    {livro.categoria?.nome}
                                </CartaoDetalhe>

                            </CartaoInfo>

                            <StatusBadge
                                text={fora ? "Indisponível" : "Disponível"}
                                tone={fora ? "warn" : "ok"}
                            />

                            <Botao
                                onPress={() => reservar(livro)}
                                disabled={fora || reservando === livro.id}
                                $desabilitado={fora || reservando === livro.id}
                            >
                                <BotaoTexto>
                                    {reservando === livro.id ? "Reservando..." : "Reservar"}
                                </BotaoTexto>
                            </Botao>

                        </Cartao>
                    )
                }}
            />

        </Container>
    )
}

export default Catalogo
