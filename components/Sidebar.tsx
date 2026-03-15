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
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
  },
  {
    label: 'Mi agente',
    href: '/dashboard/agentes',
    exact: false,
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h.01M12 15h.01M16 15h.01"/></svg>,
  },
  {
    label: 'Conversaciones',
    href: '/dashboard/conversaciones',
    exact: false,
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: 'Resultados',
    href: '/dashboard/analitica',
    exact: false,
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    label: 'Plan y facturación',
    href: '/dashboard/configuracion',
    exact: false,
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  },
  {
    label: 'Ajustes',
    href: '/dashboard/ajustes',
    exact: false,
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"/></svg>,
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
    router.push('/')
  }

  const avatarLetter = userData?.email?.[0]?.toUpperCase() ?? 'U'
  const displayName = userData?.email?.split('@')[0] ?? 'usuario'
  const displayEmail = userData?.email ?? 'usuario@revly.io'

  return (
    <aside
      style={{
        position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 40,
        width: sidebarCollapsed ? 64 : 220,
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* HEADER */}
      <div style={{ padding: sidebarCollapsed ? '20px 0' : '20px 16px', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', borderBottom: '1px solid #f5f5f5', minHeight: 60 }}>
        {!sidebarCollapsed && (
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
              <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ color: '#0a0f1a', fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>revly</span>
          </Link>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {sidebarCollapsed
              ? <polyline points="9 18 15 12 9 6"/>
              : <polyline points="15 18 9 12 15 6"/>
            }
          </svg>
        </button>
      </div>

      {/* NAV */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#ffffff' : '#374151',
                background: isActive ? '#0d9488' : 'transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <span style={{ color: isActive ? '#ffffff' : '#6b7280', flexShrink: 0, display: 'flex' }}>{icon}</span>
              {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* BOTTOM */}
      {!sidebarCollapsed && (
        <div style={{ padding: '12px 8px', borderTop: '1px solid #f5f5f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0fdfa', border: '1px solid #99f6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#0d9488', fontSize: 12, fontWeight: 700 }}>{avatarLetter}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, color: '#9ca3af', fontWeight: 500 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; (e.currentTarget as HTMLElement).style.color = '#374151' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#9ca3af' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Salir
          </button>
          <Link href="/dashboard/funcionamiento" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 11, color: '#c0c9d4' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#c0c9d4' }}
          >
            ¿Cómo funciona Revly?
          </Link>
        </div>
      )}
    </aside>
  )
}
