'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  essential: 'Starter',
  growth: 'Growth & Sales',
  partner: 'Enterprise AI',
}

const PLAN_PRICE: Record<string, string> = {
  free: '0 €/mes',
  essential: '14,99 €/mes',
  growth: '34,99 €/mes',
  partner: '79,99 €/mes',
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-[#0d9488]' : 'bg-[#e2e8f0]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default function ConfiguracionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifWhatsapp, setNotifWhatsapp] = useState(false)
  const [notifAlerts, setNotifAlerts] = useState(true)
  const [plan, setPlan] = useState('free')

  const nextBillingDate = new Date()
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
  const nextBillingStr = nextBillingDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setEmail(user.email ?? '')
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (profile) {
          setName(profile.name ?? '')
          setPlan(profile.plan ?? 'free')
        }
      } catch { /* dev mode */ }
      finally { setLoading(false) }
    }
    fetchUser()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('users').update({ name }).eq('id', user.id)
    } catch { /* dev mode */ }
    finally { setSaving(false) }
  }

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch { /* dev mode */ }
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('users').delete().eq('id', user.id)
      await supabase.auth.signOut()
    } catch { /* dev mode */ }
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <Loader2 size={20} className="animate-spin text-[#cbd5e1]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* HERO */}
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">
            Configuración
          </p>
          <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white">
            Tu cuenta,<br />
            <em className="italic text-[#0d9488]">a tu medida.</em>
          </h1>
          <p className="text-white/40 text-sm mt-3">
            Gestiona tu perfil, notificaciones y facturación.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-10 py-8 space-y-5">

        {/* PERFIL */}
        <section className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden">
          <div className="px-7 pt-6 pb-5 border-b border-[#f8fafc]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Perfil</p>
          </div>
          <div className="px-7 py-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center flex-shrink-0">
                <span className="text-[#0d9488] text-xl font-black">
                  {name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? 'U'}
                </span>
              </div>
              <div>
                <p className="text-[#0f172a] font-bold text-sm">{name || 'Sin nombre'}</p>
                <p className="text-[#94a3b8] text-xs mt-0.5">{email}</p>
                <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0d9488] bg-[#f0fdfa] border border-[#ccfbf1] px-2.5 py-1 rounded-full">
                  {PLAN_LABELS[plan]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm font-medium text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#cbd5e1] cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-[11px] font-bold uppercase tracking-wider px-6 py-3 rounded-full transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <><Loader2 size={13} className="animate-spin" />Guardando...</> : 'Guardar cambios'}
            </button>
          </div>
        </section>

        {/* NOTIFICACIONES */}
        <section className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden">
          <div className="px-7 pt-6 pb-5 border-b border-[#f8fafc]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Notificaciones</p>
          </div>
          <div className="px-7 py-5 space-y-5">
            {[
              { label: 'Notificaciones por email', sub: 'Recibe resúmenes y alertas en tu correo', val: notifEmail, set: setNotifEmail },
              { label: 'Notificaciones por WhatsApp', sub: 'Alertas directamente en tu WhatsApp', val: notifWhatsapp, set: setNotifWhatsapp },
              { label: 'Alertas del sistema', sub: 'Avisos de caídas o errores del agente', val: notifAlerts, set: setNotifAlerts },
            ].map(({ label, sub, val, set }, i, arr) => (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0f172a] text-sm font-semibold">{label}</p>
                    <p className="text-[#94a3b8] text-xs mt-0.5">{sub}</p>
                  </div>
                  <Toggle enabled={val} onChange={set} />
                </div>
                {i < arr.length - 1 && <div className="mt-5 h-px bg-[#f8fafc]" />}
              </div>
            ))}
          </div>
        </section>

        {/* FACTURACIÓN */}
        <section className="bg-white border border-[#f1f5f9] rounded-3xl overflow-hidden">
          <div className="px-7 pt-6 pb-5 border-b border-[#f8fafc]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Facturación</p>
          </div>
          <div className="px-7 py-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1.5">Plan actual</p>
                <div className="flex items-center gap-2.5">
                  <span className="text-[#0f172a] font-black text-xl">{PLAN_LABELS[plan]}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-[#ccfbf1]">
                    {PLAN_PRICE[plan]}
                  </span>
                </div>
              </div>
              <a
                href="/dashboard/agentes"
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-all"
              >
                Cambiar plan
              </a>
            </div>

            {plan !== 'free' && (
              <div className="bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 flex items-center justify-between">
                <p className="text-[#94a3b8] text-xs font-medium">Próxima factura</p>
                <p className="text-[#0f172a] text-sm font-bold">{nextBillingStr}</p>
              </div>
            )}
            {plan === 'free' && (
              <p className="text-[#cbd5e1] text-xs">Sin facturación activa — plan gratuito.</p>
            )}
          </div>
        </section>

        {/* ZONA DE PELIGRO */}
        <section className="bg-white border border-red-100 rounded-3xl overflow-hidden">
          <div className="px-7 pt-6 pb-5 border-b border-red-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-300">Zona de peligro</p>
          </div>
          <div className="px-7 py-5 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-bold transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Eliminar cuenta
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <p className="text-red-600 text-sm font-black mb-1">¿Estás seguro?</p>
                <p className="text-red-400 text-xs mb-4">
                  Se eliminarán tu cuenta, agentes y todos los datos permanentemente.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2.5 rounded-full transition-all"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-white border border-[#f1f5f9] text-[#64748b] text-sm font-semibold py-2.5 rounded-full transition-all hover:border-[#e2e8f0]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
