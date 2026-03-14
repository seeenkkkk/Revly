import Link from 'next/link'
import Image from 'next/image'
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
            <Image src="/images/logo.png.png" alt="Revly" width={32} height={32} className="h-8 w-auto" />
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
            Para negocios con WhatsApp Business
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.06] tracking-tight max-w-4xl mb-6">
          Vende en WhatsApp{' '}
          <span className="text-[#22c55e]">mientras duermes</span>
        </h1>

        <p className="text-white/50 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Configura tu agente en minutos. Él responde, califica y cierra
          mientras tú haces otra cosa.
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
          <div className="text-center mb-10">
            <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest mb-3">Funciones</p>
            <h2 className="text-4xl font-extrabold tracking-tight">Construido para vender</h2>
          </div>

          {/* Agent avatar */}
          <div className="flex justify-center mb-14">
            <div className="relative inline-flex">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl shadow-black/40">
                <Image src="/images/avatar.png.png" alt="Agente Revly" width={80} height={80} className="w-full h-full object-cover" />
              </div>
              <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center ring-2 ring-[#0D1B2A]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                ),
                title: 'Respuestas 24/7',
                desc: 'Tu negocio sigue vendiendo mientras comes, duermes o te tomas vacaciones. Sin excepciones.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                    <polyline points="16 7 22 7 22 13"/>
                  </svg>
                ),
                title: 'Cierra ventas solo',
                desc: 'No solo responde: identifica quién está listo para comprar y lleva la conversación hasta que pague.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
                  </svg>
                ),
                title: 'Listo en 10 minutos',
                desc: 'Describes tu producto en lenguaje natural. El agente aprende y empieza a vender. Sin configuración técnica.',
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
      <footer className="border-t border-white/[0.07] py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            {/* Brand */}
            <div className="flex flex-col gap-4 max-w-xs">
              <Link href="/" className="inline-flex">
                <Image src="/images/logo-completo.png.png" alt="Revly" width={120} height={32} className="h-8 w-auto" />
              </Link>
              <p className="text-white/35 text-sm leading-relaxed">
                Agentes de IA para WhatsApp Business. Vende más sin contratar más.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-12 sm:gap-16">
              <div className="flex flex-col gap-3">
                <p className="text-white/25 text-xs font-semibold uppercase tracking-widest mb-1">Producto</p>
                <a href="#como-funciona" className="text-white/45 hover:text-white/80 text-sm transition-colors">Cómo funciona</a>
                <a href="#funciones" className="text-white/45 hover:text-white/80 text-sm transition-colors">Funciones</a>
                <a href="#precios" className="text-white/45 hover:text-white/80 text-sm transition-colors">Precios</a>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-white/25 text-xs font-semibold uppercase tracking-widest mb-1">Legal</p>
                <Link href="/privacy" className="text-white/45 hover:text-white/80 text-sm transition-colors">Privacidad</Link>
                <Link href="/terms" className="text-white/45 hover:text-white/80 text-sm transition-colors">Términos</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6">
            <p className="text-white/20 text-sm">© 2026 Revly. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
