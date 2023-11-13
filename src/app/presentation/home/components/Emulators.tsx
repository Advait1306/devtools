import React from 'react';
import {Box, Center, Image, Text, VStack} from "@chakra-ui/react";
import {container} from "tsyringe";
import InstanceEngine from "../../../application/instance/instance.engine";

// @ts-ignore
import AndroidEmulatorIcon from '../../../assets/images/android_emulator_icon.png';

function Emulators() {

    const instanceEngine = container.resolve(InstanceEngine);
    const instanceStore = InstanceEngine.useInstanceStore();

    const isAvailable = instanceStore.machine?.status === 'RUNNING' && instanceStore.connection?.status === 'CONNECTED'

    const startEmulator = () => {
        if (isAvailable) {
            instanceEngine.launchEmulator();
        }
    }

    return (
        <Box pl={'84px'} pt={'60px'}>
            <Text color={'white'} fontWeight={'bold'} fontSize={'36px'} letterSpacing={'-1.5px'}>Environments</Text>
            <Box h={'24px'}/>
            <Box h={'250px'} w={'250px'} bg={'brand.primary'} borderRadius={'12px'} onDoubleClick={startEmulator} opacity={isAvailable ? 1 : 0.5}>
                <Center h={'full'}>
                    <VStack>
                        <Image src={AndroidEmulatorIcon} alt={'VS Code'} width={'74px'} height={'74px'}/>
                        <Text fontWeight={'semibold'} fontSize={'24px'} color={'white'}>Android emulator</Text>
                    </VStack>
                </Center>
            </Box>
        </Box>
    );
}

export default Emulators;
