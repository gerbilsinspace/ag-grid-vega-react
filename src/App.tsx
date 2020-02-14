import React from "react";
import { ThemeProvider } from "styled-components";

import Grid from "./Grid";
import Container from "./Container";
import theme from "./theme";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Grid />
            </Container>
        </ThemeProvider>
    );
};

export default App;
