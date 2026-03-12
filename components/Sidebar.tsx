'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { useRevlyStore } from '@/lib/store'

// Iconos SVG lineales minimalistas para cada sección
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  agentes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  funcionamiento: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <path d="M6 9v6M9 6h6" /><path d="M15.5 6.5 18 9v6" />
    </svg>
  ),
  analitica: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  configuracion: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77" />
    </svg>
  ),
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' as const, exact: true },
  { label: 'Mis Agentes', href: '/dashboard/agentes', icon: 'agentes' as const },
  { label: 'Funcionamiento', href: '/dashboard/funcionamiento', icon: 'funcionamiento' as const },
  { label: 'Analítica', href: '/dashboard/analitica', icon: 'analitica' as const },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: 'configuracion' as const },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { userData, setUserData } = useRevlyStore()

  // Obtener datos del usuario al montar el sidebar
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          setUserData({ email: user.email, plan: 'free' })
        }
      } catch {
        // Supabase no configurado — modo desarrollo
      }
    }
    fetchUser()
  }, [setUserData])

  // Cerrar sesión y redirigir al inicio
  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch {
      // ignorar error en desarrollo
    }
    router.push('/')
  }

  // Obtener inicial del email para el avatar
  const avatarLetter = userData?.email?.[0]?.toUpperCase() ?? 'U'
  const displayEmail = userData?.email ?? 'usuario@revly.io'

  return (
    <aside className="fixed left-0 top-0 h-full bg-[#0D1B2A] flex flex-col z-40" style={{ width: 240 }}>
      {/* ====== LOGO ====== */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.08]">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="/revly-logo.png"
            alt="Revly"
            fill
            className="object-contain"
            onError={() => {}} // fallback al div de abajo si no existe el logo
          />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">revly</span>
      </div>

      {/* ====== NAVEGACIÓN ====== */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[#00C48C]/15 text-[#00C48C]'
                  : 'text-[#6B7E93] hover:text-white hover:bg-white/[0.06]'
                }
              `}
            >
              <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-[#00C48C]' : ''}`}>
                {icons[icon]}
              </span>
              {label}
              {/* Indicador activo */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00C48C]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ====== WIDGET ESTADO SERVIDOR ====== */}
      <div className="px-4 pb-3">
        <div className="bg-white/[0.05] rounded-xl px-3 py-2.5 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse flex-shrink-0" />
          <div>
            <p className="text-[#6B7E93] text-xs">Estado del Servidor</p>
            <p className="text-[#00C48C] text-xs font-semibold">Online</p>
          </div>
        </div>
      </div>

      {/* ====== USUARIO + LOGOUT ====== */}
      <div className="px-3 pb-5 pt-2 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Avatar con inicial */}
          <div className="w-8 h-8 rounded-full bg-[#00C48C]/20 border border-[#00C48C]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#00C48C] text-xs font-bold">{avatarLetter}</span>
          </div>
          {/* Email truncado */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{displayEmail}</p>
            <p className="text-[#6B7E93] text-xs capitalize">{userData?.plan ?? 'free'}</p>
          </div>
        </div>
        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#6B7E93] hover:text-white hover:bg-white/[0.06] transition-all text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
