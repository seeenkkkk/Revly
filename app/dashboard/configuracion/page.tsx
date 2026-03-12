// Página de Configuración — próximamente
export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="px-10 pt-10 pb-8">
        <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">
          Configuración
        </p>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          Ajustes de tu <span className="text-[#00C48C]">Cuenta</span>
        </h1>
      </header>

      <section className="px-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0D1B2A]/5 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0D1B2A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M2 12h2M20 12h2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#0D1B2A] mb-2">Próximamente</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Aquí podrás conectar tu número de WhatsApp, configurar el prompt del agente
            y gestionar tu suscripción.
          </p>
        </div>
      </section>
    </div>
  )
}
