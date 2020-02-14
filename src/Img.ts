import styled from "styled-components";

const Img = styled.img`
    height: ${props => (props.theme && props.theme.logo ? "100px" : "auto")};
    margin: 0 20px 0 0;
    float: left;
`;

export default Img;
