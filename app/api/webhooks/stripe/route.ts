import { NextRequest, NextResponse } from 'next/server'
import { stripe, getPlanFromPriceId, PLAN_LIMITS } from '@/lib/stripe'
import { getServiceSupabase } from '@/lib/supabase'
import Stripe from 'stripe'

// Requiere el raw body — no usar edge runtime
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sin firma de Stripe' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook inválido:', err)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  // Usar cliente con service role para bypassear RLS
  const db = getServiceSupabase()

  // ============================================================
  // Pago completado → actualizar plan + crear agente
  // ============================================================
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userEmail = session.customer_email
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string
    const userId = session.metadata?.userId

    if (!userEmail) {
      console.error('Email no encontrado en sesión de Stripe')
      return NextResponse.json({ error: 'Email no encontrado' }, { status: 400 })
    }

    // Obtener el priceId de la suscripción para determinar el plan
    let plan: 'essential' | 'growth' | 'partner' = 'essential'
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0]?.price.id
      if (priceId) plan = getPlanFromPriceId(priceId)
    } catch (err) {
      console.error('Error al obtener suscripción:', err)
    }

    const conversationsLimit = PLAN_LIMITS[plan] ?? 50

    // Monthly reset date: 1st of next month
    const nextReset = new Date()
    nextReset.setDate(1)
    nextReset.setMonth(nextReset.getMonth() + 1)
    const planResetDate = nextReset.toISOString().slice(0, 10)

    // Upsert del usuario con el nuevo plan
    const { data: user, error: userError } = await db
      .from('users')
      .upsert(
        {
          email: userEmail,
          plan,
          conversations_limit: conversationsLimit,
          conversations_used: 0,
          plan_reset_date: planResetDate,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          ...(userId ? { id: userId } : {}),
        },
        { onConflict: 'email' }
      )
      .select('id')
      .single()

    if (userError) {
      console.error('Error al actualizar usuario:', userError)
      return NextResponse.json({ error: 'Error en base de datos' }, { status: 500 })
    }

    const finalUserId = user?.id ?? userId

    // Crear el agente en Supabase para este usuario
    if (finalUserId) {
      const planNames: Record<string, string> = {
        essential: 'Agente Essential',
        growth: 'Agente Growth & Marketing',
        partner: 'Partner AI',
      }

      const { error: agentError } = await db.from('agents').insert({
        user_id: finalUserId,
        name: planNames[plan] ?? 'Mi Agente',
        plan_type: plan,
        status: 'active',
        system_prompt:
          'Eres un asistente de ventas amable y profesional. Tu objetivo es ayudar al cliente a encontrar el producto ideal y guiarle al checkout de forma natural y sin presión.',
      })

      if (agentError) {
        // No es fatal — el usuario tiene su plan, el agente se puede crear luego
        console.error('Error al crear agente:', agentError)
      }
    }

    console.log(`✓ Usuario ${userEmail} actualizado al plan ${plan}`)
  }

  // ============================================================
  // Suscripción cancelada → degradar a free
  // ============================================================
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    const { error } = await db
      .from('users')
      .update({
        plan: 'free',
        conversations_limit: 50,
        stripe_subscription_id: null,
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Error al degradar usuario:', error)
    }
  }

  return NextResponse.json({ received: true })
}
