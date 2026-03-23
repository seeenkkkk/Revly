'use client'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/app/dashboard/TopBar'
import BackgroundRevly from '@/components/BackgroundRevly'
import { useRevlyStore } from '@/lib/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useRevlyStore()
  return (
    <div className="flex min-h-screen" style={{ background: '#080e1a' }}>
      <BackgroundRevly />
      <Sidebar />
      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 64 : 220, position: 'relative', zIndex: 1 }}
      >
        <TopBar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
