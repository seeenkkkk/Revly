'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { useRevlyStore } from '@/lib/store'

const NAV_ITEMS = [
  {
    label: 'Inicio',
    href: '/dashboard',
    exact: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Mi agente',
    href: '/dashboard/agentes',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Conversaciones',
    href: '/dashboard/conversaciones',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"/>
        <path d="M15 4H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
      </svg>
    ),
  },
  {
    label: 'Resultados',
    href: '/dashboard/analitica',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: 'Plan y facturación',
    href: '/dashboard/configuracion',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Ajustes',
    href: '/dashboard/ajustes',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77" />
      </svg>
    ),
  },
]

const PLAN_BADGE: Record<string, { label: string; className: string }> = {
  essential: { label: 'Starter',       className: 'bg-[#0d9488]/15 text-[#0d9488]' },
  growth:    { label: 'Growth',        className: 'bg-[#0d9488]/15 text-[#0d9488]' },
  partner:   { label: 'Enterprise',    className: 'bg-[#0d9488]/15 text-[#0d9488]' },
  free:      { label: 'Plan gratuito', className: 'text-white/20 bg-white/[0.06]'  },
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, setUserData } = useRevlyStore()
  const [fullName, setFullName] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserData({ email: user.email, plan: 'free' })

          // Fetch full_name + plan from public.users
          const { data: profile } = await supabase
            .from('users')
            .select('full_name, plan')
            .eq('id', user.id)
            .single()

          if (profile) {
            setFullName(profile.full_name ?? null)
            setUserData({ email: user.email, plan: profile.plan ?? 'free' })
          }
        }
      } catch { /* dev mode */ }
    }
    fetchUser()
  }, [setUserData])

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch { /* dev mode */ }
    router.push('/')
  }

  const email = userData?.email ?? ''
  const displayName = fullName || email.split('@')[0] || 'Usuario'
  const plan = userData?.plan ?? 'free'
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.free

  return (
    <aside className="fixed left-0 top-0 h-full bg-[#0a0f1a] flex flex-col z-40" style={{ width: 200 }}>

      {/* LOGO */}
      <div className="px-5 pt-8 pb-7">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/images/logo.png.png" alt="Revly" fill className="object-contain" />
          </div>
          <span className="text-white font-black text-lg tracking-tight">revly</span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-white/[0.08] text-white'
                  : 'text-white/25 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-[#0d9488]' : 'text-white/20'}`}>
                {icon}
              </span>
              {label}
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#0d9488] flex-shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* BOTTOM */}
      <div className="px-3 pb-5 pt-4 mt-4">
        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-7 h-7 rounded-xl bg-[#0d9488]/20 border border-[#0d9488]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#0d9488] text-xs font-black">{displayName[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{displayName}</p>
            <p className="text-white/30 text-[11px] truncate">{email}</p>
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/15 hover:text-white/40 hover:bg-white/[0.04] transition-all text-[12px] font-semibold"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Salir
        </button>
      </div>
    </aside>
  )
}
