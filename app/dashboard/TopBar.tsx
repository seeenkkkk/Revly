'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRevlyStore } from '@/lib/store'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/dashboard/agentes': 'Mi agente',
  '/dashboard/conversaciones': 'Conversaciones',
  '/dashboard/analitica': 'Resultados',
  '/dashboard/configuracion': 'Plan y facturación',
  '/dashboard/ajustes': 'Ajustes',
}

const PLAN_BADGE: Record<string, string> = {
  free: 'Plan gratuito',
  essential: 'Starter',
  growth: 'Growth',
  partner: 'Enterprise',
}

export default function TopBar() {
  const pathname = usePathname()
  const { userData } = useRevlyStore()

  const title = PAGE_TITLES[pathname] ?? 'Dashboard'
  const plan = userData?.plan ?? 'free'
  const showUpgrade = plan === 'free' || plan === 'essential'

  return (
    <div className="h-14 bg-[#0d1117] border-b border-white/[0.04] flex items-center justify-between px-8 flex-shrink-0">
      <p className="text-white font-bold text-sm">{title}</p>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/[0.06] px-3 py-1.5 rounded-full">
          {PLAN_BADGE[plan] ?? PLAN_BADGE.free}
        </span>
        {showUpgrade && (
          <Link
            href="/dashboard/configuracion"
            className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488] hover:text-[#0f766e] bg-[#0d9488]/10 hover:bg-[#0d9488]/20 px-3 py-1.5 rounded-full transition-all"
          >
            Upgrade →
          </Link>
        )}
      </div>
    </div>
  )
}
