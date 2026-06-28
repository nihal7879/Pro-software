import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole, type User } from '@/types'
import { users } from '@/mocks/users'

interface AuthState {
  currentUser: User
  role: UserRole
  switchRole: (role: UserRole) => void
}

function userForRole(role: UserRole): User {
  return users.find((u) => u.role === role) ?? users[0]
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: userForRole(UserRole.Purchase),
      role: UserRole.Purchase,
      switchRole: (role) => set({ role, currentUser: userForRole(role) }),
    }),
    { name: 'procura.auth' },
  ),
)
