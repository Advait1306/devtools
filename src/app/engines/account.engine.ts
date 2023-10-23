import {singleton} from "tsyringe";
import {getAuth, sendSignInLinkToEmail, signInWithEmailLink, signOut} from "firebase/auth";
import firebase from "firebase/compat";


@singleton()
export default class AccountEngine {
    auth = getAuth();

    constructor() {
        this.setupLoginLinkHandler();
    }

    setupLoginLinkHandler() {
        // @ts-ignore
        window.electron.handleLink(async (event: Electron.IpcRendererEvent, url: string) => {
            console.log('handle-login-link', url)
            const loginUrl = url.replace('tic-devtools://', '')
            console.log('cleaned-login-url', loginUrl)

            const response = await signInWithEmailLink(this.auth, 'advaitbansode4@gmail.com', loginUrl);
            console.log('login-response', response)
        });
        console.log('setup-login-link-handler')
    }

    login = async () => {
        const actionCodeSettings = {
            url: 'https://auth.sixhuman.com',
            handleCodeInApp: true
        }

        const response = await sendSignInLinkToEmail(this.auth,'advaitbansode4@gmail.com', actionCodeSettings);
        console.log(response)
    }

    logout = async () => {
        await signOut(this.auth)
    }
}
