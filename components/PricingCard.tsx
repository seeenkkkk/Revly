'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

interface PricingCardProps {
  name: string
  price: number
  features: string[]
  priceId: string | null | undefined
  highlighted?: boolean
}

// Inicializar Stripe en el cliente
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PricingCard({
  name,
  price,
  features,
  priceId,
  highlighted = false,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  // Redirigir al checkout de Stripe o registrar plan gratuito
  const handleCheckout = async () => {
    if (!priceId) {
      // Plan gratuito: autenticar con Google directamente
      window.location.href = `${window.location.origin}/api/auth/google`
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const { sessionId, error } = await res.json()
      if (error) throw new Error(error)

      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error('Error al iniciar el pago:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl p-8 transition-transform hover:-translate-y-1
        ${highlighted
          ? 'bg-[#00C48C] text-[#0D1B2A] shadow-2xl shadow-[#00C48C]/30 scale-105'
          : 'bg-white/5 text-white border border-white/10'
        }
      `}
    >
      {/* Badge plan popular */}
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-[#0D1B2A] text-[#00C48C] text-xs font-bold px-3 py-1 rounded-full">
            MÁS POPULAR
          </span>
        </div>
      )}

      {/* Nombre del plan */}
      <h3 className={`text-xl font-bold mb-2 ${highlighted ? 'text-[#0D1B2A]' : 'text-white'}`}>
        {name}
      </h3>

      {/* Precio */}
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price === 0 ? 'Gratis' : `${price}€`}</span>
        {price > 0 && (
          <span className={`text-sm ml-1 ${highlighted ? 'text-[#0D1B2A]/70' : 'text-white/50'}`}>
            /mes
          </span>
        )}
      </div>

      {/* Características */}
      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <svg
              className={`w-4 h-4 flex-shrink-0 ${highlighted ? 'text-[#0D1B2A]' : 'text-[#00C48C]'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className={highlighted ? 'text-[#0D1B2A]/80' : 'text-white/70'}>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Botón CTA */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`
          w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60
          ${highlighted
            ? 'bg-[#0D1B2A] text-white hover:bg-[#162436]'
            : 'bg-[#00C48C] text-[#0D1B2A] hover:bg-[#00b07e]'
          }
        `}
      >
        {loading ? 'Procesando...' : price === 0 ? 'Empezar gratis' : 'Contratar plan'}
      </button>
    </div>
  )
}
