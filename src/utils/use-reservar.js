
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import { useAuth } from "../contexts/auth-context"
import { reservarLivro } from "../services/biblioteca-api"
import { formatDate } from "../services/resources"


// Nomes dos autores de um livro, separados por vírgula.
const autoresDe = (livro) => (livro?.autores ?? []).map((autor) => autor.nome).join(", ") || "Autor não informado"


// RESERVAR UM LIVRO: SEM LOGIN, LEVA PARA A TELA DE ENTRADA E VOLTA DEPOIS.
// aoFeito(livroId) avisa a tela que o livro acabou de ficar indisponível (ou, sem id, que deu erro e vale recarregar).
const useReservar = (aoFeito) => {

    const navigation = useNavigation()
    const { sessao } = useAuth()

    const [reservando, setReservando] = useState(null)
    const [aviso, setAviso] = useState()
    const [erro, setErro] = useState()

    const reservar = async (livro) => {

        if (!sessao) {
            navigation.navigate("Login", { voltar: true })
            return
        }

        setReservando(livro.id)
        setAviso(undefined)
        setErro(undefined)

        try {

            const reserva = await reservarLivro(livro.id)

            setAviso(`Reserva feita! Retire "${livro.titulo}" na biblioteca até ${formatDate(reserva.retirarAte)}.`)
            aoFeito?.(livro.id)

        } catch (e) {

            setErro(e.message)
            aoFeito?.()

        } finally {
            setReservando(null)
        }
    }

    return { reservar, reservando, aviso, erro }
}


export {
    autoresDe,
    useReservar
}
