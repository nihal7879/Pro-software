import { useRateRevisions } from '@/hooks/useProcurement'
import { formatDate, formatPercent } from '@/lib/format'
import { RateRevisionDetail } from '@/features/procurement/detail-views'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function RateRevisionApproval() {
  const { data, isLoading } = useRateRevisions()

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
    />
  )
}
