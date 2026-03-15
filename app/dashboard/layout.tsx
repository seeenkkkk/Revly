'use client'
import Sidebar from '@/components/Sidebar'
import { useRevlyStore } from '@/lib/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useRevlyStore()
  return (
    <div className="flex min-h-screen" style={{ background: '#f7f8fa' }}>
      <Sidebar />
      <main className="flex-1 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? 64 : 220 }}>
        {children}
      </main>
    </div>
  )
}
