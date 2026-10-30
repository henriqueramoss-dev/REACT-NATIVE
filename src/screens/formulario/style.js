
import styled from "styled-components/native"
import { ActivityIndicator } from "react-native"

import { cor } from "../../utils/tema"


const Container = styled.KeyboardAvoidingView`
    flex: 1;

    background-color: ${cor("background")};
`


const Content = styled.ScrollView.attrs({
    contentContainerStyle: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 20,
        paddingBottom: 40
    }
})``


const Message = styled.Text`
    margin-top: 40px;

    font-size: 15px;
    text-align: center;

    color: ${cor("text")};
`


const Alert = styled.View`
    background-color: ${cor("dangerSoft")};

    border-radius: 8px;

    padding: 10px 14px;

    margin-bottom: 16px;
`


const AlertText = styled.Text`
    font-size: 14px;
    font-weight: 500;

    color: ${cor("danger")};
`


const Card = styled.View`
    gap: 18px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;

    padding: 20px;
`


const Loader = styled(ActivityIndicator)`
    margin: 40px 0;
`


const FormActions = styled.View`
    flex-direction: row;
    justify-content: flex-end;

    gap: 10px;

    padding-top: 6px;
`


const CancelButton = styled.TouchableOpacity`
    min-width: 92px;
    height: 42px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 8px;

    padding: 0 16px;

    align-items: center;
    justify-content: center;
`


const CancelButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("text")};
`


// $desabilitado deixa o botão mais claro enquanto salva ou carrega.
const SaveButton = styled.TouchableOpacity`
    min-width: 92px;
    height: 42px;

    background-color: ${cor("primary")};

    border-width: 1px;
    border-color: ${cor("primary")};
    border-radius: 8px;

    padding: 0 16px;

    align-items: center;
    justify-content: center;

    opacity: ${({ $desabilitado }) => ($desabilitado ? 0.55 : 1)};
`


const SaveButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


const SavingIndicator = styled(ActivityIndicator)``


const DeleteButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;

    gap: 6px;

    height: 44px;

    margin-top: 14px;
`


const DeleteButtonText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("danger")};
`


export {
    Container,
    Content,
    Message,
    Alert,
    AlertText,
    Card,
    Loader,
    FormActions,
    CancelButton,
    CancelButtonText,
    SaveButton,
    SaveButtonText,
    SavingIndicator,
    DeleteButton,
    DeleteButtonText
}
