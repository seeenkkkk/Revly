'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function LandingNav({ userEmail }: { userEmail?: string | null }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e2e8f0] transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : ''
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image src="/images/logo.png.png" alt="Revly" width={32} height={32} className="h-8 w-auto" />
          <span className="font-semibold text-[#0f172a] text-[15px] tracking-tight">revly</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
            Cómo funciona
          </a>
          <a href="#funciones" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
            Funciones
          </a>
          <a href="#precios" className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors">
            Precios
          </a>
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {userEmail ? (
            <>
              <span className="text-[#64748b] text-sm">{userEmail}</span>
              <Link
                href="/dashboard/agentes"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Dashboard →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/agentes"
                className="text-[#64748b] hover:text-[#0f172a] text-sm transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/dashboard/agentes"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Empieza gratis
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[#64748b] hover:text-[#0f172a]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#e2e8f0] bg-white px-6 py-4 flex flex-col gap-4">
          <a href="#como-funciona" onClick={() => setMobileOpen(false)} className="text-[#64748b] text-sm py-1">Cómo funciona</a>
          <a href="#funciones" onClick={() => setMobileOpen(false)} className="text-[#64748b] text-sm py-1">Funciones</a>
          <a href="#precios" onClick={() => setMobileOpen(false)} className="text-[#64748b] text-sm py-1">Precios</a>
          <Link
            href="/dashboard/agentes"
            className="bg-[#2563eb] text-white font-medium text-sm px-4 py-2.5 rounded-lg text-center"
          >
            Empieza gratis
          </Link>
        </div>
      )}
    </header>
  )
}
