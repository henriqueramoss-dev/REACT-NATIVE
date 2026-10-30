
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { gravarValor, lerValor } from "../utils/armazenamento"

const CHAVE_NOTIFICACOES = "biblioteca:notificacoes"

const PreferenciasContext = createContext(undefined)


// Guarda as preferências do usuário no aparelho (por enquanto: lembretes de devolução).
// O tema claro/escuro fica no theme-context.
const PreferenciasProvider = ({ children }) => {

    const [notificacoes, setNotificacoesState] = useState(false)

    // RECUPERA A ESCOLHA SALVA AO ABRIR O APP
    useEffect(() => {

        lerValor(CHAVE_NOTIFICACOES).then((salvo) => {
            if (salvo === "true") setNotificacoesState(true)
        })

    }, [])

    // LIGA OU DESLIGA OS LEMBRETES E GUARDA A ESCOLHA
    const setNotificacoes = useCallback((ligado) => {

        setNotificacoesState(ligado)
        gravarValor(CHAVE_NOTIFICACOES, ligado)
    }, [])

    const value = useMemo(
        () => ({ notificacoes, setNotificacoes }),
        [notificacoes, setNotificacoes]
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
