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
import { useVendors } from '@/hooks/useProcurement'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { VendorStatus, type Vendor } from '@/types'

export default function VendorDirectory() {
  const navigate = useNavigate()
  const { data, isLoading } = useVendors()
  const [status, setStatus] = useState('all')

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
              { label: 'Edit', icon: <Pencil />, onClick: () => toast.info('Edit vendor', row.original.name) },
              {
                label: 'Delete',
                icon: <Trash2 />,
                destructive: true,
                separatorBefore: true,
                onClick: () => toast.error('Vendor removed', row.original.name),
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
          <Button onClick={() => toast.success('New vendor', 'Vendor form would open')}>
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
    </div>
  )
}
