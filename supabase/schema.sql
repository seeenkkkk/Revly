-- ============================================================
-- Schema de Supabase para revly
-- Ejecutar en el SQL Editor de tu proyecto de Supabase
-- ============================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  google_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  conversations_used INTEGER NOT NULL DEFAULT 0,
  conversations_limit INTEGER NOT NULL DEFAULT 50,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de agentes
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  whatsapp_number TEXT,
  system_prompt TEXT DEFAULT 'Eres un asistente de ventas amable y profesional.',
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Activar RLS en ambas tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Solo el backend puede insertar usuarios (via service role)
CREATE POLICY "Service role puede insertar usuarios"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Políticas para la tabla agents
CREATE POLICY "Los usuarios pueden ver su propio agente"
  ON public.agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear su propio agente"
  ON public.agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propio agente"
  ON public.agents FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Función para crear perfil automáticamente al registrarse
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

-- Trigger que llama a la función al crear un nuevo usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
