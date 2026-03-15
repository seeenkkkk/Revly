import Sidebar from '@/components/Sidebar'
import TopBar from './TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar />
      <div className="flex-1 ml-[200px] min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
