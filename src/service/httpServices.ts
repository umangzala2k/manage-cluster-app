import ServiceInstances from "@/service/index";

class HttpServices extends ServiceInstances {
    constructor() {
        super()
    }

    async getClusters() {
        return await this.serviceInstance.get(`/clusters`)
    }

    async getMetrics(id: string) {
        return await this.serviceInstance.get(`/clusters/metrics/${id}`)
    }

    async getClusterSnapPolicyById(id: string) {
        return await this.serviceInstance.get(`/clusters/snapshot-policy/${id}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateClusterSnapPolicyById(id: string, payload: any) {
        return await this.serviceInstance.put(`/clusters/snapshot-policy/${id}`, payload)
    }

}

export default HttpServices