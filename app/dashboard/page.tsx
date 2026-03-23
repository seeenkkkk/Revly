import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import type { UserProfile, Conversation } from '@/lib/supabase'

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

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
    <div className="min-h-screen px-8 py-10" style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f0fdfa 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#0f172a] text-[30px] font-black tracking-tight">
              Hola, {greetingName} 👋
            </h1>
            <p className="text-[#94a3b8] text-sm mt-0.5">Aquí tienes el resumen de hoy</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.15)', color: '#0d9488' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]" style={{ boxShadow: '0 0 4px rgba(13,148,136,0.8)', animation: 'pulse 2s infinite' }} />
            Agente activo
          </div>
        </div>

        {/* Progress card */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0d1525 0%, #0f172a 60%, #0a1628 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
          {/* Background orb */}
          <div className="absolute right-[-40px] top-[-40px] w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#0d9488]"
                  style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.2)' }}>
                  <WhatsAppIcon />
                </div>
                <span className="text-white/60 text-sm font-medium">Conversaciones del mes</span>
              </div>
              <span className="text-white text-sm font-black tabular-nums"
                style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 8 }}>
                {used} / {limit}
              </span>
            </div>

            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: nearLimit
                    ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(90deg, #0d9488, #2dd4bf)',
                  boxShadow: nearLimit
                    ? '0 0 8px rgba(245,158,11,0.4)'
                    : '0 0 8px rgba(13,148,136,0.4)',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white/35 text-xs">{remaining} conversaciones restantes</p>
              {nearLimit && (
                <p className="text-amber-400/90 text-xs font-semibold flex items-center gap-1">
                  ⚠ Cerca del límite
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats or empty state */}
        {used === 0 ? (
          <div className="rounded-2xl p-10 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0d1525 0%, #0f172a 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(13,148,136,0.06) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0d9488]"
                style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.2)' }}>
                <WhatsAppIcon />
              </div>
              <p className="text-white/50 text-sm mb-1 font-medium">Tu agente está listo</p>
              <p className="text-white/25 text-xs mb-6">Aún no ha tenido conversaciones. Actívalo para empezar.</p>
              <Link
                href="/dashboard/agentes"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-full transition-all"
                style={{
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
                }}
              >
                Activar mi agente →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Hoy', value: convToday, icon: '☀️', sub: 'conversaciones' },
              { label: 'Esta semana', value: convWeek, icon: '📅', sub: 'conversaciones' },
              { label: 'Total', value: convTotal, icon: '🔥', sub: 'acumuladas' },
            ].map(({ label, value, icon, sub }) => (
              <div key={label} className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0d1525 0%, #0f172a 100%)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                <div className="absolute top-4 right-4 text-lg opacity-30">{icon}</div>
                <p className="text-white font-black text-3xl tabular-nums mb-1"
                  style={{ background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {value}
                </p>
                <p className="text-white/50 text-[11px] uppercase tracking-wide font-medium">{label}</p>
                <p className="text-white/20 text-[10px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
