import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

// Desactivar el body parser por defecto de Next.js (Stripe necesita el raw body)
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sin firma de Stripe' }, { status: 400 })
  }

  let event: Stripe.Event

  // Verificar que el webhook viene realmente de Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Error al verificar webhook de Stripe:', err)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  // Manejar el evento de pago completado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userEmail = session.customer_email
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    // Obtener el plan según el Price ID de la suscripción
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id

    // Determinar el plan según el Price ID
    let plan: 'pro' | 'business' = 'pro'
    let conversationsLimit = 1000

    if (priceId === process.env.STRIPE_PRICE_BUSINESS) {
      plan = 'business'
      conversationsLimit = 10000
    }

    if (!userEmail) {
      console.error('No se encontró email en la sesión de Stripe')
      return NextResponse.json({ error: 'Email no encontrado' }, { status: 400 })
    }

    // Upsert del usuario en Supabase con los datos del plan
    const { error } = await supabase.from('users').upsert(
      {
        email: userEmail,
        plan,
        conversations_limit: conversationsLimit,
        conversations_used: 0,
        // Guardar el ID de cliente de Stripe para futuras operaciones
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      },
      {
        onConflict: 'email', // Actualizar si el email ya existe
      }
    )

    if (error) {
      console.error('Error al guardar usuario en Supabase:', error)
      return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
    }

    console.log(`Usuario ${userEmail} actualizado al plan ${plan}`)
  }

  // Manejar cancelación de suscripción
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    // Buscar usuario por stripe_customer_id y degradar al plan free
    const { error } = await supabase
      .from('users')
      .update({
        plan: 'free',
        conversations_limit: 50,
        stripe_subscription_id: null,
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Error al degradar usuario a free:', error)
    }
  }

  return NextResponse.json({ received: true })
}
