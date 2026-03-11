import Stripe from 'stripe'

// Cliente de Stripe para el servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

// Planes disponibles con sus precios de Stripe
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    conversations_limit: 50,
    features: [
      '50 conversaciones/mes',
      '1 número de WhatsApp',
      'Soporte por email',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRICE_PRO,
    conversations_limit: 1000,
    features: [
      '1.000 conversaciones/mes',
      '3 números de WhatsApp',
      'Prompt personalizado',
      'Soporte prioritario',
    ],
  },
  business: {
    name: 'Business',
    price: 79,
    priceId: process.env.STRIPE_PRICE_BUSINESS,
    conversations_limit: 10000,
    features: [
      '10.000 conversaciones/mes',
      'Números ilimitados',
      'Integraciones avanzadas',
      'Soporte dedicado 24/7',
    ],
  },
}
