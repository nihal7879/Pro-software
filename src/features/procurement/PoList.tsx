import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, FileText, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { FilterPanel } from '@/components/common/FilterPanel'
import { ApprovalStatusBadge, DocumentStatusBadge } from '@/components/common/StatusBadge'
import { buttonVariants } from '@/components/ui/button'
import { usePurchaseOrders } from '@/hooks/useProcurement'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import { ApprovalStatus, type PurchaseOrder } from '@/types'

export default function PoList() {
  const navigate = useNavigate()
  const { data, isLoading } = usePurchaseOrders()
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () => (data ?? []).filter((p) => status === 'all' || p.status === status),
    [data, status],
  )

  const columns = useMemo<ColumnDef<PurchaseOrder>[]>(
    () => [
      { accessorKey: 'poNo', header: 'PO No', cell: ({ row }) => <span className="font-medium">{row.original.poNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'vendorName', header: 'Vendor' },
      { accessorKey: 'department', header: 'Department' },
      { accessorKey: 'grandTotal', header: 'Total', cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.grandTotal)}</span> },
      { accessorKey: 'deliveryStatus', header: 'Delivery', cell: ({ row }) => <DocumentStatusBadge status={row.original.deliveryStatus} /> },
      { accessorKey: 'status', header: 'Approval', cell: ({ row }) => <ApprovalStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'Preview', icon: <Eye />, onClick: () => navigate(paths.poPreview(row.original.id)) },
              { label: 'Download PDF', icon: <FileText />, onClick: () => navigate(paths.poPreview(row.original.id)) },
            ]}
          />
        ),
      },
    ],
    [navigate],
  )

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Issued purchase orders and delivery tracking."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Purchase Orders' }]}
        actions={
          <Link to={paths.poCreate} className={buttonVariants()}>
            <Plus />
            New PO
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        enableSelection
        searchPlaceholder="Search purchase orders…"
        toolbar={
          <FilterPanel
            groups={[
              {
                id: 'status',
                label: 'Approval Status',
                value: status,
                onChange: setStatus,
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Draft', value: ApprovalStatus.Draft },
                  { label: 'Pending', value: ApprovalStatus.Pending },
                  { label: 'Approved', value: ApprovalStatus.Approved },
                ],
              },
            ]}
          />
        }
      />
    </div>
  )
}
