'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'

export default function AjustesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setEmail(user.email ?? '')
        const { data } = await supabase.from('users').select('full_name, company_name').eq('id', user.id).single()
        if (data) {
          setFullName(data.full_name ?? '')
          setCompanyName(data.company_name ?? '')
        }
      } catch { /* dev */ }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      const supabase = createBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('users').update({ full_name: fullName, company_name: companyName }).eq('id', user.id)
      setSuccess(true)
    } catch { /* dev */ }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-[#0d9488]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="bg-[#0f172a] px-10 pt-10 pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#0d9488] mb-4">Ajustes</p>
          <h1 className="text-[48px] font-black leading-[1.0] tracking-tight text-white">
            Tu cuenta,<br />
            <em className="italic text-[#0d9488]">a tu medida.</em>
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-10 py-10">
        <form onSubmit={handleSave} className="bg-white border border-[#f1f5f9] rounded-3xl p-8 space-y-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Información personal</h2>

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

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Empresa</label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Nombre de tu negocio"
              className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#94a3b8] cursor-not-allowed"
            />
          </div>

          {success && (
            <p className="text-[#0d9488] text-xs font-medium">Cambios guardados correctamente.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}
