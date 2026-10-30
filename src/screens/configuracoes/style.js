
import styled from "styled-components/native"
import { Switch as RNSwitch } from "react-native"

import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Content = styled.ScrollView.attrs({
    contentContainerStyle: {
        padding: 16,
        paddingBottom: 40
    }
})``


const SectionTitle = styled.Text`
    margin: 20px 0 8px 4px;

    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: ${cor("textMuted")};
`


const Card = styled.View`
    gap: 8px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;

    padding: 16px;
`


const AccountName = styled.Text`
    font-size: 17px;
    font-weight: bold;

    color: ${cor("text")};
`


const AccountEmail = styled.Text`
    font-size: 14px;

    color: ${cor("textMuted")};
`


const Hint = styled.Text`
    font-size: 13px;
    line-height: 19px;

    color: ${cor("textMuted")};
`


const Options = styled.View`
    flex-direction: row;
    flex-wrap: wrap;

    gap: 8px;
`


const Option = styled.TouchableOpacity`
    padding: 8px 16px;

    border-width: 1px;
    border-radius: 999px;

    background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
    border-color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
`


const OptionText = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.text)};
`


const SwitchRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: 12px;
`


const SwitchTexts = styled.View`
    flex: 1;

    gap: 3px;
`


const SwitchTitle = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("text")};
`


const SwitchDescription = styled.Text`
    font-size: 13px;
    line-height: 18px;

    color: ${cor("textMuted")};
`


const Switch = styled(RNSwitch)``


const Label = styled.Text`
    margin-top: 6px;

    font-size: 13px;
    font-weight: bold;

    color: ${cor("text")};
`


const Input = styled.TextInput`
    height: 44px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.border)};
    border-radius: 8px;

    padding: 0 12px;

    font-size: 15px;
    color: ${cor("text")};
`


const FieldError = styled.Text`
    font-size: 13px;

    color: ${cor("danger")};
`


const PrimaryButton = styled.TouchableOpacity`
    height: 46px;

    margin-top: 10px;

    background-color: ${cor("primary")};

    border-radius: 8px;

    align-items: center;
    justify-content: center;
`


const PrimaryButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


const SecondaryButton = styled.TouchableOpacity`
    height: 44px;

    margin-top: 8px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 8px;

    align-items: center;
    justify-content: center;
`


const SecondaryButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("text")};
`


export {
    Container,
    Content,
    SectionTitle,
    Card,
    AccountName,
    AccountEmail,
    Hint,
    Options,
    Option,
    OptionText,
    SwitchRow,
    SwitchTexts,
    SwitchTitle,
    SwitchDescription,
    Switch,
    Label,
    Input,
    FieldError,
    PrimaryButton,
    PrimaryButtonText,
    SecondaryButton,
    SecondaryButtonText
}
