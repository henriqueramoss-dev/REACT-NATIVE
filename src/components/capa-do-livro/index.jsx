
import { useState } from "react"

import { CapaDeLivro, corDaCapa } from "../ilustracoes"
import { usePreferencias } from "../../contexts/preferencias-context"
import { urlDaCapa } from "../../utils/capas"

import {
    CapaReal
} from "./style"

// Capa do livro: a imagem real (buscada pelo ISBN no Open Library) ou, se não houver
// (ou se as capas reais estiverem desligadas nas Configurações), a capa ilustrada.
// Props: livro (com id e isbn), largura e tamanho ("S", "M" ou "L").
const CapaDoLivro = ({ livro, largura = 40, tamanho = "M" }) => {

    const { capasReais } = usePreferencias()

    const [falhou, setFalhou] = useState(false)

    const altura = Math.round((largura * 84) / 60)
    const url = capasReais ? urlDaCapa(livro?.isbn, tamanho) : null

    if (!url || falhou) {
        return (
            <CapaDeLivro
                cor={corDaCapa(livro?.id)}
                width={largura}
                height={altura}
            />
        )
    }

    return (
        <CapaReal
            source={{ uri: url }}
            style={{ width: largura, height: altura }}
            accessible={false}
            onError={() => setFalhou(true)}
            onLoad={(e) => {
                // O SERVIÇO PODE DEVOLVER UMA IMAGEM DE 1 PIXEL QUANDO NÃO TEM A CAPA
                const origem = e?.nativeEvent?.source
                if (origem && origem.width <= 1) setFalhou(true)
            }}
        />
    )
}

export default CapaDoLivro
