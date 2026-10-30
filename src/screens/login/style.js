
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Content = styled.ScrollView.attrs({
    contentContainerStyle: {
        flexGrow: 1,
        padding: 22,
        paddingTop: 32,
        paddingBottom: 40
    }
})``


const Brand = styled.View`
    flex-direction: row;
    align-items: center;

    gap: 10px;

    margin-bottom: 30px;
`


const BrandName = styled.Text`
    font-size: 19px;
    font-weight: bold;

    color: ${cor("text")};
`


const Title = styled.Text`
    font-size: 30px;
    font-weight: bold;

    color: ${cor("text")};
`


const Description = styled.Text`
    margin-top: 8px;

    font-size: 15px;
    line-height: 22px;

    color: ${cor("textMuted")};
`


const Form = styled.View`
    margin-top: 25px;
`


const Label = styled.Text`
    margin-top: 14px;
    margin-bottom: 6px;

    font-size: 13px;
    font-weight: bold;

    color: ${cor("text")};
`


const Input = styled.TextInput`
    height: 44px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 8px;

    padding: 0 12px;

    font-size: 15px;
    color: ${cor("text")};
`


const Btn = styled.TouchableOpacity`
    height: 46px;

    margin-top: 20px;

    background-color: ${cor("primary")};

    border-radius: 8px;

    align-items: center;
    justify-content: center;
`


const BtnTitle = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("onPrimary")};
`


const AccountText = styled.Text`
    margin-top: 20px;

    font-size: 13px;
    text-align: center;

    color: ${cor("textMuted")};
`


const RegisterLink = styled.Text`
    font-weight: bold;

    color: ${cor("primary")};
`


const Notice = styled.Text`
    margin-top: 20px;

    font-size: 11px;
    line-height: 17px;
    text-align: center;

    color: ${cor("placeholder")};
`


export {
    Container,
    Content,
    Brand,
    BrandName,
    Title,
    Description,
    Form,
    Label,
    Input,
    Btn,
    BtnTitle,
    AccountText,
    RegisterLink,
    Notice
}
