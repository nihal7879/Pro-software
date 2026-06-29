import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { materialRequests as seed } from '@/mocks/materialRequests'
import { ApprovalStatus, UserRole, type ApprovalStep, type MaterialRequest } from '@/types'

interface MaterialRequestState {
  requests: MaterialRequest[]
  /** Add a freshly raised request (status: Pending, awaiting HOD). */
  addRequest: (mr: MaterialRequest) => void
  /** Record an HOD approve/reject decision against a request. */
  decide: (id: string, action: 'approve' | 'reject', approverName: string, remark?: string) => void
  /** Restore the original seed data (handy for re-running a demo). */
  reset: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

export const useMaterialRequestStore = create<MaterialRequestState>()(
  persist(
    (set) => ({
      requests: seed,

      addRequest: (mr) => set((state) => ({ requests: [mr, ...state.requests] })),

      decide: (id, action, approverName, remark) =>
        set((state) => ({
          requests: state.requests.map((m) => {
            if (m.id !== id) return m
            const approved = action === 'approve'
            const stepStatus = approved ? ApprovalStatus.Approved : ApprovalStatus.Rejected
            const hodStep: ApprovalStep = {
              role: UserRole.HOD,
              approverName,
              status: stepStatus,
              remark,
              actedOn: today(),
            }
            // Update the HOD (first) approval step, or add one if absent.
            const approvals = m.approvals.length
              ? m.approvals.map((a, i) => (i === 0 ? { ...a, ...hodStep } : a))
              : [hodStep]
            return {
              ...m,
              status: approved ? ApprovalStatus.HodApproved : ApprovalStatus.Rejected,
              approvals,
            }
          }),
        })),

      reset: () => set({ requests: seed }),
    }),
    { name: 'procura.materialRequests' },
  ),
)
