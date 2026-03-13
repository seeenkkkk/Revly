'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent, UserProfile } from '@/lib/supabase'

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

// ── Status indicator ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DeployStatus; error: string | null }) {
  if (status === 'active') {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]" />
        </span>
        <span className="text-[#22c55e] text-sm font-semibold">Agente Activo</span>
      </div>
    )
  }
  if (status === 'deploying' || status === 'saving') {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
        </span>
        <span className="text-amber-400 text-sm font-semibold">
          {status === 'saving' ? 'Guardando...' : 'Desplegando...'}
        </span>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
        <span className="text-red-400 text-sm font-semibold">Error</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white/20" />
      </span>
      <span className="text-white/30 text-sm font-semibold">Sin desplegar</span>
    </div>
  )
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const checkoutSuccess  = searchParams.get('success')  === 'true'
  const checkoutCanceled = searchParams.get('canceled') === 'true'

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle')
  const [deployError, setDeployError] = useState<string | null>(null)

  // Form fields
  const [agentName, setAgentName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')

  // Plan selector
  const [selectedPlan, setSelectedPlan] = useState<string>('essential')

  // AI generation
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
      } catch {
        // dev mode
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ── Generate prompt with AI ─────────────────────────────────────────────
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
    } catch {
      // silently ignore
    } finally {
      setGeneratingPrompt(false)
    }
  }

  // ── Deploy: save agent data then redirect to Stripe Checkout ───────────
  const handleDeploy = async () => {
    if (!agentName.trim() || !whatsappNumber.trim() || !systemPrompt.trim()) {
      setDeployError('Completa nombre, número de WhatsApp y prompt antes de desplegar.')
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

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setDeployStatus('error')
      setDeployError(err instanceof Error ? err.message : 'Error al iniciar el pago.')
    }
  }

  const usedPct = userProfile
    ? Math.min(Math.round((userProfile.conversations_used / userProfile.conversations_limit) * 100), 100)
    : 0

  // ── Loading skeleton ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] p-10">
        <div className="max-w-5xl mx-auto space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white/[0.05] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const isDeploying = deployStatus === 'saving' || deployStatus === 'deploying'

  return (
    <div className="min-h-screen bg-[#0D1B2A]">

      {/* ── HEADER ── */}
      <div className="border-b border-white/[0.07] px-10 pt-10 pb-6">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[#22c55e] text-xs font-semibold uppercase tracking-widest mb-1">
              Panel de Control
            </p>
            <h1 className="text-2xl font-bold text-white">
              {agentName || 'Nuevo Agente'}
            </h1>
            <p className="text-white/35 text-sm mt-0.5">
              Configura y despliega el cerebro de IA de tu agente de WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <StatusBadge status={deployStatus} error={deployError} />
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              userProfile?.plan === 'partner'
                ? 'bg-[#22c55e]/15 text-[#22c55e]'
                : 'bg-white/[0.08] text-white/50'
            }`}>
              {PLAN_LABELS[userProfile?.plan ?? 'free']}
            </span>
          </div>
        </div>
      </div>

      {/* ── CHECKOUT BANNERS ── */}
      {checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-10 pt-6">
          <div className="bg-[#22c55e]/10 border border-[#22c55e]/25 rounded-xl px-5 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#22c55e] text-sm font-semibold">
              ¡Pago completado! Tu agente está siendo desplegado. Recibirás una confirmación en breve.
            </p>
          </div>
        </div>
      )}
      {checkoutCanceled && (
        <div className="max-w-5xl mx-auto px-10 pt-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-400 text-sm font-semibold">
              Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
            </p>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="max-w-5xl mx-auto px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Config form ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
              Cerebro del Agente
            </h2>

            {/* Agent name */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Nombre del Agente
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Ej: Asistente de Ventas"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Número WhatsApp Business
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20 transition-all font-mono"
              />
              <p className="text-white/25 text-xs mt-1.5">Incluye el prefijo internacional (+34 para España)</p>
            </div>

            {/* System prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Prompt del Sistema
                </label>
                <span className="text-[#22c55e] text-xs font-semibold">
                  {systemPrompt.length} caracteres
                </span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={7}
                placeholder="Eres un asistente de ventas profesional de..."
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/20 transition-all resize-none leading-relaxed"
              />

              {/* AI generator row */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                  placeholder='Ej: "Soy una inmobiliaria en Madrid"'
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#22c55e]/40 transition-all"
                />
                <button
                  onClick={handleGeneratePrompt}
                  disabled={generatingPrompt || !businessDesc.trim()}
                  className="flex items-center gap-2 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] text-xs font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {generatingPrompt ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Analizando...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                      </svg>
                      Generar con IA
                    </>
                  )}
                </button>
              </div>
              <p className="text-white/20 text-xs mt-1.5">
                Describe tu negocio y la IA escribirá el prompt por ti.
              </p>
            </div>
          </div>

          {/* Error message */}
          {deployError && deployStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {deployError}
            </div>
          )}
          {deployError && deployStatus !== 'error' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400">
              {deployError}
            </div>
          )}
        </div>

        {/* ── RIGHT: Deploy panel ── */}
        <div className="space-y-4">

          {/* Deploy card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-6">
              Estado en Tiempo Real
            </h2>

            {/* Big status display */}
            <div className={`rounded-xl p-5 mb-5 flex flex-col items-center text-center transition-all duration-500 ${
              deployStatus === 'active'
                ? 'bg-[#22c55e]/10 border border-[#22c55e]/25'
                : deployStatus === 'error'
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-white/[0.03] border border-white/[0.06]'
            }`}>
              {deployStatus === 'active' ? (
                <>
                  <span className="relative flex h-5 w-5 mb-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60" />
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#22c55e]" />
                  </span>
                  <p className="text-[#22c55e] font-bold text-base">Agente Activo</p>
                  <p className="text-[#22c55e]/60 text-xs mt-1">Escuchando en WhatsApp</p>
                </>
              ) : deployStatus === 'deploying' ? (
                <>
                  <svg className="animate-spin w-6 h-6 text-amber-400 mb-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-amber-400 font-bold text-sm">Redirigiendo a Stripe...</p>
                  <p className="text-amber-400/50 text-xs mt-1">Preparando sesión de pago</p>
                </>
              ) : deployStatus === 'saving' ? (
                <>
                  <svg className="animate-spin w-6 h-6 text-white/40 mb-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-white/50 font-bold text-sm">Preparando pago...</p>
                </>
              ) : deployStatus === 'error' ? (
                <>
                  <svg className="w-6 h-6 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-red-400 font-bold text-sm">Error al desplegar</p>
                  <p className="text-red-400/50 text-xs mt-1">Revisa los datos e inténtalo</p>
                </>
              ) : (
                <>
                  <span className="w-5 h-5 rounded-full bg-white/10 mb-3 block" />
                  <p className="text-white/30 font-semibold text-sm">Sin desplegar</p>
                  <p className="text-white/20 text-xs mt-1">Completa los datos y despliega</p>
                </>
              )}
            </div>

            {/* Plan selector */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                Selecciona tu plan
              </p>
              <div className="space-y-2">
                {CHECKOUT_PLANS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPlan(p.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                      selectedPlan === p.key
                        ? 'bg-[#22c55e]/10 border-[#22c55e]/40 text-white'
                        : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <span className="text-xs font-semibold">{p.label}</span>
                    <span className={`text-xs font-mono ${selectedPlan === p.key ? 'text-[#22c55e]' : 'text-white/30'}`}>
                      {p.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deploy button */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                deployStatus === 'active'
                  ? 'bg-white/[0.07] hover:bg-white/[0.10] text-white/60 border border-white/10'
                  : 'bg-[#22c55e] hover:bg-[#16a34a] text-[#0D1B2A] shadow-lg shadow-[#22c55e]/20 hover:shadow-[#22c55e]/35 disabled:opacity-60'
              }`}
            >
              {isDeploying ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Redirigiendo a pago...
                </>
              ) : deployStatus === 'active' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Redesplegar Agente
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Desplegar Agente
                </>
              )}
            </button>
          </div>

          {/* Plan usage card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                Uso del Plan
              </h2>
              <span className="text-white/50 text-xs font-mono">
                {userProfile?.conversations_used ?? 0}/{userProfile?.conversations_limit ?? 100}
              </span>
            </div>

            <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${usedPct > 80 ? 'bg-red-400' : 'bg-[#22c55e]'}`}
                style={{ width: `${usedPct}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-white/30 text-xs">{usedPct}% usado</span>
              {userProfile?.plan !== 'partner' && (
                <a href="/dashboard/agentes" className="text-[#22c55e] text-xs font-semibold hover:underline">
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
