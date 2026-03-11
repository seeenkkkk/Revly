'use client'

import { useState } from 'react'

// Iconos SVG para cada tipo de agente
const AgentIconEssential = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const AgentIconGrowth = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Burbuja de chat */}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" />
    {/* Rayo de energía */}
    <path d="M13 3L9 13h4l-2 8 8-10h-5l3-8z" stroke="currentColor" fill="currentColor" fillOpacity="0.15" />
  </svg>
)

const AgentIconPartner = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {/* Busto de androide */}
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    <path d="M9 8h.01M15 8h.01" />
    <path d="M10 11s.5 1 2 1 2-1 2-1" />
    <path d="M12 4V2M8 5.5L6.5 4M16 5.5l1.5-1.5" />
  </svg>
)

export type AgentTier = 'essential' | 'growth' | 'partner'

interface AgentCardProps {
  tier: AgentTier
  name: string
  price: number
  tagline: string
  description: string
  features: string[]
  badge?: string
  onDeploy: (tier: AgentTier) => void
}

const iconMap = {
  essential: <AgentIconEssential />,
  growth: <AgentIconGrowth />,
  partner: <AgentIconPartner />,
}

export default function AgentCard({
  tier,
  name,
  price,
  tagline,
  description,
  features,
  badge,
  onDeploy,
}: AgentCardProps) {
  const [deploying, setDeploying] = useState(false)

  const handleDeploy = async () => {
    setDeploying(true)
    // Simular animación de deploy y llamar al callback
    await new Promise((r) => setTimeout(r, 800))
    onDeploy(tier)
    setDeploying(false)
  }

  // Estilos según el tier
  const cardStyles = {
    essential: 'bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md',
    growth: 'bg-white border-2 border-[#00C48C] shadow-lg shadow-[#00C48C]/10 hover:shadow-xl hover:shadow-[#00C48C]/15',
    partner: 'bg-gradient-to-b from-[#0D1B2A] to-[#162436] border border-[#2A3F55] shadow-xl hover:shadow-2xl',
  }

  const isLight = tier !== 'partner'

  return (
    <div className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${cardStyles[tier]}`}>
      {/* Badge "Más Rentable" */}
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-[#00C48C] text-[#0D1B2A] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {badge}
          </span>
        </div>
      )}

      {/* Icono del agente */}
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
          tier === 'essential'
            ? 'bg-gray-100 text-gray-500'
            : tier === 'growth'
            ? 'bg-[#00C48C]/10 text-[#00C48C]'
            : 'bg-white/10 text-[#00C48C]'
        }`}
      >
        {iconMap[tier]}
      </div>

      {/* Nombre y tagline */}
      <h3 className={`text-lg font-bold mb-0.5 ${isLight ? 'text-[#0D1B2A]' : 'text-white'}`}>
        {name}
      </h3>
      <p className={`text-xs font-medium mb-4 ${isLight ? 'text-[#00C48C]' : 'text-[#00C48C]'}`}>
        {tagline}
      </p>

      {/* Precio */}
      <div className="mb-4">
        <span className={`text-3xl font-extrabold ${isLight ? 'text-[#0D1B2A]' : 'text-white'}`}>
          {price.toFixed(2).replace('.', ',')}€
        </span>
        <span className={`text-sm ml-1 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>/mes</span>
      </div>

      {/* Descripción */}
      <p className={`text-sm leading-relaxed mb-5 ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
        {description}
      </p>

      {/* Características */}
      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#00C48C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={isLight ? 'text-gray-600' : 'text-white/60'}>{f}</span>
          </li>
        ))}
      </ul>

      {/* Botón Desplegar Agente */}
      <button
        onClick={handleDeploy}
        disabled={deploying}
        className={`
          w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-70
          ${tier === 'essential'
            ? 'bg-gray-100 hover:bg-gray-200 text-[#0D1B2A]'
            : tier === 'growth'
            ? 'bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A]'
            : 'bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A]'
          }
        `}
      >
        {deploying ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Desplegando...
          </span>
        ) : (
          'Desplegar Agente →'
        )}
      </button>
    </div>
  )
}
