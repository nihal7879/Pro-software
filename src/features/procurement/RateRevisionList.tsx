import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpRight, Eye, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { ApprovalStatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/ui/modal'
import { buttonVariants } from '@/components/ui/button'
import { RateRevisionDetail } from './detail-views'
import { useRateRevisions } from '@/hooks/useProcurement'
import { formatCurrency, formatDate, formatPercent } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { RateRevision } from '@/types'

export default function RateRevisionList() {
  const { data, isLoading } = useRateRevisions()
  const [selected, setSelected] = useState<RateRevision | null>(null)

  const columns = useMemo<ColumnDef<RateRevision>[]>(
    () => [
      { accessorKey: 'formNo', header: 'Form No', cell: ({ row }) => <span className="font-medium">{row.original.formNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'itemName', header: 'Item' },
      { accessorKey: 'supplier', header: 'Supplier' },
      { accessorKey: 'existingRate', header: 'Existing', cell: ({ row }) => formatCurrency(row.original.existingRate) },
      { accessorKey: 'revisedCostPrice', header: 'Revised', cell: ({ row }) => formatCurrency(row.original.revisedCostPrice) },
      {
        accessorKey: 'differenceRatePercent',
        header: 'Change',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-0.5 font-medium text-warning">
            <ArrowUpRight className="size-3.5" />
            {formatPercent(row.original.differenceRatePercent)}
          </span>
        ),
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <ApprovalStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <RowActions actions={[{ label: 'View form', icon: <Eye />, onClick: () => setSelected(row.original) }]} />,
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Rate Revision List"
        description="Supplier price revision forms and approvals."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Rate Revision' }]}
        actions={
          <Link to={paths.rateRevisionForm} className={buttonVariants()}>
            <Plus />
            New Rate Revision
          </Link>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search rate revisions…" />

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.formNo} description="Rate Revision Form" size="lg">
        {selected && <RateRevisionDetail record={selected} />}
      </Modal>
    </div>
  )
}
