import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Agent, UserProfile } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'

const AGENT_PLANS = [
  {
    tier: 'essential' as const,
    name: PLANS.essential.name,
    price: PLANS.essential.price,
    tagline: 'Para empezar',
    features: ['Respuestas automáticas 24/7', 'Calificación de leads', '500 conversaciones/mes', 'Soporte por email'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? null,
  },
  {
    tier: 'growth' as const,
    name: PLANS.growth.name,
    price: PLANS.growth.price,
    tagline: 'Más popular',
    features: ['Todo lo del Starter', 'Re-engagement automático', '1.500 conversaciones/mes', 'Analítica de conversiones'],
    badge: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID ?? null,
  },
  {
    tier: 'partner' as const,
    name: PLANS.partner.name,
    price: PLANS.partner.price,
    tagline: 'Sin límites',
    features: ['Todo lo del Growth', 'IA conversacional avanzada', 'Conversaciones ilimitadas', 'Soporte dedicado 24/7'],
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ?? null,
  },
]

export default async function DashboardPage() {
  let agents: Agent[] = []
  let userProfile: UserProfile | null = null

  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const [agentsResult, profileResult] = await Promise.all([
        supabase.from('agents').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('users').select('*').eq('id', session.user.id).single<UserProfile>(),
      ])
      agents = (agentsResult.data as Agent[]) ?? []
      userProfile = profileResult.data
    }
  } catch { /* dev mode */ }

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* HERO */}
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
            Dashboard
          </p>
          <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white">
            Elige tu agente,<br />
            <em className="italic text-[#0d9488]">empieza hoy.</em>
          </h1>
          <p className="text-white/40 text-sm mt-3 max-w-md">
            Despliega un agente de WhatsApp con IA y empieza a vender en minutos, sin código.
          </p>

          {/* Agentes activos en el hero */}
          {agents.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.status === 'active' ? 'bg-[#0d9488]' : 'bg-white/20'}`} />
                  <p className="text-white text-sm font-semibold">{agent.name || 'Sin nombre'}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full">
                    {agent.status ?? 'idle'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PLANES */}
      <div className="max-w-5xl mx-auto px-10 py-10">

        {agents.length > 0 && (
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-[#f1f5f9]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#cbd5e1]">Añadir nuevo agente</p>
            <div className="flex-1 h-px bg-[#f1f5f9]" />
          </div>
        )}

        {userProfile?.plan === 'partner' && agents.length > 0 ? (
          <div className="bg-[#0f172a] rounded-3xl px-8 py-10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-3">Plan Enterprise activo</p>
            <p className="text-white font-black text-2xl mb-2">Ya tienes acceso completo.</p>
            <p className="text-white/40 text-sm">Ve a Configuración para ajustar tu agente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AGENT_PLANS.map((plan) => (
              <div
                key={plan.tier}
                className={`relative flex flex-col rounded-3xl p-7 border transition-all ${
                  plan.badge
                    ? 'bg-[#0f172a] border-[#0f172a]'
                    : 'bg-white border-[#f1f5f9] hover:border-[#e2e8f0]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0d9488] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                      Más popular
                    </span>
                  </div>
                )}

                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${plan.badge ? 'text-[#0d9488]' : 'text-[#94a3b8]'}`}>
                  {plan.tagline}
                </p>
                <h3 className={`text-xl font-black mb-5 tracking-tight ${plan.badge ? 'text-white' : 'text-[#0f172a]'}`}>
                  {plan.name}
                </h3>

                <div className="mb-5">
                  {plan.price === 0 ? (
                    <span className={`text-4xl font-black tracking-tight ${plan.badge ? 'text-white' : 'text-[#0f172a]'}`}>
                      Gratis
                    </span>
                  ) : (
                    <>
                      <span className={`text-4xl font-black tracking-tight ${plan.badge ? 'text-white' : 'text-[#0f172a]'}`}>
                        {plan.price.toFixed(2).replace('.', ',')}€
                      </span>
                      <span className={`text-sm ml-1.5 ${plan.badge ? 'text-white/40' : 'text-[#94a3b8]'}`}>/mes</span>
                    </>
                  )}
                </div>

                <div className={`h-px mb-5 ${plan.badge ? 'bg-white/10' : 'bg-[#f1f5f9]'}`} />

                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`flex-shrink-0 ${plan.badge ? 'text-[#0d9488]' : 'text-[#0d9488]'}`}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className={plan.badge ? 'text-white/70' : 'text-[#64748b]'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard/agentes"
                  className={`w-full text-center py-3.5 rounded-full font-black text-[11px] uppercase tracking-wider transition-all ${
                    plan.badge
                      ? 'bg-[#0d9488] hover:bg-[#0f766e] text-white'
                      : 'bg-[#0f172a] hover:bg-[#1e293b] text-white'
                  }`}
                >
                  Activar {plan.name} →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
