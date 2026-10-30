
import { useCallback, useEffect, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import StatusBadge from "../status-badge"
import { useAppTheme } from "../../contexts/theme-context"
import { list, remove } from "../../services/biblioteca-api"
import { RESOURCES } from "../../services/resources"
import { avisar, confirmar } from "../../utils/dialogs"

import {
    Container,
    Toolbar,
    PageHeader,
    Count,
    NewButton,
    NewButtonText,
    SearchArea,
    SearchInput,
    Chips,
    Chip,
    ChipText,
    List,
    Loader,
    ErrorBox,
    ErrorText,
    RetryText,
    Table,
    EmptyText,
    Row,
    RowBody,
    RowTitle,
    RowSubtitle,
    RowDetail,
    RowDetailLabel,
    BadgeRow,
    Actions,
    IconButton
} from "./style"

const PAGE_SIZE = 15

// Tela de listagem genérica: busca, paginação infinita, atualização e exclusão.
// Prop: resourceKey ("livros", "autores"...), que escolhe o recurso em src/services/resources.ts.
const ResourceList = ({ resourceKey }) => {

    const navigation = useNavigation()
    const route = useRoute()
    const insets = useSafeAreaInsets()
    const { colors } = useAppTheme()

    const resource = RESOURCES[resourceKey]

    // A BUSCA PODE VIR PRONTA DE OUTRA TELA (EX.: O PAINEL ABRE OS EMPRÉSTIMOS ATIVOS)
    const param = route.params?.[resource.search.param]
    const initialTerm = typeof param === "string" ? param : ""

    const [draft, setDraft] = useState(initialTerm)
    const [term, setTerm] = useState(initialTerm)
    const [items, setItems] = useState([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState()

    const requestId = useRef(0)

    const load = useCallback(async (nextPage, mode) => {

        const id = ++requestId.current

        if (mode === "reset") setLoading(true)
        if (mode === "more") setLoadingMore(true)
        if (mode === "refresh") setRefreshing(true)

        try {

            const data = await list(resource.key, resource.embeddedKey, {
                page: nextPage,
                size: PAGE_SIZE,
                search: { [resource.search.param]: term }
            })

            // RESPOSTA ANTIGA (O USUÁRIO JÁ MUDOU A BUSCA)
            if (id !== requestId.current) return

            setItems((current) => (mode === "more" ? [...current, ...data.items] : data.items))
            setPage(data.number)
            setTotalPages(data.totalPages)
            setTotal(data.totalElements)
            setError(undefined)

        } catch (e) {

            if (id === requestId.current) setError(e.message)

        } finally {

            if (id === requestId.current) {
                setLoading(false)
                setLoadingMore(false)
                setRefreshing(false)
            }
        }

    }, [resource, term])

    // RECARREGA AO ABRIR A TELA, AO VOLTAR DO FORMULÁRIO E QUANDO A BUSCA MUDA
    useFocusEffect(
        useCallback(() => {
            load(0, "reset")
        }, [load])
    )

    // ESPERA O USUÁRIO PARAR DE DIGITAR ANTES DE BUSCAR
    useEffect(() => {

        if (resource.search.options) return

        const timer = setTimeout(() => setTerm(draft.trim()), 400)

        return () => clearTimeout(timer)

    }, [draft, resource.search.options])

    // ABRIR UM ITEM: LIVRO VAI PARA OS DETALHES, OS DEMAIS PARA O FORMULÁRIO
    const handleOpen = (item) => {

        if (resource.key === "livros") {
            navigation.navigate("LivroDetalhes", { id: String(item.id) })
        } else {
            navigation.navigate("Formulario", { recurso: resource.key, id: String(item.id) })
        }
    }

    const handleNew = () => {
        navigation.navigate("Formulario", { recurso: resource.key })
    }

    const handleEdit = (item) => {
        navigation.navigate("Formulario", { recurso: resource.key, id: String(item.id) })
    }

    const handleDelete = async (item) => {

        const ok = await confirmar(
            `Excluir ${resource.singular.toLowerCase()}`,
            `Deseja excluir "${resource.title(item)}"?`
        )

        if (!ok) return

        try {
            await remove(resource.key, item.id)
            load(0, "refresh")
        } catch (e) {
            avisar("Não foi possível excluir", e.message)
        }
    }

    // CARREGA A PRÓXIMA PÁGINA QUANDO CHEGA NO FIM DA LISTA
    const handleEndReached = () => {
        if (!loading && !loadingMore && !error && page < totalPages - 1) {
            load(page + 1, "more")
        }
    }

    // O FLATLIST PRECISA DESTE ESTILO PARA DESENHAR A MOLDURA DA TABELA
    const tableStyle = {
        marginHorizontal: 16,
        flexGrow: 0,
        marginBottom: insets.bottom + 24,
        ...(items.length > 0 && {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 10,
            overflow: "hidden"
        })
    }

    return (
        <Container>

            <Toolbar>

                <PageHeader>

                    <Count>
                        {loading || (error && items.length === 0) ? " " : total === 1 ? "1 registro" : `${total} registros`}
                    </Count>

                    <NewButton onPress={handleNew}>

                        <Ionicons
                            name="add"
                            size={18}
                            color={colors.onPrimary}
                        />

                        <NewButtonText>
                            {resource.newLabel}
                        </NewButtonText>

                    </NewButton>

                </PageHeader>

                {resource.search.options ? (
                    <Chips>

                        {[{ value: "", label: "Todos" }, ...resource.search.options].map((option) => {

                            const active = term === option.value

                            return (
                                <Chip
                                    key={option.value || "todos"}
                                    $active={active}
                                    onPress={() => setTerm(option.value)}
                                >
                                    <ChipText $active={active}>
                                        {option.label}
                                    </ChipText>
                                </Chip>
                            )
                        })}

                    </Chips>
                ) : (
                    <SearchArea>

                        <Ionicons
                            name="search"
                            size={17}
                            color={colors.textMuted}
                        />

                        <SearchInput
                            value={draft}
                            onChangeText={setDraft}
                            placeholder={resource.search.label}
                            placeholderTextColor={colors.textMuted}
                            returnKeyType="search"
                            onSubmitEditing={() => setTerm(draft.trim())}
                        />

                        {draft !== "" && (
                            <IconButton
                                onPress={() => setDraft("")}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                accessibilityLabel="Limpar busca"
                            >
                                <Ionicons
                                    name="close"
                                    size={18}
                                    color={colors.textMuted}
                                />
                            </IconButton>
                        )}

                    </SearchArea>
                )}

            </Toolbar>

            <List
                data={items}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={tableStyle}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => load(0, "refresh")}
                    />
                }
                onEndReachedThreshold={0.4}
                onEndReached={handleEndReached}
                ListEmptyComponent={
                    loading ? (
                        <Loader color={colors.primary} />
                    ) : error ? (
                        <ErrorBox>

                            <Ionicons
                                name="alert-circle-outline"
                                size={22}
                                color={colors.danger}
                            />

                            <ErrorText>
                                {error}
                            </ErrorText>

                            <IconButton onPress={() => load(0, "reset")}>
                                <RetryText>
                                    Tentar novamente
                                </RetryText>
                            </IconButton>

                        </ErrorBox>
                    ) : (
                        <Table>
                            <EmptyText>
                                {term ? "Nenhum resultado para a busca." : resource.emptyLabel}
                            </EmptyText>
                        </Table>
                    )
                }
                ListFooterComponent={
                    loadingMore ? (
                        <Loader color={colors.primary} />
                    ) : error && items.length > 0 ? (
                        <ErrorBox
                            $rodape
                            onPress={() => load(0, "refresh")}
                        >

                            <ErrorText>
                                {error}
                            </ErrorText>

                            <RetryText>
                                Tocar para tentar novamente
                            </RetryText>

                        </ErrorBox>
                    ) : null
                }
                renderItem={({ item, index }) => {

                    const badge = resource.badge?.(item)

                    return (
                        <Row
                            $primeiro={index === 0}
                            onPress={() => handleOpen(item)}
                            activeOpacity={0.7}
                        >

                            <RowBody>

                                <RowTitle numberOfLines={2}>
                                    {resource.title(item)}
                                </RowTitle>

                                {resource.subtitle(item) !== "" && (
                                    <RowSubtitle numberOfLines={1}>
                                        {resource.subtitle(item)}
                                    </RowSubtitle>
                                )}

                                {resource.details(item).map((detail) => (
                                    <RowDetail key={detail.label}>
                                        <RowDetailLabel>
                                            {detail.label}:{" "}
                                        </RowDetailLabel>
                                        {detail.value}
                                    </RowDetail>
                                ))}

                                {badge && (
                                    <BadgeRow>
                                        <StatusBadge
                                            text={badge.text}
                                            tone={badge.tone}
                                        />
                                    </BadgeRow>
                                )}

                            </RowBody>

                            <Actions>

                                <IconButton
                                    onPress={() => handleEdit(item)}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                    accessibilityLabel={`Editar ${resource.title(item)}`}
                                >
                                    <Ionicons
                                        name="pencil-outline"
                                        size={18}
                                        color={colors.textMuted}
                                    />
                                </IconButton>

                                <IconButton
                                    onPress={() => handleDelete(item)}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                    accessibilityLabel={`Excluir ${resource.title(item)}`}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={18}
                                        color={colors.textMuted}
                                    />
                                </IconButton>

                            </Actions>

                        </Row>
                    )
                }}
            />

        </Container>
    )
}

export default ResourceList
