'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AgentCard, { type AgentTier } from '@/components/AgentCard'
import WorkflowPreview from '@/components/WorkflowPreview'

// Definición de los tres agentes digitales
const AGENTS = [
  {
    tier: 'essential' as AgentTier,
    name: 'Essential',
    price: 9.99,
    tagline: 'Tu cerrador básico',
    description:
      'Responde dudas frecuentes y guía al cliente paso a paso hasta el checkout. Ideal para negocios que empiezan a automatizar.',
    features: [
      'Respuestas automáticas 24/7',
      'Guía al cliente al checkout',
      '50 conversaciones/mes',
      'Soporte por email',
    ],
  },
  {
    tier: 'growth' as AgentTier,
    name: 'Growth & Marketing',
    price: 27.99,
    tagline: 'Vende y prospecta',
    description:
      'Vende y prospecta activamente. Incluye estrategias de marketing, seguimiento y re-engagement inteligente para maximizar conversiones.',
    features: [
      'Todo lo del plan Essential',
      'Re-engagement automático',
      'Estrategias de upselling',
      '1.000 conversaciones/mes',
      'Análisis de conversaciones',
    ],
    highlighted: true,
    badge: 'Más Rentable',
  },
  {
    tier: 'partner' as AgentTier,
    name: 'Partner AI',
    price: 49.99,
    tagline: 'Tu socio digital',
    description:
      'Prácticamente un empleado humano en WhatsApp. Innova en la conversación, analiza datos en tiempo real y cierra ventas complejas de forma autónoma.',
    features: [
      'Todo lo del plan Growth',
      'IA conversacional avanzada',
      'Análisis de datos en tiempo real',
      'Cierre de ventas complejas',
      'Conversaciones ilimitadas',
      'Soporte dedicado 24/7',
    ],
  },
]

export default function DashboardPage() {
  const [deployedAgent, setDeployedAgent] = useState<AgentTier | null>(null)

  const handleDeploy = (tier: AgentTier) => {
    setDeployedAgent(tier)
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* ====== BARRA LATERAL ====== */}
      <Sidebar />

      {/* ====== CONTENIDO PRINCIPAL ====== */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Encabezado */}
        <header className="px-10 pt-10 pb-8">
          <p className="text-xs font-medium text-[#00C48C] uppercase tracking-widest mb-2">
            Panel de control
          </p>
          <h1 className="text-3xl font-bold text-[#0D1B2A] leading-tight">
            Hola, selecciona tu nuevo{' '}
            <span className="text-[#00C48C]">Empleado Digital</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Despliega un agente de WhatsApp con IA y empieza a vender en minutos.
          </p>
        </header>

        {/* Notificación si hay agente desplegado */}
        {deployedAgent && (
          <div className="mx-10 mb-6 bg-[#00C48C]/10 border border-[#00C48C]/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse" />
            <p className="text-sm text-[#00C48C] font-medium">
              Agente <span className="font-bold capitalize">{deployedAgent}</span> desplegado
              correctamente. Configura tu número de WhatsApp en Configuración.
            </p>
          </div>
        )}

        {/* ====== TARJETAS DE AGENTES ====== */}
        <section className="px-10 pb-8">
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
                onDeploy={handleDeploy}
              />
            ))}
          </div>
        </section>

        {/* ====== PREVISUALIZACIÓN DEL WORKFLOW ====== */}
        <section className="px-10 pb-10 mt-auto">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Previsualización del Workflow
            </h2>
          </div>
          <WorkflowPreview />
        </section>
      </main>
    </div>
  )
}
