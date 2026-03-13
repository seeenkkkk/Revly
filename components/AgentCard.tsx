'use client'

import { useState } from 'react'

// Icono Essential: burbuja de chat con símbolo de dólar
const AgentIconEssential = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 7v1m0 8v1m-2.5-7.5c0-1.1.9-2 2-2s2 1 2 2c0 2-4 2-4 4s.9 2 2 2 2-.9 2-2" />
  </svg>
)

// Icono Growth: burbuja de chat + rayo
const AgentIconGrowth = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" />
    <path d="M13.5 6l-3 5.5h3l-2 5 6-7h-4l2-3.5z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

// Icono Partner: busto de androide
const AgentIconPartner = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 20a7 7 0 0 1 13 0" />
    <path d="M12 3V1M8.5 4.5 7 3M15.5 4.5 17 3" />
    <circle cx="10" cy="7" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="14" cy="7" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

export type AgentTier = 'essential' | 'growth' | 'partner'

interface AgentCardProps {
  tier: AgentTier
  name: string
  price: number
  tagline: string
  description: string
  features: string[]
  badge?: string
  buttonLabel: string
  priceId: string | null
}

const iconMap: Record<AgentTier, React.ReactNode> = {
  essential: <AgentIconEssential />,
  growth: <AgentIconGrowth />,
  partner: <AgentIconPartner />,
}

const styles: Record<AgentTier, {
  card: string; icon: string; title: string; price: string
  priceSub: string; desc: string; feature: string; btn: string
}> = {
  essential: {
    card: 'bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md',
    icon: 'bg-gray-100 text-gray-500',
    title: 'text-[#0D1B2A]', price: 'text-[#0D1B2A]',
    priceSub: 'text-gray-400', desc: 'text-gray-500',
    feature: 'text-gray-600', btn: 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#0D1B2A]',
  },
  growth: {
    card: 'bg-white border-2 border-[#00C48C] shadow-lg shadow-[#00C48C]/10 hover:shadow-xl hover:shadow-[#00C48C]/15',
    icon: 'bg-[#00C48C]/10 text-[#00C48C]',
    title: 'text-[#0D1B2A]', price: 'text-[#0D1B2A]',
    priceSub: 'text-gray-400', desc: 'text-gray-500',
    feature: 'text-gray-600', btn: 'bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A]',
  },
  partner: {
    card: 'bg-gradient-to-b from-[#0D1B2A] to-[#0f2337] border border-[#1E3A52] shadow-xl hover:shadow-2xl',
    icon: 'bg-white/10 text-[#00C48C]',
    title: 'text-white', price: 'text-white',
    priceSub: 'text-white/40', desc: 'text-white/50',
    feature: 'text-white/60', btn: 'bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A]',
  },
}

export default function AgentCard({
  tier, name, price, tagline, description,
  features, badge, buttonLabel, priceId,
}: AgentCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const s = styles[tier]

  // Iniciar Stripe Checkout para este plan
  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan: tier }),
      })
      const data: { url?: string; error?: string } = await res.json()
      if (data.error) throw new Error(data.error)
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${s.card}`}>
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-[#00C48C] text-[#0D1B2A] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
            {badge}
          </span>
        </div>
      )}

      {/* Icono */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${s.icon}`}>
        {iconMap[tier]}
      </div>

      {/* Nombre y tagline */}
      <h3 className={`text-lg font-bold mb-0.5 ${s.title}`}>{name}</h3>
      <p className="text-xs font-semibold text-[#00C48C] mb-4">{tagline}</p>

      {/* Precio */}
      <div className="mb-5">
        <span className={`text-4xl font-extrabold tracking-tight ${s.price}`}>
          {price.toFixed(2).replace('.', ',')}€
        </span>
        <span className={`text-sm ml-1 ${s.priceSub}`}>/mes</span>
      </div>

      {/* Descripción */}
      <p className={`text-sm leading-relaxed mb-5 ${s.desc}`}>{description}</p>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00C48C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={s.feature}>{f}</span>
          </li>
        ))}
      </ul>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mb-3 text-center">{error}</p>
      )}

      {/* Botón CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-70 ${s.btn}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Procesando...
          </span>
        ) : buttonLabel}
      </button>
    </div>
  )
}
