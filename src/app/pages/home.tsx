import React, {useState} from 'react';
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import {container} from "tsyringe";
import AccountEngine from "../engines/account.engine";


function Home() {

    const accountEngine = container.resolve(AccountEngine);

    const auth = getAuth();
    const [uid, setUid] = useState(auth.currentUser?.uid);

    auth.onAuthStateChanged((user) => {
        if (user) {
            setUid(user.uid)
        } else {
            setUid(undefined)
        }
    })

    return (
        <div className={"bg-red-200"}>
            <h1>Home</h1>
            <p>{uid}</p>
            <button onClick={accountEngine.login}>log in</button>
            <button onClick={accountEngine.logout}>log out</button>
        </div>
    );
}



export default Home;
