import {container, injectable} from "tsyringe";
import Network from "../core/network";

@injectable()
export default class InstanceRepository {

    http = container.resolve(Network).http;

    async getInstanceInfo() {
        const response = await this.http.get('/instance/info');
        return response.data;
    }

    async startInstance() {
        const response = await this.http.post('/instance/start');
        return response.data;
    }

    async stopInstance() {
        const response = await this.http.post('/instance/stop');
        return response.data;
    }

    async createSSHKey(): Promise<string> {
        // @ts-ignore
        return await window.electron.generateSSHKey();
    }

    async addSSHKey(key: string) {
        const response = await this.http.put('/instance/key', {key, user: 'developer'});
        return response.data;
    }

    async connectToInstance({ip, onExit}: {ip: string, onExit: () => void}) {

        console.log('connecting-to-instance', ip)

        // @ts-ignore
        const disconnectListener = window.electron.sshDisconnected(() => {
            onExit();
            disconnectListener();
        })

        // @ts-ignore
        return await window.electron.connectToInstance(ip)
    }

    async launchRemoteVSC(ip: string) {
        // @ts-ignore
        return await window.electron.launchRemoteVSC(ip);
    }
}
