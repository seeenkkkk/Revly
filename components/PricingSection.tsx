'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

interface Plan {
  key: string
  name: string
  price: number
  tagline: string
  features: string[]
  highlighted: boolean
  badge?: string
  cta: string
  priceId?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

export default function PricingSection({
  plans,
  userLoggedIn,
}: {
  plans: Plan[]
  userLoggedIn?: boolean
}) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null)

  const handlePlanClick = async (plan: Plan) => {
    if (!userLoggedIn) {
      window.location.href = '/login'
      return
    }
    if (!plan.priceId) {
      window.location.href = '/dashboard/agentes'
      return
    }
    setLoadingKey(plan.key)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId, plan: plan.key }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Error')
      window.location.href = data.url
    } catch {
      setLoadingKey(null)
      window.location.href = '/dashboard/agentes'
    }
  }

  return (
    <section id="precios" className="py-28 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">Precios</p>
          <h2 className="text-[52px] font-black leading-[1.05] tracking-tight text-[#0f172a]">
            Sin permanencia.<br />
            <em className="italic font-black text-[#0d9488]">Sin letra pequeña.</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map(({ key, name, price, tagline, features, highlighted, badge, cta, priceId }, i) => (
            <motion.div
              key={key}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <div
                className={`relative flex flex-col rounded-3xl p-8 h-full transition-all duration-200 ${
                  highlighted
                    ? 'bg-[#0f172a] text-white border border-[#0f172a]'
                    : 'bg-white border border-[#e2e8f0] hover:border-[#0f172a]/20'
                }`}
              >
                {/* Badge */}
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0d9488] text-white text-[10px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap uppercase tracking-wider">
                      {badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${highlighted ? 'text-[#0d9488]' : 'text-[#64748b]'}`}>
                  {tagline}
                </p>
                <h3 className={`text-2xl font-black mb-6 tracking-tight ${highlighted ? 'text-white' : 'text-[#0f172a]'}`}>
                  {name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  {price === 0 ? (
                    <span className={`text-5xl font-black tracking-tight ${highlighted ? 'text-white' : 'text-[#0f172a]'}`}>
                      Gratis
                    </span>
                  ) : (
                    <>
                      <span className={`text-5xl font-black tracking-tight ${highlighted ? 'text-white' : 'text-[#0f172a]'}`}>
                        {price.toFixed(2).replace('.', ',')}€
                      </span>
                      <span className={`text-sm ml-1.5 ${highlighted ? 'text-white/50' : 'text-[#64748b]'}`}>/mes</span>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${highlighted ? 'bg-white/10' : 'bg-[#f1f5f9]'}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={15}
                        className="mt-0.5 flex-shrink-0 text-[#0d9488]"
                        strokeWidth={3}
                      />
                      <span className={highlighted ? 'text-white/80' : 'text-[#64748b]'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePlanClick({ key, name, price, tagline, features, highlighted, badge, cta, priceId })}
                  disabled={loadingKey === key}
                  className={`w-full text-center py-3.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 ${
                    highlighted
                      ? 'bg-[#0d9488] text-white hover:bg-[#0f766e]'
                      : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
                  }`}
                >
                  {loadingKey === key ? (
                    <><Loader2 size={13} className="animate-spin" />Redirigiendo...</>
                  ) : cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-[#94a3b8] text-sm mt-10">
          Todos los planes incluyen configuración asistida y soporte por email.
        </p>

      </div>
    </section>
  )
}
