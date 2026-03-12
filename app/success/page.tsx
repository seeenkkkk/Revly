import Link from 'next/link'

const planLabels: Record<string, { name: string; emoji: string; color: string }> = {
  essential: { name: 'Essential', emoji: '💬', color: 'text-gray-700' },
  growth: { name: 'Growth & Marketing', emoji: '⚡', color: 'text-[#00C48C]' },
  partner: { name: 'Partner AI', emoji: '🤖', color: 'text-[#0D1B2A]' },
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  const planKey = searchParams.plan ?? 'essential'
  const plan = planLabels[planKey] ?? planLabels.essential

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 max-w-md w-full text-center">
        {/* Icono de éxito */}
        <div className="w-20 h-20 rounded-full bg-[#00C48C]/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-[#00C48C]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">
          ¡Pago completado! {plan.emoji}
        </h1>
        <p className={`text-lg font-semibold mb-4 ${plan.color}`}>Plan {plan.name} activado</p>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Tu agente de WhatsApp está siendo configurado. En unos segundos
          estará listo para empezar a vender. Ve al dashboard para
          conectar tu número de WhatsApp.
        </p>

        {/* Estado de activación */}
        <div className="bg-[#00C48C]/5 border border-[#00C48C]/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-8 text-left">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C48C] animate-pulse flex-shrink-0" />
          <p className="text-sm text-[#00C48C] font-medium">
            Agente activado — Ve a Configuración para conectar WhatsApp
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard/agentes"
          className="block w-full bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-bold py-3 rounded-xl transition-colors"
        >
          Ir al Dashboard →
        </Link>

        <Link
          href="/dashboard/configuracion"
          className="block mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Configurar WhatsApp ahora
        </Link>
      </div>
    </main>
  )
}
