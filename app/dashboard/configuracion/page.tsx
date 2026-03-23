'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'

const PLANS = [
  {
    key: 'essential',
    name: 'Starter',
    price: '14,99 €',
    limit: '100 conversaciones/mes',
    feature: 'Respuestas automáticas 24/7',
    priceIdEnv: 'NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID',
  },
  {
    key: 'growth',
    name: 'Growth',
    price: '34,99 €',
    limit: '1.500 conversaciones/mes',
    feature: 'Re-engagement automático + analítica',
    priceIdEnv: 'NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID',
  },
  {
    key: 'partner',
    name: 'Enterprise',
    price: '79,99 €',
    limit: 'Conversaciones ilimitadas',
    feature: 'IA avanzada + soporte dedicado 24/7',
    priceIdEnv: 'NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID',
  },
]

const PLAN_LABELS: Record<string, string> = {
  free: 'Plan gratuito',
  essential: 'Starter',
  growth: 'Growth',
  partner: 'Enterprise',
}

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)
  const [toast, setToast] = useState(false)

  const [plan, setPlan] = useState('free')
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(50)

  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (profile) {
          setPlan(profile.plan ?? 'free')
          setUsed(profile.conversations_used ?? 0)
          setLimit(profile.conversations_limit ?? 50)
          setFullName(profile.full_name ?? '')
          setCompanyName(profile.company_name ?? '')
          setWhatsappNumber(profile.whatsapp_number ?? '')
        }
      } catch { /* dev */ }
      finally { setLoading(false) }
    }
    fetchUser()
  }, [])

  const handleCheckout = async (planKey: string) => {
    setCheckingOut(planKey)
    try {
      const priceIdMap: Record<string, string | undefined> = {
        essential: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
        growth: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID,
        partner: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
      }
      const priceId = priceIdMap[planKey]
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: planKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch { /* dev */ }
    finally { setCheckingOut(null) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('users').update({
        full_name: fullName,
        company_name: companyName,
        whatsapp_number: whatsappNumber,
      }).eq('id', user.id)
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    } catch { /* dev */ }
    finally { setSaving(false) }
  }

  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 size={20} className="animate-spin text-[#0d9488]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f172a] px-8 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Plan y facturación</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Gestiona tu suscripción y datos de cuenta</p>
        </div>

        {/* Current plan + progress */}
        <div className="bg-[#0d1117] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Plan actual</p>
              <p className="text-white font-black text-xl">{PLAN_LABELS[plan]}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488] bg-[#0d9488]/10 px-3 py-1.5 rounded-full">
              {used} / {limit} conv.
            </span>
          </div>
          <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct > 80 ? 'bg-red-400' : 'bg-[#0d9488]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-white/30 text-xs">{pct}% del límite mensual usado</p>
        </div>

        {/* Plan cards */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4">Cambiar plan</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map(p => {
              const isCurrent = plan === p.key
              return (
                <div
                  key={p.key}
                  className={`rounded-2xl p-5 flex flex-col gap-4 transition-all ${
                    isCurrent
                      ? 'bg-[#0d1117] ring-1 ring-[#0d9488]/40'
                      : 'bg-white border border-[#f1f5f9]'
                  }`}
                >
                  <div>
                    <p className={`font-black text-lg ${isCurrent ? 'text-white' : 'text-[#0f172a]'}`}>{p.name}</p>
                    <p className={`text-2xl font-black mt-1 ${isCurrent ? 'text-[#0d9488]' : 'text-[#0f172a]'}`}>
                      {p.price}<span className={`text-sm font-medium ml-1 ${isCurrent ? 'text-white/40' : 'text-[#94a3b8]'}`}>/mes</span>
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className={`text-xs font-medium ${isCurrent ? 'text-white/60' : 'text-[#64748b]'}`}>{p.limit}</p>
                    <p className={`text-xs ${isCurrent ? 'text-white/40' : 'text-[#94a3b8]'}`}>{p.feature}</p>
                  </div>
                  {isCurrent ? (
                    <span className="w-full text-center py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#0d9488] bg-[#0d9488]/10">
                      Plan actual
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckout(p.key)}
                      disabled={checkingOut !== null}
                      className="w-full py-2.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {checkingOut === p.key ? <><Loader2 size={12} className="animate-spin" />Redirigiendo...</> : 'Activar plan →'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Account settings */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4">Datos de cuenta</p>
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Nombre</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-[#0f172a] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Empresa</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Nombre de tu negocio"
                  className="w-full bg-[#0f172a] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Número WhatsApp</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-[#0f172a] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-mono text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
              />
            </div>

            {toast && (
              <p className="text-[#0d9488] text-xs font-medium">Cambios guardados</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="py-3.5 px-8 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
