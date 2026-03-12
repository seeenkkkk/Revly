import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase-server'
import { PLANS } from '@/lib/stripe'

export default async function LandingPage() {
  let userEmail: string | null = null
  try {
    const supabase = createServerSupabase()
    const { data } = await supabase.auth.getSession()
    userEmail = data.session?.user?.email ?? null
  } catch {
    // dev mode
  }

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white">

      {/* =========================================================
          1. NAVBAR
      ========================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#00C48C] rounded-lg flex items-center justify-center">
              <span className="text-[#0D1B2A] font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg tracking-tight">revly</span>
          </Link>

          {/* Center links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-white/60 hover:text-white text-sm transition-colors">
              Cómo funciona
            </a>
            <a href="#funciones" className="text-white/60 hover:text-white text-sm transition-colors">
              Funciones
            </a>
            <a href="#precios" className="text-white/60 hover:text-white text-sm transition-colors">
              Precios
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {userEmail ? (
              <>
                <span className="text-white/50 text-sm hidden sm:block">{userEmail}</span>
                <Link
                  href="/dashboard/agentes"
                  className="bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/agentes"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/dashboard/agentes"
                  className="bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
                >
                  Empezar gratis
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* =========================================================
          2. HERO
      ========================================================= */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#00C48C18_0%,_transparent_65%)] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#00C48C]/10 border border-[#00C48C]/25 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-[#00C48C] rounded-full animate-pulse flex-shrink-0" />
          <span className="text-[#00C48C] text-xs font-semibold whitespace-nowrap">Agente de ventas por WhatsApp con IA</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight max-w-4xl mb-6">
          Vende en WhatsApp{' '}
          <span className="text-[#00C48C]">mientras duermes</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/55 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Un agente de IA atiende a tus clientes, responde dudas y cierra ventas
          las 24 horas. Sin código. Sin esperas.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/dashboard/agentes"
            className="bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-105 shadow-lg shadow-[#00C48C]/20"
          >
            Empezar gratis →
          </Link>
          <a
            href="#como-funciona"
            className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-8 py-4 rounded-xl text-base transition-all"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Dashboard mockup */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
            {/* Browser chrome */}
            <div className="bg-[#111E2D] px-4 py-3 flex items-center gap-2 border-b border-white/[0.07]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-white/[0.06] rounded-md h-6 flex items-center px-3">
                <span className="text-white/30 text-xs">app.revly.io/dashboard</span>
              </div>
            </div>
            {/* Mockup body */}
            <div className="bg-[#F8F9FA] flex" style={{ minHeight: 340 }}>
              {/* Sidebar mock */}
              <div className="bg-[#0D1B2A] flex flex-col gap-1 p-3 flex-shrink-0" style={{ width: 180 }}>
                <div className="h-8 w-20 bg-[#00C48C]/20 rounded-lg mb-4" />
                {['Mis Agentes', 'Funcionamiento', 'Analítica', 'Configuración'].map((item, i) => (
                  <div
                    key={item}
                    className={`h-8 rounded-lg flex items-center px-3 gap-2 ${i === 0 ? 'bg-[#00C48C]/15' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-sm flex-shrink-0 ${i === 0 ? 'bg-[#00C48C]' : 'bg-white/10'}`} />
                    <div className={`h-2 rounded flex-1 ${i === 0 ? 'bg-[#00C48C]/40' : 'bg-white/10'}`} />
                  </div>
                ))}
              </div>
              {/* Main content mock */}
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { v: '42', l: 'Conversaciones' },
                    { v: '34%', l: 'Conversión' },
                    { v: '2', l: 'Agentes' },
                    { v: '84%', l: 'Uso del plan' },
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <p className="text-[#0D1B2A] font-extrabold text-xl">{v}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1">
                  <div className="h-3 w-32 bg-gray-200 rounded mb-4" />
                  <div className="flex items-end gap-2 h-24">
                    {[40, 65, 50, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#00C48C]/20 rounded-t-md" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. HOW IT WORKS
      ========================================================= */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00C48C] text-xs font-semibold uppercase tracking-widest mb-3">Cómo funciona</p>
            <h2 className="text-4xl font-bold">Así de simple</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                step: '01',
                label: 'Cliente escribe',
                desc: 'Tu cliente te manda un mensaje por WhatsApp',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v2.5M12 19.5V22M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2 12h2.5M19.5 12H22M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77" />
                  </svg>
                ),
                step: '02',
                label: 'Agente responde',
                desc: 'La IA responde al instante, califica y convence',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
                step: '03',
                label: 'Tú cobras',
                desc: 'La venta se cierra y el dinero llega a tu cuenta',
              },
            ].map(({ icon, step, label, desc }, i) => (
              <div key={step} className="flex flex-col md:flex-row items-center flex-1">
                <div className="flex flex-col items-center text-center px-8 py-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#00C48C]/10 border border-[#00C48C]/20 flex items-center justify-center mb-4">
                    {icon}
                  </div>
                  <span className="text-[#00C48C] font-mono text-xs font-bold mb-2">{step}</span>
                  <h3 className="text-lg font-bold mb-1">{label}</h3>
                  <p className="text-white/45 text-sm leading-snug max-w-[180px]">{desc}</p>
                </div>
                {/* Arrow between steps */}
                {i < 2 && (
                  <div className="hidden md:flex items-center flex-shrink-0 text-white/20">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. FEATURES
      ========================================================= */}
      <section id="funciones" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00C48C] text-xs font-semibold uppercase tracking-widest mb-3">Funciones</p>
            <h2 className="text-4xl font-bold">Todo lo que necesitas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: 'Respuestas 24/7',
                desc: 'Tu agente nunca duerme. Atiende a clientes a cualquier hora del día, incluso festivos.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                ),
                title: 'Cierra ventas solo',
                desc: 'Detecta la intención de compra, supera objeciones y guía al cliente hasta el pago.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                ),
                title: 'Sin configuración técnica',
                desc: 'Escribe el prompt de tu negocio, conecta WhatsApp y listo. Sin código ni integraciones complejas.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:border-[#00C48C]/30 hover:bg-white/[0.06] transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#00C48C]/10 flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          5. PRICING
      ========================================================= */}
      <section id="precios" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#00C48C] text-xs font-semibold uppercase tracking-widest mb-3">Precios</p>
            <h2 className="text-4xl font-bold mb-3">Sin sorpresas</h2>
            <p className="text-white/50 text-base">Sin permanencia. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {[
              {
                key: 'essential',
                name: PLANS.essential.name,
                price: PLANS.essential.price,
                features: PLANS.essential.features,
                highlighted: false,
                cta: 'Empezar con Essential',
              },
              {
                key: 'growth',
                name: PLANS.growth.name,
                price: PLANS.growth.price,
                features: PLANS.growth.features,
                highlighted: true,
                badge: 'Más popular',
                cta: 'Empezar con Growth',
              },
              {
                key: 'partner',
                name: PLANS.partner.name,
                price: PLANS.partner.price,
                features: PLANS.partner.features,
                highlighted: false,
                cta: 'Contratar Partner',
              },
            ].map(({ key, name, price, features, highlighted, badge, cta }) => (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl p-7 transition-all ${
                  highlighted
                    ? 'bg-[#00C48C] text-[#0D1B2A] shadow-xl shadow-[#00C48C]/25'
                    : 'bg-white/[0.04] border border-white/10 text-white'
                }`}
              >
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0D1B2A] text-[#00C48C] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap border border-[#00C48C]/30">
                      {badge}
                    </span>
                  </div>
                )}

                <h3 className={`text-lg font-bold mb-1 ${highlighted ? 'text-[#0D1B2A]' : 'text-white'}`}>{name}</h3>
                <div className="mb-6 mt-3">
                  <span className={`text-4xl font-extrabold tracking-tight ${highlighted ? 'text-[#0D1B2A]' : 'text-white'}`}>
                    {price.toFixed(2).replace('.', ',')}€
                  </span>
                  <span className={`text-sm ml-1 ${highlighted ? 'text-[#0D1B2A]/60' : 'text-white/40'}`}>/mes</span>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? 'text-[#0D1B2A]' : 'text-[#00C48C]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={highlighted ? 'text-[#0D1B2A]/80' : 'text-white/60'}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard/agentes"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    highlighted
                      ? 'bg-[#0D1B2A] hover:bg-[#162436] text-white'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          6. FOOTER
      ========================================================= */}
      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#00C48C] rounded-md flex items-center justify-center">
              <span className="text-[#0D1B2A] font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-base tracking-tight">revly</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Terms
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-white/30 text-sm">© 2025 Revly. Todos los derechos reservados.</p>
        </div>
      </footer>

    </main>
  )
}
