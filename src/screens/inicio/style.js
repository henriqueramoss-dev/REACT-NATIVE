
import styled from "styled-components/native"

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


const Description = styled.Text`
    margin-top: 10px;

    font-size: 15px;
    line-height: 22px;

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

    margin-top: 12px;

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


const DemoLink = styled.Text`
    margin-top: 22px;

    font-size: 13px;
    font-weight: bold;
    text-align: center;

    color: ${cor("primary")};
`


export {
    Container,
    Content,
    Brand,
    BrandName,
    Eyebrow,
    Title,
    Description,
    PrimaryButton,
    PrimaryButtonText,
    SecondaryButton,
    SecondaryButtonText,
    DemoLink
}
