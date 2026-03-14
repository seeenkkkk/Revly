import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export interface AuthResult {
  userId: string
  email: string
}

/**
 * Verifies the Supabase session from the request cookies.
 * Returns the user ID and email if valid, or a 401 NextResponse if not.
 *
 * Usage in an API route:
 *   const auth = await requireAuth(req)
 *   if (auth instanceof NextResponse) return auth  // unauthenticated
 *   const { userId } = auth
 */
export async function requireAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest
): Promise<AuthResult | NextResponse> {
  try {
    const supabase = createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    return {
      userId: session.user.id,
      email: session.user.email ?? '',
    }
  } catch {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }
}
