'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Check, ArrowRight } from 'lucide-react'

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

// Mock phone showing WhatsApp conversation
function PhoneMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 220, filter: 'drop-shadow(0 32px 64px rgba(13,148,136,0.25))' }}>
      {/* Phone frame */}
      <div style={{
        borderRadius: 32,
        border: '1.5px solid rgba(13,148,136,0.3)',
        background: 'rgba(13,148,136,0.04)',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Status bar */}
        <div style={{ background: 'rgba(13,148,136,0.12)', padding: '10px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 600 }}>9:41</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[3, 2.5, 2].map((h, i) => (
              <div key={i} style={{ width: 2.5, height: h * 2.5, background: 'rgba(255,255,255,0.4)', borderRadius: 1, alignSelf: 'flex-end' }} />
            ))}
          </div>
        </div>
        {/* Chat header */}
        <div style={{ background: 'rgba(13,148,136,0.15)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(13,148,136,0.15)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#2dd4bf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>R</div>
          <div>
            <p style={{ color: '#fff', fontSize: 10, fontWeight: 700, margin: 0 }}>Revly Agent</p>
            <p style={{ color: 'rgba(13,148,136,0.8)', fontSize: 8, margin: 0 }}>● en línea</p>
          </div>
        </div>
        {/* Messages */}
        <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(8,14,26,0.6)', minHeight: 200 }}>
          {/* Incoming */}
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '12px 12px 12px 3px', padding: '7px 10px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9, margin: 0, lineHeight: 1.4 }}>Hola! Me interesa el piso en venta en Málaga 🏡</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 7, margin: '2px 0 0 4px' }}>10:23</p>
          </div>
          {/* Outgoing (agent) */}
          <div style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(13,148,136,0.35),rgba(13,148,136,0.2))', border: '1px solid rgba(13,148,136,0.3)', borderRadius: '12px 12px 3px 12px', padding: '7px 10px' }}>
              <p style={{ color: '#fff', fontSize: 9, margin: 0, lineHeight: 1.4 }}>¡Buenas! Claro, ese piso tiene 3 hab y 95m². ¿Cuándo te viene bien verlo? 📅</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 7, margin: '2px 4px 0 0', textAlign: 'right' }}>10:23 ✓✓</p>
          </div>
          {/* Incoming */}
          <div style={{ alignSelf: 'flex-start', maxWidth: '75%' }}>
            <div style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: '12px 12px 12px 3px', padding: '7px 10px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 9, margin: 0, lineHeight: 1.4 }}>Mañana por la tarde me va genial!</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 7, margin: '2px 0 0 4px' }}>10:24</p>
          </div>
          {/* Outgoing */}
          <div style={{ alignSelf: 'flex-end', maxWidth: '82%' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(13,148,136,0.35),rgba(13,148,136,0.2))', border: '1px solid rgba(13,148,136,0.3)', borderRadius: '12px 12px 3px 12px', padding: '7px 10px' }}>
              <p style={{ color: '#fff', fontSize: 9, margin: 0, lineHeight: 1.4 }}>Perfecto! Te confirmo cita para mañana 17:00h. ¡Hasta entonces! 🤝</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 7, margin: '2px 4px 0 0', textAlign: 'right' }}>10:24 ✓✓</p>
          </div>
          {/* Typing indicator */}
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 3, padding: '6px 10px', background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.15)', borderRadius: '12px 12px 12px 3px' }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#0d9488', animation: `bounce 1.2s ${d}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      </div>
      {/* Glow underneath */}
      <div style={{ position: 'absolute', bottom: -20, left: '10%', right: '10%', height: 40, background: 'rgba(13,148,136,0.2)', filter: 'blur(20px)', borderRadius: '50%' }} />
    </div>
  )
}

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
    if (oauthError) { setError('No se pudo iniciar sesión con Google.'); setGoogleLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null); setSuccess(null)
    const supabase = createBrowserSupabase()
    if (mode === 'login') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError('Email o contraseña incorrectos.'); setLoading(false); return }
      router.push(redirectTo)
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }
      setSuccess('Revisa tu email para confirmar tu cuenta antes de entrar.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(13,148,136,0.2)} 50%{box-shadow:0 0 40px rgba(13,148,136,0.4)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .shimmer-text {
          background: linear-gradient(90deg, #2dd4bf 0%, #ffffff 30%, #0d9488 60%, #2dd4bf 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .phone-float { animation: float 4s ease-in-out infinite; }
        .input-focus:focus {
          border-color: #0d9488 !important;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.12) !important;
          outline: none;
        }
      `}</style>

      <div className="min-h-screen flex">

        {/* ── LEFT ── */}
        <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #060d1a 0%, #0a1525 40%, #0d1a2e 100%)' }}>

          {/* Radial glow centers */}
          <div style={{ position:'absolute', top:'15%', left:'60%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 65%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'10%', left:'5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(13,148,136,0.07) 0%, transparent 65%)', pointerEvents:'none' }} />

          {/* Rotating ring */}
          <div style={{
            position:'absolute', top:'50%', right:'-80px',
            width:320, height:320, borderRadius:'50%',
            border:'1px solid rgba(13,148,136,0.08)',
            transform:'translateY(-50%)',
            animation:'spin-slow 30s linear infinite',
            pointerEvents:'none'
          }}>
            <div style={{ position:'absolute', top:0, left:'50%', width:6, height:6, borderRadius:'50%', background:'#0d9488', transform:'translate(-50%,-50%)', boxShadow:'0 0 10px rgba(13,148,136,0.8)' }} />
          </div>
          <div style={{
            position:'absolute', top:'50%', right:'-30px',
            width:220, height:220, borderRadius:'50%',
            border:'1px solid rgba(13,148,136,0.05)',
            transform:'translateY(-50%)',
            animation:'spin-slow 20s linear infinite reverse',
            pointerEvents:'none'
          }} />

          {/* Grid */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.025, backgroundImage:'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />

          {/* Logo */}
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', position:'relative', zIndex:1 }}>
            <div style={{ position:'relative', width:34, height:34, borderRadius:10, background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.3)', padding:5, flexShrink:0 }}>
              <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit:'contain', padding:3 }} />
            </div>
            <div>
              <p style={{ color:'#fff', fontWeight:800, fontSize:17, letterSpacing:'-0.5px', margin:0, lineHeight:1.1 }}>revly</p>
              <p style={{ color:'rgba(13,148,136,0.6)', fontSize:9, margin:0, letterSpacing:'0.08em', fontWeight:500 }}>FOR BUSINESS</p>
            </div>
          </Link>

          {/* Center */}
          <div style={{ position:'relative', zIndex:1 }}>
            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, borderRadius:99, padding:'5px 12px', marginBottom:28, background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.18)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#0d9488', boxShadow:'0 0 8px rgba(13,148,136,1)', display:'inline-block', flexShrink:0 }} />
              <span style={{ color:'#0d9488', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>Agente IA para negocios locales</span>
            </div>

            <h2 style={{ color:'#fff', fontSize:46, fontWeight:900, lineHeight:1.05, letterSpacing:'-1.5px', marginBottom:8, margin:'0 0 8px' }}>
              Vende más,<br />trabaja menos.
            </h2>
            <p className="shimmer-text" style={{ fontSize:46, fontWeight:900, lineHeight:1.05, letterSpacing:'-1.5px', marginBottom:32 }}>
              Tu WhatsApp,<br />en automático.
            </p>

            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:14, lineHeight:1.7, marginBottom:40, maxWidth:360 }}>
              Un agente de IA que responde, califica y cierra tus ventas en WhatsApp — las 24h, sin que tú tengas que estar.
            </p>

            {/* Phone mockup */}
            <div className="phone-float">
              <PhoneMockup />
            </div>
          </div>

          {/* Bottom quote */}
          <div style={{ position:'relative', zIndex:1, padding:'14px 16px', borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderLeft:'2.5px solid rgba(13,148,136,0.5)' }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12.5, fontStyle:'italic', lineHeight:1.6, margin:0 }}>
              &ldquo;En la primera semana cerré 3 ventas que yo ni había visto. El agente respondía mientras yo dormía.&rdquo;
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,rgba(13,148,136,0.3),rgba(13,148,136,0.1))', border:'1px solid rgba(13,148,136,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#2dd4bf' }}>C</div>
              <p style={{ color:'rgba(255,255,255,0.22)', fontSize:11, margin:0, fontWeight:500 }}>Carlos M. — Inmobiliaria Costa Sur</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-8 py-12 relative"
          style={{ background:'linear-gradient(160deg, #0d1525 0%, #0a1020 100%)' }}>

          {/* Background noise */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.03, backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize:'24px 24px' }} />
          {/* Glow */}
          <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 65%)', pointerEvents:'none' }} />

          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-10" style={{ textDecoration:'none' }}>
            <div style={{ position:'relative', width:32, height:32, borderRadius:8, background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.3)', padding:5 }}>
              <Image src="/images/logo.png.png" alt="Revly" fill style={{ objectFit:'contain', padding:3 }} />
            </div>
            <span style={{ color:'#fff', fontWeight:800, fontSize:18, letterSpacing:'-0.4px' }}>revly</span>
          </Link>

          <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1 }}>

            {/* Card */}
            <div style={{
              background:'rgba(15,23,42,0.8)',
              backdropFilter:'blur(24px)',
              border:'1px solid rgba(13,148,136,0.18)',
              borderRadius:20,
              padding:'32px 28px',
              boxShadow:'0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}>

              {/* Heading */}
              <div style={{ marginBottom:24 }}>
                <h1 style={{ color:'#fff', fontSize:24, fontWeight:800, letterSpacing:'-0.6px', margin:'0 0 4px' }}>
                  {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
                </h1>
                <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, margin:0 }}>
                  {mode === 'login' ? 'Accede a tu panel de Revly' : 'Empieza sin tarjeta de crédito'}
                </p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={googleLoading || loading}
                style={{
                  width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                  background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:12, padding:'11px 16px', cursor:'pointer', transition:'all 0.2s',
                  fontSize:13, fontWeight:600, color:'#fff', marginBottom:16,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,148,136,0.4)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(13,148,136,0.15)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                {googleLoading ? <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }} /> : <GoogleIcon />}
                {mode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}
              </button>

              {/* Divider */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
                <span style={{ color:'rgba(255,255,255,0.2)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>o con email</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="tu@email.com"
                    className="input-focus"
                    style={{
                      width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                      borderRadius:10, padding:'10px 14px', fontSize:13, color:'#fff',
                      outline:'none', transition:'all 0.2s', boxSizing:'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Contraseña</label>
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                    placeholder="••••••••"
                    className="input-focus"
                    style={{
                      width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                      borderRadius:10, padding:'10px 14px', fontSize:13, color:'#fff',
                      outline:'none', transition:'all 0.2s', boxSizing:'border-box',
                    }}
                  />
                </div>

                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'9px 12px' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', flexShrink:0 }} />
                    <p style={{ color:'#fca5a5', fontSize:12, margin:0, fontWeight:500 }}>{error}</p>
                  </div>
                )}
                {success && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(13,148,136,0.08)', border:'1px solid rgba(13,148,136,0.2)', borderRadius:10, padding:'9px 12px' }}>
                    <Check size={12} style={{ color:'#2dd4bf', flexShrink:0 }} />
                    <p style={{ color:'#5eead4', fontSize:12, margin:0, fontWeight:500 }}>{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    background:'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    border:'1px solid rgba(13,148,136,0.5)',
                    borderRadius:12, padding:'12px 16px', cursor:'pointer',
                    fontSize:13, fontWeight:700, color:'#fff', marginTop:4,
                    boxShadow:'0 4px 24px rgba(13,148,136,0.35)',
                    transition:'all 0.2s', opacity: loading || googleLoading ? 0.6 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!loading && !googleLoading) {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 36px rgba(13,148,136,0.5)'
                      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(13,148,136,0.35)'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  }}
                >
                  {loading ? <Loader2 size={14} style={{ animation:'spin 1s linear infinite' }} /> : null}
                  {mode === 'login' ? 'Entrar al panel' : 'Crear cuenta'}
                  {!loading && <ArrowRight size={14} strokeWidth={2.5} />}
                </button>
              </form>

              <p style={{ textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:12, marginTop:18, marginBottom:0 }}>
                {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null) }}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'#2dd4bf', fontWeight:700, fontSize:12 }}>
                  {mode === 'login' ? 'Regístrate gratis' : 'Iniciar sesión'}
                </button>
              </p>
            </div>

            <p style={{ textAlign:'center', color:'rgba(255,255,255,0.15)', fontSize:11, marginTop:20 }}>
              Al continuar aceptas nuestros{' '}
              <Link href="/terms" style={{ color:'rgba(255,255,255,0.25)', textDecoration:'underline' }}>términos de uso</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background:'#0a1020' }} />}>
      <LoginContent />
    </Suspense>
  )
}
