import {container, singleton} from "tsyringe";
import {getAuth, sendSignInLinkToEmail, signInWithEmailLink, signOut} from "firebase/auth";
import {AccountState} from "./account.state";
import {createStore, useStore} from "zustand";


@singleton()
export default class AccountEngine {
    accountStore = createStore<AccountState>(() => ({isInitialized: false}));
    auth = getAuth();

    constructor() {
        this.setupLoginLinkHandler();
        this.initialize();
    }

    private setupLoginLinkHandler() {
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

    private initialize() {

        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.accountStore.setState({
                    user: {
                        id: user?.uid,
                        email: user?.email,
                        name: user?.displayName,
                    },
                })
            } else {
                this.accountStore.setState({
                    user: undefined,
                })
            }
        })

        this.auth.authStateReady().then(() => {
            this.accountStore.setState({
                isInitialized: true
            })
        })


    }

    login = async ({email}: { email: string }) => {
        const actionCodeSettings = {
            url: 'https://auth.sixhuman.com',
            handleCodeInApp: true
        }

        try {
            const response = await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    logout = async () => {
        await signOut(this.auth)
    }

    static useAccountStore = () => {
        const currentAccountEngine = container.resolve(AccountEngine);
        const currentAccountStore = currentAccountEngine.accountStore;
        return useStore(currentAccountStore);
    }
}
