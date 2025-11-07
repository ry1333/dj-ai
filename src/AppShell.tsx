import { Outlet } from 'react-router-dom'
import BottomTabBar from './components/BottomTabBar'
import SidebarNav from './components/SidebarNav'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SidebarNav />
      <main className="md:pl-56 pb-20 md:pb-0 min-h-screen">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
