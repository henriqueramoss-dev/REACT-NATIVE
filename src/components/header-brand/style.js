
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


const Brand = styled.View`
    flex-direction: row;
    align-items: center;

    gap: 8px;
`


const BrandText = styled.Text`
    font-size: 17px;
    font-weight: bold;

    color: ${cor("headerText")};
`


export {
    Brand,
    BrandText
}
