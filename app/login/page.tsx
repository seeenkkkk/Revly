'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard/agentes'
  const confirmError = searchParams.get('error') === 'confirmation_failed'

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    confirmError ? 'El enlace de confirmación no es válido o ha expirado.' : null
  )
  const [success, setSuccess] = useState<string | null>(null)

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/agentes`,
      },
    })
    if (error) {
      setError('No se pudo iniciar sesión con Google.')
      setGoogleLoading(false)
    }
    // On success, browser is redirected by Supabase — no need to do anything
  }

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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/agentes`,
        },
      })
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
        <p className="text-[#94a3b8] text-sm mb-6">
          {mode === 'login' ? 'Bienvenido de vuelta.' : 'Empieza a vender con IA hoy.'}
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#fafafa] rounded-2xl px-4 py-3 text-sm font-semibold text-[#0f172a] transition-all disabled:opacity-60 mb-5"
        >
          {googleLoading
            ? <Loader2 size={16} className="animate-spin text-[#94a3b8]" />
            : <GoogleIcon />
          }
          {mode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[#f1f5f9]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#cbd5e1]">o con email</span>
          <div className="flex-1 h-px bg-[#f1f5f9]" />
        </div>

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
            disabled={loading || googleLoading}
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
