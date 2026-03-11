// Previsualización estática del workflow de ventas
// Muestra la lógica: Saludo → Interés → Venta

const nodes = [
  {
    id: 'saludo',
    label: 'Saludo',
    sublabel: 'Mensaje inicial',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: 'bg-blue-50 border-blue-200 text-blue-600',
    dot: 'bg-blue-400',
  },
  {
    id: 'interes',
    label: 'Interés',
    sublabel: 'Cualificación',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
      </svg>
    ),
    color: 'bg-amber-50 border-amber-200 text-amber-600',
    dot: 'bg-amber-400',
  },
  {
    id: 'propuesta',
    label: 'Propuesta',
    sublabel: 'Oferta personalizada',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    color: 'bg-purple-50 border-purple-200 text-purple-600',
    dot: 'bg-purple-400',
  },
  {
    id: 'venta',
    label: 'Venta',
    sublabel: 'Cierre y pago',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: 'bg-[#00C48C]/10 border-[#00C48C]/30 text-[#00C48C]',
    dot: 'bg-[#00C48C]',
  },
]

export default function WorkflowPreview() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-[#0D1B2A]">Workflow de Ventas</h3>
          <p className="text-xs text-gray-400 mt-0.5">Lógica de conversación del agente</p>
        </div>
        <span className="text-xs bg-[#00C48C]/10 text-[#00C48C] font-medium px-2.5 py-1 rounded-full">
          Activo
        </span>
      </div>

      {/* Nodos del workflow */}
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center flex-shrink-0">
            {/* Nodo */}
            <div className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 ${node.color}`}>
              <div className={`w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center`}>
                {node.icon}
              </div>
              <div>
                <p className="text-xs font-semibold">{node.label}</p>
                <p className="text-xs opacity-60">{node.sublabel}</p>
              </div>
              {/* Indicador activo */}
              <span className={`w-1.5 h-1.5 rounded-full ${node.dot} ml-1`} />
            </div>

            {/* Conector entre nodos */}
            {i < nodes.length - 1 && (
              <div className="flex items-center gap-0 px-1">
                <div className="w-6 h-px bg-gray-200" />
                <svg width="8" height="8" viewBox="0 0 8 8" className="text-gray-300 -ml-0.5">
                  <path d="M0 4h6M3 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Métricas del workflow */}
      <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100">
        {[
          { label: 'Tasa de respuesta', value: '98%' },
          { label: 'Tiempo medio', value: '< 2s' },
          { label: 'Conversiones', value: '34%' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-lg font-bold text-[#0D1B2A]">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
