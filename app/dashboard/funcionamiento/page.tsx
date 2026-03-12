// Página: ¿Cómo vende tu Agente?
// Diagrama visual del proceso de ventas paso a paso + mockup de chat

const STEPS = [
  {
    id: 1,
    title: 'Cliente escribe',
    description: 'El cliente inicia la conversación en WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.046 22l4.932-1.363A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.522 2 12 2z" fillOpacity="0.3"/>
      </svg>
    ),
    color: 'bg-green-50 text-green-600 border-green-200',
    accent: '#25D366',
  },
  {
    id: 2,
    title: 'Respuesta instantánea',
    description: 'El agente responde en menos de 2 segundos, 24/7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: 'bg-amber-50 text-amber-500 border-amber-200',
    accent: '#F59E0B',
  },
  {
    id: 3,
    title: 'Califica el lead',
    description: 'Identifica si el cliente tiene intención real de compra',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-500 border-blue-200',
    accent: '#3B82F6',
  },
  {
    id: 4,
    title: 'Oferta personalizada',
    description: 'Presenta el producto o servicio ideal para ese cliente',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    color: 'bg-purple-50 text-purple-500 border-purple-200',
    accent: '#8B5CF6',
  },
  {
    id: 5,
    title: 'Cliente compra',
    description: 'El cliente realiza el pago directamente en el chat',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    color: 'bg-[#00C48C]/10 text-[#00C48C] border-[#00C48C]/20',
    accent: '#00C48C',
  },
  {
    id: 6,
    title: 'Tú recibes la venta',
    description: 'El dinero llega a tu cuenta. Tú no hiciste nada.',
    icon: (
      <div className="w-7 h-7 bg-[#0D1B2A] rounded-lg flex items-center justify-center">
        <span className="text-[#00C48C] font-black text-xs">R</span>
      </div>
    ),
    color: 'bg-[#0D1B2A]/5 text-[#0D1B2A] border-[#0D1B2A]/10',
    accent: '#0D1B2A',
  },
]

// Mensajes del mockup de chat de WhatsApp
const CHAT_MESSAGES = [
  { from: 'client', text: 'Hola! Vi vuestro producto en Instagram, ¿cuánto cuesta?' },
  { from: 'agent', text: '¡Hola! 👋 Encantado de atenderte. El precio base es 97€. ¿Para qué tipo de negocio lo necesitas?' },
  { from: 'client', text: 'Tengo una tienda de ropa, quiero automatizar las consultas' },
  { from: 'agent', text: 'Perfecto para eso 🎯 Nuestro plan Growth está diseñado exactamente para tiendas. Incluye respuesta automática a consultas de tallas, precios y disponibilidad. ¿Te envío los detalles?' },
  { from: 'client', text: 'Sí, por favor!' },
  { from: 'agent', text: '¡Listo! 🛍️ Aquí tienes el enlace de pago seguro: revly.io/checkout — El setup es en menos de 10 min.' },
  { from: 'client', text: '¡Comprado! Gracias' },
  { from: 'agent', text: '🎉 ¡Perfecto! Ya tienes acceso. En breve recibirás las instrucciones de configuración. ¡A vender!' },
]

export default function FuncionamientoPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* ====== ENCABEZADO ====== */}
      <header className="px-10 pt-10 pb-8">
        <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">
          Funcionamiento
        </p>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          ¿Cómo vende tu <span className="text-[#00C48C]">Agente</span>?
        </h1>
        <p className="text-gray-400 mt-2 text-sm max-w-xl">
          Tu empleado digital trabaja mientras tú descansas. Así es el proceso de venta automatizada.
        </p>
      </header>

      {/* ====== DIAGRAMA DE PASOS ====== */}
      <section className="px-10 pb-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Grid de pasos — horizontal en desktop, vertical en móvil */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex flex-col items-center text-center gap-3 relative">
                {/* Número de paso */}
                <span className="text-xs font-bold text-gray-300 tabular-nums">
                  0{step.id}
                </span>

                {/* Icono */}
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 ${step.color}`}
                >
                  {step.icon}
                </div>

                {/* Flecha conectora (solo entre pasos, no después del último) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-[46px] left-[calc(50%+28px)] items-center" style={{ width: 'calc(100% - 28px)' }}>
                    <div className="flex-1 h-px bg-[#00C48C]/30" />
                    <svg width="8" height="8" viewBox="0 0 8 8" className="text-[#00C48C] -ml-px">
                      <path d="M0 4h6M3 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}

                {/* Título */}
                <h3 className="text-sm font-semibold text-[#0D1B2A] leading-tight">
                  {step.title}
                </h3>

                {/* Descripción */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== MOCKUP DE CHAT WHATSAPP ====== */}
      <section className="px-10 pb-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Conversación real de ejemplo
        </h2>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-md">
          {/* Header del chat */}
          <div className="bg-[#0D1B2A] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00C48C] flex items-center justify-center flex-shrink-0">
              <span className="text-[#0D1B2A] font-bold text-xs">R</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Agente Revly</p>
              <p className="text-[#00C48C] text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C] inline-block" />
                en línea
              </p>
            </div>
          </div>

          {/* Fondo estilo WhatsApp */}
          <div className="bg-[#ECE5DD] px-4 py-4 flex flex-col gap-2 max-h-96 overflow-y-auto">
            {CHAT_MESSAGES.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'client' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`
                    max-w-[80%] px-3 py-2 rounded-xl text-sm shadow-sm
                    ${msg.from === 'client'
                      ? 'bg-white text-gray-800 rounded-tl-none'
                      : 'bg-[#DCF8C6] text-gray-800 rounded-tr-none'
                    }
                  `}
                >
                  {msg.text}
                  {/* Ticks de WhatsApp */}
                  {msg.from === 'agent' && (
                    <span className="text-[10px] text-[#00C48C] ml-2 inline-block align-bottom">✓✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer del chat */}
          <div className="bg-white px-4 py-3 flex items-center gap-2 border-t border-gray-100">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400">
              El agente gestiona esto por ti...
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
