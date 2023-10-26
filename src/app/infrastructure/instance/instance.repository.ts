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

    async addSSHKey(key: string) {
        const response = await this.http.post('/instance/key', {key});
        return response.data;
    }
}
