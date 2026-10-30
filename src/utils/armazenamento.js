
import AsyncStorage from "@react-native-async-storage/async-storage"

// Guarda pequenos valores no aparelho (no navegador, usa o localStorage).
// Se o armazenamento falhar, o app continua funcionando: só não lembra da escolha.

// LER UM VALOR (devolve null se não existir ou se der erro)
const lerValor = async (chave) => {

    try {
        return await AsyncStorage.getItem(chave)
    } catch {
        return null
    }
}


// GRAVAR UM VALOR (texto)
const gravarValor = async (chave, valor) => {

    try {
        await AsyncStorage.setItem(chave, String(valor))
    } catch {
        // SEM ARMAZENAMENTO: A ESCOLHA VALE SÓ ATÉ FECHAR O APP
    }
}


// APAGAR UM VALOR
const apagarValor = async (chave) => {

    try {
        await AsyncStorage.removeItem(chave)
    } catch {
        // NADA A FAZER
    }
}


export {
    lerValor,
    gravarValor,
    apagarValor
}
