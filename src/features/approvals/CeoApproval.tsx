import { useNewMaterials } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { NewMaterialDetail } from '@/features/procurement/detail-views'
import { useNewMaterialStore } from '@/store/newMaterial.store'
import { useAuthStore } from '@/store/auth.store'
import { applyDecision } from '@/lib/approval'
import { ApprovalStatus } from '@/types'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function CeoApproval() {
  const { data, isLoading } = useNewMaterials()
  const update = useNewMaterialStore((s) => s.update)
  const role = useAuthStore((s) => s.role)
  const approverName = useAuthStore((s) => s.currentUser?.name ?? 'CEO')

  const decide = (id: string, action: 'approve' | 'reject', remark: string) => {
    const record = data?.find((n) => n.id === id)
    if (record && role) update(id, applyDecision(record, action, role, approverName, remark))
  }

  const records: ApprovalRecord[] = (data ?? []).map((n) => ({
    id: n.id,
    reference: n.formNo,
    primary: n.supplierName,
    secondary: `${n.department} · ${formatDate(n.date)}`,
    amount: `${n.lines.length} item(s)`,
    status: n.status,
    approvals: n.approvals,
    detail: <NewMaterialDetail record={n} />,
  }))

  return (
    <ApprovalQueue
      title="New Material — CEO Approval"
      description="Final executive sign-off on new material forms."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'New Material — CEO' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="Form No"
      primaryLabel="Supplier"
      openStatuses={[ApprovalStatus.HodApproved]}
      onApprove={(id, remark) => decide(id, 'approve', remark)}
      onReject={(id, remark) => decide(id, 'reject', remark)}
    />
  )
}
