import { createClient } from '@supabase/supabase-js'

// Cliente anon (lazy) — para uso general en server/client
export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cliente con service role — solo en server (webhook, admin ops)
// Bypasa Row Level Security para operaciones del sistema
export function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Alias compatible con imports existentes
export const supabase = {
  from: (...args: Parameters<ReturnType<typeof getSupabase>['from']>) =>
    getSupabase().from(...args),
}

// ============================================================
// Tipos de tablas Supabase
// ============================================================

export type Plan = 'free' | 'essential' | 'growth' | 'partner'

export type UserProfile = {
  id: string
  email: string
  google_id: string | null
  plan: Plan
  conversations_used: number
  conversations_limit: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export type Agent = {
  id: string
  user_id: string
  name: string
  whatsapp_number: string | null
  system_prompt: string
  status: 'active' | 'inactive'
  plan_type: string
  created_at: string
}
