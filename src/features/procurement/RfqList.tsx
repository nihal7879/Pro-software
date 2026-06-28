import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Plus, Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { DocumentStatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { useRfqs } from '@/hooks/useProcurement'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import type { Rfq } from '@/types'

export default function RfqList() {
  const { data, isLoading } = useRfqs()
  const [selected, setSelected] = useState<Rfq | null>(null)

  const columns = useMemo<ColumnDef<Rfq>[]>(
    () => [
      { accessorKey: 'rfqNo', header: 'RFQ No', cell: ({ row }) => <span className="font-medium">{row.original.rfqNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'store', header: 'Store' },
      { accessorKey: 'dueDate', header: 'Due', cell: ({ row }) => formatDate(row.original.dueDate) },
      { id: 'vendors', header: 'Vendors', cell: ({ row }) => <Badge tone="primary">{row.original.vendorIds.length}</Badge> },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <DocumentStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'View quotes', icon: <Eye />, onClick: () => setSelected(row.original) },
              { label: 'Send reminder', icon: <Send />, onClick: () => toast.info('Reminder sent', row.original.rfqNo) },
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
        title="Request for Quotation"
        description="Solicit and track price quotes from vendors."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'RFQ' }]}
        actions={
          <Link to={paths.rfqCreate} className={buttonVariants()}>
            <Plus />
            New RFQ
          </Link>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} enableSelection searchPlaceholder="Search RFQs…" />

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.rfqNo} description={`${selected?.store}`} size="lg">
        {selected && (
          <div className="space-y-4">
            {selected.lines.map((line) => (
              <div key={line.itemCode} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">{line.itemName}</p>
                  <span className="text-sm text-muted-foreground">Qty: {line.quantity} {line.unit}</span>
                </div>
                <div className="space-y-2">
                  {line.quotes.map((q) => (
                    <div key={q.vendorId} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                      <span>{q.vendorName}</span>
                      {q.responded ? (
                        <span className="font-semibold">{formatCurrency(q.rate)}</span>
                      ) : (
                        <Badge tone="warning">Awaiting</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
