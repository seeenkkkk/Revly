-- Migration: add limit_reached_at to track the 5-hour grace period
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS limit_reached_at TIMESTAMPTZ;
