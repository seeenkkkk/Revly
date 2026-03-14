import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAuth } from '@/lib/api-auth'

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

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
      customer_email: auth.email || undefined,
      // URL de éxito con el plan como parámetro para mostrar confirmación
      success_url: `${appUrl}/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        userId: auth.userId,
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
