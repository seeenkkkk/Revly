'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard/agentes'

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createBrowserSupabase()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Email o contraseña incorrectos.')
        setLoading(false)
        return
      }
      router.push(redirect)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setSuccess('Revisa tu email para confirmar tu cuenta antes de entrar.')
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4">

      <Link href="/" className="mb-10">
        <Image
          src="/images/logo-completo.png.png"
          alt="Revly"
          width={120}
          height={36}
          className="h-8 w-auto"
        />
      </Link>

      <div className="w-full max-w-sm bg-white border border-[#f1f5f9] rounded-3xl p-8">

        <h1 className="text-[22px] font-black text-[#0f172a] mb-1 tracking-tight">
          {mode === 'login' ? 'Accede a tu cuenta' : 'Crea tu cuenta'}
        </h1>
        <p className="text-[#94a3b8] text-sm mb-8">
          {mode === 'login' ? 'Bienvenido de vuelta.' : 'Empieza a vender con IA hoy.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-[#fafafa] border border-[#f1f5f9] rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:bg-white transition-all"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium">{error}</p>
          )}
          {success && (
            <p className="text-[#0d9488] text-xs font-medium">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-[12px] uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {mode === 'login' ? 'Entrar →' : 'Crear cuenta →'}
          </button>
        </form>

        <p className="text-center text-[#94a3b8] text-xs mt-6">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={switchMode}
            className="text-[#0d9488] font-bold hover:underline underline-offset-4"
          >
            {mode === 'login' ? 'Regístrate gratis' : 'Acceder'}
          </button>
        </p>
      </div>

      <p className="text-[#cbd5e1] text-xs mt-8">
        <Link href="/" className="hover:text-[#94a3b8] transition-colors">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa]" />}>
      <LoginContent />
    </Suspense>
  )
}
