import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const Layout = () => (
    <div className="flex min-h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
            <Outlet />
        </main>
    </div>
)