import React, {useState} from 'react';
import {Box, Button, Center, Input, Text, VStack} from "@chakra-ui/react";
import {container} from "tsyringe";
import AccountEngine from "../../application/account/account.engine";

function LoginPage() {

    const [email, setEmail] = useState('')
    const [linkSent, setLinkSent] = useState(false)

    const [link, setLink] = useState('')

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const accountEngine = container.resolve(AccountEngine);

    const sendLoginLink = async () => {
        setIsLoading(true);
        const response = await accountEngine.login({email: email});

        if (response) {
            setLinkSent(true);
            setIsLoading(false);
        } else {
            setError('Something went wrong');
            setIsLoading(false);
        }
    }

    const verifyLoginLink = async () => {
        accountEngine.verifyLink({link})
    }

    if (linkSent) {
        return (<Center h={'full'}>
            <VStack  maxW={'800px'}>
            <Text color={'white'} textAlign={'center'}>You’ll find the login link in an email we’ve sent you. Make sure you access it from
                this computer. If that doesn't work, you can paste the link here </Text>
                <Input
                    variant='Filled'
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    type={'email'}
                />
                <Button onClick={verifyLoginLink}>verify link</Button>
            </VStack>
        </Center>)
    }

    return (
        <Center h={'full'}>
            <Box h={'500px'} w={'460px'} bg={'brand.primary'} borderRadius={'16px'}>
                <Center h={'full'}>
                    <VStack h={'full'} justifyContent={'space-evenly'}>
                        <VStack marginY={10} gap={'8px'} alignItems={'flex-start'}>
                            <Text color={'white'} fontWeight={'medium'} fontSize={'14px'}>Email</Text>
                            <Input
                                variant='Filled'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                type={'email'}
                            />
                        </VStack>
                        <Button isLoading={isLoading} onClick={sendLoginLink}>send login link</Button>
                    </VStack>
                </Center>
            </Box>
        </Center>
    );
}

export default LoginPage;
