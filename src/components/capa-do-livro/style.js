
import styled from "styled-components/native"

import { cor } from "../../utils/tema"


const CapaReal = styled.Image`
    background-color: ${cor("surfaceMuted")};

    border-radius: 3px;

    shadow-color: #000000;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    shadow-offset: 0px 2px;

    elevation: 3;
`


export {
    CapaReal
}
