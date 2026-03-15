'use client'

import { useState, useEffect } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Conversation, Message } from '@/lib/supabase'

type FilterTab = 'all' | 'open' | 'closed' | 'converted'

const STATUS_LABELS: Record<string, string> = {
  open: 'Abierta',
  closed: 'Cerrada',
  converted: 'Convertida',
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-500/10 text-blue-500',
  closed: 'bg-[#f1f5f9] text-[#94a3b8]',
  converted: 'bg-[#0d9488]/10 text-[#0d9488]',
}

export default function ConversacionesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false })
        setConversations((data as Conversation[]) ?? [])
      } catch { /* dev */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleViewMessages = async (convId: string) => {
    if (expandedId === convId) {
      setExpandedId(null)
      return
    }
    setExpandedId(convId)
    if (messages[convId]) return
    setLoadingMessages(convId)
    try {
      const supabase = createBrowserSupabase()
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
      setMessages(prev => ({ ...prev, [convId]: (data as Message[]) ?? [] }))
    } catch { /* dev */ }
    finally { setLoadingMessages(null) }
  }

  const filtered = conversations.filter(c => {
    if (activeTab === 'all') return true
    if (activeTab === 'open') return c.status === 'open'
    if (activeTab === 'closed') return c.status === 'closed'
    if (activeTab === 'converted') return c.status === 'converted'
    return true
  })

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'open', label: 'Abiertas' },
    { key: 'closed', label: 'Cerradas' },
    { key: 'converted', label: 'Convertidas' },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] px-8 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-[#0f172a] text-[28px] font-black tracking-tight">Conversaciones</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Todas las conversaciones que gestiona tu agente</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === key
                  ? 'bg-[#0d1117] text-white'
                  : 'bg-white border border-[#f1f5f9] text-[#94a3b8] hover:text-[#0f172a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-[#f1f5f9] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#0d1117] rounded-2xl p-10 text-center">
            <p className="text-white/40 text-sm">
              {conversations.length === 0
                ? 'Aún no hay conversaciones. Cuando tu agente empiece a trabajar, aparecerán aquí.'
                : 'No hay conversaciones en esta categoría.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(conv => (
              <div key={conv.id} className="bg-white border border-[#f1f5f9] rounded-2xl overflow-hidden">

                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0f172a] font-semibold text-sm truncate">
                      {conv.whatsapp_number ?? 'Número desconocido'}
                    </p>
                    <p className="text-[#94a3b8] text-xs mt-0.5">
                      Inicio: {new Date(conv.started_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {conv.last_message_at && (
                        <> · Último: {new Date(conv.last_message_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</>
                      )}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0 ${STATUS_COLORS[conv.status]}`}>
                    {STATUS_LABELS[conv.status]}
                  </span>
                  <button
                    onClick={() => handleViewMessages(conv.id)}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#0d9488] hover:text-[#0f766e] transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {expandedId === conv.id ? 'Cerrar' : 'Ver mensajes'}
                  </button>
                </div>

                {/* Messages panel */}
                {expandedId === conv.id && (
                  <div className="border-t border-[#f1f5f9] bg-[#fafafa] px-5 py-4 max-h-80 overflow-y-auto">
                    {loadingMessages === conv.id ? (
                      <div className="flex justify-center py-6">
                        <div className="w-5 h-5 rounded-full border-2 border-[#0d9488] border-t-transparent animate-spin" />
                      </div>
                    ) : (messages[conv.id] ?? []).length === 0 ? (
                      <p className="text-[#94a3b8] text-xs text-center py-4">Sin mensajes registrados</p>
                    ) : (
                      <div className="space-y-3">
                        {(messages[conv.id] ?? []).map(msg => (
                          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              msg.role === 'user'
                                ? 'bg-[#0d9488] text-white rounded-tr-sm'
                                : 'bg-white border border-[#f1f5f9] text-[#0f172a] rounded-tl-sm'
                            }`}>
                              <p className="leading-relaxed">{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-[#94a3b8]'}`}>
                                {new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
