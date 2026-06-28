import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
import { ApprovalStatus, type MaterialRequest } from '@/types'

export default function MaterialRequestList() {
  const { data, isLoading } = useMaterialRequests()
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<MaterialRequest | null>(null)

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
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'View details', icon: <Eye />, onClick: () => setSelected(row.original) },
              { label: 'Convert to RFQ', icon: <FileStack />, onClick: () => toast.info('RFQ', `From ${row.original.mrNo}`) },
            ]}
          />
        ),
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
