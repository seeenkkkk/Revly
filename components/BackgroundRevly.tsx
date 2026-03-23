'use client'

import { useEffect, useRef } from 'react'

interface Bubble {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  type: 'circle' | 'chat'
  rotation: number
  vr: number
}

export default function BackgroundRevly() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const bubblesRef = useRef<Bubble[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init bubbles
    const count = 28
    bubblesRef.current = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: 18 + Math.random() * 48,
      opacity: 0.04 + Math.random() * 0.08,
      type: i % 5 === 0 ? 'chat' : 'circle',
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.004,
    }))

    const drawChatBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      const tail = h * 0.25
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r * 2 + tail, y + h)
      ctx.lineTo(x + r * 0.5, y + h + tail)
      ctx.lineTo(x + r * 2, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      bubblesRef.current.forEach(b => {
        // Parallax: slight pull toward mouse
        const dx = mx - canvas.width / 2
        const dy = my - canvas.height / 2
        const px = dx * 0.004
        const py = dy * 0.004

        b.x += b.vx + px * 0.05
        b.y += b.vy + py * 0.05
        b.rotation += b.vr

        // Wrap around
        if (b.x < -b.size * 2) b.x = canvas.width + b.size
        if (b.x > canvas.width + b.size * 2) b.x = -b.size
        if (b.y < -b.size * 2) b.y = canvas.height + b.size
        if (b.y > canvas.height + b.size * 2) b.y = -b.size

        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.rotation)
        ctx.globalAlpha = b.opacity
        ctx.strokeStyle = `rgba(13,148,136,1)`
        ctx.lineWidth = 1.2

        if (b.type === 'chat') {
          const w = b.size * 1.4
          const h = b.size
          drawChatBubble(ctx, -w / 2, -h / 2, w, h, h * 0.22)
          ctx.stroke()
          // Inner lines (like text)
          ctx.globalAlpha = b.opacity * 0.5
          ctx.beginPath()
          ctx.moveTo(-w / 2 + w * 0.15, -h * 0.15)
          ctx.lineTo(w / 2 - w * 0.15, -h * 0.15)
          ctx.moveTo(-w / 2 + w * 0.15, h * 0.12)
          ctx.lineTo(w / 2 - w * 0.35, h * 0.12)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, b.size / 2, 0, Math.PI * 2)
          ctx.stroke()
          // Inner dot
          ctx.globalAlpha = b.opacity * 0.4
          ctx.beginPath()
          ctx.arc(0, 0, b.size * 0.12, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(13,148,136,1)'
          ctx.fill()
        }

        ctx.restore()
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1,
      }}
    />
  )
}
