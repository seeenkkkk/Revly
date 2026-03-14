import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'

// POST /api/generate-prompt
// Recibe una descripción del negocio y devuelve un system prompt profesional.
// Si OPENAI_API_KEY está configurada usa GPT-4o-mini; si no, genera un template.
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req)
  if (auth instanceof NextResponse) return auth

  try {
    const { business_description } = await req.json()

    if (!business_description?.trim()) {
      return NextResponse.json({ error: 'business_description requerido' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (apiKey) {
      // ── Generación real con OpenAI ──────────────────────────────────────
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 400,
          messages: [
            {
              role: 'system',
              content:
                'Eres un experto en ventas conversacionales y en configurar agentes de IA para WhatsApp. ' +
                'Cuando el usuario describa su negocio, genera un system prompt corto (máx 200 palabras) ' +
                'que defina claramente: nombre del asistente, tono (profesional pero cercano), ' +
                'objetivo principal (cerrar ventas, responder FAQs, calificar leads), ' +
                'y cómo manejar objeciones. Escribe SOLO el prompt, sin explicaciones.',
            },
            {
              role: 'user',
              content: `Mi negocio: ${business_description}`,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Error en OpenAI API')
      }

      const data = await response.json()
      const prompt = data.choices?.[0]?.message?.content?.trim()

      if (!prompt) throw new Error('Respuesta vacía de OpenAI')

      return NextResponse.json({ prompt })
    }

    // ── Fallback: template basado en la descripción ──────────────────────
    const prompt = generateTemplatePrompt(business_description.trim())
    return NextResponse.json({ prompt })
  } catch (err) {
    console.error('generate-prompt error:', err)
    return NextResponse.json({ error: 'Error al generar el prompt' }, { status: 500 })
  }
}

function generateTemplatePrompt(description: string): string {
  return `Eres un asistente de ventas inteligente y profesional de ${description}.

Tu objetivo principal es atender a los clientes de forma rápida, amable y eficaz a través de WhatsApp.

**Cómo actuar:**
- Responde siempre en menos de 30 segundos con mensajes cortos y claros.
- Saluda con calidez y pregunta en qué puedes ayudar.
- Cuando detectes intención de compra, presenta la oferta más relevante con beneficios concretos.
- Ante objeciones de precio, destaca el valor y ofrece facilidades si las hay.
- Si el cliente está listo para comprar, guíale directamente al enlace de pago.
- Si no puedes resolver algo, escala al equipo humano con un mensaje amable.

**Tono:** Profesional, cercano y orientado a resultados. Nunca agresivo.

**Importante:** Nunca inventes información sobre precios o disponibilidad que no conozcas.`
}
