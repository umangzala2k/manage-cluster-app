import axios, { AxiosInstance } from "axios"

class ServiceInstances {
    serviceInstance: AxiosInstance
    constructor() {
        this.serviceInstance = this.getAxiosInstance()
    }

    getAxiosInstance() {
        const axiosInstance = axios.create({
            baseURL: "http://127.0.0.1:3333/api",
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Add a response interceptor
        axiosInstance.interceptors.response.use(
            response => response,
            error => {
                console.error('API Error:', error);
                return Promise.reject(error);
            }
        );

        return axiosInstance;
    }
}

export default ServiceInstances
