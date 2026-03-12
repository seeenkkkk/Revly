import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { PLANS } from '@/lib/stripe'
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
      badge: 'Más rentable',
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
    <main className="min-h-screen bg-[#0D1B2A] text-white">

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A]/85 backdrop-blur-md border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <span className="text-[#0D1B2A] font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg tracking-tight">revly</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-white/50 hover:text-white text-sm transition-colors">
              Cómo funciona
            </a>
            <a href="#funciones" className="text-white/50 hover:text-white text-sm transition-colors">
              Funciones
            </a>
            <a href="#precios" className="text-white/50 hover:text-white text-sm transition-colors">
              Precios
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <span className="text-white/40 text-sm hidden sm:block">{userEmail}</span>
                <Link
                  href="/dashboard/agentes"
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-[#0D1B2A] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/agentes"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/dashboard/agentes"
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-[#0D1B2A] font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-lg shadow-[#22c55e]/20"
                >
                  Empezar gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,_#22c55e12_0%,_transparent_70%)] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse flex-shrink-0" />
          <span className="text-[#22c55e] text-xs font-semibold whitespace-nowrap">
            Agente de ventas por WhatsApp con IA
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.06] tracking-tight max-w-4xl mb-6">
          Vende en WhatsApp{' '}
          <span className="text-[#22c55e]">mientras duermes</span>
        </h1>

        <p className="text-white/50 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Un agente de IA atiende a tus clientes, responde dudas y cierra ventas
          las 24 horas. Sin código. Sin esperas.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/dashboard/agentes"
            className="bg-[#22c55e] hover:bg-[#16a34a] text-[#0D1B2A] font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-xl shadow-[#22c55e]/25"
          >
            Empezar gratis →
          </Link>
          <a
            href="#como-funciona"
            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-8 py-4 rounded-xl text-base transition-all"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Dashboard mockup */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
            {/* Browser bar */}
            <div className="bg-[#111E2D] px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]/60" />
              <div className="flex-1 mx-4 bg-white/[0.05] rounded-md h-6 flex items-center px-3">
                <span className="text-white/25 text-xs font-mono">app.revly.io/dashboard</span>
              </div>
            </div>
            {/* App UI */}
            <div className="bg-[#F8F9FA] flex" style={{ minHeight: 340 }}>
              {/* Sidebar */}
              <div className="bg-[#0D1B2A] flex flex-col gap-1 p-3 flex-shrink-0" style={{ width: 180 }}>
                <div className="h-8 w-20 bg-[#22c55e]/20 rounded-lg mb-4" />
                {['Mis Agentes', 'Funcionamiento', 'Analítica', 'Configuración'].map((item, i) => (
                  <div key={item} className={`h-8 rounded-lg flex items-center px-3 gap-2 ${i === 0 ? 'bg-[#22c55e]/15' : ''}`}>
                    <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${i === 0 ? 'bg-[#22c55e]' : 'bg-white/10'}`} />
                    <div className={`h-2 rounded flex-1 ${i === 0 ? 'bg-[#22c55e]/40' : 'bg-white/10'}`} />
                  </div>
                ))}
              </div>
              {/* Main */}
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { v: '87', l: 'Conversaciones' },
                    { v: '38%', l: 'Conversión' },
                    { v: '2', l: 'Agentes' },
                    { v: '87%', l: 'Uso del plan' },
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <p className="text-[#0D1B2A] font-extrabold text-xl">{v}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1">
                  <div className="h-3 w-36 bg-gray-200 rounded mb-4" />
                  <div className="flex items-end gap-2 h-24">
                    {[35, 60, 45, 80, 55, 90].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, backgroundColor: i === 5 ? '#22c55e' : '#22c55e33' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS (Client Component — Framer Motion)
      ========================================================= */}
      <HowItWorks />

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section id="funciones" className="py-24 px-6 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest mb-3">Funciones</p>
            <h2 className="text-4xl font-extrabold tracking-tight">Todo lo que necesitas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: 'Respuestas 24/7',
                desc: 'Tu agente nunca duerme. Atiende clientes a cualquier hora, sin fallos ni retrasos.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                  </svg>
                ),
                title: 'Cierra ventas solo',
                desc: 'Detecta intención de compra, supera objeciones y guía al cliente hasta el pago.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                  </svg>
                ),
                title: 'Sin configuración técnica',
                desc: 'Escribe el prompt de tu negocio, conecta WhatsApp y listo. Sin código.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 hover:border-[#22c55e]/30 hover:bg-white/[0.06] transition-all duration-200 backdrop-blur-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRICING (Client Component — Framer Motion)
      ========================================================= */}
      <PricingSection plans={pricingPlans} />

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/[0.07] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#22c55e] rounded-md flex items-center justify-center">
              <span className="text-[#0D1B2A] font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-base tracking-tight">revly</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/35 hover:text-white/70 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/35 hover:text-white/70 text-sm transition-colors">Terms</Link>
          </div>

          <p className="text-white/25 text-sm">© 2025 Revly. Todos los derechos reservados.</p>
        </div>
      </footer>

    </main>
  )
}
