'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function PricingSection({ plans }: { plans: Plan[] }) {
  return (
    <section id="precios" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest mb-3">Precios</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Sin sorpresas
          </h2>
          <p className="text-white/45 text-base">Sin permanencia. Cancela cuando quieras.</p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {plans.map(({ key, name, price, tagline, features, highlighted, badge, cta }) => (
            <motion.div key={key} variants={cardVariants}>
              <div
                className={`relative flex flex-col rounded-2xl p-7 h-full transition-all duration-300 ${
                  highlighted
                    ? 'bg-[#22c55e]/10 border-2 border-[#22c55e]/60 shadow-xl shadow-[#22c55e]/10 backdrop-blur-sm'
                    : 'bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                {/* Badge */}
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#22c55e] text-[#0D1B2A] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg shadow-[#22c55e]/30">
                      {badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlighted ? 'text-[#22c55e]' : 'text-white/40'}`}>
                  {tagline}
                </p>
                <h3 className="text-xl font-bold text-white mb-5">{name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="font-mono text-5xl font-extrabold tracking-tight text-white">
                    {price.toFixed(2).replace('.', ',')}€
                  </span>
                  <span className="text-white/35 text-sm ml-1.5">/mes</span>
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${highlighted ? 'bg-[#22c55e]/25' : 'bg-white/[0.08]'}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: highlighted ? '#22c55e' : '#22c55e' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/60">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/dashboard/agentes"
                  className={`w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    highlighted
                      ? 'bg-[#22c55e] hover:bg-[#16a34a] text-[#0D1B2A] shadow-lg shadow-[#22c55e]/25 hover:shadow-[#22c55e]/40'
                      : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
