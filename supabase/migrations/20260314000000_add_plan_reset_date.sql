-- Migration: add plan_reset_date to users table
-- Run in: Supabase → SQL Editor

-- Add plan_reset_date column (tracks when the monthly conversation counter resets)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan_reset_date DATE;

-- Backfill existing rows: reset date is the 1st of the current month
UPDATE public.users
SET plan_reset_date = DATE_TRUNC('month', NOW())::DATE
WHERE plan_reset_date IS NULL;

-- Update trigger to also set plan_reset_date for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, google_id, plan, conversations_used, conversations_limit, plan_reset_date)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'sub',
    'free',
    0,
    50,
    DATE_TRUNC('month', NOW())::DATE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
