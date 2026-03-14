'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  MessageSquare,
  Zap,
  SlidersHorizontal,
  Tag,
  CreditCard,
  BellRing,
} from 'lucide-react'

const STEPS = [
  {
    Icon: MessageSquare,
    step: '01',
    title: 'Cliente escribe',
    desc: 'Un mensaje en WhatsApp a cualquier hora.',
  },
  {
    Icon: Zap,
    step: '02',
    title: 'Respuesta en 2 segundos',
    desc: 'El agente contesta al instante, sin demoras ni errores.',
  },
  {
    Icon: SlidersHorizontal,
    step: '03',
    title: 'Solo los que compran',
    desc: 'Filtra leads fríos. Avanza solo con intención real.',
  },
  {
    Icon: Tag,
    step: '04',
    title: 'El pitch exacto',
    desc: 'Adapta la propuesta al perfil de ese cliente.',
  },
  {
    Icon: CreditCard,
    step: '05',
    title: 'Cobro en el chat',
    desc: 'El cliente paga sin salir de WhatsApp.',
  },
  {
    Icon: BellRing,
    step: '06',
    title: 'Dinero en tu cuenta',
    desc: 'Recibes la notificación. La venta ya está cerrada.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const, delay: i * 0.08 },
  }),
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-28 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
            Cómo funciona
          </p>
          <h2 className="text-[52px] font-black leading-[1.05] tracking-tight text-[#0f172a]">
            De mensaje a venta<br />
            <em className="italic font-black text-[#0d9488]">en segundos.</em>
          </h2>
        </div>

        {/* Split layout */}
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Steps grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map(({ Icon, step, title, desc }, i) => (
              <motion.div
                key={step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="flex gap-4 p-6 rounded-3xl border border-[#f1f5f9] bg-[#fafafa] hover:border-[#e2e8f0] hover:bg-white transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#0d9488] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <Icon size={17} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-widest mb-1">{step}</p>
                  <h3 className="text-[#0f172a] font-bold text-sm mb-1">{title}</h3>
                  <p className="text-[#64748b] text-xs leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phone mockup */}
          <motion.div
            className="flex-shrink-0 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            <div
              className="relative bg-[#0f172a] rounded-[44px] p-[10px]"
              style={{ width: 260 }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0f172a] rounded-b-2xl z-10" />

              {/* Screen */}
              <div className="bg-white rounded-[36px] overflow-hidden" style={{ minHeight: 460 }}>

                {/* WhatsApp header */}
                <div className="bg-[#0d9488] px-4 pt-8 pb-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                    <Image
                      src="/images/avatar.png.png"
                      alt="Agente Revly"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold leading-tight">Revly Agent</p>
                    <p className="text-white/60 text-[10px]">En línea ahora</p>
                  </div>
                </div>

                {/* Chat */}
                <div className="bg-[#f0f4f8] flex flex-col gap-2.5 p-3" style={{ minHeight: 340 }}>

                  <div className="self-start bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)] max-w-[82%]">
                    <p className="text-[#0f172a] text-xs leading-snug">
                      Hola, me interesa el plan Growth
                    </p>
                    <p className="text-[#94a3b8] text-[9px] mt-1">10:32</p>
                  </div>

                  <div className="self-end bg-[#0d9488] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                    <p className="text-white text-xs leading-snug">
                      ¡Hola! Growth incluye 1.500 conversaciones y analítica completa por 34,99€/mes. ¿Empezamos?
                    </p>
                    <p className="text-white/50 text-[9px] mt-1">10:32 ✓✓</p>
                  </div>

                  <div className="self-start bg-white rounded-2xl rounded-tl-sm px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)] max-w-[72%]">
                    <p className="text-[#0f172a] text-xs leading-snug">
                      Sí, quiero contratarlo ahora
                    </p>
                    <p className="text-[#94a3b8] text-[9px] mt-1">10:33</p>
                  </div>

                  <div className="self-end bg-[#0d9488] rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                    <p className="text-white text-xs leading-snug">
                      ✓ Pago procesado. Ya tienes acceso al dashboard.
                    </p>
                    <p className="text-white/50 text-[9px] mt-1">10:33 ✓✓</p>
                  </div>

                  <div className="self-center bg-white border border-[#e2e8f0] rounded-full px-3 py-1 mt-1">
                    <p className="text-[#0d9488] text-[10px] font-bold">Venta cerrada · € 34,99</p>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
