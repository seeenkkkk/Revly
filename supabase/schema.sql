-- ============================================================
-- Schema de Supabase para Revly
-- Ejecutar en: Supabase → SQL Editor → New Query
-- ============================================================

-- Tabla de usuarios (sincronizada con auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  google_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'essential', 'growth', 'partner')),
  conversations_used INTEGER NOT NULL DEFAULT 0,
  conversations_limit INTEGER NOT NULL DEFAULT 50,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de agentes de WhatsApp
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Mi Agente',
  whatsapp_number TEXT,
  system_prompt TEXT NOT NULL DEFAULT
    'Eres un asistente de ventas amable y profesional. Tu objetivo es ayudar al cliente a encontrar el producto ideal y guiarle al checkout de forma natural.',
  status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (status IN ('active', 'inactive')),
  plan_type TEXT NOT NULL DEFAULT 'essential',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Políticas de users
CREATE POLICY "Usuarios ven su propio perfil"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios actualizan su propio perfil"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Inserción permitida"
  ON public.users FOR INSERT WITH CHECK (true);

-- Políticas de agents
CREATE POLICY "Usuarios ven sus agentes"
  ON public.agents FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios crean sus agentes"
  ON public.agents FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios actualizan sus agentes"
  ON public.agents FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: crear perfil al registrarse con Google OAuth
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, google_id, plan, conversations_used, conversations_limit)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'sub',
    'free',
    0,
    50
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
