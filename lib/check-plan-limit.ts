import { getServiceSupabase } from '@/lib/supabase'

export interface PlanLimitResult {
  allowed: boolean
  plan: string
  used: number
  limit: number
  remaining: number
  graceEndsAt?: string // ISO timestamp — present when in the 5-hour grace period
}

const GRACE_PERIOD_MS = 5 * 60 * 60 * 1000 // 5 hours in milliseconds

/**
 * Given a WhatsApp number, checks whether the associated agent/user
 * can handle another conversation.
 *
 * Rules:
 * - If conversations_used < conversations_limit → allowed immediately.
 * - If limit is reached for the first time → record limit_reached_at,
 *   allow for 5 hours from that moment (grace period).
 * - If limit_reached_at is set and 5 hours have passed → block.
 */
export async function checkPlanLimit(whatsappNumber: string): Promise<PlanLimitResult> {
  const db = getServiceSupabase()

  const { data: agent, error: agentError } = await db
    .from('agents')
    .select('user_id')
    .eq('whatsapp_number', whatsappNumber)
    .eq('status', 'active')
    .single()

  if (agentError || !agent) {
    return { allowed: false, plan: 'unknown', used: 0, limit: 0, remaining: 0 }
  }

  const { data: user, error: userError } = await db
    .from('users')
    .select('plan, conversations_used, conversations_limit, plan_reset_date, limit_reached_at')
    .eq('id', agent.user_id)
    .single()

  if (userError || !user) {
    return { allowed: false, plan: 'unknown', used: 0, limit: 0, remaining: 0 }
  }

  // Auto-reset monthly counter if past reset date
  const today = new Date().toISOString().slice(0, 10)
  if (user.plan_reset_date && user.plan_reset_date < today) {
    const nextReset = new Date()
    nextReset.setDate(1)
    nextReset.setMonth(nextReset.getMonth() + 1)

    await db
      .from('users')
      .update({
        conversations_used: 0,
        limit_reached_at: null,
        plan_reset_date: nextReset.toISOString().slice(0, 10),
      })
      .eq('id', agent.user_id)

    user.conversations_used = 0
    user.limit_reached_at = null
  }

  const used = user.conversations_used ?? 0
  const limit = user.conversations_limit ?? 500
  const remaining = Math.max(0, limit - used)

  // Under the limit — allow normally
  if (used < limit) {
    return { allowed: true, plan: user.plan ?? 'free', used, limit, remaining }
  }

  // Limit reached — check grace period
  const now = Date.now()

  if (!user.limit_reached_at) {
    // First time hitting the limit — start the 5-hour clock
    await db
      .from('users')
      .update({ limit_reached_at: new Date().toISOString() })
      .eq('id', agent.user_id)

    const graceEndsAt = new Date(now + GRACE_PERIOD_MS).toISOString()
    return { allowed: true, plan: user.plan ?? 'free', used, limit, remaining: 0, graceEndsAt }
  }

  const limitReachedAt = new Date(user.limit_reached_at).getTime()
  const elapsed = now - limitReachedAt

  if (elapsed < GRACE_PERIOD_MS) {
    // Still within the 5-hour grace window
    const graceEndsAt = new Date(limitReachedAt + GRACE_PERIOD_MS).toISOString()
    return { allowed: true, plan: user.plan ?? 'free', used, limit, remaining: 0, graceEndsAt }
  }

  // Grace period expired — block
  return { allowed: false, plan: user.plan ?? 'free', used, limit, remaining: 0 }
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
