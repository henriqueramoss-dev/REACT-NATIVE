
import styled from "styled-components/native"
import { FlatList, StyleSheet } from "react-native"

import { cor } from "../../utils/tema"


// Área escura atrás do modal: tocar nela fecha o seletor.
const Fundo = styled.TouchableOpacity`
    flex: 1;

    background-color: ${cor("overlay")};
`


const Sheet = styled.View`
    max-height: 75%;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    padding: 18px 20px 0px 20px;
`


const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 12px;
`


const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;

    color: ${cor("text")};
`


const CloseButton = styled.TouchableOpacity``


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

    margin-bottom: 8px;
`


const SearchInput = styled.TextInput`
    flex: 1;

    font-size: 15px;
    color: ${cor("text")};
`


const Message = styled.Text`
    font-size: 14px;
    text-align: center;

    color: ${({ theme, $erro }) => ($erro ? theme.colors.danger : theme.colors.textMuted)};
`


const List = styled(FlatList)`
    flex-grow: 0;
`


const Option = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: 12px;

    padding: 14px 0;

    border-bottom-width: ${StyleSheet.hairlineWidth}px;
    border-bottom-color: ${cor("border")};
`


const OptionText = styled.Text`
    flex: 1;

    font-size: 15px;
    color: ${cor("text")};
`


const Empty = styled.View`
    align-items: center;

    gap: 14px;

    padding: 24px 0;
`


const CreateButton = styled.TouchableOpacity`
    background-color: ${cor("primary")};

    border-radius: 8px;

    padding: 10px 18px;
`


const CreateButtonText = styled.Text`
    font-weight: 600;
    color: ${cor("onPrimary")};
`


const DoneButton = styled.TouchableOpacity`
    height: 46px;

    margin-top: 14px;

    background-color: ${cor("primary")};

    border-radius: 8px;

    align-items: center;
    justify-content: center;
`


const DoneButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


export {
    Fundo,
    Sheet,
    Header,
    Title,
    CloseButton,
    SearchArea,
    SearchInput,
    Message,
    List,
    Option,
    OptionText,
    Empty,
    CreateButton,
    CreateButtonText,
    DoneButton,
    DoneButtonText
}
