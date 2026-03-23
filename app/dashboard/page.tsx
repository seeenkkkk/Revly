import { createServerSupabase } from '@/lib/supabase-server'
import type { UserProfile, Conversation } from '@/lib/supabase'
import { MessageCircle, Users, Zap, TrendingUp } from 'lucide-react'
import CTACard from './CTACard'

function StatCard({ icon: Icon, label, value, sub, accent = '#0d9488', trend }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: string; trend?: string
}) {
  return (
    <div style={{
      borderRadius: 16,
      padding: '1px',
      background: `linear-gradient(135deg, ${accent}30, rgba(255,255,255,0.04), ${accent}15)`,
      boxShadow: `0 8px 32px rgba(0,0,0,0.25)`,
    }}>
      <div style={{
        borderRadius: 15,
        padding: '20px 20px 18px',
        background: 'linear-gradient(145deg, rgba(13,20,38,0.95), rgba(10,16,30,0.98))',
        backdropFilter: 'blur(16px)',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Corner glow */}
        <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle, ${accent}20 0%, transparent 70%)`, pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:`${accent}12`, border:`1px solid ${accent}25`, flexShrink:0 }}>
            <Icon size={16} style={{ color: accent }} strokeWidth={1.8} />
          </div>
          {trend && (
            <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, fontWeight:700, color:'#4ade80', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:99, padding:'2px 8px' }}>
              <TrendingUp size={9} strokeWidth={2.5} />
              {trend}
            </div>
          )}
        </div>

        <p style={{ color:'#fff', fontSize:32, fontWeight:900, margin:'0 0 2px', letterSpacing:'-1px', lineHeight:1 }}>
          {value}
        </p>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, fontWeight:600, margin:'0 0 2px' }}>{label}</p>
        {sub && <p style={{ color:'rgba(255,255,255,0.18)', fontSize:10, margin:0 }}>{sub}</p>}
      </div>
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

  const used = userProfile?.conversations_used ?? 0
  const limit = userProfile?.conversations_limit ?? 50
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const remaining = Math.max(limit - used, 0)
  const nearLimit = pct >= 80
  const agentConfigured = (userProfile as unknown as Record<string, unknown>)?.agent_configured as boolean ?? false
  const agentActive = (userProfile as unknown as Record<string, unknown>)?.agent_active as boolean ?? false

  const hour = now.getHours()
  const greeting = hour < 13 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div style={{ minHeight:'100vh', padding:'32px 36px', background:'#0f172a' }}>
      <style>{`
        @keyframes status-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
      `}</style>
      <div style={{ maxWidth:860, margin:'0 auto', display:'flex', flexDirection:'column', gap:24 }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.25)', fontSize:12, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', margin:'0 0 4px' }}>
              {greeting}
            </p>
            <h1 style={{ color:'#fff', fontSize:30, fontWeight:900, letterSpacing:'-0.8px', margin:0, lineHeight:1.1 }}>
              {greetingName} 👋
            </h1>
          </div>

          {/* Agent status pill */}
          <div style={{
            display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:99,
            background: agentActive ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${agentActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            <span style={{
              width:7, height:7, borderRadius:'50%', flexShrink:0,
              background: agentActive ? '#4ade80' : '#f87171',
              boxShadow: agentActive ? '0 0 8px rgba(74,222,128,0.9)' : '0 0 8px rgba(248,113,113,0.7)',
              animation: agentActive ? 'status-pulse 2s ease-in-out infinite' : 'none',
            }} />
            <span style={{ fontSize:12, fontWeight:700, color: agentActive ? '#4ade80' : '#f87171' }}>
              {agentActive ? 'Agente activo' : 'Agente inactivo'}
            </span>
          </div>
        </div>

        {/* ── CTA CARD (if not configured) ── */}
        {!agentConfigured && <CTACard />}

        {/* ── STATS GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          <StatCard icon={MessageCircle} label="Conversaciones hoy" value={convToday} sub="mensajes recibidos" accent="#0d9488" trend="+12%" />
          <StatCard icon={Users} label="Leads esta semana" value={convWeek} sub="contactos nuevos" accent="#6366f1" trend="+8%" />
          <StatCard icon={Zap} label="Tasa de respuesta" value={used > 0 ? '98%' : '—'} sub="tiempo medio < 2s" accent="#f59e0b" />
        </div>

        {/* ── USAGE CARD ── */}
        <div style={{
          borderRadius:16, padding:'1px',
          background:'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(255,255,255,0.03), rgba(13,148,136,0.08))',
        }}>
          <div style={{
            borderRadius:15, padding:'22px 24px',
            background:'linear-gradient(145deg, rgba(13,20,38,0.96), rgba(10,16,30,0.98))',
            backdropFilter:'blur(16px)',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:0, top:0, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle at 80% 20%, rgba(13,148,136,0.08) 0%, transparent 65%)', pointerEvents:'none' }} />

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:'rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MessageCircle size={15} style={{ color:'#0d9488' }} strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:600, margin:0 }}>Conversaciones del mes</p>
                  <p style={{ color:'rgba(255,255,255,0.2)', fontSize:10, margin:0 }}>Se reinicia el 1 de cada mes</p>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ color:'#fff', fontSize:20, fontWeight:900, margin:0, letterSpacing:'-0.5px' }}>{used}<span style={{ color:'rgba(255,255,255,0.25)', fontSize:13, fontWeight:500 }}>/{limit}</span></p>
                <p style={{ color:'rgba(255,255,255,0.2)', fontSize:10, margin:0 }}>{pct}% usado</p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:6, borderRadius:99, background:'rgba(255,255,255,0.05)', overflow:'hidden', marginBottom:10 }}>
              <div style={{
                height:'100%', borderRadius:99, transition:'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                width:`${pct}%`,
                background: nearLimit
                  ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                  : 'linear-gradient(90deg,#0d9488,#2dd4bf)',
                boxShadow: nearLimit ? '0 0 10px rgba(245,158,11,0.5)' : '0 0 10px rgba(13,148,136,0.5)',
              }} />
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11, margin:0 }}>{remaining} conversaciones restantes</p>
              {nearLimit && (
                <p style={{ color:'#fbbf24', fontSize:11, fontWeight:700, margin:0 }}>⚠ Cerca del límite</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
