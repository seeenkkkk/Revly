// Página de Analítica — próximamente
export default function AnaliticaPage() {
  return (
    <div className="flex flex-col min-h-full">
      <header className="px-10 pt-10 pb-8">
        <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">
          Analítica
        </p>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          Métricas de <span className="text-[#00C48C]">Rendimiento</span>
        </h1>
      </header>

      <section className="px-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00C48C]/10 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00C48C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#0D1B2A] mb-2">Próximamente</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Los dashboards de analítica en tiempo real estarán disponibles en la próxima versión.
            Despliega tu agente primero para empezar a generar datos.
          </p>
        </div>
      </section>
    </div>
  )
}
