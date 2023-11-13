import React, {useEffect, useState} from 'react';
import AccountEngine from "../application/account/account.engine";
import Background from "./core/background";
import Home from "./home/home";
import Login from "./account/login";
import Onboarding from "./account/onboarding";
import {Text} from "@chakra-ui/react";

function App() {
    const accountStore = AccountEngine.useAccountStore();
    const [version, setVersion] = useState();

    useEffect(() => {
        const vg = async () => {
            const version = await window.electron.getAppVersion();
            setVersion(version);
        }

        vg();
    }, [])

    return (
        <>
            <Background>
                {
                    accountStore.isInitialized &&
                    (!accountStore.user ?
                        <Login/>
                        : accountStore.userDataFetched ? (accountStore.user.onboarding_complete)
                                ? <Home/>
                                : <Onboarding/>
                            : <></>)
                }
            </Background>
        </>
    );
}


export default App;
