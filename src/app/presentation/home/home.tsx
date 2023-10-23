import React from 'react';
import {Box, Button, Center, Text} from "@chakra-ui/react";
import {container} from "tsyringe";
import AccountEngine from "../../application/account/account.engine";

function Home() {

    const accountEngine = container.resolve(AccountEngine);

    return (
        <Box h={"full"} borderWidth={2} borderColor={"yellow"}>
            <Center h={'full'}>
                <Box>
                    <Text color={"white"}>Home</Text>
                    <Button onClick={accountEngine.logout}>logout</Button>
                </Box>
            </Center>
        </Box>
    );
}

export default Home;
