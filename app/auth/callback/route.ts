import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const response = NextResponse.redirect(`${origin}/dashboard`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const allCookies = cookieStore.getAll()
    console.log('CALLBACK COOKIES:', allCookies.map(c => c.name))

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('AUTH CALLBACK ERROR:', JSON.stringify(error))
      return NextResponse.redirect(`${origin}/login?error=confirmation_failed&msg=${encodeURIComponent(error.message)}`)
    }

    return response
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
