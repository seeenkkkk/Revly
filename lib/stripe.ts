import Stripe from 'stripe'

// Cliente de Stripe para el servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

// Planes del producto con precios reales
export const PLANS = {
  essential: {
    name: 'Essential',
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_ESSENTIAL,
    conversations_limit: 50,
    features: [
      'Respuestas automáticas 24/7',
      'Calificación de leads',
      '50 conversaciones/mes',
      'Soporte por email',
    ],
  },
  growth: {
    name: 'Growth & Marketing',
    price: 27.99,
    priceId: process.env.STRIPE_PRICE_GROWTH,
    conversations_limit: 1000,
    features: [
      'Todo lo del Essential',
      'Re-engagement automático',
      '1.000 conversaciones/mes',
      'Analítica de conversiones',
    ],
  },
  partner: {
    name: 'Partner AI',
    price: 49.99,
    priceId: process.env.STRIPE_PRICE_PARTNER,
    conversations_limit: 10000,
    features: [
      'Todo lo del Growth',
      'IA conversacional avanzada',
      'Conversaciones ilimitadas',
      'Soporte dedicado 24/7',
    ],
  },
}

// Mapeo inverso: priceId → nombre de plan
export function getPlanFromPriceId(priceId: string): 'essential' | 'growth' | 'partner' {
  if (priceId === process.env.STRIPE_PRICE_GROWTH) return 'growth'
  if (priceId === process.env.STRIPE_PRICE_PARTNER) return 'partner'
  return 'essential'
}

export const PLAN_LIMITS: Record<string, number> = {
  essential: 50,
  growth: 1000,
  partner: 10000,
  free: 50,
}
