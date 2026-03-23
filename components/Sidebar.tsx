'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  LayoutDashboard, Bot, MessageCircle, BarChart3,
  Settings, Headphones, BookOpen,
  LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { useRevlyStore } from '@/lib/store'

const NAV_MAIN = [
  { label: 'Inicio',          href: '/dashboard',               icon: LayoutDashboard, exact: true  },
  { label: 'Mi Agente',       href: '/dashboard/agentes',       icon: Bot,             exact: false },
  { label: 'Conversaciones',  href: '/dashboard/conversaciones', icon: MessageCircle,  exact: false },
  { label: 'Resultados',      href: '/dashboard/analitica',     icon: BarChart3,       exact: false },
]

const NAV_SUPPORT = [
  { label: 'Ajustes',        href: '/dashboard/ajustes',                       icon: Settings,    exact: false, external: false },
  { label: 'Soporte',        href: 'mailto:neuraxis.ia.global@gmail.com',       icon: Headphones,  exact: false, external: true  },
  { label: 'Cómo funciona',  href: '/dashboard/funcionamiento',                icon: BookOpen,    exact: false, external: false },
]

function NavItem({
  label, href, icon: Icon, external, collapsed, isActive,
}: {
  label: string; href: string; icon: React.ElementType; exact?: boolean
  external?: boolean; collapsed: boolean; isActive: boolean
}) {
  const inner = (
    <div
      className="flex items-center transition-all duration-150"
      style={{
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '9px 0' : '9px 12px',
        borderRadius: 9,
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
        background: isActive
          ? 'linear-gradient(135deg,#0d9488 0%,#0f766e 100%)'
          : 'transparent',
        border: isActive ? '1px solid rgba(13,148,136,0.4)' : '1px solid transparent',
        boxShadow: isActive ? '0 2px 14px rgba(13,148,136,0.25)' : 'none',
        whiteSpace: 'nowrap',
        position: 'relative' as const,
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.1)'
          ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.15)'
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
        }
      }}
    >
      {isActive && !collapsed && (
        <span style={{
          position: 'absolute', left: 0, top: '20%', height: '60%',
          width: 2.5, borderRadius: '0 2px 2px 0',
          background: 'linear-gradient(180deg,#5eead4,#0d9488)',
          boxShadow: '0 0 8px rgba(13,148,136,0.7)',
        }} />
      )}
      <Icon size={16} style={{ color: isActive ? '#fff' : '#0d9488', flexShrink: 0 }} strokeWidth={1.8} />
      {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
    </div>
  )

  const linkEl = external
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
    : <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger style={{ display: 'block', background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}>
          {linkEl}
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }
  return linkEl
}

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
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 40,
      width: W,
      background: 'rgba(15,23,42,0.97)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(13,148,136,0.2)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>

      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 100,
        background: 'radial-gradient(ellipse at 50% -10%, rgba(13,148,136,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── HEADER ── */}
      <div style={{
        padding: sidebarCollapsed ? '16px 0' : '16px 14px',
        display: 'flex', alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid rgba(13,148,136,0.12)',
        minHeight: 62, position: 'relative', zIndex: 1,
      }}>
        {!sidebarCollapsed && (
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{
              position: 'relative', width: 30, height: 30, flexShrink: 0,
              borderRadius: 8, background: 'rgba(13,148,136,0.15)',
              border: '1px solid rgba(13,148,136,0.3)', padding: 5,
            }}>
              <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit: 'contain', padding: 3 }} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: '-0.4px', margin: 0, lineHeight: 1.1 }}>revly</p>
              <p style={{ color: 'rgba(13,148,136,0.7)', fontSize: 9.5, margin: 0, letterSpacing: '0.02em', fontWeight: 500 }}>Tu agente WhatsApp</p>
            </div>
          </Link>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: '1px solid rgba(13,148,136,0.2)',
            background: 'rgba(13,148,136,0.06)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'all 0.15s', color: 'rgba(255,255,255,0.4)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.18)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.5)'
            ;(e.currentTarget as HTMLElement).style.color = '#0d9488'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.06)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.2)'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1, padding: '10px 8px',
        display: 'flex', flexDirection: 'column', gap: 1,
        overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 1,
      }}>
        {/* Main section label */}
        {!sidebarCollapsed && (
          <p style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px 6px', margin: 0 }}>
            Principal
          </p>
        )}
        {NAV_MAIN.map(item => (
          <NavItem
            key={item.href}
            {...item}
            collapsed={sidebarCollapsed}
            isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
          />
        ))}

        <div style={{ margin: '10px 4px' }}>
          <Separator style={{ background: 'rgba(13,148,136,0.12)' }} />
        </div>

        {/* Support section label */}
        {!sidebarCollapsed && (
          <p style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 12px 6px', margin: 0 }}>
            Soporte
          </p>
        )}
        {NAV_SUPPORT.map(item => (
          <NavItem
            key={item.href}
            {...item}
            collapsed={sidebarCollapsed}
            isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      {/* ── BOTTOM ── */}
      <div style={{
        padding: '10px 8px',
        borderTop: '1px solid rgba(13,148,136,0.12)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logout */}
        <button
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Salir' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: sidebarCollapsed ? 0 : 8,
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? '8px 0' : '8px 12px',
            borderRadius: 8, border: 'none', background: 'transparent',
            cursor: 'pointer', fontSize: 12,
            color: 'rgba(255,255,255,0.22)', fontWeight: 500,
            marginBottom: 6, transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.75)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)'
          }}
        >
          <LogOut size={13} strokeWidth={1.8} />
          {!sidebarCollapsed && <span>Salir</span>}
        </button>

        {/* Avatar */}
        {!sidebarCollapsed ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 10,
            background: 'rgba(13,148,136,0.06)',
            border: '1px solid rgba(13,148,136,0.15)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,rgba(13,148,136,0.25),rgba(13,148,136,0.1))',
              border: '1px solid rgba(13,148,136,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(13,148,136,0.2)',
            }}>
              <span style={{ color: '#2dd4bf', fontSize: 12, fontWeight: 700 }}>{avatarLetter}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </p>
              {displayEmail && (
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayEmail}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,rgba(13,148,136,0.25),rgba(13,148,136,0.1))',
              border: '1px solid rgba(13,148,136,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(13,148,136,0.2)',
            }}>
              <span style={{ color: '#2dd4bf', fontSize: 12, fontWeight: 700 }}>{avatarLetter}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
