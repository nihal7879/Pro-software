import { ApprovalStatus, UserRole, type ApprovalStep } from '@/types'

/**
 * Applies an approve/reject decision to a record's approval trail and returns
 * the new status + approvals. Works for single-step (CEO-only) and two-step
 * (HOD → CEO) documents alike.
 */
export function applyDecision<T extends { status: ApprovalStatus; approvals: ApprovalStep[] }>(
  record: T,
  action: 'approve' | 'reject',
  role: UserRole,
  approverName: string,
  remark?: string,
): Pick<T, 'status' | 'approvals'> {
  const today = new Date().toISOString().slice(0, 10)
  const rejected = action === 'reject'
  const steps: ApprovalStep[] = record.approvals.map((s) => ({ ...s }))
  const newStep: ApprovalStep = {
    role,
    approverName,
    status: rejected ? ApprovalStatus.Rejected : ApprovalStatus.Approved,
    remark,
    actedOn: today,
  }
  const idx = steps.findIndex((s) => s.role === role)
  if (idx >= 0) steps[idx] = newStep
  else steps.push(newStep)

  let status = record.status
  if (rejected) {
    status = ApprovalStatus.Rejected
  } else {
    const hod = steps.find((s) => s.role === UserRole.HOD)
    const ceo = steps.find((s) => s.role === UserRole.CEO)
    if (ceo?.status === ApprovalStatus.Approved) status = ApprovalStatus.Approved
    else if (hod?.status === ApprovalStatus.Approved) status = ApprovalStatus.HodApproved
  }
  return { status, approvals: steps } as Pick<T, 'status' | 'approvals'>
}
