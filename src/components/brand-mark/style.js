
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


const Mark = styled.View`
    width: 40px;
    height: 40px;

    border-radius: 10px;

    background-color: ${cor("header")};

    border-width: 1.5px;
    border-color: ${cor("gold")};

    align-items: center;
    justify-content: center;
`


export {
    Mark
}
