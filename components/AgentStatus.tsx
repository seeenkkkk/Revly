'use client'

import { useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent } from '@/lib/supabase'

interface AgentStatusProps {
  agent: Agent | null
  userId: string
}

export default function AgentStatus({ agent, userId }: AgentStatusProps) {
  const [saving, setSaving] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState(agent?.whatsapp_number ?? '')
  const [systemPrompt, setSystemPrompt] = useState(
    agent?.system_prompt ?? 'Eres un asistente de ventas amable y profesional.'
  )
  const [status, setStatus] = useState<'active' | 'inactive'>(agent?.status ?? 'inactive')
  const [saved, setSaved] = useState(false)

  // Guardar o actualizar configuración del agente
  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const supabase = createBrowserSupabase()

    const agentData = {
      user_id: userId,
      whatsapp_number: whatsappNumber,
      system_prompt: systemPrompt,
      status,
    }

    if (agent?.id) {
      // Actualizar agente existente
      await supabase.from('agents').update(agentData).eq('id', agent.id)
    } else {
      // Crear nuevo agente
      await supabase.from('agents').insert(agentData)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Alternar estado activo/inactivo
  const toggleStatus = async () => {
    const newStatus = status === 'active' ? 'inactive' : 'active'
    setStatus(newStatus)
    const supabase = createBrowserSupabase()

    if (agent?.id) {
      await supabase.from('agents').update({ status: newStatus }).eq('id', agent.id)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">Configuración del Agente</h2>

        {/* Toggle de estado */}
        <button
          onClick={toggleStatus}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            status === 'active'
              ? 'bg-[#00C48C]/20 text-[#00C48C] border border-[#00C48C]/30'
              : 'bg-white/5 text-white/50 border border-white/10'
          }`}
        >
          {/* Indicador de estado animado */}
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'active' ? 'bg-[#00C48C] animate-pulse' : 'bg-white/30'
            }`}
          />
          {status === 'active' ? 'Activo' : 'Inactivo'}
        </button>
      </div>

      {/* Número de WhatsApp */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Número de WhatsApp</label>
        <input
          type="tel"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="+34 600 000 000"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00C48C]/50 transition-colors"
        />
      </div>

      {/* System prompt */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Prompt del sistema</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={4}
          placeholder="Define cómo debe comportarse tu agente de ventas..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00C48C]/50 transition-colors resize-none"
        />
        <p className="text-white/30 text-xs mt-1">
          Instrucciones que definen la personalidad y comportamiento de tu agente
        </p>
      </div>

      {/* Botón guardar */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60 w-full"
      >
        {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar cambios'}
      </button>
    </div>
  )
}
