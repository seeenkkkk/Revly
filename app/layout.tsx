import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Fuente Inter de Google Fonts — tipografía geométrica moderna
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'revly — Tu negocio vendiendo en WhatsApp, solo.',
  description:
    'Automatiza tus ventas con un agente de IA que atiende a tus clientes las 24 horas en WhatsApp.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
