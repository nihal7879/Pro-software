import { useRateRevisions } from '@/hooks/useProcurement'
import { formatDate, formatPercent } from '@/lib/format'
import { RateRevisionDetail } from '@/features/procurement/detail-views'
import { useRateRevisionStore } from '@/store/rateRevision.store'
import { useItemStore } from '@/store/masters.store'
import { useAuthStore } from '@/store/auth.store'
import { applyDecision } from '@/lib/approval'
import { ApprovalStatus, UserRole } from '@/types'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function RateRevisionApproval() {
  const { data, isLoading } = useRateRevisions()
  const update = useRateRevisionStore((s) => s.update)
  const items = useItemStore((s) => s.items)
  const updateItem = useItemStore((s) => s.update)
  const role = useAuthStore((s) => s.role)
  const approverName = useAuthStore((s) => s.currentUser?.name ?? 'Approver')

  // HOD acts on Pending; CEO acts after HOD (HOD Approved).
  const openStatuses = role === UserRole.CEO ? [ApprovalStatus.HodApproved] : [ApprovalStatus.Pending]

  const decide = (id: string, action: 'approve' | 'reject', remark: string) => {
    const record = data?.find((r) => r.id === id)
    if (!record || !role) return
    const patch = applyDecision(record, action, role, approverName, remark)
    update(id, patch)
    // On final CEO approval, push the new rate onto the item master + history.
    if (patch.status === ApprovalStatus.Approved) {
      const item = items.find((i) => i.code === record.itemCode || i.name === record.itemName)
      if (item) updateItem(item.id, { currentRate: record.quotedRate, mrp: record.revisedMrp, lastRateRevisedOn: record.date })
    }
  }

  const records: ApprovalRecord[] = (data ?? []).map((r) => ({
    id: r.id,
    reference: r.formNo,
    primary: r.itemName,
    secondary: `${r.supplier} · ${formatDate(r.date)}`,
    amount: `+${formatPercent(r.differenceRatePercent)}`,
    status: r.status,
    approvals: r.approvals,
    detail: <RateRevisionDetail record={r} />,
  }))

  return (
    <ApprovalQueue
      title="Rate Revision Approval"
      description="Review supplier price revisions for approval."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'Rate Revision' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="Form No"
      primaryLabel="Item"
      openStatuses={openStatuses}
      onApprove={(id, remark) => decide(id, 'approve', remark)}
      onReject={(id, remark) => decide(id, 'reject', remark)}
    />
  )
}
