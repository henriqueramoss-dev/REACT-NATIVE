import styled from "styled-components/native"
import { ActivityIndicator, FlatList } from "react-native"

import { FONTE_TITULO } from "../../utils/fontes"
import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Lista = styled(FlatList)`
    flex: 1;
`


const Topo = styled.View`
    gap: 4px;

    padding: 20px 16px 12px 16px;
`


const Title = styled.Text`
    font-family: ${FONTE_TITULO};
    font-size: 26px;
    font-weight: bold;

    color: ${cor("text")};
`


const Subtitle = styled.Text`
    font-size: 14px;

    color: ${cor("textMuted")};
`


const Cartao = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 14px;

    margin: 0 16px 12px 16px;
    padding: 14px;

    background-color: ${cor("surface")};
    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;
`


const Corpo = styled.View`
    flex: 1;
    align-items: flex-start;
    gap: 4px;
`


const Titulo = styled.Text`
    font-size: 15px;
    font-weight: bold;

    color: ${cor("text")};
`


const Detalhe = styled.Text`
    font-size: 13px;

    color: ${cor("textMuted")};
`


const BotaoCancelar = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;

    padding: 8px 12px;

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 8px;

    background-color: ${cor("surface")};
`


const BotaoCancelarTexto = styled.Text`
    font-size: 13px;
    font-weight: 600;

    color: ${cor("text")};
`


const BotaoPrimario = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;

    height: 44px;
    margin-top: 12px;
    padding: 0 20px;

    border-radius: 8px;

    background-color: ${cor("primary")};
`


const BotaoPrimarioTexto = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


const Loader = styled(ActivityIndicator)`
    margin: 30px 0;
`


const Vazio = styled.View`
    align-items: center;

    margin: 16px;
    padding: 22px 16px 24px 16px;

    background-color: ${cor("surface")};
    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;
`


const VazioTexto = styled.Text`
    padding: 6px 20px 0;

    font-family: ${FONTE_TITULO};
    font-size: 16px;
    text-align: center;

    color: ${cor("textMuted")};
`


const Erro = styled.TouchableOpacity`
    align-items: center;
    gap: 6px;

    margin: 16px;
    padding: 16px;

    border-radius: 10px;

    background-color: ${cor("dangerSoft")};
`


const ErroTexto = styled.Text`
    font-size: 14px;
    text-align: center;

    color: ${cor("danger")};
`


export {
    Container,
    Lista,
    Topo,
    Title,
    Subtitle,
    Cartao,
    Corpo,
    Titulo,
    Detalhe,
    BotaoCancelar,
    BotaoCancelarTexto,
    BotaoPrimario,
    BotaoPrimarioTexto,
    Loader,
    Vazio,
    VazioTexto,
    Erro,
    ErroTexto
}
