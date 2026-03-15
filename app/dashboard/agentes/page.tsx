'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react'

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black transition-all ${
            current >= s ? 'bg-[#0d9488] text-white' : 'bg-[#f1f5f9] text-[#94a3b8]'
          }`}>
            {current > s ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : s}
          </div>
          {i < 2 && (
            <div className={`flex-1 h-0.5 mx-2 transition-all ${current > s ? 'bg-[#0d9488]' : 'bg-[#f1f5f9]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function AgentesContent() {
  const searchParams = useSearchParams()
  const checkoutSuccess = searchParams.get('success') === 'true'
  const checkoutCanceled = searchParams.get('canceled') === 'true'

  const [loading, setLoading] = useState(true)
  const [hasAgent, setHasAgent] = useState(false)
  const [agentId, setAgentId] = useState<string | null>(null)
  const [agentStatus, setAgentStatus] = useState<'active' | 'inactive'>('inactive')
  const [editMode, setEditMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [agentName, setAgentName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [businessDesc, setBusinessDesc] = useState('')

  const [generatingPrompt, setGeneratingPrompt] = useState(false)
  const [provisioning, setProvisioning] = useState(false)
  const [provisionError, setProvisionError] = useState<string | null>(null)
  const [provisionSuccess, setProvisionSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showFullPrompt, setShowFullPrompt] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single<Agent>()
        if (data) {
          setHasAgent(true)
          setAgentId(data.id)
          setAgentStatus(data.status)
          setAgentName(data.name ?? '')
          setWhatsappNumber(data.whatsapp_number ?? '')
          setSystemPrompt(data.system_prompt ?? '')
        }
      } catch { /* no agent yet */ }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const handleGeneratePrompt = async () => {
    if (!businessDesc.trim()) return
    setGeneratingPrompt(true)
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_description: businessDesc }),
      })
      const data = await res.json()
      if (data.prompt) setSystemPrompt(data.prompt)
    } catch { /* silently ignore */ }
    finally { setGeneratingPrompt(false) }
  }

  const handleProvision = async () => {
    setProvisioning(true)
    setProvisionError(null)
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const agentPayload = {
        user_id: user.id,
        name: agentName,
        whatsapp_number: whatsappNumber,
        system_prompt: systemPrompt,
        status: 'inactive' as const,
      }

      if (agentId) {
        await supabase.from('agents').update(agentPayload).eq('id', agentId)
      } else {
        const { data: newAgent } = await supabase.from('agents').insert(agentPayload).select().single<Agent>()
        if (newAgent) setAgentId(newAgent.id)
      }

      const res = await fetch('/api/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: user.id }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? 'Error al activar el agente')
      }
      setHasAgent(true)
      setAgentStatus('active')
      setEditMode(false)
      setProvisionSuccess(true)
    } catch (err) {
      setProvisionError(err instanceof Error ? err.message : 'Error al activar')
    }
    finally { setProvisioning(false) }
  }

  const handleSaveEdit = async () => {
    if (!agentId) return
    setSaving(true)
    try {
      const supabase = createBrowserSupabase()
      await supabase.from('agents').update({
        name: agentName,
        whatsapp_number: whatsappNumber,
        system_prompt: systemPrompt,
      }).eq('id', agentId)
      setEditMode(false)
    } catch { /* dev */ }
    finally { setSaving(false) }
  }

  const handleToggleStatus = async () => {
    if (!agentId) return
    const newStatus = agentStatus === 'active' ? 'inactive' : 'active'
    try {
      const supabase = createBrowserSupabase()
      await supabase.from('agents').update({ status: newStatus }).eq('id', agentId)
      setAgentStatus(newStatus)
    } catch { /* dev */ }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <Loader2 size={22} className="animate-spin text-[#0d9488]" />
    </div>
  )

  // ── AGENT EXISTS VIEW ──
  if (hasAgent && !editMode) return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-2xl mx-auto space-y-5">

        <div>
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Mi agente</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Gestiona y configura tu agente de WhatsApp</p>
        </div>

        {checkoutSuccess && (
          <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl px-5 py-4 flex items-center gap-3">
            <CheckCircle size={16} className="text-[#0d9488] flex-shrink-0" />
            <p className="text-[#0f766e] text-sm font-medium">¡Pago completado! Tu agente está activo.</p>
          </div>
        )}
        {checkoutCanceled && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-center gap-3">
            <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm font-medium">Pago cancelado. Puedes intentarlo de nuevo.</p>
          </div>
        )}
        {provisionSuccess && (
          <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl px-5 py-4 flex items-center gap-3">
            <CheckCircle size={16} className="text-[#0d9488] flex-shrink-0" />
            <p className="text-[#0f766e] text-sm font-medium">¡Agente activado correctamente!</p>
          </div>
        )}

        {/* Agent card */}
        <div className="bg-[#0d1117] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-white font-black text-xl">{agentName || 'Mi agente'}</p>
              {whatsappNumber && (
                <p className="text-white/40 text-sm mt-1 font-mono">{whatsappNumber}</p>
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0 ${
              agentStatus === 'active'
                ? 'bg-[#0d9488]/15 text-[#0d9488]'
                : 'bg-white/5 text-white/30'
            }`}>
              {agentStatus === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {systemPrompt && (
            <div className="bg-white/[0.04] rounded-xl p-4 mb-5">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">Prompt del sistema</p>
              <p className={`text-white/60 text-sm leading-relaxed ${!showFullPrompt ? 'line-clamp-3' : ''}`}>
                {systemPrompt}
              </p>
              {systemPrompt.length > 120 && (
                <button
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  className="text-[#0d9488] text-xs font-bold mt-2 hover:text-[#0f766e] transition-colors"
                >
                  {showFullPrompt ? 'Ver menos ↑' : 'Ver completo ↓'}
                </button>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold uppercase tracking-wider transition-all"
            >
              Editar
            </button>
            <button
              onClick={handleToggleStatus}
              className={`flex-1 py-3 rounded-full text-[12px] font-bold uppercase tracking-wider transition-all ${
                agentStatus === 'active'
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-[#0d9488] text-white hover:bg-[#0f766e]'
              }`}
            >
              {agentStatus === 'active' ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── EDIT MODE ──
  if (hasAgent && editMode) return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Editar agente</h1>
          <button onClick={() => setEditMode(false)} className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">
            Cancelar
          </button>
        </div>

        <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Nombre del agente</label>
            <input
              type="text"
              value={agentName}
              onChange={e => setAgentName(e.target.value)}
              placeholder="Ej: Asistente de Ventas"
              className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Número WhatsApp</label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              placeholder="+34 600 000 000"
              className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-mono text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Prompt del sistema</label>
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={6}
              className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>
          <button
            onClick={handleSaveEdit}
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )

  // ── ONBOARDING FLOW (no agent) ──
  return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-xl mx-auto">

        <div className="mb-8">
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Configura tu agente</h1>
          <p className="text-[#94a3b8] text-sm mt-1">En 3 pasos, tu agente estará listo para vender</p>
        </div>

        <StepIndicator current={currentStep} />

        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488] mb-1">Paso 1 de 3</p>
              <h2 className="text-[#0f172a] font-black text-lg">¿Cómo se llama tu agente?</h2>
              <p className="text-[#94a3b8] text-sm mt-1">Dale un nombre a tu asistente de ventas</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Nombre del agente</label>
              <input
                type="text"
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                placeholder="Ej: Asistente de Ventas"
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
              />
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!agentName.trim()}
              className="w-full py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488] mb-1">Paso 2 de 3</p>
              <h2 className="text-[#0f172a] font-black text-lg">Configura las instrucciones</h2>
              <p className="text-[#94a3b8] text-sm mt-1">Describe tu negocio para generar el prompt con IA</p>
            </div>

            {/* AI generator */}
            <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-[#0d9488]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488]">Generar con IA</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={businessDesc}
                  onChange={e => setBusinessDesc(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGeneratePrompt()}
                  placeholder='Ej: "Soy una inmobiliaria en Madrid"'
                  className="flex-1 bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] transition-all"
                />
                <button
                  onClick={handleGeneratePrompt}
                  disabled={generatingPrompt || !businessDesc.trim()}
                  className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {generatingPrompt ? <><Loader2 size={12} className="animate-spin" />Generando</> : 'Generar'}
                </button>
              </div>
            </div>

            {/* System prompt (readonly after generation) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Prompt generado</label>
              <textarea
                value={systemPrompt}
                readOnly
                rows={5}
                placeholder="El prompt aparecerá aquí después de generarlo con IA..."
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3.5 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] font-bold text-[12px] uppercase tracking-wider transition-all"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!systemPrompt.trim()}
                className="flex-1 py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488] mb-1">Paso 3 de 3</p>
              <h2 className="text-[#0f172a] font-black text-lg">¿Cuál es tu número de WhatsApp?</h2>
              <p className="text-[#94a3b8] text-sm mt-1">El número donde tu agente atenderá a los clientes</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Número WhatsApp Business</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-mono text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
              />
            </div>

            {provisionError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{provisionError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3.5 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] font-bold text-[12px] uppercase tracking-wider transition-all"
              >
                ← Atrás
              </button>
              <button
                onClick={handleProvision}
                disabled={provisioning || !whatsappNumber.trim()}
                className="flex-1 py-3.5 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {provisioning ? <><Loader2 size={14} className="animate-spin" />Activando...</> : 'Activar mi agente →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgentesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <AgentesContent />
    </Suspense>
  )
}
