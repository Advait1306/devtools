import React, {useState} from 'react';
import {Box, Button, Center, FormLabel, Heading, Input, Text} from "@chakra-ui/react";
import {container} from "tsyringe";
import AccountEngine from "../../application/account/account.engine";

function LoginPage() {

    const [email, setEmail] = useState('')
    const [linkSent, setLinkSent] = useState(false)
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

    if (linkSent) {
        return (<Center h={'full'}>
            <Text color={'white'}>we’ve sent you a link on your email, open the link on this computer to complete the login
                process</Text>
        </Center>)
    }

    return (
        <Center h={'full'}>
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Heading color={'white'}>devtools</Heading>
                <Box marginY={10}>
                    <FormLabel color={'white'}>enter your email</FormLabel>
                    <Input
                        variant='Filled'
                        placeholder='Filled'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type={'email'}
                    />
                </Box>
                <Button isLoading={isLoading} onClick={sendLoginLink}>send login link</Button>
            </Box>
        </Center>

    );
}

export default LoginPage;
