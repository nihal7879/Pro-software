import { useNewMaterials } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { NewMaterialDetail } from '@/features/procurement/detail-views'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function HodReview() {
  const { data, isLoading } = useNewMaterials()

  const records: ApprovalRecord[] = (data ?? []).map((n) => ({
    id: n.id,
    reference: n.formNo,
    primary: n.department,
    secondary: `${n.supplierName} · ${formatDate(n.date)}`,
    amount: `${n.lines.length} item(s)`,
    status: n.status,
    approvals: n.approvals,
    detail: <NewMaterialDetail record={n} />,
  }))

  return (
    <ApprovalQueue
      title="New Material — HOD Review"
      description="Departmental review of new material approval forms."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'New Material — HOD' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="Form No"
      primaryLabel="Department"
    />
  )
}
