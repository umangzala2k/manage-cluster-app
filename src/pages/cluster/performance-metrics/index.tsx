import IOPs from "@/components/performance-metrics/IOPS"
import Throughput from '@/components/performance-metrics/Throughput'
import { useEffect, useState } from "react";
import HttpServices from "@/service/httpServices"

export default function PerformanceMetrics() {

    const httpServices = new HttpServices()

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<{ iops: any, throughput: any } | null>(null)

    useEffect(() => {
        fetchMetrics()
    }, [])

    const fetchMetrics = async () => {
        try {
            setLoading(true)
            const cluster: string | null = window.localStorage.getItem("cluster")
            if (cluster) {
                const parsedCluster = JSON.parse(cluster)
                if (parsedCluster.id) {
                    const { data } = await httpServices.getMetrics(parsedCluster.id)
                    setData(data)
                }
            }

        } catch (error: any) {
            setError(error?.response?.data?.message || 'Something went wrong!')
            setData(null)

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <div className="text-xl">Performance Metrics</div>

            {loading && <div className="mt-10 text-center text-3xl"> Loading... </div>}
            {!loading && !data && error && <div className="mt-10 text-center text-3xl"> {error} </div>}

            {!loading && data && <div className="p-6">
                <IOPs data={data.iops} />
                <Throughput data={data.throughput} />
            </div>}
        </div>
    );
}
