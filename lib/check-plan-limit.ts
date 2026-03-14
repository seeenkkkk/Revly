import { getServiceSupabase } from '@/lib/supabase'

export interface PlanLimitResult {
  allowed: boolean
  plan: string
  used: number
  limit: number
  remaining: number
}

/**
 * Given a WhatsApp number, checks whether the associated agent/user
 * has remaining conversations for this billing period.
 *
 * Usage (e.g. in your n8n webhook handler or API route):
 *   const result = await checkPlanLimit('+34600000000')
 *   if (!result.allowed) return "Lo siento, límite alcanzado."
 */
export async function checkPlanLimit(whatsappNumber: string): Promise<PlanLimitResult> {
  const db = getServiceSupabase()

  // Find the agent by whatsapp_number, join to the user profile
  const { data: agent, error: agentError } = await db
    .from('agents')
    .select('user_id')
    .eq('whatsapp_number', whatsappNumber)
    .eq('status', 'active')
    .single()

  if (agentError || !agent) {
    // No active agent found — deny by default
    return { allowed: false, plan: 'unknown', used: 0, limit: 0, remaining: 0 }
  }

  const { data: user, error: userError } = await db
    .from('users')
    .select('plan, conversations_used, conversations_limit, plan_reset_date')
    .eq('id', agent.user_id)
    .single()

  if (userError || !user) {
    return { allowed: false, plan: 'unknown', used: 0, limit: 0, remaining: 0 }
  }

  // Auto-reset counter if we're past the reset date
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  if (user.plan_reset_date && user.plan_reset_date < today) {
    const nextMonth = new Date()
    nextMonth.setDate(1)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextResetDate = nextMonth.toISOString().slice(0, 10)

    await db
      .from('users')
      .update({ conversations_used: 0, plan_reset_date: nextResetDate })
      .eq('id', agent.user_id)

    user.conversations_used = 0
  }

  const used = user.conversations_used ?? 0
  const limit = user.conversations_limit ?? 500
  const remaining = Math.max(0, limit - used)
  const allowed = used < limit

  return {
    allowed,
    plan: user.plan ?? 'free',
    used,
    limit,
    remaining,
  }
}

/**
 * Increments conversations_used by 1 for the user owning the given WhatsApp number.
 * Call this after a conversation is successfully handled.
 */
export async function incrementConversationCount(whatsappNumber: string): Promise<void> {
  const db = getServiceSupabase()

  const { data: agent } = await db
    .from('agents')
    .select('user_id')
    .eq('whatsapp_number', whatsappNumber)
    .eq('status', 'active')
    .single()

  if (!agent) return

  await db.rpc('increment_conversations', { user_id_input: agent.user_id })
}
