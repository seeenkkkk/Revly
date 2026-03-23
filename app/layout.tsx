import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

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
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
