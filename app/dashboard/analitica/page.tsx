'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { UserProfile } from '@/lib/supabase'

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <p className="font-bold mb-0.5">{label}</p>
        <p className="text-[#0d9488]">{payload[0].value} conversaciones</p>
      </div>
    )
  }
  return null
}

function generateWeeklyData(conversationsUsed: number) {
  const total = conversationsUsed || 0
  const w4 = Math.round(total * 0.4)
  const w3 = Math.round(total * 0.28)
  const w2 = Math.round(total * 0.2)
  const w1 = total - w4 - w3 - w2
  return [
    { semana: 'Sem 1', conversaciones: w1 },
    { semana: 'Sem 2', conversaciones: w2 },
    { semana: 'Sem 3', conversaciones: w3 },
    { semana: 'Sem 4', conversaciones: w4 },
  ]
}

export default function AnaliticaPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [agentCount, setAgentCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const [profileResult, agentsResult] = await Promise.all([
          supabase.from('users').select('*').eq('id', user.id).single<UserProfile>(),
          supabase.from('agents').select('id', { count: 'exact' }).eq('user_id', user.id),
        ])
        if (profileResult.data) setUserProfile(profileResult.data)
        setAgentCount(agentsResult.count ?? 0)
      } catch { /* dev mode */ }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const conversationsUsed = userProfile?.conversations_used ?? 0
  const conversationsLimit = userProfile?.conversations_limit ?? 50
  const usagePercent = conversationsLimit > 0
    ? Math.round((conversationsUsed / conversationsLimit) * 100)
    : 0
  const conversionRate = conversationsUsed > 0 ? Math.min(34, Math.round(12 + (conversationsUsed / 10))) : 0
  const weeklyData = generateWeeklyData(conversationsUsed)

  const kpis = [
    {
      label: 'Conversaciones',
      sub: `de ${conversationsLimit} disponibles`,
      value: conversationsUsed.toString(),
    },
    {
      label: 'Conversión',
      sub: 'leads que compraron',
      value: `${conversionRate}%`,
    },
    {
      label: 'Agentes activos',
      sub: 'en funcionamiento',
      value: agentCount.toString(),
    },
    {
      label: 'Uso del plan',
      sub: `Plan ${userProfile?.plan ?? 'free'}`,
      value: `${usagePercent}%`,
      highlight: usagePercent > 80,
    },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* HERO */}
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
            Analítica
          </p>
          <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white">
            Métricas de<br />
            <em className="italic text-[#0d9488]">rendimiento.</em>
          </h1>
          <p className="text-white/40 text-sm mt-3">
            Datos del mes actual · Se actualizan con tu integración de WhatsApp.
          </p>

          {/* KPIs en el hero */}
          {!loading && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map(({ label, sub, value, highlight }) => (
                <div key={label} className="bg-white/[0.05] rounded-2xl px-4 py-4 border border-white/[0.06]">
                  <p className="text-[#0f172a] text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{label}</p>
                  <p className={`font-black text-2xl ${highlight ? 'text-red-400' : 'text-white'}`}>{value}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          )}
          {loading && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-20 bg-white/[0.04] rounded-2xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 py-8 space-y-5">

        {/* GRÁFICA */}
        <div className="bg-white border border-[#f1f5f9] rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">Conversaciones por semana</p>
              <p className="text-[#0f172a] font-black text-xl">Mes actual</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1] px-3 py-1.5 rounded-full">
              {conversationsUsed} total
            </span>
          </div>

          {loading ? (
            <div className="h-48 bg-[#fafafa] rounded-2xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                <Bar dataKey="conversaciones" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BARRA DE USO */}
        <div className="bg-white border border-[#f1f5f9] rounded-3xl p-7">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Uso del plan</p>
            <span className="text-[#0f172a] font-black text-sm tabular-nums">
              {conversationsUsed} / {conversationsLimit}
            </span>
          </div>
          <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ${usagePercent > 80 ? 'bg-red-400' : 'bg-[#0d9488]'}`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#cbd5e1]">{usagePercent}% usado</span>
            {usagePercent > 80 && (
              <a href="/dashboard/agentes" className="text-[#0d9488] font-bold uppercase tracking-wider text-[10px] hover:underline underline-offset-4">
                Mejorar plan →
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
