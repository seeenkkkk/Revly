import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AgentStatus from '@/components/AgentStatus'
import type { UserProfile, Agent } from '@/lib/supabase'

export default async function DashboardPage() {
  const supabase = createServerSupabase()

  // Verificar sesión (el middleware ya lo protege, pero doble seguridad)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/')

  // Obtener perfil del usuario desde la tabla users
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single<UserProfile>()

  // Obtener configuración del agente del usuario
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', session.user.id)
    .single<Agent>()

  // Calcular porcentaje de conversaciones usadas
  const conversationsUsed = userProfile?.conversations_used ?? 0
  const conversationsLimit = userProfile?.conversations_limit ?? 50
  const usagePercent = Math.min((conversationsUsed / conversationsLimit) * 100, 100)

  // Etiquetas de plan con colores
  const planLabels = {
    free: { label: 'Free', color: 'text-white/60 bg-white/10' },
    pro: { label: 'Pro', color: 'text-[#00C48C] bg-[#00C48C]/10' },
    business: { label: 'Business', color: 'text-purple-400 bg-purple-400/10' },
  }
  const planInfo = planLabels[userProfile?.plan ?? 'free']

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white">
      <Navbar userEmail={session.user.email} />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Cabecera del dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-white/50 text-sm">{session.user.email}</p>
          </div>

          {/* Badge de plan actual */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${planInfo.color}`}>
            Plan {planInfo.label}
          </div>
        </div>

        {/* ====== MÉTRICAS ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Conversaciones usadas */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/50 text-sm mb-2">Conversaciones</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold">{conversationsUsed}</span>
              <span className="text-white/40 text-sm mb-1">/ {conversationsLimit}</span>
            </div>
            {/* Barra de progreso */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C48C] rounded-full transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-white/30 text-xs mt-2">{usagePercent.toFixed(0)}% del límite mensual</p>
          </div>

          {/* Estado del agente */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/50 text-sm mb-2">Estado del agente</p>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  agent?.status === 'active' ? 'bg-[#00C48C] animate-pulse' : 'bg-white/20'
                }`}
              />
              <span className="text-2xl font-bold">
                {agent?.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-white/30 text-xs mt-3">
              {agent?.whatsapp_number
                ? `WhatsApp: ${agent.whatsapp_number}`
                : 'Sin número configurado'}
            </p>
          </div>

          {/* Plan y upgrade */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-white/50 text-sm mb-2">Tu plan</p>
              <p className="text-2xl font-bold capitalize">{userProfile?.plan ?? 'Free'}</p>
            </div>
            {userProfile?.plan !== 'business' && (
              <a
                href="/#precios"
                className="mt-4 bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors text-center"
              >
                Mejorar plan →
              </a>
            )}
          </div>
        </div>

        {/* ====== CONFIGURACIÓN DEL AGENTE ====== */}
        <AgentStatus agent={agent} userId={session.user.id} />
      </div>
    </main>
  )
}
