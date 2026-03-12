import { redirect } from 'next/navigation'

// Redirigir la raíz del dashboard a Mis Agentes (vista por defecto)
export default function DashboardPage() {
  redirect('/dashboard/agentes')
}
