import styled from "styled-components/native"
import { ActivityIndicator } from "react-native"

import { FONTE_TITULO } from "../../utils/fontes"
import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Content = styled.ScrollView.attrs({
    contentContainerStyle: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 28,
        paddingBottom: 40
    }
})``


const Loader = styled(ActivityIndicator)`
    margin-top: 40px;
`


const Message = styled.Text`
    margin-top: 30px;

    font-size: 14px;
    text-align: center;

    color: ${cor("text")};
`


const CapaArea = styled.View`
    align-items: center;

    margin-bottom: 20px;
`


const Eyebrow = styled.Text`
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1.4px;

    color: ${cor("primary")};
`


const Title = styled.Text`
    margin-top: 10px;

    font-family: ${FONTE_TITULO};
    font-size: 26px;
    font-weight: bold;

    color: ${cor("text")};
`


const Authors = styled.Text`
    margin: 4px 0 12px 0;

    font-size: 15px;

    color: ${cor("textMuted")};
`


const Selo = styled.View`
    align-items: flex-start;

    margin-bottom: 8px;
`


const Ficha = styled.View`
    margin-top: 8px;

    background-color: ${cor("surface")};
    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;
`


const FichaLinha = styled.View`
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;

    padding: 12px 14px;

    border-top-width: ${({ $primeiro }) => ($primeiro ? "0px" : "1px")};
    border-top-color: ${cor("border")};
`


const FichaRotulo = styled.Text`
    font-size: 13px;

    color: ${cor("textMuted")};
`


const FichaValor = styled.Text`
    flex-shrink: 1;

    font-size: 14px;
    font-weight: 600;
    text-align: right;

    color: ${cor("text")};
`


const Aviso = styled.View`
    gap: 6px;

    margin-top: 16px;
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


const PrimaryButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;

    height: 50px;
    margin-top: 20px;

    border-radius: 10px;

    background-color: ${cor("primary")};
    opacity: ${({ $desabilitado }) => ($desabilitado ? 0.5 : 1)};
`


const PrimaryButtonText = styled.Text`
    font-size: 16px;
    font-weight: bold;

    color: ${cor("onPrimary")};
`


const Nota = styled.Text`
    margin-top: 10px;

    font-size: 12px;
    text-align: center;

    color: ${cor("textMuted")};
`


export {
    Container,
    Content,
    Loader,
    Message,
    CapaArea,
    Eyebrow,
    Title,
    Authors,
    Selo,
    Ficha,
    FichaLinha,
    FichaRotulo,
    FichaValor,
    Aviso,
    AvisoTexto,
    AvisoLink,
    PrimaryButton,
    PrimaryButtonText,
    Nota
}
