import Sidebar from "@/components/layout/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex">
                <div className="max-w-xs:4/12 lg:w-3/12 xl:w-2/12">
                    <Sidebar />
                </div>
                <div className="h-[100vh] overflow-y-auto sm:8/12 lg:w-9/12 xl:w-10/12">
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}