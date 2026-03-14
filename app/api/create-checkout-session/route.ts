import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { requireAuth } from '@/lib/api-auth'

const PRICE_IDS: Record<string, string | undefined> = {
  essential: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  growth:    process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID,
  partner:   process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

  let body: { agent_name: string; phone_number: string; system_prompt: string; plan: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { agent_name, phone_number, system_prompt, plan } = body

  if (!agent_name || !phone_number || !system_prompt || !plan) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    return NextResponse.json({ error: 'Plan no válido' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        agent_name,
        phone_number,
        system_prompt: system_prompt.slice(0, 500), // Stripe metadata max 500 chars per value
        plan,
      },
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url:  `${appUrl}/dashboard?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Error al crear sesión de Stripe:', JSON.stringify(err))
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error desconocido' }, { status: 500 })
  }
}
