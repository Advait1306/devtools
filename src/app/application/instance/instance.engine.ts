import {container, singleton} from "tsyringe";
import InstanceRepository from "../../infrastructure/instance/instance.repository";
import {createStore, useStore} from "zustand";
import {InstanceState} from "./instance.state";


@singleton()
export default class InstanceEngine {
    instanceStore = createStore<InstanceState>(() => ({initialized: false}));
    instanceRepository = container.resolve(InstanceRepository);

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
                }
            })
        } catch (e) {
            console.log('error', e);
        }
    }

    async startInstance() {
        try {
            await this.instanceRepository.startInstance();
            await this.getInstanceInfo();
        } catch (e) {
            console.log('error', e);
        }
    }

    async stopInstance() {
        try {
            await this.instanceRepository.stopInstance();
            await this.getInstanceInfo();
        } catch (e) {
            console.log('error', e);
        }
    }

    private async addSSHKey(key: string) {

    }

    private async connectSSH() {

    }

    static useInstanceStore() {
        return useStore(container.resolve(InstanceEngine).instanceStore);
    }
}
