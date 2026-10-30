
import styled from "styled-components/native"
import { ActivityIndicator, FlatList } from "react-native"

import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Toolbar = styled.View`
    padding: 16px 16px 0px 16px;

    gap: 12px;
`


const PageHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: 12px;
`


const Count = styled.Text`
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


const Chips = styled.View`
    flex-direction: row;
    flex-wrap: wrap;

    gap: 8px;
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


const List = styled(FlatList)`
    margin-top: 16px;
`


const Loader = styled(ActivityIndicator)`
    margin: 30px 0;
`


// Caixa de erro. $rodape é a versão que aparece embaixo de uma lista já carregada.
const ErrorBox = styled.TouchableOpacity`
    align-items: center;

    gap: 8px;

    background-color: ${cor("dangerSoft")};

    border-radius: 10px;

    padding: 16px;

    margin: ${({ $rodape }) => ($rodape ? "12px" : "0px")};
`


const ErrorText = styled.Text`
    font-size: 14px;
    text-align: center;

    color: ${cor("danger")};
`


const RetryText = styled.Text`
    padding: 6px 12px;

    font-size: 14px;
    font-weight: bold;

    color: ${cor("danger")};
`


// Moldura usada quando a lista está vazia.
const Table = styled.View`
    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;

    overflow: hidden;
`


const EmptyText = styled.Text`
    padding: 36px 20px;

    font-size: 14px;
    text-align: center;

    color: ${cor("textMuted")};
`


const Row = styled.TouchableOpacity`
    flex-direction: row;
    align-items: flex-start;

    gap: 8px;

    padding: 12px 8px 12px 16px;

    border-top-width: ${({ $primeiro }) => ($primeiro ? "0px" : "1px")};
    border-top-color: ${cor("border")};
`


const RowBody = styled.View`
    flex: 1;

    gap: 3px;
`


const RowTitle = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("text")};
`


const RowSubtitle = styled.Text`
    font-size: 13px;

    color: ${cor("textMuted")};
`


const RowDetail = styled.Text`
    font-size: 14px;

    color: ${cor("text")};
`


const RowDetailLabel = styled.Text`
    color: ${cor("textMuted")};
`


const BadgeRow = styled.View`
    flex-direction: row;

    margin-top: 4px;
`


const Actions = styled.View`
    flex-direction: row;
`


const IconButton = styled.TouchableOpacity`
    min-width: 36px;
    min-height: 36px;

    border-radius: 8px;

    align-items: center;
    justify-content: center;
`


export {
    Container,
    Toolbar,
    PageHeader,
    Count,
    NewButton,
    NewButtonText,
    SearchArea,
    SearchInput,
    Chips,
    Chip,
    ChipText,
    List,
    Loader,
    ErrorBox,
    ErrorText,
    RetryText,
    Table,
    EmptyText,
    Row,
    RowBody,
    RowTitle,
    RowSubtitle,
    RowDetail,
    RowDetailLabel,
    BadgeRow,
    Actions,
    IconButton
}
