import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DetailModal, EditModal, ConfirmDialog, type FieldConfig } from '@/components/common/CrudDialogs'
import { useDepartments } from '@/hooks/useProcurement'
import { useDepartmentStore } from '@/store/masters.store'
import { toast } from '@/store/toast.store'
import type { Department } from '@/types'

const editFields: FieldConfig[] = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Department' },
  { key: 'hodName', label: 'Head of Department' },
  { key: 'costCenter', label: 'Cost Center' },
  { key: 'active', label: 'Status', type: 'toggle' },
]

export default function DepartmentMaster() {
  const { data, isLoading } = useDepartments()
  const { add, update, remove } = useDepartmentStore()
  const [view, setView] = useState<Department | null>(null)
  const [edit, setEdit] = useState<Department | null>(null)
  const [del, setDel] = useState<Department | null>(null)

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

  const addDepartment = () => {
    const dep: Department = {
      id: `DEP-${Date.now()}`,
      code: 'NEW',
      name: 'New Department',
      hodName: '',
      costCenter: '',
      active: true,
    }
    add(dep)
    setEdit(dep)
  }

  return (
    <div>
      <PageHeader
        title="Department Master"
        description="Hospital departments and their cost centers."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Departments' }]}
        actions={
          <Button onClick={addDepartment}>
            <Plus />
            Add Department
          </Button>
        }
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search departments…" />

      <DetailModal
        open={view !== null}
        onClose={() => setView(null)}
        title={view?.name}
        rows={
          view
            ? [
                { label: 'Code', value: view.code },
                { label: 'Head of Department', value: view.hodName || '—' },
                { label: 'Cost Center', value: view.costCenter || '—' },
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
            update(edit.id, values as Partial<Department>)
            toast.success('Department saved', String(values.name))
            setEdit(null)
          }}
        />
      )}

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        title="Delete department"
        message={<>Remove <b>{del?.name}</b>? This cannot be undone.</>}
        onConfirm={() => {
          if (del) {
            remove(del.id)
            toast.error('Department deleted', del.name)
          }
          setDel(null)
        }}
      />
    </div>
  )
}
