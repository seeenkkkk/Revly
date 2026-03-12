'use client'

import { useState } from 'react'
import AgentCard from '@/components/AgentCard'
import { useRevlyStore, type AgentTier } from '@/lib/store'

// Definición de los tres agentes digitales
const AGENTS = [
  {
    tier: 'essential' as AgentTier,
    name: 'Essential',
    price: 9.99,
    tagline: 'Tu cerrador básico',
    description:
      'Responde FAQs, califica leads y guía al checkout. AI nivel medio.',
    features: [
      'Respuestas automáticas 24/7',
      'Calificación de leads',
      'Guía al checkout',
      '50 conversaciones/mes',
      'Soporte por email',
    ],
    buttonLabel: 'Desplegar Agente Essential',
  },
  {
    tier: 'growth' as AgentTier,
    name: 'Growth & Marketing',
    price: 27.99,
    tagline: 'Vende y prospecta',
    description:
      'Vende y prospecta. Re-engagement inteligente y seguimiento de leads. AI avanzada.',
    features: [
      'Todo lo del Essential',
      'Re-engagement automático',
      'Seguimiento de leads',
      '1.000 conversaciones/mes',
      'Analítica de conversiones',
    ],
    badge: 'Más Rentable',
    buttonLabel: 'Desplegar Agente Growth',
  },
  {
    tier: 'partner' as AgentTier,
    name: 'Partner AI',
    price: 49.99,
    tagline: 'Tu Socio Digital',
    description:
      'Tu Socio Digital. Cierra ventas complejas. Prácticamente un empleado humano en WhatsApp.',
    features: [
      'Todo lo del Growth',
      'IA conversacional avanzada',
      'Cierre de ventas complejas',
      'Conversaciones ilimitadas',
      'Soporte dedicado 24/7',
    ],
    buttonLabel: 'Contratar Socio AI',
  },
]

export default function AgentesPage() {
  const { setSelectedAgent } = useRevlyStore()
  const [deployedAgent, setDeployedAgent] = useState<AgentTier | null>(null)

  const handleDeploy = (tier: AgentTier) => {
    setSelectedAgent(tier)
    setDeployedAgent(tier)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* ====== ENCABEZADO ====== */}
      <header className="px-10 pt-10 pb-8">
        <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">
          Mis Agentes
        </p>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          Selecciona tu nuevo{' '}
          <span className="text-[#00C48C]">Empleado Digital</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm max-w-xl">
          Despliega un agente de WhatsApp con IA y empieza a vender en minutos, sin código.
        </p>
      </header>

      {/* ====== NOTIFICACIÓN DE DEPLOY ====== */}
      {deployedAgent && (
        <div className="mx-10 mb-6 bg-[#00C48C]/10 border border-[#00C48C]/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse flex-shrink-0" />
          <p className="text-sm text-[#00C48C] font-medium">
            Agente <span className="font-bold capitalize">{deployedAgent}</span> desplegado
            correctamente. Ve a Configuración para conectar tu WhatsApp.
          </p>
        </div>
      )}

      {/* ====== TARJETAS DE AGENTES ====== */}
      <section className="px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {AGENTS.map((agent) => (
            <AgentCard
              key={agent.tier}
              tier={agent.tier}
              name={agent.name}
              price={agent.price}
              tagline={agent.tagline}
              description={agent.description}
              features={agent.features}
              badge={agent.badge}
              buttonLabel={agent.buttonLabel}
              onDeploy={handleDeploy}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
