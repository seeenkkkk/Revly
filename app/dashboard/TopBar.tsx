'use client'

import { usePathname } from 'next/navigation'
import { useRevlyStore } from '@/lib/store'

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  '/dashboard':                  { title: 'Inicio',          sub: 'Resumen de tu agente' },
  '/dashboard/agentes':          { title: 'Mi Agente',       sub: 'Configura y activa tu agente WhatsApp' },
  '/dashboard/conversaciones':   { title: 'Conversaciones',  sub: 'Historial de chats' },
  '/dashboard/analitica':        { title: 'Resultados',      sub: 'Métricas y estadísticas' },
  '/dashboard/ajustes':          { title: 'Ajustes',         sub: 'Configuración de tu cuenta' },
  '/dashboard/funcionamiento':   { title: 'Cómo funciona',   sub: 'Guía de uso de Revly' },
}

export default function TopBar() {
  const pathname = usePathname()
  const { userData } = useRevlyStore()

  const page = PAGE_TITLES[pathname] ?? { title: 'Dashboard', sub: '' }
  const avatarLetter = userData?.email?.[0]?.toUpperCase() ?? 'U'
  const displayName = userData?.email?.split('@')[0] ?? 'usuario'

  return (
    <div
      style={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(8,14,26,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(13,148,136,0.12)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0, letterSpacing: '-0.3px' }}>
            {page.title}
          </p>
          {page.sub && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, margin: 0, fontWeight: 500 }}>
              {page.sub}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px 6px 8px',
          borderRadius: 99,
          background: 'rgba(13,148,136,0.06)',
          border: '1px solid rgba(13,148,136,0.12)',
          cursor: 'default',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(13,148,136,0.35), rgba(13,148,136,0.15))',
            border: '1.5px solid rgba(13,148,136,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            color: '#2dd4bf',
            flexShrink: 0,
            boxShadow: '0 0 10px rgba(13,148,136,0.2)',
          }}
        >
          {avatarLetter}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, paddingRight: 2 }}>
          {displayName}
        </span>
      </div>
    </div>
  )
}
