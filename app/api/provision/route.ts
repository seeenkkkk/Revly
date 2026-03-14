import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/api-auth'

// POST /api/provision
// Triggered after a user completes their configuration.
// Sends a structured webhook to n8n to activate the WhatsApp agent workflow.
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

  try {
    const { customer_id } = await req.json()

    // Ensure the caller can only provision their own account
    if (customer_id !== auth.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (!customer_id) {
      return NextResponse.json({ error: 'customer_id requerido' }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    // Fetch user profile + agent config in parallel
    const [profileResult, agentResult] = await Promise.all([
      supabase.from('users').select('*').eq('id', customer_id).single(),
      supabase.from('agents').select('*').eq('user_id', customer_id).order('created_at', { ascending: false }).limit(1).single(),
    ])

    if (profileResult.error || !profileResult.data) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }
    if (agentResult.error || !agentResult.data) {
      return NextResponse.json({ error: 'Agente no configurado' }, { status: 404 })
    }

    const profile = profileResult.data
    const agent = agentResult.data

    // Structured payload for the n8n workflow
    const webhookPayload = {
      customer_id,
      plan_type: profile.plan ?? 'free',
      openai_api_key: agent.openai_api_key ?? process.env.OPENAI_API_KEY ?? null,
      business_knowledge: agent.system_prompt ?? '',
      whatsapp_number_id: agent.whatsapp_number ?? null,
      agent_name: agent.name ?? 'Agente Revly',
      conversations_limit: profile.conversations_limit ?? 100,
      timestamp: new Date().toISOString(),
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      return NextResponse.json({ error: 'N8N_WEBHOOK_URL no configurada' }, { status: 500 })
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('n8n webhook error:', errorText)
      return NextResponse.json({ error: 'Error al activar el agente en n8n' }, { status: 502 })
    }

    // Mark agent as active in Supabase
    await supabase
      .from('agents')
      .update({ status: 'active' })
      .eq('id', agent.id)

    return NextResponse.json({ success: true, agent_id: agent.id })
  } catch (err) {
    console.error('Provision error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
