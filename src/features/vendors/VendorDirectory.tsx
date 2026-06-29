import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { FilterPanel } from '@/components/common/FilterPanel'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { VendorStatusBadge } from '@/components/common/StatusBadge'
import { EditModal, ConfirmDialog, type FieldConfig } from '@/components/common/CrudDialogs'
import { useVendors } from '@/hooks/useProcurement'
import { useVendorStore } from '@/store/masters.store'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { VendorStatus, type Vendor } from '@/types'

const vendorStatusOptions = [
  { label: 'Active', value: VendorStatus.Active },
  { label: 'Pending', value: VendorStatus.Pending },
  { label: 'Inactive', value: VendorStatus.Inactive },
  { label: 'Blacklisted', value: VendorStatus.Blacklisted },
]

const editFields: FieldConfig[] = [
  { key: 'name', label: 'Vendor Name', full: true },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'leadTimeDays', label: 'Lead Time (days)', type: 'number' },
  { key: 'rating', label: 'Rating', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: vendorStatusOptions },
]

export default function VendorDirectory() {
  const navigate = useNavigate()
  const { data, isLoading } = useVendors()
  const { add, update, remove } = useVendorStore()
  const [status, setStatus] = useState('all')
  const [edit, setEdit] = useState<Vendor | null>(null)
  const [del, setDel] = useState<Vendor | null>(null)

  const addVendor = () => {
    const vendor: Vendor = {
      id: `VEN-${Date.now()}`,
      code: `VEN-${Date.now().toString().slice(-4)}`,
      name: 'New Vendor',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      gstin: '',
      category: [],
      status: VendorStatus.Pending,
      rating: 0,
      onTimeDeliveryRate: 0,
      totalOrders: 0,
      totalSpend: 0,
      paymentTerms: 'Net 30',
      leadTimeDays: 7,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    add(vendor)
    setEdit(vendor)
  }

  const filtered = useMemo(
    () => (data ?? []).filter((v) => status === 'all' || v.status === status),
    [data, status],
  )

  const columns = useMemo<ColumnDef<Vendor>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Vendor',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar name={row.original.name} size="sm" />
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.code}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'contactPerson', header: 'Contact', cell: ({ row }) => (
        <div>
          <p>{row.original.contactPerson}</p>
          <p className="text-xs text-muted-foreground">{row.original.phone}</p>
        </div>
      ) },
      { accessorKey: 'city', header: 'City' },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 font-medium">
            <Star className="size-3.5 fill-warning text-warning" />
            {row.original.rating.toFixed(1)}
          </span>
        ),
      },
      {
        accessorKey: 'totalSpend',
        header: 'Total Spend',
        cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.totalSpend, true)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <VendorStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'View profile', icon: <Eye />, onClick: () => navigate(paths.vendorProfile(row.original.id)) },
              { label: 'Edit', icon: <Pencil />, onClick: () => setEdit(row.original) },
              {
                label: 'Delete',
                icon: <Trash2 />,
                destructive: true,
                separatorBefore: true,
                onClick: () => setDel(row.original),
              },
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
        title="Vendor Directory"
        description="Manage suppliers, performance and compliance."
        breadcrumbs={[{ label: 'Vendors' }, { label: 'Directory' }]}
        actions={
          <Button onClick={addVendor}>
            <Plus />
            Add Vendor
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        enableSelection
        searchPlaceholder="Search vendors…"
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
                  { label: 'Active', value: VendorStatus.Active },
                  { label: 'Pending', value: VendorStatus.Pending },
                  { label: 'Inactive', value: VendorStatus.Inactive },
                  { label: 'Blacklisted', value: VendorStatus.Blacklisted },
                ],
              },
            ]}
          />
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
            update(edit.id, values as Partial<Vendor>)
            toast.success('Vendor saved', String(values.name))
            setEdit(null)
          }}
        />
      )}

      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        title="Delete vendor"
        message={<>Remove <b>{del?.name}</b> from the directory? This cannot be undone.</>}
        onConfirm={() => {
          if (del) {
            remove(del.id)
            toast.error('Vendor deleted', del.name)
          }
          setDel(null)
        }}
      />
    </div>
  )
}
