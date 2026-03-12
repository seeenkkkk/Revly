import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase()

  // Obtener sesión del usuario actual
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let body: { priceId: string; plan: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { priceId, plan } = body

  if (!priceId) {
    return NextResponse.json({ error: 'PriceId requerido' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session?.user?.email ?? undefined,
      // URL de éxito con el plan como parámetro para mostrar confirmación
      success_url: `${appUrl}/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        userId: session?.user?.id ?? '',
        plan: plan ?? '',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('Error al crear sesión de Stripe:', err)
    return NextResponse.json(
      { error: 'Error al procesar el pago. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
