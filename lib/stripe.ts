import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing env var: STRIPE_SECRET_KEY')
}

// Cliente de Stripe para el servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
})

// Planes del producto con precios reales
export const PLANS = {
  essential: {
    name: 'Starter',
    price: 14.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    conversations_limit: 100,
    tagline: 'El gancho perfecto',
    features: [
      'Respuestas automáticas 24/7',
      'Calificación básica de leads',
      '100 conversaciones/mes',
      'Soporte por email',
    ],
  },
  growth: {
    name: 'Growth & Sales',
    price: 34.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID,
    conversations_limit: 1500,
    tagline: 'El motor de ventas',
    features: [
      'Todo lo del Starter',
      'Re-engagement automático',
      '1.500 conversaciones/mes',
      'Analítica de conversiones',
      'Conexión a 1 CRM (Sheets/Notion)',
    ],
  },
  partner: {
    name: 'Enterprise AI',
    price: 79.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    conversations_limit: 999999,
    tagline: 'Tu socio total',
    features: [
      'Todo lo del Growth',
      'IA con memoria a largo plazo',
      'Conversaciones ilimitadas',
      'Prioridad de ejecución',
      'Soporte dedicado 24/7',
    ],
  },
}

// Mapeo inverso: priceId → nombre de plan
export function getPlanFromPriceId(priceId: string): 'essential' | 'growth' | 'partner' {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID) return 'growth'
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID) return 'partner'
  return 'essential'
}

export const PLAN_LIMITS: Record<string, number> = {
  essential: 100,
  growth: 1500,
  partner: 999999,
  free: 50,
}
