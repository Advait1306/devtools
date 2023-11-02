import {container, singleton} from "tsyringe";
import {Auth, getAuth, sendSignInLinkToEmail, signInWithEmailLink, signOut} from "firebase/auth";
import {AccountState} from "./account.state";
import {createStore, useStore} from "zustand";
import AccountRepository from "../../infrastructure/account/account.repository";
import AnalyticsEngine from "../analytics/analytics.engine";


@singleton()
export default class AccountEngine {
    accountStore = createStore<AccountState>(() => ({isInitialized: false, userDataFetched: false}));
    auth: Auth;
    accountRepository = container.resolve(AccountRepository);
    analyticsEngine = container.resolve(AnalyticsEngine)

    constructor() {
        console.log('account-engine-constructor')
        this.auth = getAuth()
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
                    },
                })
                this.analyticsEngine.setUser(user.uid);
                this.getUserData();
            } else {
                this.analyticsEngine.reset();
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
            await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }

    logout = async () => {
        await signOut(this.auth)
    }

    getUserData = async () => {
        try {
            const data = await this.accountRepository.getUserData();
            this.accountStore.setState({
                user: {
                    ...data
                },
                userDataFetched: true
            });
        } catch (e) {
            console.log(e)
        }
    }

    setName = async (name: string) => {
        try {
            const response = await this.accountRepository.updateUserData({name})
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    setPhoneNumber = async (phoneNumber: string) => {
        try {
            const response = await this.accountRepository.updateUserData({phone_number: phoneNumber})
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    setNameAndPhoneNumber = async ({name, phoneNumber}: { name: string, phoneNumber: string }) => {
        try {
            const response = await this.accountRepository.updateUserData({name, phone_number: phoneNumber})
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    setJob = async (job: string) => {
        try {
            const response = await this.accountRepository.updateUserData({job})
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    setCompany = async (company: string) => {
        try {
            const response = await this.accountRepository.updateUserData({company})
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    setJobAndCompany = async ({job, company}: { job: string, company: string }) => {
        try {
            const response = await this.accountRepository.updateUserData({job, company})
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    completeOnboarding = async () => {
        try {
            const response = await this.accountRepository.completeOnboarding();
            this.accountStore.setState({
                user: {
                    ...response
                }
            })
            return [true]
        } catch (e) {
            return [false, e.message];
        }
    }

    static useAccountStore = () => {
        const currentAccountEngine = container.resolve(AccountEngine);
        const currentAccountStore = currentAccountEngine.accountStore;
        return useStore(currentAccountStore);
    }
}
