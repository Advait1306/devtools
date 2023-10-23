import React from 'react';
import {Box} from "@chakra-ui/react";

function Background({children}: { children: React.ReactNode }) {
    return (
        <Box width={"full"} height={"100vh"} background={"#272727"}>
            {children}
        </Box>
    );
}

export default Background;
