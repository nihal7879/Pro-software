import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole, type User } from '@/types'
import { users } from '@/mocks/users'

interface AuthState {
  currentUser: User | null
  role: UserRole | null
  isAuthenticated: boolean
  login: (role: UserRole) => void
  loginAs: (userId: string) => void
  logout: () => void
}

function userForRole(role: UserRole): User {
  return users.find((u) => u.role === role) ?? users[0]
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      role: null,
      isAuthenticated: false,
      login: (role) => set({ role, currentUser: userForRole(role), isAuthenticated: true }),
      loginAs: (userId) => {
        const user = users.find((u) => u.id === userId) ?? users[0]
        set({ role: user.role, currentUser: user, isAuthenticated: true })
      },
      logout: () => set({ role: null, currentUser: null, isAuthenticated: false }),
    }),
    { name: 'procura.auth' },
  ),
)
