import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente simple (sin sesión) para uso en webhooks/API routes con service role
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de las tablas de Supabase
export type UserProfile = {
  id: string
  email: string
  google_id: string
  plan: 'free' | 'pro' | 'business'
  conversations_used: number
  conversations_limit: number
  created_at: string
}

export type Agent = {
  id: string
  user_id: string
  whatsapp_number: string
  system_prompt: string
  status: 'active' | 'inactive'
  created_at: string
}
