'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  essential: 'Starter',
  growth: 'Growth & Sales',
  partner: 'Enterprise AI',
}

const PLAN_PRICE: Record<string, string> = {
  free: '0 €/mes',
  essential: '29 €/mes',
  growth: '79 €/mes',
  partner: '199 €/mes',
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-[#00C48C]' : 'bg-white/[0.12]'
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

  // Profile
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifWhatsapp, setNotifWhatsapp] = useState(false)
  const [notifAlerts, setNotifAlerts] = useState(true)

  // Plan
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

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setName(profile.name ?? '')
          setPlan(profile.plan ?? 'free')
        }
      } catch {
        // dev mode
      } finally {
        setLoading(false)
      }
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
    } catch {
      // dev mode
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch {
      // dev mode
    }
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('users').delete().eq('id', user.id)
      await supabase.auth.signOut()
    } catch {
      // dev mode
    }
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] p-10">
        <div className="max-w-2xl mx-auto space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-white/[0.05] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">

      {/* ── HEADER ── */}
      <div className="border-b border-white/[0.07] px-10 pt-10 pb-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#00C48C] text-xs font-semibold uppercase tracking-widest mb-1">
            Ajustes
          </p>
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-white/35 text-sm mt-0.5">
            Gestiona tu cuenta, notificaciones y facturación.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-10 py-8 space-y-6">

        {/* ── PERFIL ── */}
        <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
            Perfil
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00C48C]/20 border border-[#00C48C]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#00C48C] text-xl font-bold">
                {name?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{name || 'Sin nombre'}</p>
              <p className="text-white/40 text-xs mt-0.5">{email}</p>
              <button className="mt-2 text-[#00C48C] text-xs font-semibold hover:underline">
                Cambiar foto
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#00C48C]/50 focus:ring-1 focus:ring-[#00C48C]/20 transition-all"
            />
          </div>

          {/* Email (read-only) */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white/40 cursor-not-allowed"
            />
            <p className="text-white/20 text-xs mt-1.5">El email no se puede cambiar desde aquí.</p>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-[#00C48C] hover:bg-[#00a87a] text-[#0D1B2A] text-sm font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Guardando...
              </>
            ) : 'Guardar cambios'}
          </button>
        </section>

        {/* ── NOTIFICACIONES ── */}
        <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
            Notificaciones
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Notificaciones por email</p>
                <p className="text-white/35 text-xs mt-0.5">Recibe resúmenes y alertas en tu correo</p>
              </div>
              <Toggle enabled={notifEmail} onChange={setNotifEmail} />
            </div>

            <div className="h-px bg-white/[0.06]" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Notificaciones por WhatsApp</p>
                <p className="text-white/35 text-xs mt-0.5">Alertas directamente en tu WhatsApp</p>
              </div>
              <Toggle enabled={notifWhatsapp} onChange={setNotifWhatsapp} />
            </div>

            <div className="h-px bg-white/[0.06]" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Alertas del sistema</p>
                <p className="text-white/35 text-xs mt-0.5">Avisos de caídas o errores del agente</p>
              </div>
              <Toggle enabled={notifAlerts} onChange={setNotifAlerts} />
            </div>
          </div>
        </section>

        {/* ── FACTURACIÓN ── */}
        <section className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-5">
            Facturación
          </h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Plan actual</p>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">{PLAN_LABELS[plan]}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00C48C]/15 text-[#00C48C]">
                  {PLAN_PRICE[plan]}
                </span>
              </div>
            </div>
            <button className="bg-[#00C48C] hover:bg-[#00a87a] text-[#0D1B2A] text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
              Cambiar plan
            </button>
          </div>

          {plan !== 'free' && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p className="text-white/40 text-xs">Próxima factura</p>
              </div>
              <p className="text-white text-sm font-semibold">{nextBillingStr}</p>
            </div>
          )}

          {plan === 'free' && (
            <p className="text-white/25 text-xs mt-2">
              Estás en el plan gratuito. No hay facturación activa.
            </p>
          )}
        </section>

        {/* ── ZONA DE PELIGRO ── */}
        <section className="bg-red-500/[0.04] border border-red-500/[0.15] rounded-2xl p-6">
          <h2 className="text-xs font-semibold text-red-400/70 uppercase tracking-widest mb-1">
            Zona de peligro
          </h2>
          <p className="text-white/30 text-xs mb-5">
            Estas acciones son irreversibles. Procede con cuidado.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] hover:bg-red-500/[0.12] text-red-400 text-sm font-semibold transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/[0.08] hover:bg-red-500/[0.16] text-red-400 text-sm font-semibold transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Eliminar cuenta
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4">
                <p className="text-red-300 text-sm font-semibold mb-1">¿Estás seguro?</p>
                <p className="text-red-400/60 text-xs mb-4">
                  Se eliminarán tu cuenta, agentes y todos los datos permanentemente.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 rounded-xl transition-all"
                  >
                    Sí, eliminar cuenta
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-white/[0.06] hover:bg-white/[0.10] text-white/60 text-sm font-semibold py-2 rounded-xl transition-all"
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
