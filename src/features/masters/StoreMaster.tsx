import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStores } from '@/hooks/useProcurement'
import { toast } from '@/store/toast.store'
import type { Store } from '@/types'

export default function StoreMaster() {
  const { data, isLoading } = useStores()

  const columns = useMemo<ColumnDef<Store>[]>(
    () => [
      { accessorKey: 'code', header: 'Code', cell: ({ row }) => <span className="font-mono text-xs">{row.original.code}</span> },
      { accessorKey: 'name', header: 'Store', cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
      { accessorKey: 'location', header: 'Location' },
      { accessorKey: 'inchargeName', header: 'Store Incharge' },
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
              { label: 'Edit', icon: <Pencil />, onClick: () => toast.info('Edit store', row.original.name) },
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
        title="Store Master"
        description="Physical stores and storage locations."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Stores' }]}
        actions={
          <Button onClick={() => toast.success('Add store', 'Form would open')}>
            <Plus />
            Add Store
          </Button>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search stores…" />
    </div>
  )
}
