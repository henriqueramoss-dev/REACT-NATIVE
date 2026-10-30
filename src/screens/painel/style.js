
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


// Cor da faixa lateral de cada card de status.
const coresDoStatus = {
    ATIVO: "success",
    DEVOLVIDO: "textMuted",
    ATRASADO: "danger"
}


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Content = styled.ScrollView.attrs({
    contentContainerStyle: {
        padding: 16,
        paddingTop: 22,
        paddingBottom: 40
    }
})``


const PageHeader = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;

    gap: 14px;

    margin-bottom: 18px;
`


const PageHeaderText = styled.View`
    flex-grow: 1;
    flex-shrink: 1;

    min-width: 180px;
`


const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;

    color: ${cor("text")};
`


const Subtitle = styled.Text`
    margin-top: 4px;

    font-size: 14px;

    color: ${cor("textMuted")};
`


const NewButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;

    gap: 6px;

    height: 42px;

    background-color: ${cor("primary")};

    border-radius: 8px;

    padding: 0 16px;
`


const NewButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


const Alert = styled.TouchableOpacity`
    gap: 4px;

    background-color: ${cor("dangerSoft")};

    border-radius: 8px;

    padding: 12px;

    margin-bottom: 14px;
`


const AlertText = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${cor("danger")};
`


const AlertAction = styled.Text`
    font-size: 13px;
    font-weight: bold;

    color: ${cor("danger")};
`


const Stats = styled.View`
    flex-direction: row;

    gap: 10px;

    margin-bottom: 10px;
`


const Stat = styled.TouchableOpacity`
    flex: 1;

    gap: 4px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-left-width: 4px;
    border-left-color: ${({ theme, $status }) => theme.colors[coresDoStatus[$status]]};
    border-radius: 10px;

    padding: 12px;
`


const StatLabel = styled.Text`
    font-size: 12px;

    color: ${cor("textMuted")};
`


const StatValue = styled.Text`
    font-size: 26px;
    font-weight: bold;

    color: ${cor("text")};
`


const Tiles = styled.View`
    flex-direction: row;
    flex-wrap: wrap;

    gap: 10px;

    margin-bottom: 20px;
`


const Tile = styled.TouchableOpacity`
    flex-basis: 47%;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;

    gap: 12px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;

    padding: 14px;
`


const TileIcon = styled.View`
    width: 42px;
    height: 42px;

    background-color: ${cor("primarySoft")};

    border-radius: 10px;

    align-items: center;
    justify-content: center;
`


const TileText = styled.View``


const TileValue = styled.Text`
    font-size: 20px;
    font-weight: bold;

    color: ${cor("text")};
`


const TileLabel = styled.Text`
    font-size: 13px;

    color: ${cor("textMuted")};
`


const Card = styled.View`
    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;

    overflow: hidden;
`


const CardHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: 14px 16px;

    border-bottom-width: 1px;
    border-bottom-color: ${cor("border")};
`


const CardTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;

    color: ${cor("text")};
`


const CardLink = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${cor("primary")};
`


const Empty = styled.Text`
    padding: 28px 16px;

    font-size: 14px;
    text-align: center;

    color: ${cor("textMuted")};
`


const Recent = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: 10px;

    padding: 12px 16px;

    border-top-width: ${({ $primeiro }) => ($primeiro ? "0px" : "1px")};
    border-top-color: ${cor("border")};
`


const RecentText = styled.Text`
    flex: 1;

    font-size: 14px;

    color: ${cor("textMuted")};
`


const RecentTitle = styled.Text`
    font-weight: bold;

    color: ${cor("text")};
`


const ApiInfo = styled.Text`
    margin-top: 24px;

    font-size: 11px;
    text-align: center;

    color: ${cor("placeholder")};
`


export {
    Container,
    Content,
    PageHeader,
    PageHeaderText,
    Title,
    Subtitle,
    NewButton,
    NewButtonText,
    Alert,
    AlertText,
    AlertAction,
    Stats,
    Stat,
    StatLabel,
    StatValue,
    Tiles,
    Tile,
    TileIcon,
    TileText,
    TileValue,
    TileLabel,
    Card,
    CardHeader,
    CardTitle,
    CardLink,
    Empty,
    Recent,
    RecentText,
    RecentTitle,
    ApiInfo
}
