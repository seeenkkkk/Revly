'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'

interface Plan {
  key: string
  name: string
  price: number
  tagline: string
  features: string[]
  highlighted: boolean
  badge?: string
  cta: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

export default function PricingSection({ plans }: { plans: Plan[] }) {
  return (
    <section id="precios" className="py-24 px-6 bg-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#2563eb] text-xs font-semibold uppercase tracking-widest mb-3">Precios</p>
          <h2 className="text-[38px] font-semibold tracking-tight text-[#0f172a] mb-3">
            Sin permanencia
          </h2>
          <p className="text-[#64748b] text-base">
            Cancela cuando quieras. Sin letra pequeña.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(({ key, name, price, tagline, features, highlighted, badge, cta }, i) => (
            <motion.div
              key={key}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <div
                className={`relative flex flex-col rounded-xl p-8 h-full transition-all duration-200 ${
                  highlighted
                    ? 'bg-[#2563eb] text-white border border-[#2563eb]'
                    : 'bg-white border border-[#e2e8f0] hover:border-[#2563eb]/30'
                }`}
              >
                {/* Badge */}
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0f172a] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      {badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlighted ? 'text-blue-200' : 'text-[#64748b]'}`}>
                  {tagline}
                </p>
                <h3 className={`text-xl font-semibold mb-6 ${highlighted ? 'text-white' : 'text-[#0f172a]'}`}>
                  {name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-5xl font-bold tracking-tight ${highlighted ? 'text-white' : 'text-[#0f172a]'}`}>
                    {price.toFixed(2).replace('.', ',')}€
                  </span>
                  <span className={`text-sm ml-1.5 ${highlighted ? 'text-blue-200' : 'text-[#64748b]'}`}>/mes</span>
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${highlighted ? 'bg-white/20' : 'bg-[#e2e8f0]'}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${highlighted ? 'text-blue-200' : 'text-[#2563eb]'}`}
                        strokeWidth={2.5}
                      />
                      <span className={highlighted ? 'text-blue-50' : 'text-[#64748b]'}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/dashboard/agentes"
                  className={`w-full text-center py-3 rounded-lg font-medium text-sm transition-colors duration-200 ${
                    highlighted
                      ? 'bg-white text-[#2563eb] hover:bg-blue-50'
                      : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-[#94a3b8] text-sm mt-8">
          Todos los planes incluyen configuración asistida y soporte por email.
        </p>

      </div>
    </section>
  )
}
