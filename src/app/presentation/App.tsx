import React from 'react';
import AccountEngine from "../application/account/account.engine";
import Background from "./core/background";
import Home from "./home/home";
import Login from "./account/login";

function App() {
    const accountStore = AccountEngine.useAccountStore();

    return (
        <Background>
            {
                accountStore.isInitialized &&
                (accountStore.user ?
                    <Home/>
                    :
                    <Login/>)
            }
        </Background>
    );
}


export default App;
