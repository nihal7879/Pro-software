import { useMaterialRequests } from '@/hooks/useProcurement'
import { formatCurrency, formatDate } from '@/lib/format'
import { useMaterialRequestStore } from '@/store/materialRequest.store'
import { useAuthStore } from '@/store/auth.store'
import { ApprovalStatus } from '@/types'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function MaterialRequestApproval() {
  const { data, isLoading } = useMaterialRequests()
  const decide = useMaterialRequestStore((s) => s.decide)
  const approverName = useAuthStore((s) => s.currentUser?.name ?? 'Department HOD')

  const records: ApprovalRecord[] = (data ?? []).map((m) => ({
    id: m.id,
    reference: m.mrNo,
    primary: m.department,
    secondary: `${m.requestedBy} · ${formatDate(m.date)}`,
    amount: formatCurrency(m.totalEstimate),
    status: m.status,
    approvals: m.approvals,
    detail: (
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {m.lines.map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-3 py-2">{l.itemName}</td>
                <td className="px-3 py-2">{l.quantity} {l.unit}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(l.quantity * l.estimatedRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  }))

  return (
    <ApprovalQueue
      title="Material Request Approval"
      description="Review and approve indents raised by departments."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'Material Requests' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="MR No"
      primaryLabel="Department"
      openStatuses={[ApprovalStatus.Pending]}
      onApprove={(id, remark) => decide(id, 'approve', approverName, remark)}
      onReject={(id, remark) => decide(id, 'reject', approverName, remark)}
    />
  )
}
