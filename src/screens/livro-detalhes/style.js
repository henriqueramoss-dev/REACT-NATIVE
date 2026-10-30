
import styled from "styled-components/native"
import { ActivityIndicator } from "react-native"

import { cor } from "../../utils/tema"


const Container = styled.View`
    flex: 1;

    background-color: ${cor("background")};
`


const Content = styled.ScrollView.attrs({
    contentContainerStyle: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 32,
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


const Eyebrow = styled.Text`
    font-size: 11px;
    font-weight: bold;
    letter-spacing: 1.4px;

    color: ${cor("primary")};
`


const Title = styled.Text`
    margin-top: 10px;

    font-size: 30px;
    font-weight: bold;
    line-height: 38px;

    color: ${cor("text")};
`


const Authors = styled.Text`
    margin-top: 10px;

    font-size: 15px;
    line-height: 22px;

    color: ${cor("textMuted")};
`


const DetailLabel = styled.Text`
    margin-top: 18px;

    font-size: 12px;
    font-weight: bold;

    color: ${cor("textMuted")};
`


const DetailValue = styled.Text`
    margin-top: 4px;

    font-size: 15px;
    line-height: 21px;

    color: ${cor("text")};
`


const Situation = styled.View`
    margin-top: 12px;

    background-color: ${cor("surface")};

    border-width: 1px;
    border-color: ${cor("border")};
    border-radius: 10px;

    padding: 16px;
`


const SituationRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`


// $disponivel deixa o título verde ("Disponível para empréstimo").
const SituationTitle = styled.Text`
    font-size: 17px;
    font-weight: bold;

    color: ${({ theme, $disponivel }) => ($disponivel ? theme.colors.success : theme.colors.text)};
`


const SituationInfo = styled.Text`
    margin-top: 5px;

    font-size: 13px;

    color: ${cor("textMuted")};
`


const PrimaryButton = styled.TouchableOpacity`
    height: 46px;

    margin-top: 30px;

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
    height: 46px;

    margin-top: 10px;

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


const DeleteLink = styled.Text`
    margin-top: 22px;

    font-size: 13px;
    font-weight: bold;
    text-align: center;

    color: ${cor("danger")};
`


export {
    Container,
    Content,
    Loader,
    Message,
    Eyebrow,
    Title,
    Authors,
    DetailLabel,
    DetailValue,
    Situation,
    SituationRow,
    SituationTitle,
    SituationInfo,
    PrimaryButton,
    PrimaryButtonText,
    SecondaryButton,
    SecondaryButtonText,
    DeleteLink
}
