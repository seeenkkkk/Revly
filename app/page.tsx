import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabase } from '@/lib/supabase-server'
import { PLANS } from '@/lib/stripe'
import LandingNav from '@/components/LandingNav'
import HowItWorks from '@/components/HowItWorks'
import PricingSection from '@/components/PricingSection'

export default async function LandingPage() {
  let userEmail: string | null = null
  try {
    const supabase = createServerSupabase()
    const { data } = await supabase.auth.getSession()
    userEmail = data.session?.user?.email ?? null
  } catch {
    // dev mode
  }

  const pricingPlans = [
    {
      key: 'essential',
      name: PLANS.essential.name,
      price: PLANS.essential.price,
      tagline: PLANS.essential.tagline,
      features: PLANS.essential.features,
      highlighted: false,
      cta: 'Empezar con Starter',
    },
    {
      key: 'growth',
      name: PLANS.growth.name,
      price: PLANS.growth.price,
      tagline: PLANS.growth.tagline,
      features: PLANS.growth.features,
      highlighted: true,
      badge: 'Más popular',
      cta: 'Empezar con Growth',
    },
    {
      key: 'partner',
      name: PLANS.partner.name,
      price: PLANS.partner.price,
      tagline: PLANS.partner.tagline,
      features: PLANS.partner.features,
      highlighted: false,
      cta: 'Contratar Enterprise',
    },
  ]

  return (
    <main className="min-h-screen bg-white text-[#0f172a]">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <LandingNav userEmail={userEmail} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full flex-shrink-0" />
              <span className="text-[#2563eb] text-xs font-semibold">
                Para negocios con WhatsApp Business
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-[56px] sm:text-[64px] font-bold leading-[1.08] tracking-tight text-[#0f172a] mb-6">
              Tu agente de ventas{' '}
              <span className="text-[#2563eb]">en WhatsApp, 24/7</span>
            </h1>

            <p className="text-[#64748b] text-lg leading-relaxed max-w-xl mb-10">
              Configura tu agente en minutos. Responde, califica y cierra
              ventas mientras tú haces otra cosa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/agentes"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors"
              >
                Empieza gratis →
              </Link>
              <a
                href="#como-funciona"
                className="border border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#0f172a] font-medium px-6 py-3 rounded-lg text-sm transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          {/* Dashboard mockup — light */}
          <div className="relative mx-auto max-w-5xl">
            {/* logo2 badge flotante */}
            <div className="absolute -top-5 -left-4 z-10 hidden md:flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <Image src="/images/logo2.png.png" alt="" width={20} height={20} className="h-5 w-auto" />
              <span className="text-[#0f172a] text-xs font-semibold">Revly</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              {/* Browser bar */}
              <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#fca5a5]" />
                <span className="w-3 h-3 rounded-full bg-[#fcd34d]" />
                <span className="w-3 h-3 rounded-full bg-[#86efac]" />
                <div className="flex-1 mx-4 bg-white border border-[#e2e8f0] rounded-md h-6 flex items-center px-3">
                  <span className="text-[#94a3b8] text-xs font-mono">app.revly.io/dashboard</span>
                </div>
              </div>

              {/* App UI — light theme */}
              <div className="bg-white flex" style={{ minHeight: 320 }}>
                {/* Sidebar */}
                <div className="bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col gap-1 p-3 flex-shrink-0" style={{ width: 176 }}>
                  <div className="h-7 w-16 bg-[#dbeafe] rounded-md mb-4" />
                  {['Mis Agentes', 'Analítica', 'Configuración', 'Soporte'].map((item, i) => (
                    <div
                      key={item}
                      className={`h-8 rounded-lg flex items-center px-3 gap-2 ${
                        i === 0 ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#94a3b8]'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-[#2563eb]' : 'bg-[#e2e8f0]'}`} />
                      <div className={`h-2 rounded flex-1 ${i === 0 ? 'bg-[#bfdbfe]' : 'bg-[#e2e8f0]'}`} />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-6 flex flex-col gap-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { v: '1.247', l: 'Conversaciones' },
                      { v: '41%', l: 'Conversión' },
                      { v: '3', l: 'Agentes activos' },
                      { v: '€ 8.490', l: 'Ventas este mes' },
                    ].map(({ v, l }) => (
                      <div key={l} className="bg-white rounded-lg p-3 border border-[#e2e8f0]">
                        <p className="text-[#0f172a] font-bold text-lg">{v}</p>
                        <p className="text-[#94a3b8] text-xs mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-[#e2e8f0] flex-1">
                    <div className="h-2.5 w-32 bg-[#f1f5f9] rounded mb-4" />
                    <div className="flex items-end gap-2 h-20">
                      {[40, 65, 50, 85, 60, 75, 95].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 6 ? '#2563eb' : '#dbeafe',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ─────────────────────────────────── */}
      <section className="py-10 px-6 border-y border-[#e2e8f0] bg-[#f8fafc]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {[
            { v: '+1.200', l: 'negocios activos' },
            { v: '< 2s', l: 'tiempo de respuesta' },
            { v: '41%', l: 'tasa de conversión media' },
            { v: '24/7', l: 'sin interrupciones' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[#0f172a] font-bold text-2xl tracking-tight">{v}</span>
              <span className="text-[#64748b] text-sm">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <HowItWorks />

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="funciones" className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-[1200px] mx-auto">

          <div className="text-center mb-14">
            <p className="text-[#2563eb] text-xs font-semibold uppercase tracking-widest mb-3">
              Funciones
            </p>
            <h2 className="text-[38px] font-semibold tracking-tight text-[#0f172a] mb-4">
              Construido para cerrar ventas
            </h2>
            <p className="text-[#64748b] text-base max-w-lg mx-auto">
              Cada función apunta a un único objetivo: que tus clientes paguen
              sin que tengas que intervenir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
                title: 'Respuestas 24/7',
                desc: 'Tu negocio responde al instante aunque sea domingo a las 3 AM. Sin excepciones ni tiempos de espera.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                  </svg>
                ),
                title: 'Cierra ventas solo',
                desc: 'Detecta intención de compra, gestiona objeciones y conduce al cliente hasta el pago. Sin ayuda.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                ),
                title: 'Califica automático',
                desc: 'Filtra leads fríos antes de que lleguen a ti. Solo ves los clientes con intención real de compra.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                ),
                title: 'Cobro en el chat',
                desc: 'El cliente paga directamente en WhatsApp. Sin salir de la conversación, sin pasos extra.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                ),
                title: 'Prompt en lenguaje natural',
                desc: 'Describes tu negocio con tus palabras. El agente aprende y empieza a vender. Sin código.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                title: 'Analítica en tiempo real',
                desc: 'Ve qué conversaciones convierten, qué objeciones frenan y dónde mejorar el pitch.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-[#e2e8f0] rounded-xl p-8 hover:border-[#2563eb]/30 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center mb-5 text-[#2563eb]">
                  {icon}
                </div>
                <h3 className="text-[#0f172a] font-semibold text-base mb-2">{title}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <PricingSection plans={pricingPlans} />

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#e2e8f0] py-16 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">

            {/* Brand */}
            <div className="flex flex-col gap-4 max-w-sm">
              <Link href="/" className="inline-flex">
                <Image
                  src="/images/logo-completo.png.png"
                  alt="Revly"
                  width={140}
                  height={40}
                  className="h-9 w-auto"
                />
              </Link>
              <p className="text-[#64748b] text-sm leading-relaxed">
                Agentes de IA para WhatsApp Business.<br />
                Vende más sin contratar más.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-16 sm:gap-24">
              <div className="flex flex-col gap-3">
                <p className="text-[#0f172a] text-xs font-semibold uppercase tracking-widest mb-1">
                  Producto
                </p>
                <a href="#como-funciona" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
                  Cómo funciona
                </a>
                <a href="#funciones" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
                  Funciones
                </a>
                <a href="#precios" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
                  Precios
                </a>
                <Link href="/dashboard/agentes" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
                  Acceder
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#0f172a] text-xs font-semibold uppercase tracking-widest mb-1">
                  Legal
                </p>
                <Link href="/privacy" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
                  Privacidad
                </Link>
                <Link href="/terms" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
                  Términos de uso
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-8">
            <p className="text-[#94a3b8] text-sm">
              © 2026 Revly. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </main>
  )
}
