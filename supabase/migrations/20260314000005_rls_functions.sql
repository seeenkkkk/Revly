-- Migration: RLS on users + agents, helper functions

-- ── RLS on users ─────────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- ── RLS on agents ─────────────────────────────────────────────────────────────
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own agents" ON public.agents;
CREATE POLICY "Users can read own agents"
  ON public.agents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own agents" ON public.agents;
CREATE POLICY "Users can insert own agents"
  ON public.agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own agents" ON public.agents;
CREATE POLICY "Users can update own agents"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

-- ── Monthly reset function ────────────────────────────────────────────────────
-- Call via pg_cron or a scheduled Supabase edge function once a day
CREATE OR REPLACE FUNCTION public.reset_monthly_conversations()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET
    conversations_used = 0,
    limit_reached_at   = NULL,
    plan_reset_date    = (DATE_TRUNC('month', NOW()) + INTERVAL '1 month')::DATE
  WHERE
    plan_reset_date IS NOT NULL
    AND plan_reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── increment_conversations RPC (used by check-plan-limit.ts) ─────────────────
CREATE OR REPLACE FUNCTION public.increment_conversations(user_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET conversations_used = conversations_used + 1
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
