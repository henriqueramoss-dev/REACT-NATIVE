
import { Platform } from "react-native"

import { list } from "../services/biblioteca-api"
import { RESOURCES } from "../services/resources"

// Lembretes de devolução: avisos LOCAIS, agendados no próprio aparelho (sem servidor).
// Cada empréstimo ativo gera um aviso às 9h do dia anterior à devolução (ou do próprio dia, se for tarde demais).

const HORA_DO_AVISO = 9
const CANAL = "lembretes"


// A BIBLIOTECA DE NOTIFICAÇÕES SÓ É CARREGADA QUANDO PRECISA (NA WEB ELA NÃO EXISTE)
const carregarNotificacoes = async () => {

    if (Platform.OS === "web") return null

    const Notifications = await import("expo-notifications")

    // MOSTRA O AVISO MESMO COM O APP ABERTO
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true
        })
    })

    return Notifications
}


// "2026-11-03" + horas → Date no horário do aparelho
const dataComHora = (iso, diasDeDiferenca) => {

    const [ano, mes, dia] = iso.split("-").map(Number)

    return new Date(ano, mes - 1, dia + diasDeDiferenca, HORA_DO_AVISO, 0, 0)
}


// Escolhe quando avisar sobre uma devolução. Devolve null se já não dá tempo.
// Primeiro tenta a véspera às 9h; se já passou, tenta o dia da devolução às 9h.
const calcularAviso = (dataPrevistaDevolucao, agora = new Date()) => {

    if (!dataPrevistaDevolucao) return null

    const limite = agora.getTime() + 60 * 1000

    const vespera = dataComHora(dataPrevistaDevolucao, -1)
    if (vespera.getTime() > limite) return { quando: vespera, texto: "amanhã" }

    const dia = dataComHora(dataPrevistaDevolucao, 0)
    if (dia.getTime() > limite) return { quando: dia, texto: "hoje" }

    return null
}


// BUSCA OS EMPRÉSTIMOS ATIVOS: OS DA CONTA QUE ENTROU OU, SEM CONTA, TODOS
const buscarAtivos = async (usuarioId) => {

    const emp = RESOURCES.emprestimos

    if (usuarioId) {
        const pagina = await list(`usuarios/${usuarioId}/emprestimos`, emp.embeddedKey, { size: 100, sort: "id,desc" })
        return pagina.items.filter((e) => e.status === "ATIVO")
    }

    const pagina = await list(emp.key, emp.embeddedKey, { size: 100, sort: "id,desc", search: { status: "ATIVO" } })
    return pagina.items
}


// PEDE PERMISSÃO PARA MOSTRAR NOTIFICAÇÕES. Devolve "ok", "negada" ou "indisponivel" (web).
const pedirPermissao = async () => {

    const Notifications = await carregarNotificacoes()

    if (!Notifications) return "indisponivel"

    let { status } = await Notifications.getPermissionsAsync()

    if (status !== "granted") {
        ({ status } = await Notifications.requestPermissionsAsync())
    }

    return status === "granted" ? "ok" : "negada"
}


// APAGA TODOS OS LEMBRETES AGENDADOS
const cancelarLembretes = async () => {

    const Notifications = await carregarNotificacoes()

    if (!Notifications) return

    await Notifications.cancelAllScheduledNotificationsAsync()
}


// REFAZ OS LEMBRETES: apaga os antigos e agenda um para cada empréstimo ativo. Devolve quantos agendou.
const sincronizarLembretes = async (usuarioId) => {

    const Notifications = await carregarNotificacoes()

    if (!Notifications) return 0

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(CANAL, {
            name: "Lembretes de devolução",
            importance: Notifications.AndroidImportance.DEFAULT
        })
    }

    const ativos = await buscarAtivos(usuarioId)

    await Notifications.cancelAllScheduledNotificationsAsync()

    let agendados = 0

    for (const emprestimo of ativos) {

        const aviso = calcularAviso(emprestimo.dataPrevistaDevolucao)

        if (!aviso) continue

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Devolução ${aviso.texto}`,
                body: `Devolva "${emprestimo.livro?.titulo ?? "o livro"}" até ${emprestimo.dataPrevistaDevolucao.split("-").reverse().join("/")}.`
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: aviso.quando,
                channelId: CANAL
            }
        })

        agendados++
    }

    return agendados
}


export {
    calcularAviso,
    pedirPermissao,
    cancelarLembretes,
    sincronizarLembretes
}
