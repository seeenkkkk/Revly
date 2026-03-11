'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  userEmail?: string | null
}

export default function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Iniciar sesión con Google OAuth
  const handleLogin = async () => {
    setLoading(true)
    const supabase = createBrowserSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    setLoading(false)
  }

  // Cerrar sesión
  const handleLogout = async () => {
    setLoading(true)
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    router.push('/')
    setLoading(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00C48C] rounded-lg flex items-center justify-center">
            <span className="text-[#0D1B2A] font-bold text-sm">R</span>
          </div>
          <span className="text-white font-semibold text-lg">revly</span>
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="text-white/60 text-sm hidden sm:block">{userEmail}</span>
              <Link
                href="/dashboard"
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-[#00C48C] hover:bg-[#00b07e] text-[#0D1B2A] font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Cargando...' : 'Comenzar gratis'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
