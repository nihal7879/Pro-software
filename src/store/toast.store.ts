import { create } from 'zustand'
import type { ID } from '@/types'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: ID
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: ID) => void
}

let counter = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${++counter}`
    set({ toasts: [...get().toasts, { ...toast, id }] })
    setTimeout(() => get().dismiss(id), 4000)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

/** Convenience helper to fire toasts outside of React components. */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: 'success' }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: 'error' }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: 'info' }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: 'warning' }),
}
