import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import BottomTabBar from './components/BottomTabBar'
import SidebarNav from './components/SidebarNav'

export default function AppShell() {
  const location = useLocation()
  const isStreamPage = location.pathname === '/stream'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isStreamPage)

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Collapsable Sidebar */}
      {!sidebarCollapsed && <SidebarNav />}

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface border border-line text-text hover:bg-card hover:border-magenta/50 transition-all shadow-lg md:block hidden"
        title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="w-5 h-5" />
        ) : (
          <PanelLeftClose className="w-5 h-5" />
        )}
      </button>

      <main className={`pb-20 md:pb-0 min-h-screen transition-all ${sidebarCollapsed ? '' : 'md:pl-56'}`}>
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
