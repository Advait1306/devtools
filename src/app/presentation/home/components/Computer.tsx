import React from 'react';
import {Box, Center, HStack, Icon, Text, VStack} from "@chakra-ui/react";
import {IoPlay, IoStop} from "react-icons/io5";
import InstanceEngine from "../../../application/instance/instance.engine";
import {container} from "tsyringe";
import {FiCopy} from "react-icons/fi";


function Computer() {
    const instanceEngine = container.resolve(InstanceEngine);
    const instanceStore = InstanceEngine.useInstanceStore();
    const isRunning = instanceStore.machine?.status === "RUNNING";
    const isConnected = instanceStore.connection?.status === "CONNECTED";
    const isLoading = instanceStore.machine?.status !== "RUNNING" && instanceStore.machine?.status !== "TERMINATED";

    const powerButtonHandler = () => {
        console.log('power button clicked');
        if (!isRunning) {
            instanceEngine.startInstance();
        } else {
            instanceEngine.stopInstance();
        }
    }

    const copyIpHandler = () => {

    }

    return (
        <Box pl={'84px'} pt={'60px'}>
            <Text color={'white'} fontWeight={'bold'} fontSize={'36px'} letterSpacing={'-1.5px'}>Computer</Text>
            <Box h={'24px'}/>
            <Box
                h={'260px'}
                w={'212px'}
                bg={'brand.primary'}
                borderRadius={'12px'}
                px={'24px'}
                py={'24px'}
            >
                <VStack w={'100%'} h={'100%'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <HStack w={'100%'} justifyContent={'space-between'}>
                        <Box h={'20px'} w={'20px'} pt={'4px'} px={'4px'} bg={'#B3B3B3'} borderRadius={'4px'}>
                            <Box h={'2px'} w={'12px'} bg={'#2C2C2C'} borderRadius={'4px'}/>
                        </Box>
                        {
                            !isLoading && <Box onClick={powerButtonHandler}>
                                <Icon as={isRunning ? IoStop : IoPlay} color={isRunning ? '#D94545' : 'white'}/>
                            </Box>
                        }
                    </HStack>
                    <VStack alignItems={'flex-start'}>
                        {
                            (isRunning && isConnected) &&
                            <VStack alignItems={'flex-start'}>
                                <HStack>
                                    <Text color={'white'}>{instanceStore.machine?.ip}</Text>
                                    <Box onClick={copyIpHandler}>
                                        <Icon as={FiCopy} color={'white'}/>
                                    </Box>
                                </HStack>
                                <Box px={'8px'} py={'6px'} bg={'#38A169'} borderRadius={'4px'}>
                                    <Text fontWeight={'semibold'} color={'white'} letterSpacing={'1.5px'} fontSize={'14px'}>CONNECTED</Text>
                                </Box>
                            </VStack>
                        }
                        <HStack>
                        <Text
                            color={'white'}
                            fontWeight={'medium'}
                            fontSize={'12px'}
                        >
                            {instanceStore.machine?.name}
                        </Text>
                        {
                            isRunning &&
                            <Box h={'12px'} w={'12px'} bg={'#275B3F'} borderRadius={'6px'}>
                                <Center h={'full'}>
                                    <Box h={'6px'} w={'6px'} bg={'#38A169'}  borderRadius={'3px'}/>
                                </Center>
                            </Box>
                        }
                    </HStack>
                    </VStack>
                </VStack>
            </Box>
        </Box>
    );
}

export default Computer;
