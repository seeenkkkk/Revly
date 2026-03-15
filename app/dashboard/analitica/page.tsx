'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Conversation } from '@/lib/supabase'

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1117] text-white text-xs px-3 py-2 rounded-xl shadow-lg">
        <p className="font-bold mb-0.5">{label}</p>
        <p className="text-[#0d9488]">{payload[0].value} conversaciones</p>
      </div>
    )
  }
  return null
}

export default function AnaliticaPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
        setConversations((data as Conversation[]) ?? [])
      } catch { /* dev */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const total = conversations.length
  const thisMonthCount = conversations.filter(c => new Date(c.started_at) >= thisMonthStart).length
  const converted = conversations.filter(c => c.status === 'converted').length
  const open = conversations.filter(c => c.status === 'open').length
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0'

  // Last 7 days bar chart data
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const end = new Date(start)
    end.setDate(start.getDate() + 1)
    const count = conversations.filter(c => {
      const t = new Date(c.started_at)
      return t >= start && t < end
    }).length
    return {
      dia: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      conversaciones: count,
    }
  })

  const kpis = [
    { label: 'Total', value: total.toString(), sub: 'conversaciones totales' },
    { label: 'Este mes', value: thisMonthCount.toString(), sub: 'conversaciones este mes' },
    { label: 'Convertidas', value: converted.toString(), sub: 'leads convertidos' },
    { label: 'Abiertas', value: open.toString(), sub: 'en curso ahora' },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Resultados</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Métricas de rendimiento de tu agente</p>
        </div>

        {/* KPI cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-[#0d1117] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map(({ label, value, sub }) => (
              <div key={label} className="bg-[#0d1117] rounded-2xl p-5">
                <p className="text-white font-black text-3xl tabular-nums">{value}</p>
                <p className="text-white/40 text-xs mt-1.5 uppercase tracking-wide">{label}</p>
                <p className="text-white/20 text-[10px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Conversion rate */}
        <div className="bg-[#0d1117] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Tasa de conversión</p>
            <p className="text-white font-black text-[40px] leading-none tabular-nums">{conversionRate}<span className="text-[#0d9488] text-xl">%</span></p>
            <p className="text-white/30 text-xs mt-2">leads que se convirtieron en clientes</p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-[#0d9488]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 rounded-full border-4 border-[#0d9488]/40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#0d9488]/20" />
            </div>
          </div>
        </div>

        {/* Bar chart */}
        {total === 0 && !loading ? (
          <div className="bg-[#0d1117] rounded-2xl p-10 text-center">
            <p className="text-white/40 text-sm">Los resultados aparecerán cuando tu agente empiece a conversar.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">Últimos 7 días</p>
                <p className="text-[#0f172a] font-black text-lg">Conversaciones por día</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1] px-3 py-1.5 rounded-full">
                {dailyData.reduce((a, d) => a + d.conversaciones, 0)} total
              </span>
            </div>

            {loading ? (
              <div className="h-48 bg-[#fafafa] rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyData} barSize={32}>
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
                  <Bar dataKey="conversaciones" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
