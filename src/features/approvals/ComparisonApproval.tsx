import { useComparisons } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { ComparisonDetail } from '@/features/procurement/detail-views'
import { useComparisonStore, decideComparison } from '@/store/comparison.store'
import { useAuthStore } from '@/store/auth.store'
import { ApprovalStatus, UserRole } from '@/types'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function ComparisonApproval() {
  const { data, isLoading } = useComparisons()
  const update = useComparisonStore((s) => s.update)
  const role = useAuthStore((s) => s.role)
  const approverName = useAuthStore((s) => s.currentUser?.name ?? 'Approver')

  const records: ApprovalRecord[] = (data ?? []).map((c) => ({
    id: c.id,
    reference: c.compNo,
    primary: c.storeName,
    secondary: `${c.vendors.length} vendors · ${formatDate(c.date)}`,
    amount: c.recommendedVendor,
    status: c.status,
    approvals: c.approvals,
    detail: <ComparisonDetail record={c} />,
  }))

  // HOD acts on Pending; CEO acts after HOD (HOD Approved).
  const openStatuses = role === UserRole.CEO ? [ApprovalStatus.HodApproved] : [ApprovalStatus.Pending]

  const decide = (id: string, action: 'approve' | 'reject', remark: string) => {
    const record = data?.find((c) => c.id === id)
    if (record && role) update(id, decideComparison(record, action, role, approverName, remark))
  }

  return (
    <ApprovalQueue
      title="Comparison Approval"
      description="Approve recommended vendors from quotation comparisons."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'Comparison' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="Comp No"
      primaryLabel="Store"
      openStatuses={openStatuses}
      onApprove={(id, remark) => decide(id, 'approve', remark)}
      onReject={(id, remark) => decide(id, 'reject', remark)}
    />
  )
}
