import Sidebar from '@/components/Sidebar'

// Layout persistente del dashboard — la barra lateral se mantiene en todas las rutas
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-1 ml-[240px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
