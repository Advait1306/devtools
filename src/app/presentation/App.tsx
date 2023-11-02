import React from 'react';
import AccountEngine from "../application/account/account.engine";
import Background from "./core/background";
import Home from "./home/home";
import Login from "./account/login";
import Onboarding from "./account/onboarding";

function App() {
    const accountStore = AccountEngine.useAccountStore();

    return (
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
    );
}


export default App;
