'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent, UserProfile } from '@/lib/supabase'

const planLabels: Record<string, { name: string; color: string }> = {
  free: { name: 'Free', color: 'text-gray-500 bg-gray-100' },
  essential: { name: 'Essential', color: 'text-gray-700 bg-gray-100' },
  growth: { name: 'Growth & Marketing', color: 'text-[#00C48C] bg-[#00C48C]/10' },
  partner: { name: 'Partner AI', color: 'text-[#0D1B2A] bg-[#0D1B2A]/5' },
}

export default function ConfiguracionPage() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Campos del formulario
  const [agentName, setAgentName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')

  // Cargar datos del agente y perfil al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const [agentResult, profileResult] = await Promise.all([
          supabase
            .from('agents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single<Agent>(),
          supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single<UserProfile>(),
        ])

        if (agentResult.data) {
          setAgent(agentResult.data)
          setAgentName(agentResult.data.name ?? '')
          setWhatsappNumber(agentResult.data.whatsapp_number ?? '')
          setSystemPrompt(agentResult.data.system_prompt ?? '')
        }
        if (profileResult.data) {
          setUserProfile(profileResult.data)
        }
      } catch {
        // Supabase no configurado — mostrar formulario vacío
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Guardar cambios en Supabase
  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const agentData = {
        user_id: user.id,
        name: agentName,
        whatsapp_number: whatsappNumber,
        system_prompt: systemPrompt,
      }

      if (agent?.id) {
        // Actualizar agente existente
        const { error } = await supabase
          .from('agents')
          .update(agentData)
          .eq('id', agent.id)
        if (error) throw error
      } else {
        // Crear nuevo agente si no existe
        const { data, error } = await supabase
          .from('agents')
          .insert({ ...agentData, status: 'inactive', plan_type: userProfile?.plan ?? 'free' })
          .select()
          .single<Agent>()
        if (error) throw error
        if (data) setAgent(data)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar. Inténtalo de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const planInfo = planLabels[userProfile?.plan ?? 'free']

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <header className="px-10 pt-10 pb-8">
          <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">Configuración</p>
          <h1 className="text-3xl font-bold text-[#0D1B2A]">Ajustes de tu <span className="text-[#00C48C]">Agente</span></h1>
        </header>
        <div className="px-10 flex gap-4 flex-col">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="px-10 pt-10 pb-8">
        <p className="text-xs font-semibold text-[#00C48C] uppercase tracking-widest mb-2">
          Configuración
        </p>
        <h1 className="text-3xl font-bold text-[#0D1B2A]">
          Ajustes de tu <span className="text-[#00C48C]">Agente</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Personaliza cómo se presenta y comporta tu agente en WhatsApp.
        </p>
      </header>

      <div className="px-10 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====== FORMULARIO PRINCIPAL ====== */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#0D1B2A] mb-5">Datos del agente</h2>

            {/* Nombre del agente */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Nombre del agente
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Ej: Asistente de Ventas"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D1B2A] placeholder-gray-300 focus:outline-none focus:border-[#00C48C]/50 focus:ring-1 focus:ring-[#00C48C]/20 transition-all"
              />
            </div>

            {/* Número de WhatsApp */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Número de WhatsApp Business
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D1B2A] placeholder-gray-300 focus:outline-none focus:border-[#00C48C]/50 focus:ring-1 focus:ring-[#00C48C]/20 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">
                Incluye el prefijo internacional (+34 para España)
              </p>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Prompt del sistema
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
                placeholder="Eres un asistente de ventas amable y profesional..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0D1B2A] placeholder-gray-300 focus:outline-none focus:border-[#00C48C]/50 focus:ring-1 focus:ring-[#00C48C]/20 transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Define la personalidad y objetivos de tu agente. Sé específico sobre tu negocio.
              </p>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Guardando...
              </>
            ) : saved ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ¡Guardado!
              </>
            ) : (
              'Guardar cambios'
            )}
          </button>
        </div>

        {/* ====== PANEL LATERAL: PLAN ACTUAL ====== */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Tu plan actual
            </h2>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${planInfo.color}`}>
              {planInfo.name}
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conversaciones usadas</span>
                <span className="font-semibold text-[#0D1B2A]">
                  {userProfile?.conversations_used ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Límite mensual</span>
                <span className="font-semibold text-[#0D1B2A]">
                  {userProfile?.conversations_limit ?? 50}
                </span>
              </div>
              {/* Barra de progreso */}
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#00C48C] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((userProfile?.conversations_used ?? 0) /
                        (userProfile?.conversations_limit ?? 50)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Botón upgrade (si no es partner) */}
            {userProfile?.plan !== 'partner' && (
              <a
                href="/dashboard/agentes"
                className="block w-full text-center bg-[#0D1B2A] hover:bg-[#162436] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Mejorar plan →
              </a>
            )}
          </div>

          {/* Info de estado del agente */}
          {agent && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Estado del agente
              </h2>
              <div className={`flex items-center gap-2 text-sm font-semibold ${
                agent.status === 'active' ? 'text-[#00C48C]' : 'text-gray-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  agent.status === 'active' ? 'bg-[#00C48C] animate-pulse' : 'bg-gray-300'
                }`} />
                {agent.status === 'active' ? 'Activo' : 'Inactivo'}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                El estado se controla desde la tarjeta del agente en Mis Agentes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
