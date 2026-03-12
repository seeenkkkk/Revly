import Link from 'next/link'

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 max-w-md w-full text-center">
        {/* Icono */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2">Pago cancelado</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          No te hemos cobrado nada. Puedes volver a seleccionar un plan
          cuando quieras. Tu cuenta sigue activa.
        </p>

        <Link
          href="/dashboard/agentes"
          className="block w-full bg-[#0D1B2A] hover:bg-[#162436] text-white font-bold py-3 rounded-xl transition-colors mb-3"
        >
          Volver a Mis Agentes
        </Link>

        <Link
          href="/"
          className="block text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Ir a la página principal
        </Link>
      </div>
    </main>
  )
}
