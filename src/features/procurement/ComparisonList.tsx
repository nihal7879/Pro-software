import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { ApprovalStatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { ComparisonDetail } from './detail-views'
import { useComparisons } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { Comparison } from '@/types'

export default function ComparisonList() {
  const { data, isLoading } = useComparisons()
  const [selected, setSelected] = useState<Comparison | null>(null)

  const columns = useMemo<ColumnDef<Comparison>[]>(
    () => [
      { accessorKey: 'compNo', header: 'Comp No', cell: ({ row }) => <span className="font-medium">{row.original.compNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'storeName', header: 'Store' },
      { id: 'vendors', header: 'Vendors', cell: ({ row }) => <Badge tone="primary">{row.original.vendors.length}</Badge> },
      { accessorKey: 'recommendedVendor', header: 'Recommended', cell: ({ row }) => <span className="text-primary">{row.original.recommendedVendor}</span> },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <ApprovalStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <RowActions actions={[{ label: 'View worksheet', icon: <Eye />, onClick: () => setSelected(row.original) }]} />,
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Comparison List"
        description="Quotation comparison worksheets and recommendations."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Comparison' }]}
        actions={
          <Link to={paths.comparisonWorksheet} className={buttonVariants()}>
            <Plus />
            New Comparison
          </Link>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search comparisons…" />

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.compNo} description={selected?.storeName} size="xl">
        {selected && <ComparisonDetail record={selected} />}
      </Modal>
    </div>
  )
}
