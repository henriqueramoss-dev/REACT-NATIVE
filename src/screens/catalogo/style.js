import styled from "styled-components/native"
import { ActivityIndicator, FlatList } from "react-native"

import { FONTE_TITULO } from "../../utils/fontes"
import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Faixa = styled.View`
    background-color: ${cor("surfaceMuted")};
    border-bottom-width: 1px;
    border-bottom-color: ${cor("border")};
`


const Grade = styled(FlatList)`
    flex: 1;
`


const Topo = styled.View`
    padding: 20px 16px 4px 16px;
    gap: 12px;
`


const Eyebrow = styled.Text`
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1.4px;

    color: ${cor("primary")};
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


const SearchArea = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 8px;

    height: 44px;

    background-color: ${cor("surface")};
    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 8px;
    padding: 0 12px;
`


const SearchInput = styled.TextInput`
    flex: 1;

    font-size: 15px;

    color: ${cor("text")};
`


const Categorias = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { gap: 8, paddingVertical: 2 }
})`
    flex-grow: 0;
`


const Chip = styled.TouchableOpacity`
    padding: 7px 14px;

    border-width: 1px;
    border-radius: 999px;

    background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
    border-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
`


const ChipText = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.text)};
`


// Aviso de sucesso (reserva feita) ou de erro.
const Aviso = styled.View`
    gap: 6px;

    border-radius: 8px;
    padding: 10px 14px;

    background-color: ${({ theme, $erro }) => ($erro ? theme.colors.dangerSoft : theme.colors.successSoft)};
`


const AvisoTexto = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${({ theme, $erro }) => ($erro ? theme.colors.danger : theme.colors.success)};
`


const AvisoLink = styled.Text`
    font-size: 14px;
    font-weight: bold;
    text-decoration-line: underline;

    color: ${cor("success")};
`


// Cartão de um livro: duas colunas na tela do celular.
const Cartao = styled.View`
    flex: 1;
    align-items: center;
    gap: 8px;

    margin: 6px;
    padding: 14px 10px;

    background-color: ${cor("surface")};
    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;
`


const CartaoCapa = styled.TouchableOpacity`
    align-items: center;
    justify-content: flex-end;

    min-height: 150px;
`


const CartaoInfo = styled.TouchableOpacity`
    align-items: center;
    gap: 2px;

    flex-grow: 1;
`


const CartaoTitulo = styled.Text`
    font-size: 14px;
    font-weight: bold;
    text-align: center;

    color: ${cor("text")};
`


const CartaoDetalhe = styled.Text`
    font-size: 12px;
    text-align: center;

    color: ${cor("textMuted")};
`


const Botao = styled.TouchableOpacity`
    align-self: stretch;
    align-items: center;
    justify-content: center;

    height: 38px;

    border-radius: 8px;

    background-color: ${cor("primary")};
    opacity: ${({ $desabilitado }) => ($desabilitado ? 0.5 : 1)};
`


const BotaoTexto = styled.Text`
    font-size: 14px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


const Loader = styled(ActivityIndicator)`
    margin: 30px 0;
`


const Vazio = styled.View`
    align-items: center;

    margin: 16px;
    padding-top: 22px;

    background-color: ${cor("surface")};
    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;
`


const VazioTexto = styled.Text`
    padding: 6px 20px 30px;

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


// Ocupa o lugar do cartão que falta na última linha.
const Espaco = styled.View`
    flex: 1;

    margin: 6px;
`


export {
    Container,
    Faixa,
    Grade,
    Topo,
    Eyebrow,
    Title,
    Subtitle,
    SearchArea,
    SearchInput,
    Categorias,
    Chip,
    ChipText,
    Aviso,
    AvisoTexto,
    AvisoLink,
    Cartao,
    CartaoCapa,
    CartaoInfo,
    CartaoTitulo,
    CartaoDetalhe,
    Botao,
    BotaoTexto,
    Loader,
    Vazio,
    VazioTexto,
    Erro,
    ErroTexto,
    Espaco
}
