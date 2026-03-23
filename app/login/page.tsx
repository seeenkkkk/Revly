'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Check } from 'lucide-react'

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

const BULLETS = [
  'Responde leads en segundos, 24 horas al día',
  'Califica y cierra ventas sin que tú intervengas',
  'Configura tu agente en menos de 10 minutos',
]

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
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
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (oauthError) {
      setError('No se pudo iniciar sesión con Google.')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const supabase = createBrowserSupabase()

    if (mode === 'login') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError('Email o contraseña incorrectos.')
        setLoading(false)
        return
      }
      router.push(redirectTo)
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (signUpError) {
        setError(signUpError.message)
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
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL — branding (hidden on mobile) ─────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] flex-col justify-between p-12 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-[-80px] right-[-80px] w-[380px] h-[380px] bg-[#0d9488]/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] bg-[#0d9488]/[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit: 'contain' }} />
          </div>
          <span className="text-white font-black text-xl tracking-tight">revly</span>
        </Link>

        {/* Center copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#0d9488]/10 border border-[#0d9488]/20 rounded-full px-3 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse flex-shrink-0" />
            <span className="text-[#0d9488] text-[10px] font-bold uppercase tracking-widest">
              Para negocios locales
            </span>
          </div>

          <h2 className="text-[40px] font-black leading-[1.1] tracking-tight text-white mb-6">
            Tu agente WhatsApp<br />
            <em className="italic text-[#0d9488]">que vende mientras<br />duermes.</em>
          </h2>

          <ul className="space-y-4 mt-8">
            {BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#0d9488]/15 border border-[#0d9488]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} className="text-[#0d9488]" strokeWidth={2.5} />
                </span>
                <span className="text-white/60 text-sm leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-l-2 border-[#0d9488]/40 pl-4">
          <p className="text-white/40 text-sm italic leading-relaxed">
            &ldquo;En la primera semana cerré 3 ventas que yo ni había visto.&rdquo;
          </p>
          <p className="text-white/25 text-xs mt-1.5 font-medium">Carlos M. — Inmobiliaria Costa Sur</p>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ───────────────────────────────────── */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit: 'contain' }} />
          </div>
          <span className="text-[#0f172a] font-black text-xl tracking-tight">revly</span>
        </Link>

        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[26px] font-black text-[#0f172a] tracking-tight mb-1">
              {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </h1>
            <p className="text-[#94a3b8] text-sm">
              {mode === 'login'
                ? 'Accede a tu panel de Revly'
                : 'Empieza gratis, sin tarjeta'}
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-xl px-4 py-3.5 text-sm font-semibold text-[#0f172a] transition-all disabled:opacity-60 shadow-sm hover:shadow-md mb-5"
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder-[#cbd5e1] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <p className="text-red-600 text-xs font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-[#f0fdfa] border border-[#99f6e4] rounded-lg px-3 py-2.5">
                <Check size={12} className="text-[#0d9488] flex-shrink-0" />
                <p className="text-[#0d9488] text-xs font-medium">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 shadow-sm hover:shadow-[0_4px_16px_rgba(13,148,136,0.25)]"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {mode === 'login' ? 'Entrar →' : 'Crear cuenta →'}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-[#94a3b8] text-sm mt-6">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={switchMode}
              className="text-[#0d9488] font-bold hover:text-[#0f766e] transition-colors"
            >
              {mode === 'login' ? 'Regístrate gratis' : 'Acceder'}
            </button>
          </p>

          <p className="text-center text-[#cbd5e1] text-xs mt-8">
            Al continuar aceptas nuestros{' '}
            <Link href="/terms" className="underline hover:text-[#94a3b8] transition-colors">
              términos de uso
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  )
}
