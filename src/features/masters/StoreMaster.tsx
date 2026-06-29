import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DetailModal, EditModal, ConfirmDialog, type FieldConfig } from '@/components/common/CrudDialogs'
import { useStores } from '@/hooks/useProcurement'
import { useStoreStore } from '@/store/masters.store'
import { toast } from '@/store/toast.store'
import type { Store } from '@/types'

const editFields: FieldConfig[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Store' },
  { key: 'location', label: 'Location', full: true },
  { key: 'inchargeName', label: 'Store Incharge' },
  { key: 'active', label: 'Status', type: 'toggle' },
]

export default function StoreMaster() {
  const { data, isLoading } = useStores()
  const { add, update, remove } = useStoreStore()
  const [view, setView] = useState<Store | null>(null)
  const [edit, setEdit] = useState<Store | null>(null)
  const [del, setDel] = useState<Store | null>(null)

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
              { label: 'View', icon: <Eye />, onClick: () => setView(row.original) },
              { label: 'Edit', icon: <Pencil />, onClick: () => setEdit(row.original) },
              { label: 'Delete', icon: <Trash2 />, destructive: true, separatorBefore: true, onClick: () => setDel(row.original) },
            ]}
          />
        ),
      },
    ],
    [],
  )

  const addStore = () => {
    const store: Store = {
      id: `STR-${Date.now()}`,
      code: 'NEW',
      name: 'New Store',
      location: '',
      inchargeName: '',
      active: true,
    }
    add(store)
    setEdit(store)
  }

  return (
    <div>
      <PageHeader
        title="Store Master"
        description="Physical stores and storage locations."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Stores' }]}
        actions={
          <Button onClick={addStore}>
            <Plus />
            Add Store
          </Button>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search stores…" />

      <DetailModal
        open={view !== null}
        onClose={() => setView(null)}
        title={view?.name}
        rows={
          view
            ? [
                { label: 'Code', value: view.code },
                { label: 'Location', value: view.location || '—' },
                { label: 'Store Incharge', value: view.inchargeName || '—' },
                { label: 'Status', value: view.active ? 'Active' : 'Inactive' },
              ]
            : []
        }
      />

      {edit && (
        <EditModal
          key={edit.id}
          open
          onClose={() => setEdit(null)}
          title={`Edit · ${edit.name}`}
          fields={editFields}
          initial={edit as unknown as Record<string, unknown>}
          onSave={(values) => {
            update(edit.id, values as Partial<Store>)
            toast.success('Store saved', String(values.name))
            setEdit(null)
          }}
        />
      )}

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        title="Delete store"
        message={<>Remove <b>{del?.name}</b>? This cannot be undone.</>}
        onConfirm={() => {
          if (del) {
            remove(del.id)
            toast.error('Store deleted', del.name)
          }
          setDel(null)
        }}
      />
    </div>
  )
}
