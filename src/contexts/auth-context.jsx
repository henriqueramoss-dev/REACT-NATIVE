import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { gerarChave, revogarChave, setApiKey, setOnUnauthorized } from "../services/biblioteca-api"
import { apagarValor, gravarValor, lerValor } from "../utils/armazenamento"

const CHAVE_SESSAO = "biblioteca:sessao"

// Do menor para o maior acesso: cada nível inclui os anteriores.
const ORDEM = ["LEITURA", "ESCRITA", "ADMIN"]

const AuthContext = createContext(undefined)


// Login do app: e-mail e senha viram uma chave de API (POST /chaves-api), guardada no aparelho.
// A senha NUNCA é guardada. Quem é da equipe da biblioteca (tipo FUNCIONARIO) recebe uma chave ADMIN e vê o
// painel de gestão; clientes recebem LEITURA e veem o catálogo e as próprias reservas.
const AuthProvider = ({ children }) => {

    const [sessao, setSessao] = useState(null)
    const [carregado, setCarregado] = useState(false)
    const [aviso, setAviso] = useState()

    // RECUPERA QUEM JÁ ESTAVA LOGADO AO ABRIR O APP
    useEffect(() => {

        lerValor(CHAVE_SESSAO).then((salva) => {

            try {
                const dados = salva ? JSON.parse(salva) : null

                if (dados && dados.chave && Number.isInteger(dados.usuarioId)) {
                    setApiKey(dados.chave)
                    setSessao(dados)
                }
            } catch {
                // VALOR ESTRAGADO: IGNORA
            }

            setCarregado(true)
        })

    }, [])

    // A API RECUSOU A CHAVE (REVOGADA OU API REINICIADA): VOLTA A SER VISITANTE
    useEffect(() => {

        setOnUnauthorized(() => {
            apagarValor(CHAVE_SESSAO)
            setApiKey(undefined)
            setSessao(null)
            setAviso("Sua sessão terminou. Entre novamente.")
        })

        return () => setOnUnauthorized(undefined)

    }, [])

    // ENTRAR: CONFERE E-MAIL E SENHA NA API E GUARDA A CHAVE (LANÇA ERRO SE ESTIVEREM INCORRETOS)
    const entrar = useCallback(async (email, senha) => {

        // FUNCIONÁRIO RECEBE ADMIN; OS DEMAIS TIPOS SÓ PODEM TER LEITURA (A API RESPONDE 403 AO PEDIDO DE ADMIN)
        let criada

        try {
            criada = await gerarChave(email, senha, "ADMIN")
        } catch (e) {

            if (e.status !== 403) throw e

            criada = await gerarChave(email, senha, "LEITURA")
        }

        const nova = {
            chave: criada.chave,
            chaveId: criada.id,
            nivel: criada.nivel,
            usuarioId: criada.usuarioId,
            email: email.trim(),
            nome: criada.usuarioNome ?? email.trim(),
            tipo: criada.usuarioTipo
        }

        setApiKey(nova.chave)
        gravarValor(CHAVE_SESSAO, JSON.stringify(nova))
        setAviso(undefined)
        setSessao(nova)

        return nova
    }, [])

    // SAIR: REVOGA A CHAVE NO SERVIDOR (SE FALHAR, SAI MESMO ASSIM) E ESQUECE A SESSÃO
    const sair = useCallback(async () => {

        const atual = sessao

        if (atual) {
            try {
                await revogarChave(atual.chaveId)
            } catch {
                // A SESSÃO LOCAL TERMINA DE QUALQUER FORMA
            }
        }

        apagarValor(CHAVE_SESSAO)
        setApiKey(undefined)
        setAviso(undefined)
        setSessao(null)
    }, [sessao])

    const value = useMemo(
        () => ({
            sessao,
            // MESMO FORMATO DE ANTES (id do usuário, nome, e-mail), MAIS O TIPO
            usuario: sessao ? { id: sessao.usuarioId, nome: sessao.nome, email: sessao.email, tipo: sessao.tipo } : null,
            carregado,
            aviso,
            entrar,
            sair,
            // EQUIPE DA BIBLIOTECA (FUNCIONARIO) × CLIENTE
            ehFuncionario: sessao?.tipo === "FUNCIONARIO",
            // A SESSÃO TEM PELO MENOS ESTE NÍVEL DE ACESSO?
            pode: (nivel) => !!sessao && ORDEM.indexOf(sessao.nivel) >= ORDEM.indexOf(nivel)
        }),
        [sessao, carregado, aviso, entrar, sair]
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
