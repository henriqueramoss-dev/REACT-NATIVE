
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


const Field = styled.View`
    gap: 6px;
`


const Label = styled.Text`
    font-size: 14px;
    font-weight: 600;

    color: ${cor("text")};
`


const Required = styled.Text`
    color: ${cor("danger")};
`


// Base dos campos de texto. $error deixa a borda vermelha.
const Input = styled.TextInput`
    min-height: 44px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.border)};
    border-radius: 8px;

    padding: 0 12px;

    font-size: 15px;
    color: ${cor("text")};
`


const DateArea = styled.View``


const DateInput = styled(Input)`
    padding-right: 40px;
`


const DateIcon = styled.View`
    position: absolute;
    right: 12px;
    top: 13px;
`


const Select = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;

    gap: 10px;

    min-height: 44px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.border)};
    border-radius: 8px;

    padding: 0 12px;
`


const SelectText = styled.Text`
    flex: 1;

    font-size: 15px;

    color: ${({ theme, $vazio }) => ($vazio ? theme.colors.placeholder : theme.colors.text)};
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


const Check = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;

    gap: 8px;

    padding: 8px 12px;

    border-width: 1px;
    border-radius: 8px;

    background-color: ${({ theme, $on }) => ($on ? theme.colors.primarySoft : theme.colors.surface)};
    border-color: ${({ theme, $on }) => ($on ? theme.colors.primary : theme.colors.border)};
`


const CheckText = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${cor("text")};
`


const Hint = styled.Text`
    font-size: 14px;

    color: ${cor("textMuted")};
`


const HintLink = styled.Text`
    font-weight: 600;

    color: ${cor("primary")};
`


const ErrorText = styled.Text`
    font-size: 13px;

    color: ${cor("danger")};
`


export {
    Field,
    Label,
    Required,
    Input,
    DateArea,
    DateInput,
    DateIcon,
    Select,
    SelectText,
    Chips,
    Chip,
    ChipText,
    Check,
    CheckText,
    Hint,
    HintLink,
    ErrorText
}
