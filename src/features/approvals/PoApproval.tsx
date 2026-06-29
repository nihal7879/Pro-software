import { usePurchaseOrders } from '@/hooks/useProcurement'
import { formatCurrency, formatDate } from '@/lib/format'
import { usePoStore } from '@/store/po.store'
import { useAuthStore } from '@/store/auth.store'
import { applyDecision } from '@/lib/approval'
import { ApprovalStatus } from '@/types'
import { ApprovalQueue, type ApprovalRecord } from './ApprovalQueue'

export default function PoApproval() {
  const { data, isLoading } = usePurchaseOrders()
  const update = usePoStore((s) => s.update)
  const role = useAuthStore((s) => s.role)
  const approverName = useAuthStore((s) => s.currentUser?.name ?? 'CEO')

  const decide = (id: string, action: 'approve' | 'reject', remark: string) => {
    const record = data?.find((p) => p.id === id)
    if (record && role) update(id, applyDecision(record, action, role, approverName, remark))
  }

  const records: ApprovalRecord[] = (data ?? []).map((p) => ({
    id: p.id,
    reference: p.poNo,
    primary: p.vendorName,
    secondary: `${p.department} · ${formatDate(p.date)}`,
    amount: formatCurrency(p.grandTotal),
    status: p.status,
    approvals: p.approvals,
    detail: (
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-semibold">Item</th>
                <th className="px-3 py-2 font-semibold">Qty</th>
                <th className="px-3 py-2 font-semibold">Rate</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {p.lines.map((l, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2">{l.itemName}</td>
                  <td className="px-3 py-2">{l.quantity} {l.unit}</td>
                  <td className="px-3 py-2">{formatCurrency(l.rate)}</td>
                  <td className="px-3 py-2 text-right">{formatCurrency(l.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-8 text-sm">
          <div className="text-right">
            <p className="text-muted-foreground">Sub Total</p>
            <p className="text-muted-foreground">Tax</p>
            <p className="font-semibold">Grand Total</p>
          </div>
          <div className="text-right">
            <p>{formatCurrency(p.subTotal)}</p>
            <p>{formatCurrency(p.taxTotal)}</p>
            <p className="font-semibold">{formatCurrency(p.grandTotal)}</p>
          </div>
        </div>
      </div>
    ),
  }))

  return (
    <ApprovalQueue
      title="Purchase Order Approval"
      description="Approve purchase orders before release to vendors."
      breadcrumbs={[{ label: 'Approvals' }, { label: 'Purchase Orders' }]}
      records={records}
      isLoading={isLoading}
      referenceLabel="PO No"
      primaryLabel="Vendor"
      openStatuses={[ApprovalStatus.Pending]}
      onApprove={(id, remark) => decide(id, 'approve', remark)}
      onReject={(id, remark) => decide(id, 'reject', remark)}
    />
  )
}
