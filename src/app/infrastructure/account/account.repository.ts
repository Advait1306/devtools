import {container, injectable} from "tsyringe";
import Network from "../core/network";

@injectable()
export default class AccountRepository {

    http = container.resolve(Network).http;

    async getUserData() {
        const response = await this.http.get('/account');
        return response.data;
    }

    async updateUserData(data: Record<string, any>) {
        const response = await this.http.put('/account', data);
        return response.data;
    }

    async completeOnboarding() {
        const response = await this.http.post('/account/onboarding');
        return response.data;
    }
}
