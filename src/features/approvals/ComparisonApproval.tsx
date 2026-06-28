import { useComparisons } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { ComparisonDetail } from '@/features/procurement/detail-views'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function ComparisonApproval() {
  const { data, isLoading } = useComparisons()

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

  return (
    <ApprovalQueue
      title="Comparison Approval"
      description="Approve recommended vendors from quotation comparisons."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'Comparison' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="Comp No"
      primaryLabel="Store"
    />
  )
}
