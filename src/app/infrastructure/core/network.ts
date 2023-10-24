import {singleton} from "tsyringe";
import axios from "axios";
import {getAuth} from "firebase/auth";

@singleton()
export default class Network {
    http = axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    constructor() {
        this.http.interceptors.request.use(async function (config) {
            const auth = getAuth();

            if(auth.currentUser) {
                const token = await auth.currentUser.getIdToken();
                config.headers.Authorization = `Bearer ${token}`
            }

            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        })
    }
}


