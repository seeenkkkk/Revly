'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function LandingNav({ userEmail: _userEmail }: { userEmail?: string | null }) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <div
        className={`w-full max-w-[1100px] flex items-center justify-between bg-white/95 backdrop-blur-sm border border-[#e2e8f0] rounded-2xl px-5 h-14 transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]' : ''
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Image src="/images/logo.png.png" alt="Revly" width={28} height={28} className="h-7 w-auto" />
          <span className="font-bold text-[#0f172a] text-[15px] tracking-tight">revly</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-[#64748b] hover:text-[#0f172a] text-[11px] font-semibold uppercase tracking-widest transition-colors">
            Cómo funciona
          </a>
          <a href="#funciones" className="text-[#64748b] hover:text-[#0f172a] text-[11px] font-semibold uppercase tracking-widest transition-colors">
            Funciones
          </a>
          <a href="#precios" className="text-[#64748b] hover:text-[#0f172a] text-[11px] font-semibold uppercase tracking-widest transition-colors">
            Precios
          </a>
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[#64748b] hover:text-[#0f172a] text-[11px] font-semibold uppercase tracking-wider transition-colors"
          >
            Acceder
          </Link>
          <Link
            href="/login"
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-[11px] px-5 py-2.5 rounded-full uppercase tracking-wider transition-colors"
          >
            Empieza ahora
          </Link>
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
        <div className="md:hidden absolute top-20 left-4 right-4 bg-white border border-[#e2e8f0] rounded-2xl px-6 py-5 flex flex-col gap-4 shadow-xl">
          <a href="#como-funciona" onClick={() => setMobileOpen(false)} className="text-[#64748b] text-[11px] uppercase tracking-widest font-semibold py-1">
            Cómo funciona
          </a>
          <a href="#funciones" onClick={() => setMobileOpen(false)} className="text-[#64748b] text-[11px] uppercase tracking-widest font-semibold py-1">
            Funciones
          </a>
          <a href="#precios" onClick={() => setMobileOpen(false)} className="text-[#64748b] text-[11px] uppercase tracking-widest font-semibold py-1">
            Precios
          </a>
          <Link
            href="/login"
            className="bg-[#0f172a] text-white font-bold text-[11px] px-4 py-3 rounded-full text-center uppercase tracking-wider"
          >
            Empieza ahora
          </Link>
        </div>
      )}
    </header>
  )
}
