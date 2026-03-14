'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent, UserProfile } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Zap, RefreshCw, Loader2, Sparkles, BarChart2 } from 'lucide-react'

type DeployStatus = 'idle' | 'saving' | 'deploying' | 'active' | 'error'

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  essential: 'Starter',
  growth: 'Growth & Sales',
  partner: 'Enterprise AI',
}

const CHECKOUT_PLANS = [
  { key: 'essential', label: 'Starter',        price: '14,99 €/mes' },
  { key: 'growth',    label: 'Growth & Sales',  price: '34,99 €/mes' },
  { key: 'partner',   label: 'Enterprise AI',   price: '79,99 €/mes' },
]

function StatusBadge({ status }: { status: DeployStatus }) {
  if (status === 'active') return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d9488] opacity-60" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0d9488]" />
      </span>
      <span className="text-[#0d9488] text-sm font-medium">Agente activo</span>
    </div>
  )
  if (status === 'deploying' || status === 'saving') return (
    <div className="flex items-center gap-2">
      <Loader2 size={14} className="animate-spin text-amber-500" />
      <span className="text-amber-600 text-sm font-medium">
        {status === 'saving' ? 'Guardando...' : 'Redirigiendo a pago...'}
      </span>
    </div>
  )
  if (status === 'error') return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
      <span className="text-red-500 text-sm font-medium">Error</span>
    </div>
  )
  return (
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#e2e8f0] flex-shrink-0" />
      <span className="text-[#94a3b8] text-sm font-medium">Sin desplegar</span>
    </div>
  )
}

function AgentesContent() {
  const searchParams = useSearchParams()
  const checkoutSuccess  = searchParams.get('success')  === 'true'
  const checkoutCanceled = searchParams.get('canceled') === 'true'

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle')
  const [deployError, setDeployError] = useState<string | null>(null)

  const [agentName, setAgentName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('essential')
  const [businessDesc, setBusinessDesc] = useState('')
  const [generatingPrompt, setGeneratingPrompt] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const [agentResult, profileResult] = await Promise.all([
          supabase.from('agents').select('*').eq('user_id', user.id)
            .order('created_at', { ascending: false }).limit(1).single<Agent>(),
          supabase.from('users').select('*').eq('id', user.id).single<UserProfile>(),
        ])
        if (agentResult.data) {
          setAgentName(agentResult.data.name ?? '')
          setWhatsappNumber(agentResult.data.whatsapp_number ?? '')
          setSystemPrompt(agentResult.data.system_prompt ?? '')
          if (agentResult.data.status === 'active') setDeployStatus('active')
        }
        if (profileResult.data) setUserProfile(profileResult.data)
      } catch { /* dev mode */ }
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

  const handleDeploy = async () => {
    if (!agentName.trim() || !whatsappNumber.trim() || !systemPrompt.trim()) {
      setDeployError('Completa nombre, número de WhatsApp y prompt antes de continuar.')
      return
    }
    setDeployStatus('deploying')
    setDeployError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name:    agentName,
          phone_number:  whatsappNumber,
          system_prompt: systemPrompt,
          plan:          selectedPlan,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear la sesión de pago')
      window.location.href = data.url
    } catch (err) {
      setDeployStatus('error')
      setDeployError(err instanceof Error ? err.message : 'Error al iniciar el pago.')
    }
  }

  const usedPct = userProfile
    ? Math.min(Math.round((userProfile.conversations_used / userProfile.conversations_limit) * 100), 100)
    : 0

  const isDeploying = deployStatus === 'saving' || deployStatus === 'deploying'

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] p-10">
      <div className="max-w-5xl mx-auto space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-20 bg-[#e2e8f0] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-[#e2e8f0] px-10 pt-8 pb-6">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[#0d9488] text-xs font-semibold uppercase tracking-widest mb-1">
              Mis Agentes
            </p>
            <h1 className="text-2xl font-semibold text-[#0f172a]">
              {agentName || 'Nuevo agente'}
            </h1>
            <p className="text-[#64748b] text-sm mt-0.5">
              Configura y despliega tu agente de WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={deployStatus} />
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              userProfile?.plan === 'partner'
                ? 'bg-[#f0fdfa] text-[#0d9488] border-[#99f6e4]'
                : 'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
            }`}>
              {PLAN_LABELS[userProfile?.plan ?? 'free']}
            </span>
          </div>
        </div>
      </div>

      {/* ── BANNERS ── */}
      {checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-10 pt-6">
          <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-xl px-5 py-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-[#0d9488] flex-shrink-0" />
            <p className="text-[#0f766e] text-sm font-medium">
              ¡Pago completado! Tu agente está siendo desplegado. Recibirás confirmación por email.
            </p>
          </div>
        </div>
      )}
      {checkoutCanceled && (
        <div className="max-w-5xl mx-auto px-10 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm font-medium">
              Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
            </p>
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      <div className="max-w-5xl mx-auto px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Configuración ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-5">
              Configuración del agente
            </h2>

            {/* Nombre */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                Nombre del agente
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Ej: Asistente de Ventas"
                className="w-full bg-white border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#64748b] mb-1.5">
                Número WhatsApp Business
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-white border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] font-mono focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
              />
              <p className="text-[#94a3b8] text-xs mt-1.5">Incluye el prefijo internacional (+34 para España)</p>
            </div>

            {/* Prompt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#64748b]">
                  Prompt del sistema
                </label>
                <span className="text-[#94a3b8] text-xs tabular-nums">
                  {systemPrompt.length} caracteres
                </span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={7}
                placeholder="Eres un asistente de ventas profesional de..."
                className="w-full bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10 transition-all resize-none leading-relaxed"
              />

              {/* Generador con IA */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                  placeholder='Ej: "Soy una inmobiliaria en Madrid"'
                  className="flex-1 bg-white border border-[#e2e8f0] rounded-lg px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
                />
                <button
                  onClick={handleGeneratePrompt}
                  disabled={generatingPrompt || !businessDesc.trim()}
                  className="flex items-center gap-2 bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-[#99f6e4] text-[#0d9488] text-xs font-medium px-4 py-2.5 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {generatingPrompt
                    ? <><Loader2 size={13} className="animate-spin" />Generando...</>
                    : <><Sparkles size={13} />Generar con IA</>
                  }
                </button>
              </div>
              <p className="text-[#94a3b8] text-xs mt-1.5">
                Describe tu negocio y la IA escribirá el prompt por ti.
              </p>
            </div>
          </div>

          {/* Error */}
          {deployError && (
            <div className={`border rounded-xl px-4 py-3 flex items-start gap-3 text-sm ${
              deployStatus === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {deployError}
            </div>
          )}
        </div>

        {/* ── RIGHT: Deploy ── */}
        <div className="space-y-4">

          {/* Estado + deploy */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-sm font-semibold text-[#0f172a] mb-5">Estado del agente</h2>

            {/* Estado visual */}
            <div className={`rounded-lg p-4 mb-5 flex flex-col items-center text-center transition-all ${
              deployStatus === 'active'
                ? 'bg-[#f0fdfa] border border-[#99f6e4]'
                : deployStatus === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-[#f8fafc] border border-[#e2e8f0]'
            }`}>
              {deployStatus === 'active' ? (
                <>
                  <span className="relative flex h-5 w-5 mb-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d9488] opacity-50" />
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#0d9488]" />
                  </span>
                  <p className="text-[#0d9488] font-semibold text-sm">Agente activo</p>
                  <p className="text-[#0d9488]/60 text-xs mt-1">Escuchando en WhatsApp</p>
                </>
              ) : deployStatus === 'deploying' ? (
                <>
                  <Loader2 size={20} className="animate-spin text-amber-500 mb-3" />
                  <p className="text-amber-700 font-semibold text-sm">Redirigiendo a Stripe...</p>
                  <p className="text-amber-500 text-xs mt-1">Preparando sesión de pago</p>
                </>
              ) : deployStatus === 'error' ? (
                <>
                  <AlertCircle size={20} className="text-red-500 mb-3" />
                  <p className="text-red-600 font-semibold text-sm">Error al desplegar</p>
                  <p className="text-red-400 text-xs mt-1">Revisa los datos e inténtalo</p>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-full bg-[#e2e8f0] mb-3 block" />
                  <p className="text-[#64748b] font-medium text-sm">Sin desplegar</p>
                  <p className="text-[#94a3b8] text-xs mt-1">Completa los datos</p>
                </>
              )}
            </div>

            {/* Plan selector */}
            <div className="mb-4">
              <p className="text-xs font-medium text-[#64748b] mb-2">Plan</p>
              <div className="space-y-2">
                {CHECKOUT_PLANS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPlan(p.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-left transition-all text-sm ${
                      selectedPlan === p.key
                        ? 'bg-[#f0fdfa] border-[#0d9488] text-[#0f172a]'
                        : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#0d9488]/40'
                    }`}
                  >
                    <span className="font-medium">{p.label}</span>
                    <span className={`text-xs font-mono ${selectedPlan === p.key ? 'text-[#0d9488]' : 'text-[#94a3b8]'}`}>
                      {p.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón deploy */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className={`w-full py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                deployStatus === 'active'
                  ? 'bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]'
                  : 'bg-[#0d9488] hover:bg-[#0f766e] text-white disabled:opacity-60'
              }`}
            >
              {isDeploying ? (
                <><Loader2 size={15} className="animate-spin" />Redirigiendo a pago...</>
              ) : deployStatus === 'active' ? (
                <><RefreshCw size={15} />Redesplegar agente</>
              ) : (
                <><Zap size={15} />Desplegar agente</>
              )}
            </button>
          </div>

          {/* Uso del plan */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart2 size={14} className="text-[#0d9488]" />
                <h2 className="text-sm font-semibold text-[#0f172a]">Uso del plan</h2>
              </div>
              <span className="text-[#94a3b8] text-xs tabular-nums">
                {userProfile?.conversations_used ?? 0} / {userProfile?.conversations_limit ?? 100}
              </span>
            </div>

            <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${usedPct > 80 ? 'bg-red-400' : 'bg-[#0d9488]'}`}
                style={{ width: `${usedPct}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#94a3b8] text-xs">{usedPct}% usado</span>
              {userProfile?.plan !== 'partner' && (
                <a href="/dashboard" className="text-[#0d9488] text-xs font-medium hover:underline underline-offset-4">
                  Mejorar plan →
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function AgentesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <AgentesContent />
    </Suspense>
  )
}
