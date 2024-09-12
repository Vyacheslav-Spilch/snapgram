import { Bottombar, Topbar } from '@/components/shared'
import LeftSideBar from '@/components/shared/LeftSidebar'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
    return (
        <div className="w-full md:flex">
            <Topbar />
            <LeftSideBar />

            <section className="flex flex-1 h-full">
                <Outlet />
            </section>

            <Bottombar />
        </div>
    )
}

export default RootLayout