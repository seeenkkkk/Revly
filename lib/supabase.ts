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
  full_name: string | null
  company_name: string | null
  whatsapp_number: string | null
  google_id: string | null
  plan: Plan
  conversations_used: number
  conversations_limit: number
  plan_reset_date: string | null
  limit_reached_at: string | null
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
  openai_api_key: string | null
  status: 'active' | 'inactive'
  plan_type: string
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  plan: 'starter' | 'growth' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  conversations_used: number
  conversations_limit: number
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export type Conversation = {
  id: string
  user_id: string
  whatsapp_number: string | null
  status: 'open' | 'closed' | 'converted'
  started_at: string
  last_message_at: string | null
}

export type Message = {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}
