import React from 'react';
import {Box, Button, Text} from "@chakra-ui/react";
import InstanceEngine from "../../application/instance/instance.engine";
import {container} from "tsyringe";


function InstanceComponent() {
    const instanceEngine = container.resolve(InstanceEngine);
    const instanceStore = InstanceEngine.useInstanceStore();

    const startInstance = () => {
        instanceEngine.startInstance();
    }

    const stopInstance = () => {
        instanceEngine.stopInstance();
    }

    const launchVSCode = () => {
        instanceEngine.launchRemoteVSC();
    }

    if (instanceStore.initialized === false) {
        return <Text color={'white'}>attempting to connect to server</Text>
    }

    return (
        <Box>
            <Text color={'white'}>{instanceStore.machine?.name}</Text>
            <Text color={'white'}>{instanceStore.machine?.status}</Text>

            <Button onClick={startInstance}>Start</Button>
            <Button onClick={stopInstance}>Stop</Button>

            {
                (instanceStore.machine?.status === 'RUNNING'
                    && instanceStore.connection.status === 'CONNECTED')
                &&
                <Button onClick={launchVSCode}>Launch VSCODE</Button>
            }
        </Box>
    );
}

export default InstanceComponent;
