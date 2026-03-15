import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import type { UserProfile, Conversation } from '@/lib/supabase'

export default async function DashboardPage() {
  let userProfile: UserProfile | null = null
  let conversations: Conversation[] = []

  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const [profileResult, conversationsResult] = await Promise.all([
        supabase.from('users').select('*').eq('id', session.user.id).single<UserProfile>(),
        supabase.from('conversations').select('*').eq('user_id', session.user.id).order('started_at', { ascending: false }),
      ])
      userProfile = profileResult.data
      conversations = (conversationsResult.data as Conversation[]) ?? []
    }
  } catch { /* dev */ }

  const rawName = userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Usuario'
  const greetingName = rawName.split(' ')[0]

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay())

  const convToday = conversations.filter(c => new Date(c.started_at) >= startOfToday).length
  const convWeek = conversations.filter(c => new Date(c.started_at) >= startOfWeek).length
  const convTotal = conversations.length

  const used = userProfile?.conversations_used ?? 0
  const limit = userProfile?.conversations_limit ?? 50
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const remaining = Math.max(limit - used, 0)
  const nearLimit = pct >= 80

  return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-[#0f172a] text-[32px] font-black tracking-tight">Hola, {greetingName}</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Aquí tienes el resumen de hoy</p>
        </div>

        {/* Progress bar */}
        <div className="bg-[#0d1117] rounded-2xl p-6">
          <div className="flex justify-between mb-3">
            <span className="text-white/60 text-sm font-medium">Conversaciones usadas</span>
            <span className="text-white text-sm font-bold tabular-nums">{used} / {limit}</span>
          </div>
          <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-[#0d9488] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-white/40 text-xs">{remaining} conversaciones restantes este mes</p>
          {nearLimit && (
            <p className="text-amber-400/80 text-xs mt-1.5 font-medium">Estás cerca de tu límite</p>
          )}
        </div>

        {/* Stats or empty state */}
        {used === 0 ? (
          <div className="bg-[#0d1117] rounded-2xl p-10 text-center">
            <p className="text-white/40 text-sm mb-5">Tu agente aún no ha tenido conversaciones.</p>
            <Link
              href="/dashboard/agentes"
              className="inline-block bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-bold px-6 py-3 rounded-full transition-all"
            >
              Activar mi agente
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Conversaciones hoy', value: convToday },
              { label: 'Esta semana', value: convWeek },
              { label: 'Total', value: convTotal },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0d1117] rounded-2xl p-6">
                <p className="text-white font-black text-3xl tabular-nums">{value}</p>
                <p className="text-white/40 text-xs mt-1.5 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
