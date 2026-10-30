
import { useCallback, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"

import { list } from "../services/biblioteca-api"
import { RESOURCES } from "../services/resources"

const PAGE_SIZE = 100 // máximo da API por página
const MAX_PAGES = 20 // trava de segurança: até 2000 opções


// Carrega os registros de outro recurso para os campos de seleção, percorrendo todas as páginas.
// Recarrega sempre que a tela volta a ficar visível
// (ex.: depois de cadastrar um item pelo link "Cadastrar agora").
const useOptions = (key) => {

    const [options, setOptions] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState()

    const reload = useCallback(async () => {

        if (!key) return

        const resource = RESOURCES[key]

        try {

            const all = []

            for (let page = 0; page < MAX_PAGES; page++) {

                const data = await list(resource.key, resource.embeddedKey, { page, size: PAGE_SIZE })

                all.push(...data.items.map((item) => ({
                    value: String(item.id),
                    label: resource.title(item)
                })))

                if (page >= data.totalPages - 1) break
            }

            setOptions(all)
            setError(undefined)

        } catch (e) {
            setError(e.message)
        } finally {
            setLoaded(true)
        }

    }, [key])

    useFocusEffect(
        useCallback(() => {
            reload()
        }, [reload])
    )

    return { options, loaded, error, reload }
}


export {
    useOptions
}
