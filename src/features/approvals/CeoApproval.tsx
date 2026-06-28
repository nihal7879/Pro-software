import { useNewMaterials } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { NewMaterialDetail } from '@/features/procurement/detail-views'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function CeoApproval() {
  const { data, isLoading } = useNewMaterials()

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
    />
  )
}
