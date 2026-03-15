import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const body = await req.json()
  const { userId } = params

  const supabase = getServiceSupabase()
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  const from = body?.whatsapp?.from || body?.from
  const text = body?.whatsapp?.text?.body || body?.text?.body || body?.text || ''

  if (!from || !text) return NextResponse.json({ received: true })

  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (!n8nUrl) return NextResponse.json({ error: 'N8N_WEBHOOK_URL not set' }, { status: 500 })

  await fetch(n8nUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, text, userId, agent_name: agent.name, system_prompt: agent.system_prompt })
  })

  return NextResponse.json({ received: true })
}
