'use client'

import Link from 'next/link'
import { Bot, ArrowRight } from 'lucide-react'

export default function CTACard() {
  return (
    <Link href="/dashboard/agentes" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          borderRadius: 16, padding: '1px',
          background: 'linear-gradient(135deg, rgba(13,148,136,0.5), rgba(13,148,136,0.1), rgba(45,212,191,0.3))',
          boxShadow: '0 8px 40px rgba(13,148,136,0.15)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 50px rgba(13,148,136,0.28)'
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(13,148,136,0.15)'
          ;(e.currentTarget as HTMLElement).style.transform = 'none'
        }}
      >
        <div style={{
          borderRadius: 15, padding: '18px 22px',
          background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(13,20,38,0.95))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} style={{ color: '#0d9488' }} strokeWidth={1.8} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '0 0 2px' }}>
                Configura tu agente WhatsApp
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
                Empieza a recibir y cerrar ventas de forma automática
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#2dd4bf', fontSize: 12, fontWeight: 700,
            background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.25)',
            borderRadius: 99, padding: '6px 14px', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Configurar <ArrowRight size={13} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  )
}
