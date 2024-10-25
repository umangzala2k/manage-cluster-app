import Image from 'next/image'
import Dot from '@/components/common/Dot'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const [clusterName, setClusterName] = useState("Cluster Name")

    const routes = [
        { name: "Performance Metrics", link: "/cluster/performance-metrics" },
        { name: "Edit Snapshot Policy", link: "/cluster/snap-policy" },
    ]

    useEffect(() => {
        const cluster: string | null = window.localStorage.getItem("cluster")
        if (cluster) {
            const parsedCluster = JSON.parse(cluster)
            setClusterName(parsedCluster.name)
        }
    }, [])

    return (
        <div className="h-[100vh] bg-primary-light flex flex-col" role="navigation" aria-label="Sidebar Navigation">
            <div className="flex gap-3 px-4 pt-4">
                <Image src="/assets/logo.png" alt="sidebar-logo" width={30} height={30} />
                <h1 className="text-2xl font-medium"> {clusterName} </h1>
            </div>
            <div className='border-t my-4 mx-2 border-secondary/15'></div>
            <ul>
                {routes.map((route, index) => (
                    <Link key={`${index}-${route.name}`} className={`flex items-center pl-4 pr-6 py-1 mb-1 relative h-10 ml-4 gap-3 hover:bg-primary-dark ${pathname === route.link ? 'border-r-2 border-secondary bg-primary-dark' : ''}`} href={route.link} aria-current={pathname === route.link ? 'page' : undefined}>
                        <li className={`flex items-center gap-3 text-xs lg:text-sm`}>
                            <Dot />
                            {route.name}
                        </li>
                    </Link>)
                )}
            </ul>
        </div>
    )
}
