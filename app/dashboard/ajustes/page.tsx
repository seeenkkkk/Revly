'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'

export default function AjustesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [toast, setToast] = useState(false)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setEmail(user.email ?? '')
        const { data } = await supabase.from('users').select('full_name').eq('id', user.id).single()
        if (data) setFullName(data.full_name ?? '')
      } catch { /* dev */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('users').update({ full_name: fullName }).eq('id', user.id)
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    } catch { /* dev */ }
    finally { setSaving(false) }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch { /* dev */ }
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <Loader2 size={20} className="animate-spin text-[#0d9488]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Ajustes</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Gestiona tu cuenta y preferencias</p>
        </div>

        {/* Cuenta */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4">Cuenta</p>
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#94a3b8] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Nombre</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
              />
            </div>
            {toast && (
              <p className="text-[#0d9488] text-xs font-medium">Cambios guardados</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="py-3 px-6 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              Guardar
            </button>
          </div>
        </section>

        {/* Seguridad */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-4">Seguridad</p>
          <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6">
            <p className="text-[#0f172a] font-semibold text-sm mb-1">Cerrar todas las sesiones</p>
            <p className="text-[#94a3b8] text-xs mb-4">Cierra tu sesión en todos los dispositivos activos</p>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="py-3 px-6 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] font-bold text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {signingOut && <Loader2 size={13} className="animate-spin" />}
              Cerrar sesión
            </button>
          </div>
        </section>

        {/* Zona de peligro */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-300 mb-4">Zona de peligro</p>
          <div className="bg-white border border-red-100 rounded-2xl p-6">
            <p className="text-[#0f172a] font-semibold text-sm mb-1">Eliminar cuenta</p>
            <p className="text-[#94a3b8] text-xs mb-4">Eliminar la cuenta es irreversible. Todos tus datos serán borrados.</p>
            <div className="relative inline-block group">
              <button
                disabled
                className="py-3 px-6 rounded-full bg-red-50 text-red-400 font-bold text-[12px] uppercase tracking-wider cursor-not-allowed opacity-60"
              >
                Eliminar cuenta
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#0f172a] text-white text-xs rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Contacta soporte para eliminar tu cuenta
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
