import {singleton} from "tsyringe";
import axios from "axios";
import {getAuth} from "firebase/auth";

@singleton()
export default class Network {
    http = axios.create({
        baseURL: 'https://api.sixhuman.com',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    constructor() {
        this.http.interceptors.request.use(function (config) {
            const auth = getAuth();
            if(auth.currentUser) {
                auth.currentUser.getIdToken().then((token) => {
                    config.headers.Authorization = `Bearer ${token}`
                })
            }

            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        })
    }
}


