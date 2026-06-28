import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDepartments } from '@/hooks/useProcurement'
import { toast } from '@/store/toast.store'
import type { Department } from '@/types'

export default function DepartmentMaster() {
  const { data, isLoading } = useDepartments()

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      { accessorKey: 'code', header: 'Code', cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
      { accessorKey: 'name', header: 'Department', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: 'hodName', header: 'Head of Department' },
      { accessorKey: 'costCenter', header: 'Cost Center' },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => (row.original.active ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Inactive</Badge>),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'Edit', icon: <Pencil />, onClick: () => toast.info('Edit department', row.original.name) },
              { label: 'Delete', icon: <Trash2 />, destructive: true, separatorBefore: true, onClick: () => toast.error('Deleted', row.original.name) },
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
        title="Department Master"
        description="Hospital departments and their cost centers."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Departments' }]}
        actions={
          <Button onClick={() => toast.success('Add department', 'Form would open')}>
            <Plus />
            Add Department
          </Button>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search departments…" />
    </div>
  )
}
