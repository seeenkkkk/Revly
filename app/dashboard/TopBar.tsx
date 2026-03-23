'use client'

import { usePathname } from 'next/navigation'
import { useRevlyStore } from '@/lib/store'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/dashboard/agentes': 'Mi Agente',
  '/dashboard/conversaciones': 'Conversaciones',
  '/dashboard/analitica': 'Resultados',
  '/dashboard/ajustes': 'Ajustes',
  '/dashboard/funcionamiento': 'Cómo funciona',
}

export default function TopBar() {
  const pathname = usePathname()
  const { userData } = useRevlyStore()

  const title = PAGE_TITLES[pathname] ?? 'Dashboard'
  const avatarLetter = userData?.email?.[0]?.toUpperCase() ?? 'U'
  const displayName = userData?.email?.split('@')[0] ?? 'usuario'

  return (
    <div
      className="h-14 flex items-center justify-between px-8 flex-shrink-0"
      style={{
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(13,148,136,0.15)',
        position: 'sticky', top: 0, zIndex: 30,
      }}
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-white font-bold text-sm tracking-tight">{title}</h1>
      </div>

      {/* Right: avatar */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.15)' }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg,rgba(13,148,136,0.3),rgba(13,148,136,0.15))',
              border: '1px solid rgba(13,148,136,0.4)',
              color: '#2dd4bf',
            }}
          >
            {avatarLetter}
          </div>
          <span className="text-xs font-medium hidden sm:block" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {displayName}
          </span>
        </div>
      </div>
    </div>
  )
}
