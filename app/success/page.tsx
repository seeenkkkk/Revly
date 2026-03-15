'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const provision = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No autenticado')
        const res = await fetch('/api/provision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer_id: user.id }),
        })
        if (!res.ok) throw new Error('Error al provisionar')
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    provision()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .pop-in { animation: popIn 0.4s ease-out forwards; }
      `}</style>

      <div className="bg-[#0d1117] rounded-2xl p-10 max-w-sm w-full text-center">

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={32} className="animate-spin text-[#0d9488]" />
            <p className="text-white/40 text-sm">Activando tu agente...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            {/* Animated checkmark */}
            <div className="pop-in w-20 h-20 rounded-full bg-[#0d9488]/10 border border-[#0d9488]/20 flex items-center justify-center mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="text-white font-black text-[24px] tracking-tight mb-2">¡Tu agente está listo!</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              En unos minutos tu agente estará activo en WhatsApp.
            </p>

            <Link
              href="/dashboard"
              className="block w-full py-3.5 rounded-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-black text-[12px] uppercase tracking-wider transition-all"
            >
              Ir a mi panel →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>

            <h1 className="text-white font-black text-[22px] tracking-tight mb-2">Hubo un problema</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Hubo un problema activando tu agente. Tu pago se procesó correctamente.
            </p>

            <button
              onClick={() => { setStatus('loading'); window.location.reload() }}
              className="w-full py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all mb-3"
            >
              Reintentar
            </button>
            <Link
              href="/dashboard"
              className="block text-white/30 hover:text-white/60 text-sm transition-colors"
            >
              Ir al panel →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1a]" />}>
      <SuccessContent />
    </Suspense>
  )
}
