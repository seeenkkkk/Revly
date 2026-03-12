import { createServerSupabase } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import PricingCard from '@/components/PricingCard'
import { PLANS } from '@/lib/stripe'

export default async function LandingPage() {
  // Obtener sesión del usuario actual (si existe)
  // Si Supabase no está configurado aún, renderizar sin sesión
  let session = null
  try {
    const supabase = createServerSupabase()
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch {
    // Variables de entorno no configuradas aún — modo demo
  }

  return (
    <main className="min-h-screen bg-[#0D1B2A] text-white">
      <Navbar userEmail={session?.user?.email} />

      {/* ====== HERO ====== */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Gradiente de fondo decorativo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#00C48C15_0%,_transparent_70%)] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#00C48C]/10 border border-[#00C48C]/20 rounded-full px-5 py-2 mb-8 whitespace-nowrap">
          <span className="w-2 h-2 bg-[#00C48C] rounded-full animate-pulse flex-shrink-0" />
          <span className="text-[#00C48C] text-xs font-medium">Agente de ventas por WhatsApp</span>
        </div>

        {/* Título principal */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight max-w-4xl mb-6">
          Tu negocio vendiendo en{' '}
          <span className="text-[#00C48C]">WhatsApp</span>, solo.
        </h1>

        {/* Subtítulo */}
        <p className="text-white/60 text-xl max-w-2xl mb-10">
          Automatiza tus ventas con un agente de IA que atiende a tus clientes las 24 horas,
          responde dudas y cierra ventas mientras tú duermes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/dashboard/agentes"
            className="bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105"
          >
            Empezar gratis →
          </a>
          <a
            href="#como-funciona"
            className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-8 py-4 rounded-xl text-lg transition-all"
          >
            Ver demo
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-20 text-center">
          {[
            { value: '+500', label: 'negocios activos' },
            { value: '98%', label: 'tasa de respuesta' },
            { value: '24/7', label: 'disponibilidad' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-[#00C48C]">{value}</div>
              <div className="text-white/50 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CÓMO FUNCIONA ====== */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Así de simple</h2>
            <p className="text-white/50 text-lg">Configura tu agente en menos de 5 minutos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Conecta WhatsApp',
                desc: 'Vincula tu número de WhatsApp Business con un clic.',
              },
              {
                step: '02',
                title: 'Personaliza el agente',
                desc: 'Define el tono, respuestas y catálogo de tu negocio.',
              },
              {
                step: '03',
                title: 'Vende automáticamente',
                desc: 'Tu agente atiende, convence y cierra ventas por ti.',
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#00C48C]/30 transition-colors"
              >
                <div className="text-[#00C48C] font-mono font-bold text-sm mb-4">{step}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRECIOS ====== */}
      <section id="precios" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planes y precios</h2>
            <p className="text-white/50 text-lg">Sin permanencia. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Plan Essential */}
            <PricingCard
              name={PLANS.essential.name}
              price={PLANS.essential.price}
              features={PLANS.essential.features}
              priceId={PLANS.essential.priceId ?? null}
            />

            {/* Plan Growth (destacado) */}
            <PricingCard
              name={PLANS.growth.name}
              price={PLANS.growth.price}
              features={PLANS.growth.features}
              priceId={PLANS.growth.priceId ?? null}
              highlighted
            />

            {/* Plan Partner */}
            <PricingCard
              name={PLANS.partner.name}
              price={PLANS.partner.price}
              features={PLANS.partner.features}
              priceId={PLANS.partner.priceId ?? null}
            />
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#00C48C] rounded-md flex items-center justify-center">
              <span className="text-[#0D1B2A] font-bold text-xs">R</span>
            </div>
            <span className="text-white/60 text-sm">revly © 2025</span>
          </div>
          <p className="text-white/30 text-sm">
            Automatización de ventas por WhatsApp con IA
          </p>
        </div>
      </footer>
    </main>
  )
}
