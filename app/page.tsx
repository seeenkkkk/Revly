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
      priceId: PLANS.essential.priceId ?? '',
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
      priceId: PLANS.growth.priceId ?? '',
    },
    {
      key: 'partner',
      name: PLANS.partner.name,
      price: PLANS.partner.price,
      tagline: PLANS.partner.tagline,
      features: PLANS.partner.features,
      highlighted: false,
      cta: 'Contratar Enterprise',
      priceId: PLANS.partner.priceId ?? '',
    },
  ]

  return (
    <main className="min-h-screen bg-white text-[#0f172a]">
      <style>{`
        @keyframes blob1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.08); }
          66%      { transform: translate(-25px,20px) scale(0.94); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-35px,25px) scale(1.06); }
          66%      { transform: translate(30px,-20px) scale(0.96); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px,30px) scale(1.04); }
        }
        .blob-1 { animation: blob1 20s ease-in-out infinite; }
        .blob-2 { animation: blob2 26s ease-in-out infinite; }
        .blob-3 { animation: blob3 18s ease-in-out infinite; }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <LandingNav userEmail={userEmail} />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        {/* Animated blobs */}
        <div className="blob-1 absolute top-24 left-[10%] w-[520px] h-[520px] bg-[#0d9488]/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="blob-2 absolute top-40 right-[8%] w-[420px] h-[420px] bg-[#0f172a]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="blob-3 absolute bottom-10 left-1/2 w-[340px] h-[340px] bg-[#0d9488]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1100px] mx-auto relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f0fdfa] border border-[#99f6e4] rounded-full px-4 py-2 mb-10">
              <span className="w-1.5 h-1.5 bg-[#0d9488] rounded-full flex-shrink-0 animate-pulse" />
              <span className="text-[#0d9488] text-[11px] font-bold uppercase tracking-widest">
                Para negocios con WhatsApp Business
              </span>
            </div>

            {/* H1 — massive bold with italic accent */}
            <h1 className="text-[68px] sm:text-[84px] font-black leading-[1.0] tracking-tight text-[#0f172a] mb-8">
              Tu agente de ventas<br />
              <em className="italic font-black bg-gradient-to-r from-[#0d9488] via-[#0f9d7e] to-[#059669] bg-clip-text text-transparent">
                en WhatsApp, 24/7
              </em>
            </h1>

            <p className="text-[#64748b] text-lg leading-relaxed max-w-lg mb-12">
              Configura tu agente en minutos. Responde, califica y cierra
              ventas mientras tú haces otra cosa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link
                href="/login"
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold px-8 py-4 rounded-full text-[13px] uppercase tracking-wider transition-colors"
              >
                Empieza ahora →
              </Link>
              <a
                href="#como-funciona"
                className="border border-[#e2e8f0] hover:border-[#cbd5e1] bg-white text-[#64748b] hover:text-[#0f172a] font-semibold px-8 py-4 rounded-full text-[13px] uppercase tracking-wider transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>

            {/* Social proof mini */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2.5">
                {['#0d9488','#0f172a','#475569','#0f766e','#1e293b'].map((bg, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    {['M','A','R','I','O'][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[#64748b] text-xs font-medium">Más de <span className="text-[#0f172a] font-bold">1.200 negocios</span> ya lo usan</p>
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto max-w-5xl">
            {/* Floating badge */}
            <div className="absolute -top-5 -left-4 z-10 hidden md:flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-2xl px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              <Image src="/images/logo2.png.png" alt="" width={20} height={20} className="h-5 w-auto" />
              <span className="text-[#0f172a] text-xs font-bold">Revly</span>
            </div>

            {/* Floating live chat card */}
            <div className="absolute -bottom-8 -right-6 z-20 hidden lg:block w-[230px] bg-[#0f172a] rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.28)] overflow-hidden border border-white/[0.07]">
              {/* Header */}
              <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-white/[0.07]">
                <div className="relative flex-shrink-0">
                  <Image
                    src="/images/avatar.png.png"
                    alt="Revly Agent"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#0d9488] rounded-full ring-[1.5px] ring-[#0f172a]" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-[12px] font-bold leading-none">Tu agente</p>
                  <p className="text-[#0d9488] text-[10px] mt-0.5">● En línea ahora</p>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="px-3 py-3 space-y-2">
                <div className="flex justify-start">
                  <div className="bg-white/[0.08] rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[85%]">
                    <p className="text-white/70 text-[10.5px] leading-snug">Hola! ¿cuánto cuesta el servicio? 👋</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#0d9488] rounded-xl rounded-tr-sm px-2.5 py-2 max-w-[85%]">
                    <p className="text-white text-[10.5px] leading-snug">¡Hola! Tenemos planes desde 14,99€/mes, con 14 días gratis 🎯</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white/[0.08] rounded-xl rounded-tl-sm px-2.5 py-2 max-w-[85%]">
                    <p className="text-white/70 text-[10.5px] leading-snug">Perfecto, me apunto 🙌</p>
                  </div>
                </div>
                {/* Typing indicator */}
                <div className="flex justify-end">
                  <div className="bg-[#0d9488]/80 rounded-xl rounded-tr-sm px-3 py-2 flex gap-1 items-center">
                    <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>

              {/* Stat strip */}
              <div className="px-3 pb-3">
                <div className="bg-white/[0.05] rounded-xl px-3 py-1.5 flex items-center justify-between">
                  <span className="text-white/30 text-[9px] uppercase tracking-wider">conversión</span>
                  <span className="text-[#0d9488] text-[11px] font-black">+41% 📈</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-[#e2e8f0]">
              {/* Browser bar */}
              <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#fca5a5]" />
                <span className="w-3 h-3 rounded-full bg-[#fcd34d]" />
                <span className="w-3 h-3 rounded-full bg-[#86efac]" />
                <div className="flex-1 mx-4 bg-white border border-[#e2e8f0] rounded-lg h-6 flex items-center px-3">
                  <span className="text-[#94a3b8] text-xs font-mono">app.revly.io/dashboard</span>
                </div>
              </div>

              {/* App UI */}
              <div className="bg-white flex" style={{ minHeight: 320 }}>
                {/* Sidebar */}
                <div className="bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col gap-1 p-3 flex-shrink-0" style={{ width: 176 }}>
                  <div className="h-7 w-16 bg-[#ccfbf1] rounded-lg mb-4" />
                  {['Mis Agentes', 'Analítica', 'Configuración', 'Soporte'].map((item, i) => (
                    <div
                      key={item}
                      className={`h-8 rounded-xl flex items-center px-3 gap-2 ${
                        i === 0 ? 'bg-[#f0fdfa] text-[#0d9488]' : 'text-[#94a3b8]'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-[#0d9488]' : 'bg-[#e2e8f0]'}`} />
                      <div className={`h-2 rounded flex-1 ${i === 0 ? 'bg-[#99f6e4]' : 'bg-[#e2e8f0]'}`} />
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
                      <div key={l} className="bg-white rounded-xl p-3 border border-[#f1f5f9]">
                        <p className="text-[#0f172a] font-black text-lg">{v}</p>
                        <p className="text-[#94a3b8] text-xs mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#f1f5f9] flex-1">
                    <div className="h-2.5 w-32 bg-[#f1f5f9] rounded mb-4" />
                    <div className="flex items-end gap-2 h-20">
                      {[40, 65, 50, 85, 60, 75, 95].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 6 ? '#0d9488' : '#ccfbf1',
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
      <section className="py-14 px-6 bg-[#fafafa] border-y border-[#f1f5f9] overflow-hidden">
        {/* Stats row */}
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-20 mb-10">
          {[
            { v: '+1.200', l: 'negocios activos' },
            { v: '< 2s', l: 'tiempo de respuesta' },
            { v: '41%', l: 'tasa de conversión media' },
            { v: '24/7', l: 'sin interrupciones' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[#0f172a] font-black text-3xl tracking-tight">{v}</span>
              <span className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wider">{l}</span>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />
          <div className="flex overflow-hidden">
            <div className="marquee-track flex gap-12 items-center whitespace-nowrap">
              {[
                'Clínica Aurora','AutoMoto SL','BeautyStudio Nord','InmoPlus','FitPro Gym',
                'Restaurante El Rincón','TechStore Madrid','Academia Lingua','Viajes Sur','Dental Express',
                'Clínica Aurora','AutoMoto SL','BeautyStudio Nord','InmoPlus','FitPro Gym',
                'Restaurante El Rincón','TechStore Madrid','Academia Lingua','Viajes Sur','Dental Express',
              ].map((name, i) => (
                <span key={i} className="text-[#cbd5e1] font-black text-[13px] uppercase tracking-widest flex-shrink-0">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <HowItWorks />

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="funciones" className="py-28 px-6 bg-[#0f172a]">
        <div className="max-w-[1100px] mx-auto">

          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
              Funciones
            </p>
            <h2 className="text-[52px] font-black leading-[1.05] tracking-tight text-white">
              Construido para<br />
              <em className="italic font-black bg-gradient-to-r from-[#0d9488] to-[#059669] bg-clip-text text-transparent">cerrar ventas.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
                title: 'Respuestas 24/7',
                desc: 'Tu negocio responde al instante aunque sea domingo a las 3 AM. Sin excepciones ni tiempos de espera.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                  </svg>
                ),
                title: 'Cierra ventas solo',
                desc: 'Detecta intención de compra, gestiona objeciones y conduce al cliente hasta el pago. Sin ayuda.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                ),
                title: 'Califica automático',
                desc: 'Filtra leads fríos antes de que lleguen a ti. Solo ves los clientes con intención real de compra.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                ),
                title: 'Cobro en el chat',
                desc: 'El cliente paga directamente en WhatsApp. Sin salir de la conversación, sin pasos extra.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                ),
                title: 'Prompt en lenguaje natural',
                desc: 'Describes tu negocio con tus palabras. El agente aprende y empieza a vender. Sin código.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                title: 'Analítica en tiempo real',
                desc: 'Ve qué conversaciones convierten, qué objeciones frenan y dónde mejorar el pitch.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/[0.04] border border-white/[0.07] rounded-3xl p-8 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#0d9488]/15 flex items-center justify-center mb-6 text-[#0d9488] group-hover:bg-[#0d9488]/25 transition-colors">
                  {icon}
                </div>
                <h3 className="text-white font-black text-base mb-2 uppercase tracking-wide">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">

          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">Testimonios</p>
            <h2 className="text-[52px] font-black leading-[1.05] tracking-tight text-[#0f172a]">
              Lo que dicen<br />
              <em className="italic font-black text-[#0d9488]">nuestros clientes.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: 'En la primera semana el agente cerró 3 ventas que yo ni había visto. Responde mejor que yo y nunca se cansa.',
                name: 'Carlos M.',
                role: 'Inmobiliaria Costa Sur',
                initials: 'CM',
                gradient: 'from-[#0d9488] to-[#0f766e]',
                stars: 5,
              },
              {
                quote: 'Antes perdía leads por no responder rápido. Ahora el agente responde en segundos y yo solo cierro los que ya están convencidos.',
                name: 'Laura P.',
                role: 'Clínica Dental Norte',
                initials: 'LP',
                gradient: 'from-[#0f172a] to-[#1e293b]',
                stars: 5,
              },
              {
                quote: 'Lo configuré en 10 minutos y ese mismo día ya tenía conversaciones activas. La mejor inversión que he hecho en marketing.',
                name: 'Andrés V.',
                role: 'FitPro Gym Valencia',
                initials: 'AV',
                gradient: 'from-[#475569] to-[#334155]',
                stars: 5,
              },
            ].map(({ quote, name, role, initials, gradient, stars }) => (
              <div key={name} className="flex flex-col bg-white border border-[#f1f5f9] rounded-3xl p-8 hover:border-[#e2e8f0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#0f172a] text-sm leading-relaxed flex-1 mb-7">
                  &ldquo;{quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-[11px] font-black">{initials}</span>
                  </div>
                  <div>
                    <p className="text-[#0f172a] font-bold text-sm">{name}</p>
                    <p className="text-[#94a3b8] text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <PricingSection plans={pricingPlans} userLoggedIn={!!userEmail} />

      {/* ── DARK CTA BLOCK ─────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="bg-[#0f172a] rounded-3xl px-12 py-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-5">
              Empieza hoy
            </p>
            <h2 className="text-[48px] font-black leading-[1.05] tracking-tight text-white mb-6">
              Tu primer agente,<br />
              <em className="italic font-black text-[#0d9488]">hoy mismo.</em>
            </h2>
            <p className="text-white/50 text-base mb-10 max-w-sm mx-auto">
              En marcha en menos de 10 minutos.
            </p>
            <Link
              href="/login"
              className="inline-block bg-white hover:bg-[#f8fafc] text-[#0f172a] font-bold text-[13px] px-10 py-4 rounded-full uppercase tracking-wider transition-colors"
            >
              Crear mi agente →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-[#f1f5f9] py-16 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
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
              <p className="text-[#94a3b8] text-sm leading-relaxed">
                Agentes de IA para WhatsApp Business.<br />
                Vende más sin contratar más.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-16 sm:gap-24">
              <div className="flex flex-col gap-3">
                <p className="text-[#0f172a] text-[10px] font-bold uppercase tracking-widest mb-2">
                  Producto
                </p>
                <a href="#como-funciona" className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
                  Cómo funciona
                </a>
                <a href="#funciones" className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
                  Funciones
                </a>
                <a href="#precios" className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
                  Precios
                </a>
                <Link href="/dashboard/agentes" className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
                  Acceder
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#0f172a] text-[10px] font-bold uppercase tracking-widest mb-2">
                  Legal
                </p>
                <Link href="/privacy" className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
                  Privacidad
                </Link>
                <Link href="/terms" className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
                  Términos de uso
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f1f5f9] pt-8">
            <p className="text-[#cbd5e1] text-xs uppercase tracking-widest font-semibold">
              © 2026 Revly. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </main>
  )
}
