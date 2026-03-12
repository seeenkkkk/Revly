'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent } from '@/lib/supabase'

interface AgentStatusCardProps {
  agent: Agent
}

// Colores y etiquetas por plan_type
const planStyles: Record<string, { label: string; iconBg: string; iconColor: string }> = {
  essential: { label: 'Essential', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
  growth: { label: 'Growth & Marketing', iconBg: 'bg-[#00C48C]/10', iconColor: 'text-[#00C48C]' },
  partner: { label: 'Partner AI', iconBg: 'bg-[#0D1B2A]/5', iconColor: 'text-[#0D1B2A]' },
}

export default function AgentStatusCard({ agent }: AgentStatusCardProps) {
  const [status, setStatus] = useState<'active' | 'inactive'>(agent.status)
  const [toggling, setToggling] = useState(false)

  const style = planStyles[agent.plan_type] ?? planStyles.essential

  // Alternar estado activo/inactivo en Supabase
  const handleToggle = async () => {
    setToggling(true)
    const newStatus = status === 'active' ? 'inactive' : 'active'
    try {
      const supabase = createBrowserSupabase()
      await supabase.from('agents').update({ status: newStatus }).eq('id', agent.id)
      setStatus(newStatus)
    } catch (err) {
      console.error('Error al actualizar estado del agente:', err)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Cabecera */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icono del plan */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={style.iconColor}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#0D1B2A] text-sm">{agent.name}</h3>
            <p className="text-xs text-gray-400">{style.label}</p>
          </div>
        </div>

        {/* Badge de estado */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            status === 'active'
              ? 'bg-[#00C48C]/10 text-[#00C48C] hover:bg-[#00C48C]/20'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === 'active' ? 'bg-[#00C48C] animate-pulse' : 'bg-gray-300'
            }`}
          />
          {toggling ? '...' : status === 'active' ? 'Activo' : 'Inactivo'}
        </button>
      </div>

      {/* Número de WhatsApp */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#25D366] flex-shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.046 22l4.932-1.363A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.522 2 12 2z" fillOpacity="0.3"/>
        </svg>
        <span className={agent.whatsapp_number ? 'text-gray-700' : 'text-gray-300'}>
          {agent.whatsapp_number || 'Sin número configurado'}
        </span>
      </div>

      {/* Preview del prompt */}
      {agent.system_prompt && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mb-4 line-clamp-2">
          {agent.system_prompt}
        </p>
      )}

      {/* Botón editar */}
      <Link
        href="/dashboard/configuracion"
        className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-[#00C48C]/30 hover:bg-[#00C48C]/5 text-gray-500 hover:text-[#00C48C] text-sm font-medium py-2.5 rounded-xl transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar agente
      </Link>
    </div>
  )
}
