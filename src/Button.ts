import styled from "styled-components";
import Color from "color";

const Button = styled.button`
    background: ${props => props.theme.primaryColour || "white"};
    padding: 10px 20px;
    border: 0;
    border-radius: 2px;
    cursor: pointer;
    color: ${props => {
        const color = new Color(
            (props.theme && props.theme.primaryColour) || "white"
        );

        return color.isDark()
            ? `rgba(255, 255, 255, 0.9)`
            : `rgba(0, 0, 0, 0.9)`;
    }};
    border-bottom: 1px solid
        ${props => {
            const color = new Color(
                (props.theme && props.theme.primaryColour) || "white"
            );

            return color
                .darken(0.15)
                .rgb()
                .string();
        }};
    border-right: 1px solid
        ${props => {
            const color = new Color(
                (props.theme && props.theme.primaryColour) || "white"
            );

            return color
                .darken(0.15)
                .rgb()
                .string();
        }};
    &:disabled {
        cursor: not-allowed;
    }
`;

export default Button;
