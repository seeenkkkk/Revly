import { getServiceSupabase } from '@/lib/supabase'

export interface PlanLimitResult {
  allowed: boolean
  plan: string
  used: number
  limit: number
  remaining: number
  unblocksAt?: string // ISO timestamp — present while blocked, shows when they can use it again
}

const BLOCK_DURATION_MS = 5 * 60 * 60 * 1000 // 5 hours

/**
 * Given a WhatsApp number, checks whether the agent can handle another conversation.
 *
 * Rules:
 * - Under the limit → allowed.
 * - Limit reached → block for 5 hours (saves tokens on our side).
 *   After 5 hours the counter resets to 0 and they can use it again,
 *   same day or the next — independent of the monthly billing reset.
 * - Monthly billing reset (plan_reset_date) is separate and unrelated to this.
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

  const now = Date.now()

  // ── Monthly billing reset (independent of the 5-hour block) ──────────────
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

  // ── 5-hour cooldown reset ─────────────────────────────────────────────────
  // If the user was blocked and 5 hours have now passed → reset counter, unblock
  if (user.limit_reached_at) {
    const blockedAt = new Date(user.limit_reached_at).getTime()
    const elapsed = now - blockedAt

    if (elapsed >= BLOCK_DURATION_MS) {
      // 5 hours are up — reset counter and clear the block
      await db
        .from('users')
        .update({ conversations_used: 0, limit_reached_at: null })
        .eq('id', agent.user_id)

      user.conversations_used = 0
      user.limit_reached_at = null
    } else {
      // Still within the 5-hour block — deny
      const unblocksAt = new Date(blockedAt + BLOCK_DURATION_MS).toISOString()
      return {
        allowed: false,
        plan: user.plan ?? 'free',
        used: user.conversations_used ?? 0,
        limit: user.conversations_limit ?? 500,
        remaining: 0,
        unblocksAt,
      }
    }
  }

  const used = user.conversations_used ?? 0
  const limit = user.conversations_limit ?? 500
  const remaining = Math.max(0, limit - used)

  // ── Under the limit → allow ───────────────────────────────────────────────
  if (used < limit) {
    return { allowed: true, plan: user.plan ?? 'free', used, limit, remaining }
  }

  // ── Just hit the limit → start the 5-hour block ──────────────────────────
  await db
    .from('users')
    .update({ limit_reached_at: new Date().toISOString() })
    .eq('id', agent.user_id)

  const unblocksAt = new Date(now + BLOCK_DURATION_MS).toISOString()
  return { allowed: false, plan: user.plan ?? 'free', used, limit, remaining: 0, unblocksAt }
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
