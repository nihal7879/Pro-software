import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, FileStack, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { FilterPanel } from '@/components/common/FilterPanel'
import { ApprovalStatusBadge, PriorityBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/ui/modal'
import { buttonVariants } from '@/components/ui/button'
import { ApprovalTimeline } from '@/components/common/Timeline'
import { useMaterialRequests } from '@/hooks/useProcurement'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { useRfqStore } from '@/store/rfq.store'
import { useAuthStore } from '@/store/auth.store'
import { vendors } from '@/mocks/vendors'
import { DocumentStatus, ApprovalStatus, type MaterialRequest, type Rfq } from '@/types'

export default function MaterialRequestList() {
  const navigate = useNavigate()
  const { data, isLoading } = useMaterialRequests()
  const addRfq = useRfqStore((s) => s.add)
  const createdBy = useAuthStore((s) => s.currentUser?.name ?? 'Purchase')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<MaterialRequest | null>(null)

  const convertToRfq = (mr: MaterialRequest) => {
    const today = new Date()
    const due = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    // Seed three candidate vendors (awaiting quotes) so Purchase can record replies.
    const candidates = vendors.slice(0, 3)
    const rfq: Rfq = {
      id: `RFQ-${Date.now()}`,
      // Derive the RFQ number from the source MR so they stay tied (SH-MR-KIT-5139 → SH-RFQ-KIT-5139).
      rfqNo: mr.mrNo.replace('-MR-', '-RFQ-'),
      date: today.toISOString().slice(0, 10),
      store: mr.store,
      status: DocumentStatus.Open,
      dueDate: due.toISOString().slice(0, 10),
      vendorIds: candidates.map((v) => v.id),
      createdBy,
      lines: mr.lines.map((l) => ({
        itemCode: l.itemCode,
        itemName: l.itemName,
        unit: l.unit,
        quantity: l.quantity,
        quotes: candidates.map((v) => ({ vendorId: v.id, vendorName: v.name, rate: 0, responded: false })),
      })),
    }
    addRfq(rfq)
    toast.success('RFQ created', `${rfq.rfqNo} raised from ${mr.mrNo}.`)
    navigate(paths.rfqList)
  }

  const filtered = useMemo(
    () => (data ?? []).filter((m) => status === 'all' || m.status === status),
    [data, status],
  )

  const columns = useMemo<ColumnDef<MaterialRequest>[]>(
    () => [
      { accessorKey: 'mrNo', header: 'MR No', cell: ({ row }) => <span className="font-medium">{row.original.mrNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'department', header: 'Department' },
      { accessorKey: 'requestedBy', header: 'Requested By' },
      { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <PriorityBadge priority={row.original.priority} /> },
      {
        accessorKey: 'totalEstimate',
        header: 'Estimate',
        cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.totalEstimate)}</span>,
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <ApprovalStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          // RFQ can only be raised once the HOD (and beyond) has approved the request.
          const canConvert =
            row.original.status === ApprovalStatus.HodApproved ||
            row.original.status === ApprovalStatus.Approved
          return (
            <RowActions
              actions={[
                { label: 'View details', icon: <Eye />, onClick: () => setSelected(row.original) },
                ...(canConvert
                  ? [
                      {
                        label: 'Convert to RFQ',
                        icon: <FileStack />,
                        onClick: () => convertToRfq(row.original),
                      },
                    ]
                  : []),
              ]}
            />
          )
        },
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Material Requests"
        description="Indents raised by departments for procurement."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Material Requests' }]}
        actions={
          <Link to={paths.materialRequestCreate} className={buttonVariants()}>
            <Plus />
            New Request
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        enableSelection
        searchPlaceholder="Search by MR number…"
        toolbar={
          <FilterPanel
            groups={[
              {
                id: 'status',
                label: 'Status',
                value: status,
                onChange: setStatus,
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Draft', value: ApprovalStatus.Draft },
                  { label: 'Pending', value: ApprovalStatus.Pending },
                  { label: 'HOD Approved', value: ApprovalStatus.HodApproved },
                  { label: 'Approved', value: ApprovalStatus.Approved },
                  { label: 'Rejected', value: ApprovalStatus.Rejected },
                ],
              },
            ]}
          />
        }
      />

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.mrNo}
        description={`${selected?.department} · ${selected ? formatDate(selected.date) : ''}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-border">
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
                  {selected.lines.map((l) => (
                    <tr key={l.id} className="border-t border-border">
                      <td className="px-3 py-2">{l.itemName}</td>
                      <td className="px-3 py-2">{l.quantity} {l.unit}</td>
                      <td className="px-3 py-2">{formatCurrency(l.estimatedRate)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(l.quantity * l.estimatedRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selected.remark && <p className="text-sm text-muted-foreground">Remark: {selected.remark}</p>}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Approval Trail</h4>
              <ApprovalTimeline steps={selected.approvals} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
