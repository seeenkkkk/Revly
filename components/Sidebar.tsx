'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Iconos SVG lineales minimalistas
const icons = {
  agents: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  workflows: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M11 18H8a2 2 0 0 1-2-2V9" />
    </svg>
  ),
  history: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2" />
    </svg>
  ),
}

const navItems = [
  { label: 'Mis Agentes', href: '/dashboard', icon: 'agents' as const },
  { label: 'Workflows', href: '/dashboard/workflows', icon: 'workflows' as const },
  { label: 'Historial de Ventas', href: '/dashboard/historial', icon: 'history' as const },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: 'settings' as const },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0D1B2A] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/10">
        <div className="w-8 h-8 bg-[#00C48C] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-[#0D1B2A] font-bold text-sm">R</span>
        </div>
        <span className="text-white font-semibold text-lg">revly</span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ label, href, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${isActive
                  ? 'bg-[#00C48C]/15 text-[#00C48C] font-medium'
                  : 'text-[#8899AA] hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span className={isActive ? 'text-[#00C48C]' : 'text-[#8899AA]'}>
                {icons[icon]}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Widget estado del servidor */}
      <div className="px-4 pb-6">
        <div className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse flex-shrink-0" />
          <div>
            <p className="text-white/40 text-xs">Estado del Servidor</p>
            <p className="text-[#00C48C] text-xs font-semibold">Online</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
