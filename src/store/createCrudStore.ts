import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CrudState<T> {
  items: T[]
  add: (entity: T) => void
  update: (id: string, patch: Partial<T>) => void
  remove: (id: string) => void
  reset: () => void
}

/**
 * Creates a persisted CRUD store seeded from mock data. Backs the master-data
 * screens so view/edit/delete actually mutate (and survive a refresh, stored
 * as JSON in localStorage).
 */
export function createCrudStore<T extends { id: string }>(name: string, seed: T[]) {
  return create<CrudState<T>>()(
    persist(
      (set) => ({
        items: seed,
        add: (entity) => set((s) => ({ items: [entity, ...s.items] })),
        update: (id, patch) =>
          set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
        remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
        reset: () => set({ items: seed }),
      }),
      { name },
    ),
  )
}
