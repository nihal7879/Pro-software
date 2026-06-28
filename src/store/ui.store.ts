import { create } from 'zustand'

interface UiState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  notificationsOpen: boolean
  searchOpen: boolean
  toggleSidebar: () => void
  setMobileSidebar: (open: boolean) => void
  setNotifications: (open: boolean) => void
  setSearch: (open: boolean) => void
}

export const useUiStore = create<UiState>((set, get) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  notificationsOpen: false,
  searchOpen: false,
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
  setMobileSidebar: (open) => set({ mobileSidebarOpen: open }),
  setNotifications: (open) => set({ notificationsOpen: open }),
  setSearch: (open) => set({ searchOpen: open }),
}))
