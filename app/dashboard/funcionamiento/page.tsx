// Página: Cómo vende tu Agente

const STEPS = [
  {
    id: 1,
    title: 'Cliente escribe',
    desc: 'Un mensaje en WhatsApp a cualquier hora del día.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Respuesta en 2 s',
    desc: 'El agente responde al instante, 24/7, sin errores.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Califica el lead',
    desc: 'Filtra clientes fríos. Solo avanza quien tiene intención real.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Oferta personalizada',
    desc: 'Adapta el pitch al perfil exacto de ese cliente.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Cobro en el chat',
    desc: 'El cliente paga sin salir de WhatsApp.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Tú recibes la venta',
    desc: 'El dinero llega a tu cuenta. Tú no hiciste nada.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
]

const CHAT_MESSAGES = [
  { from: 'client', text: 'Hola! Vi vuestro producto en Instagram, ¿cuánto cuesta?' },
  { from: 'agent', text: '¡Hola! El precio base es 97€. ¿Para qué tipo de negocio lo necesitas?' },
  { from: 'client', text: 'Tengo una tienda de ropa, quiero automatizar las consultas' },
  { from: 'agent', text: 'Perfecto 🎯 Nuestro plan Growth está diseñado exactamente para tiendas. ¿Te envío los detalles?' },
  { from: 'client', text: 'Sí, por favor!' },
  { from: 'agent', text: '¡Listo! Aquí tienes el enlace de pago seguro. Setup en menos de 10 min.' },
  { from: 'client', text: '¡Comprado! Gracias' },
  { from: 'agent', text: '🎉 ¡Perfecto! Ya tienes acceso. ¡A vender!' },
]

export default function FuncionamientoPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">

      {/* HERO */}
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
            Funcionamiento
          </p>
          <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white">
            Así vende tu agente,<br />
            <em className="italic text-[#0d9488]">solo.</em>
          </h1>
          <p className="text-white/40 text-sm mt-3 max-w-md">
            Tu empleado digital trabaja mientras tú descansas. Así es el proceso completo de venta automatizada.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-10 py-10 space-y-6">

        {/* PASOS */}
        <div className="bg-white border border-[#f1f5f9] rounded-3xl p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-8">El proceso completo</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0f172a] border border-[#f1f5f9]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                    {String(step.id).padStart(2, '0')}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#f0fdfa] flex items-center justify-center text-[#0d9488]">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-[#0f172a] font-black text-sm uppercase tracking-wide mb-1">{step.title}</h3>
                  <p className="text-[#94a3b8] text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT MOCKUP */}
        <div className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden max-w-md">
          <div className="bg-[#0f172a] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0d9488]/20 border border-[#0d9488]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#0d9488] text-xs font-black">R</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">Revly Agent</p>
              <p className="text-[#0d9488] text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] inline-block" />
                En línea
              </p>
            </div>
          </div>

          <div className="bg-[#f8fafc] px-4 py-4 flex flex-col gap-2.5 max-h-96 overflow-y-auto">
            {CHAT_MESSAGES.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.from === 'client'
                    ? 'bg-white text-[#0f172a] rounded-tl-sm border border-[#f1f5f9]'
                    : 'bg-[#0d9488] text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                  {msg.from === 'agent' && (
                    <span className="text-[9px] text-white/50 ml-2 inline-block align-bottom">✓✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white px-4 py-3 flex items-center gap-2 border-t border-[#f1f5f9]">
            <div className="flex-1 bg-[#0f172a] border border-[#f1f5f9] rounded-full px-4 py-2 text-xs text-[#cbd5e1]">
              El agente gestiona esto por ti...
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
