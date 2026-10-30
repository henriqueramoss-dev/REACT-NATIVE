
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { login } from "../services/biblioteca-api"
import { apagarValor, gravarValor, lerValor } from "../utils/armazenamento"

const CHAVE_USUARIO = "biblioteca:usuario"

const AuthContext = createContext(undefined)


// Guarda quem entrou no app (id, nome e e-mail). A senha NUNCA é guardada.
// Como a API ainda não gera token, isso só serve para mostrar a conta e saber de quem trocar a senha.
const AuthProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null)
    const [carregado, setCarregado] = useState(false)

    // RECUPERA QUEM JÁ ESTAVA LOGADO AO ABRIR O APP
    useEffect(() => {

        lerValor(CHAVE_USUARIO).then((salvo) => {

            try {
                const dados = salvo ? JSON.parse(salvo) : null
                if (dados && Number.isInteger(dados.id)) setUsuario(dados)
            } catch {
                // VALOR ESTRAGADO: IGNORA
            }

            setCarregado(true)
        })

    }, [])

    // GUARDA O USUÁRIO (SÓ OS CAMPOS NECESSÁRIOS)
    const guardar = useCallback((dados) => {

        const resumo = { id: dados.id, nome: dados.nome, email: dados.email }

        setUsuario(resumo)
        gravarValor(CHAVE_USUARIO, JSON.stringify(resumo))
    }, [])

    // ENTRAR: CONFERE E-MAIL E SENHA NA API (LANÇA ERRO SE ESTIVEREM INCORRETOS)
    const entrar = useCallback(async (email, senha) => {

        const dados = await login(email.trim(), senha)

        guardar(dados)
    }, [guardar])

    // SAIR: ESQUECE O USUÁRIO
    const sair = useCallback(() => {

        setUsuario(null)
        apagarValor(CHAVE_USUARIO)
    }, [])

    const value = useMemo(
        () => ({ usuario, carregado, entrar, guardar, sair }),
        [usuario, carregado, entrar, guardar, sair]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth precisa ser usado dentro de AuthProvider.")
    }

    return context
}


export {
    AuthProvider,
    useAuth
}
