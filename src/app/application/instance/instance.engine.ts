import {container, singleton} from "tsyringe";
import InstanceRepository from "../../infrastructure/instance/instance.repository";
import {createStore, useStore} from "zustand";
import {InstanceState} from "./instance.state";
import AnalyticsEngine from "../analytics/analytics.engine";


@singleton()
export default class InstanceEngine {
    instanceStore = createStore<InstanceState>(() => ({initialized: false}));
    instanceRepository = container.resolve(InstanceRepository);

    analyticsEngine = container.resolve(AnalyticsEngine);

    constructor() {
        this.initialize();
    }

    private async initialize() {

        await this.getInstanceInfo();
        setInterval(this.getInstanceInfo.bind(this), 5000)

        this.instanceStore.setState({
            initialized: true
        })
    }

    private async getInstanceInfo() {
        console.log('getting-instance-info')
        try {
            const response = await this.instanceRepository.getInstanceInfo();
            this.instanceStore.setState({
                machine: {
                    name: response.name,
                    status: response.status,
                    ip: response.ip
                }
            })

            if (response.status === 'RUNNING'
                && (!this.instanceStore.getState().connection
                    || this.instanceStore.getState()?.connection?.status === 'DISCONNECTED'
                )) {
                this.connectToInstance();
            }

        } catch (e) {
            console.log('error', e);
        }
    }

    async startInstance() {
        try {
            this.analyticsEngine.trackEvent('start_instance');
            await this.instanceRepository.startInstance();
            await this.getInstanceInfo();
        } catch (e) {
            console.log('error', e);
        }
    }

    async stopInstance() {
        try {
            this.analyticsEngine.trackEvent('stop_instance');
            await this.instanceRepository.stopInstance();
            await this.getInstanceInfo();
        } catch (e) {
            console.log('error', e);
        }
    }

    private async connectToInstance() {
        console.log('connecting-to-instance')

        this.instanceStore.setState({
            connection: {
                status: 'CONNECTING'
            }
        })

        setTimeout(async () => {
            const publicKey = await this.createSSHKey();
            console.log('publicKey', publicKey)

            await this.addSSHKey(publicKey);
            console.log('added-ssh-key')

            console.log('connecting-to-instance')
            await this.connectSSH();

            this.instanceStore.setState({
                connection: {
                    status: 'CONNECTED'
                }
            })
        }, 5000);
    }

    private async createSSHKey() {
        console.log('creating-ssh-key')
        return await this.instanceRepository.createSSHKey();
    }

    private async addSSHKey(key: string) {
        console.log('adding-ssh-key')
        await this.instanceRepository.addSSHKey(key);
    }

    private async connectSSH() {
        await this.instanceRepository.connectToInstance({ip: this.instanceStore.getState().machine.ip, onExit: () => {
            console.log('disconnected')
            this.instanceStore.setState({
                connection: {
                    status: 'DISCONNECTED'
                }
            })
        }});
    }

    async launchRemoteVSC() {
        this.analyticsEngine.trackEvent('launch_vsc');
        await this.instanceRepository.launchRemoteVSC(this.instanceStore.getState().machine.ip);
    }

    static useInstanceStore() {
        return useStore(container.resolve(InstanceEngine).instanceStore);
    }
}
