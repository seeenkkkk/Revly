import AgentCard from '@/components/AgentCard'
import AgentStatusCard from '@/components/AgentStatusCard'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Agent, UserProfile } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'

// Mapeo de tier → priceId desde variables de entorno (server-side)
const AGENT_PLANS = [
  {
    tier: 'essential' as const,
    name: PLANS.essential.name,
    price: PLANS.essential.price,
    tagline: 'Tu cerrador básico',
    description: 'Responde FAQs, califica leads y guía al checkout. AI nivel medio.',
    features: [
      'Respuestas automáticas 24/7',
      'Calificación de leads',
      '50 conversaciones/mes',
      'Soporte por email',
    ],
    buttonLabel: 'Desplegar Agente Essential',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? null,
  },
  {
    tier: 'growth' as const,
    name: PLANS.growth.name,
    price: PLANS.growth.price,
    tagline: 'Vende y prospecta',
    description: 'Vende y prospecta. Re-engagement inteligente y seguimiento de leads. AI avanzada.',
    features: [
      'Todo lo del Essential',
      'Re-engagement automático',
      '1.000 conversaciones/mes',
      'Analítica de conversiones',
    ],
    badge: 'Más Rentable',
    buttonLabel: 'Desplegar Agente Growth',
    priceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID ?? null,
  },
  {
    tier: 'partner' as const,
    name: PLANS.partner.name,
    price: PLANS.partner.price,
    tagline: 'Tu Socio Digital',
    description: 'Tu Socio Digital. Cierra ventas complejas. Prácticamente un empleado humano en WhatsApp.',
    features: [
      'Todo lo del Growth',
      'IA conversacional avanzada',
      'Conversaciones ilimitadas',
      'Soporte dedicado 24/7',
    ],
    buttonLabel: 'Contratar Socio AI',
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID ?? null,
  },
]

export default async function AgentesPage() {
  // Obtener datos reales del usuario y sus agentes desde Supabase
  let agents: Agent[] = []
  let userProfile: UserProfile | null = null

  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const [agentsResult, profileResult] = await Promise.all([
        supabase
          .from('agents')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single<UserProfile>(),
      ])
      agents = (agentsResult.data as Agent[]) ?? []
      userProfile = profileResult.data
    }
  } catch {
    // Supabase no configurado — modo desarrollo
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ====== ENCABEZADO ====== */}
      <header className="px-10 pt-10 pb-8">
        <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">
          Mis Agentes
        </p>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          Selecciona tu nuevo{' '}
          <span className="text-[#00C48C]">Empleado Digital</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm max-w-xl">
          Despliega un agente de WhatsApp con IA y empieza a vender en minutos, sin código.
        </p>
      </header>

      {/* ====== AGENTES ACTIVOS ====== */}
      {agents.length > 0 && (
        <section className="px-10 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Tus Agentes Activos
            </h2>
            <span className="text-xs text-gray-300 bg-gray-100 px-2.5 py-1 rounded-full">
              {agents.length} {agents.length === 1 ? 'agente' : 'agentes'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
            {agents.map((agent) => (
              <AgentStatusCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      )}

      {/* ====== SEPARADOR (si hay agentes activos) ====== */}
      {agents.length > 0 && (
        <div className="px-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">Añadir nuevo agente</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </div>
      )}

      {/* ====== TARJETAS DE PLANES ====== */}
      <section className="px-10 pb-10">
        {userProfile?.plan === 'partner' && agents.length > 0 ? (
          // El usuario ya tiene el plan máximo y agentes → mostrar mensaje
          <div className="bg-[#0D1B2A]/5 border border-[#0D1B2A]/10 rounded-2xl p-8 text-center">
            <p className="text-[#0D1B2A] font-semibold mb-1">
              Ya tienes el plan Partner AI activo 🤖
            </p>
            <p className="text-gray-400 text-sm">
              Tienes acceso a todos los agentes. Ve a Configuración para ajustar tu agente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {AGENT_PLANS.map((plan) => (
              <AgentCard
                key={plan.tier}
                tier={plan.tier}
                name={plan.name}
                price={plan.price}
                tagline={plan.tagline}
                description={plan.description}
                features={plan.features}
                badge={plan.badge}
                buttonLabel={plan.buttonLabel}
                priceId={plan.priceId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
