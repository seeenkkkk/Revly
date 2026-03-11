import { createClient } from '@supabase/supabase-js'

// Creación lazy del cliente para evitar errores en build con env vars no configuradas
export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Alias para compatibilidad — se evalúa en runtime, no en build
export const supabase = {
  from: (...args: Parameters<ReturnType<typeof getSupabase>['from']>) =>
    getSupabase().from(...args),
}

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
