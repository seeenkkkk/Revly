'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { useRevlyStore } from '@/lib/store'

const NAV_ITEMS = [
  {
    label: 'Inicio',
    href: '/dashboard',
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    label: 'Mi agente',
    href: '/dashboard/agentes',
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M12 11V7"/>
        <circle cx="12" cy="5" r="2"/>
        <path d="M8 15h.01M12 15h.01M16 15h.01"/>
      </svg>
    ),
  },
  {
    label: 'Conversaciones',
    href: '/dashboard/conversaciones',
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    label: 'Resultados',
    href: '/dashboard/analitica',
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    label: 'Plan y facturación',
    href: '/dashboard/configuracion',
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M2 10h20"/>
      </svg>
    ),
  },
  {
    label: 'Ajustes',
    href: '/dashboard/ajustes',
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, setUserData, sidebarCollapsed, setSidebarCollapsed } = useRevlyStore()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) setUserData({ email: user.email, plan: 'free' })
      } catch {}
    }
    fetchUser()
  }, [setUserData])

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch {}
    router.push('/login')
  }

  const avatarLetter = userData?.email?.[0]?.toUpperCase() ?? 'U'
  const displayName = userData?.email?.split('@')[0] ?? 'usuario'
  const displayEmail = userData?.email ?? ''

  const W = sidebarCollapsed ? 64 : 220

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        zIndex: 40,
        width: W,
        background: 'linear-gradient(180deg, #0d1525 0%, #0f172a 40%, #0a1020 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        background: 'radial-gradient(ellipse at 50% -20%, rgba(13,148,136,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: sidebarCollapsed ? '18px 0' : '18px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          minHeight: 58,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {!sidebarCollapsed && (
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          >
            <div style={{
              position: 'relative', width: 28, height: 28, flexShrink: 0,
              borderRadius: 8,
              background: 'rgba(13,148,136,0.12)',
              border: '1px solid rgba(13,148,136,0.25)',
              padding: 4,
            }}>
              <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit: 'contain', padding: 3 }} />
            </div>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.4px' }}>
              revly
            </span>
          </Link>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.15)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.4)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {sidebarCollapsed
              ? <polyline points="9 18 15 12 9 6" />
              : <polyline points="15 18 9 12 15 6" />
            }
          </svg>
        </button>
      </div>

      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav
        style={{
          flex: 1,
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {NAV_ITEMS.map(({ label, href, icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={sidebarCollapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? 0 : 10,
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                padding: sidebarCollapsed ? '10px 0' : '9px 12px',
                borderRadius: 9,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(13,148,136,0.25) 0%, rgba(13,148,136,0.15) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(13,148,136,0.25)' : '1px solid transparent',
                boxShadow: isActive ? '0 2px 12px rgba(13,148,136,0.12), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.08)'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.12)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                }
              }}
            >
              {/* Active left indicator */}
              {isActive && !sidebarCollapsed && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  height: '60%',
                  width: 2.5,
                  borderRadius: '0 2px 2px 0',
                  background: 'linear-gradient(180deg, #2dd4bf, #0d9488)',
                  boxShadow: '0 0 6px rgba(13,148,136,0.6)',
                }} />
              )}
              <span style={{
                color: isActive ? '#2dd4bf' : 'rgba(13,148,136,0.6)',
                flexShrink: 0,
                display: 'flex',
              }}>
                {icon}
              </span>
              {!sidebarCollapsed && (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── BOTTOM ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: '10px 8px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* How it works link */}
        {!sidebarCollapsed && (
          <Link
            href="/dashboard/funcionamiento"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 11,
              color: 'rgba(255,255,255,0.18)',
              marginBottom: 2,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.18)' }}
          >
            ¿Cómo funciona Revly?
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Salir' : undefined}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: sidebarCollapsed ? 0 : 8,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? '10px 0' : '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 12,
            color: 'rgba(255,255,255,0.2)',
            fontWeight: 500,
            marginBottom: 6,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!sidebarCollapsed && <span>Salir</span>}
        </button>

        {/* Avatar + user info */}
        {!sidebarCollapsed ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(13,148,136,0.1))',
                border: '1px solid rgba(13,148,136,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 8px rgba(13,148,136,0.15)',
              }}
            >
              <span style={{ color: '#2dd4bf', fontSize: 12, fontWeight: 700 }}>{avatarLetter}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {displayName}
              </p>
              {displayEmail && (
                <p style={{
                  margin: 0,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.22)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {displayEmail}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(13,148,136,0.1))',
              border: '1px solid rgba(13,148,136,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(13,148,136,0.15)',
            }}>
              <span style={{ color: '#2dd4bf', fontSize: 12, fontWeight: 700 }}>{avatarLetter}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
