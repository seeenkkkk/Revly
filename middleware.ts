import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware para proteger rutas privadas
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si las credenciales no están configuradas, dejar pasar (modo desarrollo)
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    return res
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey!, {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { session } } = await supabase.auth.getSession()

    // Redirigir al inicio si no hay sesión y se intenta acceder al dashboard
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
  } catch {
    // Error de Supabase — dejar pasar en desarrollo
  }

  return res
}

// Aplicar middleware solo a estas rutas
export const config = {
  matcher: ['/dashboard/:path*'],
}
