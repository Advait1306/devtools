import React, {useEffect, useState} from 'react';
import {Box, Button, Center, Input, Text, VStack} from "@chakra-ui/react";
import AccountEngine from "../../application/account/account.engine";
import {container} from "tsyringe";

function Onboarding() {
    const accountEngine = container.resolve(AccountEngine);
    const {user} = AccountEngine.useAccountStore();

    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [job, setJob] = useState('')
    const [company, setCompany] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<number>()

    useEffect(() => {
        if (!user.name || !user.phone_number) {
            setStep(0);
            return;
        }

        if (!user.job || !user.company) {
            setStep(1);
            return;
        }

        setStep(2);

    }, [user]);

    const setNameAndPhoneNumber = async () => {
        setIsLoading(true);
        const response = await accountEngine.setNameAndPhoneNumber({name, phoneNumber});

        if (response) {
            setIsLoading(false);
            setStep(1);
        } else {
            setIsLoading(false);
            console.log(response)
        }
    }

    const setJobAndCompany = async () => {
        setIsLoading(true);
        const response = await accountEngine.setJobAndCompany({job, company});

        if (response) {
            setIsLoading(false);
            setStep(2);
        } else {
            setIsLoading(false);
            console.log(response)
        }
    }

    const completeOnboarding = async () => {
        setIsLoading(true);
        await accountEngine.completeOnboarding();
        setIsLoading(false);
    }

    if (step == undefined) {
        return <></>
    }


    if (step == 0) {
        return (
            <Center h={'full'}>
                <Box h={'500px'} w={'460px'} bg={'brand.primary'} borderRadius={'16px'}>
                    <VStack h={'full'} justifyContent={'space-evenly'}>
                        <Box>
                            <VStack marginY={10} gap={'8px'} alignItems={'flex-start'}>
                                <Text color={'white'} fontWeight={'medium'} fontSize={'14px'}>Name</Text>
                                <Input
                                    variant='Filled'
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </VStack>
                            <VStack marginY={10} gap={'8px'} alignItems={'flex-start'}>
                                <Text color={'white'} fontWeight={'medium'} fontSize={'14px'}>Phone number</Text>
                                <Input
                                    variant='Filled'
                                    value={phoneNumber}
                                    onChange={(event) => setPhoneNumber(event.target.value)}
                                    type={'tel'}
                                />
                            </VStack>
                        </Box>
                        <Button isLoading={isLoading} onClick={setNameAndPhoneNumber}>
                            next
                        </Button>
                    </VStack>
                </Box>
            </Center>
        );
    }

    if (step == 1) {
        return (
            <Center h={'full'}>
                <Box h={'500px'} w={'460px'} bg={'brand.primary'} borderRadius={'16px'}>
                    <VStack h={'full'} justifyContent={'space-evenly'}>
                        <Box>
                            <VStack marginY={10} gap={'8px'} alignItems={'flex-start'}>
                                <Text color={'white'} fontWeight={'medium'} fontSize={'14px'}>Job</Text>
                                <Input
                                    variant='Filled'
                                    value={job}
                                    onChange={(event) => setJob(event.target.value)}
                                />
                            </VStack>
                            <VStack marginY={10} gap={'8px'} alignItems={'flex-start'}>
                                <Text color={'white'} fontWeight={'medium'} fontSize={'14px'}>Phone number</Text>
                                <Input
                                    variant='Filled'
                                    value={company}
                                    onChange={(event) => setCompany(event.target.value)}
                                />
                            </VStack>
                        </Box>
                        <Button isLoading={isLoading} onClick={setJobAndCompany}>
                            next
                        </Button>
                    </VStack>
                </Box>
            </Center>
        );
    }

    if (step == 2) {
        return (
            <Center h={'full'} display={'flex'} flexDirection={'column'}>
                <Box marginY={10}>
                    <Text color={'white'}>
                        Devtools is still under beta, hope you report all your feedback so we can make it better
                    </Text>
                </Box>
                <Button onClick={completeOnboarding}>continue</Button>
            </Center>
        );
    }
}

export default Onboarding;
