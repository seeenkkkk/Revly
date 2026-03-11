import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

// Crear sesión de Stripe Checkout
export async function POST(req: NextRequest) {
  const supabase = createServerSupabase()

  // Verificar que el usuario está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { priceId } = await req.json()

  if (!priceId) {
    return NextResponse.json({ error: 'PriceId requerido' }, { status: 400 })
  }

  try {
    // Crear sesión de checkout en Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      // Pasar el email del usuario si está logueado
      customer_email: session?.user?.email ?? undefined,
      success_url: `${req.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${req.nextUrl.origin}/#precios`,
      metadata: {
        userId: session?.user?.id ?? '',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('Error al crear sesión de Stripe:', err)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
