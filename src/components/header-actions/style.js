
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


const Actions = styled.View`
    flex-direction: row;
    align-items: center;

    gap: 4px;
`


const IconButton = styled.TouchableOpacity`
    padding: 0 8px;
`


const ExitButton = styled.TouchableOpacity`
    padding: 0 12px;
`


const ExitText = styled.Text`
    font-size: 15px;
    font-weight: 600;

    color: ${cor("headerText")};
`


export {
    Actions,
    IconButton,
    ExitButton,
    ExitText
}
