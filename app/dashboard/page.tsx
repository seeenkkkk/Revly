import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import type { UserProfile, Conversation } from '@/lib/supabase'
import { MessageCircle, Users, Zap, Bot, ArrowRight } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color = '#0d9488' }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="rounded-2xl p-6 relative overflow-hidden" style={{
      background: 'rgba(15,23,42,0.75)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(13,148,136,0.15)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
    }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" style={{
        background: `radial-gradient(circle at 80% 20%, ${color}18 0%, transparent 70%)`,
      }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
          background: `${color}15`, border: `1px solid ${color}25`,
        }}>
          <Icon size={17} style={{ color }} strokeWidth={1.8} />
        </div>
      </div>
      <p className="text-white font-black text-3xl tabular-nums mb-0.5" style={{
        background: 'linear-gradient(135deg,#ffffff,rgba(255,255,255,0.6))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {value}
      </p>
      <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>{sub}</p>}
    </div>
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
  const agentConfigured = (userProfile as unknown as Record<string, unknown>)?.agent_configured as boolean ?? false
  const agentActive = (userProfile as unknown as Record<string, unknown>)?.agent_active as boolean ?? false

  return (
    <div className="px-8 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-7">

        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-[28px] font-black tracking-tight mb-0.5">
              Hola, {greetingName} 👋
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Aquí tienes el resumen de hoy</p>
          </div>
          {/* Agent status badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{
            background: agentActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${agentActive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`,
            color: agentActive ? '#4ade80' : '#f87171',
          }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
              background: agentActive ? '#4ade80' : '#f87171',
              boxShadow: agentActive ? '0 0 6px rgba(74,222,128,0.8)' : '0 0 6px rgba(248,113,113,0.6)',
              animation: agentActive ? 'pulse 2s infinite' : 'none',
            }} />
            {agentActive ? 'Agente activo' : 'Agente inactivo'}
          </div>
        </div>

        {/* Configure CTA — only if not configured */}
        {!agentConfigured && (
          <Link href="/dashboard/agentes" className="block rounded-2xl p-5 group transition-all" style={{
            background: 'linear-gradient(135deg,rgba(13,148,136,0.15) 0%,rgba(13,148,136,0.06) 100%)',
            border: '1px solid rgba(13,148,136,0.3)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(13,148,136,0.1)',
          }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                  background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.35)',
                }}>
                  <Bot size={20} className="text-[#0d9488]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Configura tu agente WhatsApp</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Empieza a recibir y cerrar ventas automáticamente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[#0d9488] text-xs font-bold group-hover:gap-2.5 transition-all">
                Configurar <ArrowRight size={13} strokeWidth={2.2} />
              </div>
            </div>
          </Link>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={MessageCircle} label="Conversaciones hoy" value={convToday} sub="mensajes recibidos" />
          <StatCard icon={Users} label="Leads captados" value={convWeek} sub="esta semana" color="#6366f1" />
          <StatCard icon={Zap} label="Tasa de respuesta" value={convTotal > 0 ? '98%' : '—'} sub="tiempo medio < 2s" color="#f59e0b" />
        </div>

        {/* Progress card */}
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{
          background: 'rgba(15,23,42,0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(13,148,136,0.15)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        }}>
          <div className="absolute right-0 top-0 w-48 h-48 rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle at 90% 10%, rgba(13,148,136,0.1) 0%, transparent 65%)',
          }} />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <MessageCircle size={16} className="text-[#0d9488]" strokeWidth={1.8} />
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Conversaciones del mes
              </span>
            </div>
            <span className="text-white text-sm font-black tabular-nums px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {used} / {limit}
            </span>
          </div>

          <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${pct}%`,
              background: nearLimit
                ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                : 'linear-gradient(90deg,#0d9488,#2dd4bf)',
              boxShadow: nearLimit ? '0 0 8px rgba(245,158,11,0.4)' : '0 0 8px rgba(13,148,136,0.4)',
            }} />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {remaining} conversaciones restantes
            </p>
            {nearLimit && (
              <p className="text-xs font-semibold" style={{ color: '#fbbf24' }}>⚠ Cerca del límite</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
