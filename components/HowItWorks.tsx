'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    step: '01',
    title: 'Cliente escribe',
    desc: 'Tu cliente manda un mensaje por WhatsApp a cualquier hora.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    step: '02',
    title: 'Menos de 2 segundos',
    desc: 'El agente responde al instante, 24/7. Sin tiempos de espera, sin errores.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
    step: '03',
    title: 'Solo los que van a comprar',
    desc: 'Filtra leads fríos automáticamente. Solo avanza con quienes tienen intención real.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    step: '04',
    title: 'El pitch exacto',
    desc: 'Adapta la propuesta al perfil del cliente. El mensaje correcto en el momento correcto.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    step: '05',
    title: 'Cobras sin salir de WhatsApp',
    desc: 'El cliente paga directamente en el chat. Sin redirects, sin fricciones.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    step: '06',
    title: 'Dinero en tu cuenta',
    desc: 'Recibes una notificación. La venta ya está cerrada.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest mb-3">
            Cómo funciona
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            De mensaje a venta,{' '}
            <span className="text-[#22c55e]">en segundos</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Tu agente ejecuta este flujo completo. Tú solo recibes la notificación.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {STEPS.map(({ icon, step, title, desc }, i) => (
            <motion.div key={step} variants={itemVariants}>
              <div className="relative group rounded-2xl p-6 border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:border-[#22c55e]/25 hover:bg-white/[0.06] transition-all duration-300 h-full">
                {/* Step number */}
                <span className="font-mono text-xs font-bold mb-5 block text-white/20">
                  {step}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-[#22c55e]/10 border border-[#22c55e]/20">
                  {icon}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>

                {/* Connector line for non-last items on desktop */}
                {i < STEPS.length - 1 && (i + 1) % 3 !== 0 && (
                  <div className="hidden lg:block absolute top-[52px] -right-[10px] w-[20px] h-px bg-[#22c55e]/20" />
                )}

                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px #22c55e08' }} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="#precios"
            className="inline-flex items-center gap-2 text-[#22c55e] text-sm font-semibold hover:underline underline-offset-4"
          >
            Ver planes y precios
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
