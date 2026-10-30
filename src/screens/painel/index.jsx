
import { useCallback, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import StatusBadge from "../../components/status-badge"
import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { usePreferencias } from "../../contexts/preferencias-context"
import { getBaseUrl, list } from "../../services/biblioteca-api"
import { RESOURCES, STATUS_OPTIONS } from "../../services/resources"
import { RESOURCE_ICONS } from "../../utils/icones"
import { sincronizarLembretes } from "../../utils/lembretes"
import { TELA_DA_LISTA } from "../../utils/rotas"

import {
    Container,
    Content,
    PageHeader,
    PageHeaderText,
    Title,
    Subtitle,
    NewButton,
    NewButtonText,
    Alert,
    AlertText,
    AlertAction,
    Stats,
    Stat,
    StatLabel,
    StatValue,
    Tiles,
    Tile,
    TileIcon,
    TileText,
    TileValue,
    TileLabel,
    Card,
    CardHeader,
    CardTitle,
    CardLink,
    Empty,
    Recent,
    RecentText,
    RecentTitle,
    ApiInfo
} from "./style"

const MODULES = Object.keys(RESOURCE_ICONS)

const Painel = () => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()
    const { usuario } = useAuth()
    const { notificacoes } = usePreferencias()

    const [counts, setCounts] = useState({})
    const [recentes, setRecentes] = useState([])
    const [error, setError] = useState()

    const load = useCallback(() => {

        const emp = RESOURCES.emprestimos

        const totals = MODULES.map((key) =>
            list(key, RESOURCES[key].embeddedKey, { size: 1 }).then((p) => [key, p.totalElements])
        )

        const byStatus = STATUS_OPTIONS.map((o) =>
            list(emp.key, emp.embeddedKey, { size: 1, search: { status: o.value } }).then((p) => [o.value, p.totalElements])
        )

        // ALLSETTLED: SE UMA CONTAGEM FALHAR, AS OUTRAS CONTINUAM APARECENDO
        Promise.allSettled([...totals, ...byStatus]).then((results) => {

            const ok = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))
            const failed = results.find((r) => r.status === "rejected")

            setCounts((current) => ({ ...current, ...Object.fromEntries(ok) }))
            setError(failed ? failed.reason.message : undefined)
        })

        list(emp.key, emp.embeddedKey, { size: 5, sort: "id,desc" })
            .then((p) => setRecentes(p.items))
            .catch(() => {})

    }, [])

    // ATUALIZA OS NÚMEROS SEMPRE QUE O PAINEL VOLTA A FICAR VISÍVEL
    useFocusEffect(load)

    // COM OS LEMBRETES LIGADOS, REFAZ OS AVISOS DE DEVOLUÇÃO AO ABRIR O PAINEL
    useFocusEffect(
        useCallback(() => {

            if (notificacoes) sincronizarLembretes(usuario?.id).catch(() => {})

        }, [notificacoes, usuario?.id])
    )

    // NOVO EMPRÉSTIMO
    const handleNewLoan = () => {
        navigation.navigate("Formulario", { recurso: "emprestimos" })
    }

    // ABRIR A LISTA DE EMPRÉSTIMOS COM UM STATUS JÁ FILTRADO
    const handleStatus = (status) => {
        navigation.navigate("Emprestimos", { status })
    }

    // ABRIR UMA DAS LISTAS (LIVROS, AUTORES...)
    const handleModule = (key) => {
        navigation.navigate(TELA_DA_LISTA[key])
    }

    // ABRIR UM EMPRÉSTIMO RECENTE
    const handleRecent = (emprestimo) => {
        navigation.navigate("Formulario", { recurso: "emprestimos", id: String(emprestimo.id) })
    }

    return (
        <Container>

            <Content>

                <PageHeader>

                    <PageHeaderText>

                        <Title>
                            Início
                        </Title>

                        <Subtitle>
                            Visão geral do acervo e dos empréstimos.
                        </Subtitle>

                    </PageHeaderText>

                    <NewButton onPress={handleNewLoan}>

                        <Ionicons
                            name="add"
                            size={18}
                            color={colors.onPrimary}
                        />

                        <NewButtonText>
                            Novo empréstimo
                        </NewButtonText>

                    </NewButton>

                </PageHeader>

                {error && (
                    <Alert onPress={load}>

                        <AlertText>
                            {error}
                        </AlertText>

                        <AlertAction>
                            Toque para tentar novamente
                        </AlertAction>

                    </Alert>
                )}

                <Stats>

                    {STATUS_OPTIONS.map((option) => (
                        <Stat
                            key={option.value}
                            $status={option.value}
                            onPress={() => handleStatus(option.value)}
                        >

                            <StatLabel>
                                Empréstimos {option.label.toLowerCase()}s
                            </StatLabel>

                            <StatValue>
                                {counts[option.value] ?? "–"}
                            </StatValue>

                        </Stat>
                    ))}

                </Stats>

                <Tiles>

                    {MODULES.map((key) => (
                        <Tile
                            key={key}
                            onPress={() => handleModule(key)}
                        >

                            <TileIcon>
                                <Ionicons
                                    name={RESOURCE_ICONS[key]}
                                    size={22}
                                    color={colors.primary}
                                />
                            </TileIcon>

                            <TileText>
                                <TileValue>
                                    {counts[key] ?? "–"}
                                </TileValue>

                                <TileLabel>
                                    {RESOURCES[key].label}
                                </TileLabel>
                            </TileText>

                        </Tile>
                    ))}

                </Tiles>

                <Card>

                    <CardHeader>

                        <CardTitle>
                            Empréstimos recentes
                        </CardTitle>

                        <CardLink
                            onPress={() => handleModule("emprestimos")}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            Ver todos
                        </CardLink>

                    </CardHeader>

                    {recentes.length === 0 ? (
                        <Empty>
                            Nenhum empréstimo registrado ainda.
                        </Empty>
                    ) : (
                        recentes.map((e, index) => {

                            const badge = RESOURCES.emprestimos.badge?.(e)

                            return (
                                <Recent
                                    key={e.id}
                                    $primeiro={index === 0}
                                    onPress={() => handleRecent(e)}
                                    activeOpacity={0.7}
                                >

                                    <RecentText numberOfLines={1}>
                                        <RecentTitle>
                                            {e.livro?.titulo}
                                        </RecentTitle>
                                        {" "}· {e.usuario?.nome}
                                    </RecentText>

                                    {badge && (
                                        <StatusBadge
                                            text={badge.text}
                                            tone={badge.tone}
                                        />
                                    )}

                                </Recent>
                            )
                        })
                    )}

                </Card>

                <ApiInfo>
                    API: {getBaseUrl()}
                </ApiInfo>

            </Content>

        </Container>
    )
}

export default Painel
