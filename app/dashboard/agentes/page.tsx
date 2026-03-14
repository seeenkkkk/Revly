'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Agent, UserProfile } from '@/lib/supabase'
import Image from 'next/image'
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
    <div className="min-h-screen bg-[#fafafa] p-10">
      <div className="max-w-5xl mx-auto space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-20 bg-[#f1f5f9] rounded-3xl animate-pulse" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-[#f1f5f9] px-10 pt-8 pb-6">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo-completo.png.png"
              alt="Revly"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
            <div className="w-px h-8 bg-[#f1f5f9]" />
            <div>
              <p className="text-[#0d9488] text-[10px] font-bold uppercase tracking-widest mb-1">
                Mis Agentes
              </p>
              <h1 className="text-xl font-black text-[#0f172a] tracking-tight">
                {agentName || 'Nuevo agente'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={deployStatus} />
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
              userProfile?.plan === 'partner'
                ? 'bg-[#f0fdfa] text-[#0d9488] border-[#99f6e4]'
                : 'bg-[#fafafa] text-[#64748b] border-[#f1f5f9]'
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
          <div className="bg-white border border-[#f1f5f9] rounded-3xl p-7">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-6">
              Configuración del agente
            </h2>

            {/* Nombre */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
                Nombre del agente
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Ej: Asistente de Ventas"
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-medium text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
                Número WhatsApp Business
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-medium text-[#0f172a] placeholder-[#cbd5e1] font-mono focus:outline-none focus:border-[#0d9488] focus:bg-white focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
              />
              <p className="text-[#cbd5e1] text-xs mt-2">Incluye el prefijo internacional (+34 para España)</p>
            </div>

            {/* Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  Prompt del sistema
                </label>
                <span className="text-[#cbd5e1] text-xs tabular-nums">
                  {systemPrompt.length} caracteres
                </span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={7}
                placeholder="Eres un asistente de ventas profesional de..."
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white focus:ring-2 focus:ring-[#0d9488]/10 transition-all resize-none leading-relaxed"
              />

              {/* Generador con IA */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                  placeholder='Ej: "Soy una inmobiliaria en Madrid"'
                  className="flex-1 bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
                />
                <button
                  onClick={handleGeneratePrompt}
                  disabled={generatingPrompt || !businessDesc.trim()}
                  className="flex items-center gap-2 bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-[#99f6e4] text-[#0d9488] text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-2xl transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {generatingPrompt
                    ? <><Loader2 size={13} className="animate-spin" />Generando...</>
                    : <><Sparkles size={13} />Generar con IA</>
                  }
                </button>
              </div>
              <p className="text-[#cbd5e1] text-xs mt-2">
                Describe tu negocio y la IA escribirá el prompt por ti.
              </p>
            </div>
          </div>

          {/* Error */}
          {deployError && (
            <div className={`border rounded-3xl px-5 py-4 flex items-start gap-3 text-sm ${
              deployStatus === 'error'
                ? 'bg-red-50 border-red-100 text-red-700'
                : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {deployError}
            </div>
          )}
        </div>

        {/* ── RIGHT: Deploy ── */}
        <div className="space-y-4">

          {/* Estado + deploy */}
          <div className="bg-white border border-[#f1f5f9] rounded-3xl p-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488] mb-5">Estado del agente</h2>

            {/* Estado visual */}
            <div className={`rounded-2xl p-4 mb-5 flex flex-col items-center text-center transition-all ${
              deployStatus === 'active'
                ? 'bg-[#f0fdfa] border border-[#ccfbf1]'
                : deployStatus === 'error'
                ? 'bg-red-50 border border-red-100'
                : 'bg-[#fafafa] border border-[#f1f5f9]'
            }`}>
              {/* Avatar siempre visible */}
              <div className="relative mb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                  <Image
                    src="/images/avatar.png.png"
                    alt="Agente"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Indicador de estado sobre el avatar */}
                <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ring-2 ring-white ${
                  deployStatus === 'active' ? 'bg-[#0d9488]' :
                  deployStatus === 'error'  ? 'bg-red-500' :
                  deployStatus === 'deploying' ? 'bg-amber-400' :
                  'bg-[#e2e8f0]'
                }`}>
                  {deployStatus === 'active' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d9488] opacity-60" />
                  )}
                </span>
              </div>

              {deployStatus === 'active' ? (
                <>
                  <p className="text-[#0d9488] font-semibold text-sm">Agente activo</p>
                  <p className="text-[#0d9488]/60 text-xs mt-0.5">Escuchando en WhatsApp</p>
                </>
              ) : deployStatus === 'deploying' ? (
                <>
                  <Loader2 size={14} className="animate-spin text-amber-500 mb-1" />
                  <p className="text-amber-700 font-semibold text-sm">Redirigiendo a Stripe...</p>
                </>
              ) : deployStatus === 'error' ? (
                <>
                  <p className="text-red-600 font-semibold text-sm">Error al desplegar</p>
                  <p className="text-red-400 text-xs mt-0.5">Revisa los datos e inténtalo</p>
                </>
              ) : (
                <>
                  <p className="text-[#64748b] font-medium text-sm">{agentName || 'Sin nombre'}</p>
                  <p className="text-[#94a3b8] text-xs mt-0.5">Sin desplegar</p>
                </>
              )}
            </div>

            {/* Plan selector */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-3">Plan</p>
              <div className="space-y-2">
                {CHECKOUT_PLANS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPlan(p.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all ${
                      selectedPlan === p.key
                        ? 'bg-[#f0fdfa] border-[#0d9488] text-[#0f172a]'
                        : 'bg-[#fafafa] border-[#f1f5f9] text-[#64748b] hover:border-[#e2e8f0]'
                    }`}
                  >
                    <span className="font-bold text-sm">{p.label}</span>
                    <span className={`text-xs font-mono ${selectedPlan === p.key ? 'text-[#0d9488]' : 'text-[#cbd5e1]'}`}>
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
              className={`w-full py-3.5 rounded-full font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                deployStatus === 'active'
                  ? 'bg-[#fafafa] hover:bg-[#f1f5f9] text-[#64748b] border border-[#f1f5f9]'
                  : 'bg-[#0f172a] hover:bg-[#1e293b] text-white disabled:opacity-60'
              }`}
            >
              {isDeploying ? (
                <><Loader2 size={14} className="animate-spin" />Redirigiendo a pago...</>
              ) : deployStatus === 'active' ? (
                <><RefreshCw size={14} />Redesplegar agente</>
              ) : (
                <><Zap size={14} />Desplegar agente</>
              )}
            </button>
          </div>

          {/* Uso del plan */}
          <div className="bg-white border border-[#f1f5f9] rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={13} className="text-[#0d9488]" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Uso del plan</h2>
              </div>
              <span className="text-[#cbd5e1] text-xs tabular-nums">
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
              <span className="text-[#cbd5e1] text-xs">{usedPct}% usado</span>
              {userProfile?.plan !== 'partner' && (
                <a href="/dashboard" className="text-[#0d9488] text-[10px] font-bold uppercase tracking-wider hover:underline underline-offset-4">
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
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <AgentesContent />
    </Suspense>
  )
}
