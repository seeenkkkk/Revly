'use client'

export default function ConversacionesPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
            Conversaciones
          </p>
          <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white">
            Tus conversaciones,<br />
            <em className="italic text-[#0d9488]">en tiempo real.</em>
          </h1>
          <p className="text-white/40 text-sm mt-3">
            Aquí verás todas las conversaciones que tu agente gestiona.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 py-12">
        <div className="bg-white border border-[#f1f5f9] rounded-3xl p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#f0fdfa] flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"/>
              <path d="M15 4H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
            </svg>
          </div>
          <h2 className="text-[#0f172a] font-black text-xl mb-2">Aún no hay conversaciones</h2>
          <p className="text-[#94a3b8] text-sm max-w-sm mx-auto">
            Cuando tu agente empiece a atender clientes en WhatsApp, las conversaciones aparecerán aquí.
          </p>
        </div>
      </div>
    </div>
  )
}
