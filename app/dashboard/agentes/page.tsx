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
  { key: 'essential', label: 'Starter',       price: '14,99 €/mes', desc: '500 conversaciones' },
  { key: 'growth',    label: 'Growth',         price: '34,99 €/mes', desc: '1.500 conversaciones' },
  { key: 'partner',   label: 'Enterprise AI',  price: '79,99 €/mes', desc: 'Sin límites' },
]

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
  const [selectedPlan, setSelectedPlan] = useState<string>('growth')
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
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#f1f5f9] animate-pulse" />
        <div className="w-32 h-3 rounded-full bg-[#f1f5f9] animate-pulse" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── HERO BANNER ── */}
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-5xl mx-auto">

          {/* Top row */}
          <div className="flex items-center justify-between mb-10">
            <Image
              src="/images/logo-completo.png.png"
              alt="Revly"
              width={100}
              height={32}
              className="h-7 w-auto opacity-90"
            />
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${
              userProfile?.plan === 'partner'
                ? 'bg-[#0d9488]/20 text-[#0d9488] border-[#0d9488]/30'
                : 'bg-white/10 text-white/50 border-white/10'
            }`}>
              {PLAN_LABELS[userProfile?.plan ?? 'free']}
            </span>
          </div>

          {/* Hero content */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
                Mis Agentes
              </p>
              <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white mb-3">
                {deployStatus === 'active'
                  ? <><em className="italic text-[#0d9488]">Activo</em> y vendiendo.</>
                  : <>Crea tu agente,<br /><em className="italic text-[#0d9488]">en minutos.</em></>
                }
              </h1>
              <p className="text-white/40 text-sm">
                Configura, elige tu plan y despliega. Tu agente empieza a vender hoy.
              </p>
            </div>

            {/* Avatar + status */}
            <div className="flex items-center gap-4 bg-white/[0.06] rounded-3xl px-5 py-4 border border-white/[0.08] flex-shrink-0">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/avatar.png.png"
                    alt="Agente"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-[#0f172a] ${
                  deployStatus === 'active' ? 'bg-[#0d9488]' :
                  deployStatus === 'error'  ? 'bg-red-500' :
                  deployStatus === 'deploying' ? 'bg-amber-400' :
                  'bg-white/20'
                }`}>
                  {deployStatus === 'active' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d9488] opacity-60" />
                  )}
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{agentName || 'Revly Agent'}</p>
                <p className={`text-xs font-medium mt-0.5 ${
                  deployStatus === 'active' ? 'text-[#0d9488]' :
                  deployStatus === 'deploying' ? 'text-amber-400' :
                  'text-white/30'
                }`}>
                  {deployStatus === 'active' ? '● En línea ahora' :
                   deployStatus === 'deploying' ? '● Redirigiendo...' :
                   '○ Sin desplegar'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats row — solo si hay datos */}
          {userProfile && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { v: userProfile.conversations_used, l: 'Conversaciones' },
                { v: `${usedPct}%`, l: 'Capacidad usada' },
                { v: userProfile.conversations_limit, l: 'Límite del plan' },
              ].map(({ v, l }) => (
                <div key={l} className="bg-white/[0.05] rounded-2xl px-4 py-3 border border-white/[0.06]">
                  <p className="text-white font-black text-xl">{v}</p>
                  <p className="text-white/30 text-xs uppercase tracking-wide mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── BANNERS ── */}
      {checkoutSuccess && (
        <div className="max-w-5xl mx-auto px-10 pt-6">
          <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-3xl px-5 py-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-[#0d9488] flex-shrink-0" />
            <p className="text-[#0f766e] text-sm font-medium">
              ¡Pago completado! Tu agente está siendo desplegado. Recibirás confirmación por email.
            </p>
          </div>
        </div>
      )}
      {checkoutCanceled && (
        <div className="max-w-5xl mx-auto px-10 pt-6">
          <div className="bg-amber-50 border border-amber-100 rounded-3xl px-5 py-4 flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-sm font-medium">
              Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
            </p>
          </div>
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="max-w-5xl mx-auto px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Pasos de configuración ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Paso 1 */}
          <div className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#f8fafc]">
              <span className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">1</span>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#0f172a]">
                Identidad del agente
              </h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Nombre del agente
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Ej: Asistente de Ventas"
                  className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-medium text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
                  Número WhatsApp Business
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-mono font-medium text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#f8fafc]">
              <span className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">2</span>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#0f172a]">
                Instrucciones del agente
              </h2>
              <span className="ml-auto text-[#cbd5e1] text-xs tabular-nums">{systemPrompt.length} caracteres</span>
            </div>
            <div className="px-6 py-5">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
                placeholder="Eres un asistente de ventas profesional de... Responde siempre en español. Tu objetivo es..."
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all resize-none leading-relaxed mb-4"
              />

              {/* Generador IA */}
              <div className="bg-[#fafafa] border border-[#f1f5f9] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={13} className="text-[#0d9488]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#0d9488]">Generar con IA</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={businessDesc}
                    onChange={(e) => setBusinessDesc(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGeneratePrompt()}
                    placeholder='Describe tu negocio: "Soy una inmobiliaria en Madrid"'
                    className="flex-1 bg-white border border-[#f1f5f9] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] transition-all"
                  />
                  <button
                    onClick={handleGeneratePrompt}
                    disabled={generatingPrompt || !businessDesc.trim()}
                    className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 whitespace-nowrap"
                  >
                    {generatingPrompt
                      ? <><Loader2 size={12} className="animate-spin" />Generando...</>
                      : <>Generar</>
                    }
                  </button>
                </div>
              </div>
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

        {/* ── RIGHT: Plan + Deploy ── */}
        <div className="space-y-4">

          {/* Paso 3 — Plan */}
          <div className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-[#f8fafc]">
              <span className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">3</span>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#0f172a]">
                Elige tu plan
              </h2>
            </div>
            <div className="px-4 py-4 space-y-2">
              {CHECKOUT_PLANS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPlan(p.key)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all ${
                    selectedPlan === p.key
                      ? 'bg-[#0f172a] border-[#0f172a] text-white'
                      : 'bg-[#fafafa] border-[#f1f5f9] text-[#64748b] hover:border-[#e2e8f0]'
                  }`}
                >
                  <div>
                    <p className={`font-bold text-sm ${selectedPlan === p.key ? 'text-white' : 'text-[#0f172a]'}`}>{p.label}</p>
                    <p className={`text-[10px] mt-0.5 ${selectedPlan === p.key ? 'text-white/50' : 'text-[#cbd5e1]'}`}>{p.desc}</p>
                  </div>
                  <span className={`text-xs font-mono font-bold ${selectedPlan === p.key ? 'text-[#0d9488]' : 'text-[#cbd5e1]'}`}>
                    {p.price}
                  </span>
                </button>
              ))}
            </div>

            {/* Deploy button */}
            <div className="px-4 pb-5">
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className={`w-full py-4 rounded-full font-black text-[13px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  deployStatus === 'active'
                    ? 'bg-[#fafafa] hover:bg-[#f1f5f9] text-[#64748b] border border-[#f1f5f9]'
                    : 'bg-[#0d9488] hover:bg-[#0f766e] text-white disabled:opacity-60'
                }`}
              >
                {isDeploying ? (
                  <><Loader2 size={15} className="animate-spin" />Redirigiendo...</>
                ) : deployStatus === 'active' ? (
                  <><RefreshCw size={15} />Redesplegar</>
                ) : (
                  <><Zap size={15} />Activar agente →</>
                )}
              </button>
              <p className="text-center text-[#cbd5e1] text-[10px] mt-3 uppercase tracking-wider">
                Pago seguro · Cancela cuando quieras
              </p>
            </div>
          </div>

          {/* Uso del plan */}
          {userProfile && (
            <div className="bg-white border border-[#f1f5f9] rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart2 size={13} className="text-[#0d9488]" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Uso del plan</h2>
                </div>
                <span className="text-[#cbd5e1] text-xs tabular-nums">
                  {userProfile.conversations_used} / {userProfile.conversations_limit}
                </span>
              </div>
              <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${usedPct > 80 ? 'bg-red-400' : 'bg-[#0d9488]'}`}
                  style={{ width: `${usedPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#cbd5e1] text-xs">{usedPct}% usado</span>
                {userProfile.plan !== 'partner' && (
                  <a href="/dashboard" className="text-[#0d9488] text-[10px] font-bold uppercase tracking-wider hover:underline underline-offset-4">
                    Mejorar plan →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="bg-[#0f172a] rounded-3xl p-5">
            <div className="space-y-3">
              {[
                { icon: '⚡', text: 'En marcha en menos de 10 min' },
                { icon: '🔒', text: 'Pago seguro con Stripe' },
                { icon: '✦', text: 'Cancela en cualquier momento' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="text-sm">{icon}</span>
                  <p className="text-white/50 text-xs">{text}</p>
                </div>
              ))}
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
