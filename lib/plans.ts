// Revly subscription plan definitions
// Maps to Stripe price IDs via env vars

export type PlanKey = 'starter' | 'growth' | 'pro'

export interface Plan {
  key: PlanKey
  name: string
  price: number          // EUR/month
  conversations: number  // monthly limit (999999 = unlimited)
  priceId: string | undefined
}

export const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: 'starter',
    name: 'Starter',
    price: 14,
    conversations: 500,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  },
  growth: {
    key: 'growth',
    name: 'Growth',
    price: 34,
    conversations: 1500,
    priceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID,
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    price: 79,
    conversations: 999999,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
}

// Resolve a Stripe price ID → plan key
export function getPlanByPriceId(priceId: string): PlanKey {
  for (const plan of Object.values(PLANS)) {
    if (plan.priceId && plan.priceId === priceId) return plan.key
  }
  return 'starter'
}

// Conversation limit for a given plan key
export function getConversationLimit(plan: PlanKey | string): number {
  return PLANS[plan as PlanKey]?.conversations ?? 500
}
