import { create } from 'zustand'

export type AgentTier = 'essential' | 'growth' | 'partner'

interface RevlyStore {
  // Agente seleccionado/desplegado actualmente
  selectedAgent: AgentTier | null
  // IDs de workflows activos
  activeWorkflows: string[]
  // Datos del usuario autenticado
  userData: { email: string; plan: string } | null
  // Sidebar collapsed state
  sidebarCollapsed: boolean

  // Acciones
  setSelectedAgent: (agent: AgentTier | null) => void
  setActiveWorkflows: (workflows: string[]) => void
  setUserData: (data: { email: string; plan: string } | null) => void
  setSidebarCollapsed: (v: boolean) => void
}

export const useRevlyStore = create<RevlyStore>((set) => ({
  selectedAgent: null,
  activeWorkflows: [],
  userData: null,
  sidebarCollapsed: false,

  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setActiveWorkflows: (workflows) => set({ activeWorkflows: workflows }),
  setUserData: (data) => set({ userData: data }),
  setSidebarCollapsed: (v: boolean) => set({ sidebarCollapsed: v }),
}))
