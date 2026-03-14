import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit'

// API routes with strict per-IP rate limits
const API_LIMITS: Record<string, { limit: number; windowSec: number }> = {
  '/api/generate-prompt':         { limit: 10, windowSec: 60 }, // 10/min — calls OpenAI
  '/api/create-checkout-session': { limit: 10, windowSec: 60 },
  '/api/provision':               { limit: 10, windowSec: 60 },
  '/api/checkout':                { limit: 10, windowSec: 60 },
}

// Fallback for any other API route
const GLOBAL_API_LIMIT = { limit: 60, windowSec: 60 }

function getIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = getIP(req)

  // ── Rate limiting for API routes (skip Stripe webhook — it has its own signature check) ──
  if (pathname.startsWith('/api/') && pathname !== '/api/webhooks/stripe') {
    const cfg = API_LIMITS[pathname] ?? GLOBAL_API_LIMIT
    const result = rateLimit({ key: `${ip}:${pathname}`, ...cfg })
    if (!result.allowed) return rateLimitResponse(result.resetAt)
  }

  // ── Auth guard for dashboard routes ──────────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    // Check for any Supabase session cookie (v1 or v2 format)
    const hasSession =
      req.cookies.has('sb-access-token') ||
      [...req.cookies.getAll()].some(
        (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
      )

    if (!hasSession) {
      const url = new URL('/', req.url)
      url.searchParams.set('auth', 'required')
      return NextResponse.redirect(url)
    }
  }

  // ── Security headers on every response ───────────────────────────────────────────────────
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-DNS-Prefetch-Control', 'off')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return res
}

export const config = {
  // All routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
