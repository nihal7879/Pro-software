import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { ApprovalStatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/ui/modal'
import { buttonVariants } from '@/components/ui/button'
import { NewMaterialDetail } from './detail-views'
import { useNewMaterials } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import type { NewMaterialRequest } from '@/types'

export default function NewMaterialList() {
  const { data, isLoading } = useNewMaterials()
  const [selected, setSelected] = useState<NewMaterialRequest | null>(null)

  const columns = useMemo<ColumnDef<NewMaterialRequest>[]>(
    () => [
      { accessorKey: 'formNo', header: 'Form No', cell: ({ row }) => <span className="font-medium">{row.original.formNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'supplierName', header: 'Supplier' },
      { accessorKey: 'department', header: 'Department' },
      { id: 'items', header: 'Items', cell: ({ row }) => row.original.lines.length },
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
        title="New Material List"
        description="New material approval forms and their status."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'New Material' }]}
        actions={
          <Link to={paths.newMaterialForm} className={buttonVariants()}>
            <Plus />
            New Material Form
          </Link>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search by form number…" />

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.formNo} description="New Material Approval Form" size="xl">
        {selected && <NewMaterialDetail record={selected} />}
      </Modal>
    </div>
  )
}
