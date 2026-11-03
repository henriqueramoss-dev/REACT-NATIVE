
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { gravarValor, lerValor } from "../utils/armazenamento"

const CHAVE_NOTIFICACOES = "biblioteca:notificacoes"
const CHAVE_CAPAS = "biblioteca:capas-reais"

const PreferenciasContext = createContext(undefined)


// Guarda as preferências do usuário no aparelho: lembretes de devolução e capas reais de livros.
// O tema claro/escuro fica no theme-context.
const PreferenciasProvider = ({ children }) => {

    const [notificacoes, setNotificacoesState] = useState(false)
    const [capasReais, setCapasReaisState] = useState(true)

    // RECUPERA A ESCOLHA SALVA AO ABRIR O APP
    useEffect(() => {

        lerValor(CHAVE_NOTIFICACOES).then((salvo) => {
            if (salvo === "true") setNotificacoesState(true)
        })

        lerValor(CHAVE_CAPAS).then((salvo) => {
            if (salvo === "false") setCapasReaisState(false)
        })

    }, [])

    // LIGA OU DESLIGA OS LEMBRETES E GUARDA A ESCOLHA
    const setNotificacoes = useCallback((ligado) => {

        setNotificacoesState(ligado)
        gravarValor(CHAVE_NOTIFICACOES, ligado)
    }, [])

    // LIGA OU DESLIGA AS CAPAS REAIS (BUSCADAS NO OPEN LIBRARY) E GUARDA A ESCOLHA
    const setCapasReais = useCallback((ligado) => {

        setCapasReaisState(ligado)
        gravarValor(CHAVE_CAPAS, ligado)
    }, [])

    const value = useMemo(
        () => ({ notificacoes, setNotificacoes, capasReais, setCapasReais }),
        [notificacoes, setNotificacoes, capasReais, setCapasReais]
    )

    return (
        <PreferenciasContext.Provider value={value}>
            {children}
        </PreferenciasContext.Provider>
    )
}


const usePreferencias = () => {

    const context = useContext(PreferenciasContext)

    if (!context) {
        throw new Error("usePreferencias precisa ser usado dentro de PreferenciasProvider.")
    }

    return context
}


export {
    PreferenciasProvider,
    usePreferencias
}
