import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, History, Pencil, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { FilterPanel } from '@/components/common/FilterPanel'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { useItems } from '@/hooks/useProcurement'
import { categoryOptions } from '@/lib/options'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import type { Item } from '@/types'

export default function ItemMaster() {
  const navigate = useNavigate()
  const { data, isLoading } = useItems()
  const [category, setCategory] = useState('all')

  const filtered = useMemo(
    () => (data ?? []).filter((i) => category === 'all' || i.category === category),
    [data, category],
  )

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Item',
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <Badge tone="primary">{row.original.category.replace('_', ' ')}</Badge>,
      },
      { accessorKey: 'unit', header: 'Unit' },
      {
        accessorKey: 'currentRate',
        header: 'Rate',
        cell: ({ row }) => formatCurrency(row.original.currentRate),
      },
      { accessorKey: 'mrp', header: 'MRP', cell: ({ row }) => formatCurrency(row.original.mrp) },
      { accessorKey: 'gstPercent', header: 'GST', cell: ({ row }) => `${row.original.gstPercent}%` },
      {
        accessorKey: 'annualConsumption',
        header: 'Annual Use',
        cell: ({ row }) => row.original.annualConsumption.toLocaleString('en-IN'),
      },
      {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) =>
          row.original.active ? <Badge tone="success">Active</Badge> : <Badge tone="neutral">Inactive</Badge>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'View', icon: <Eye />, onClick: () => toast.info('Item details', row.original.name) },
              { label: 'Edit', icon: <Pencil />, onClick: () => navigate(paths.itemCreate) },
              {
                label: 'Rate history',
                icon: <History />,
                onClick: () =>
                  toast.info('Last revised', row.original.lastRateRevisedOn ? formatDate(row.original.lastRateRevisedOn) : '—'),
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
        title="Item Master"
        description="Central catalogue of all procurable items."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Item Master' }]}
        actions={
          <Link to={paths.itemCreate} className={buttonVariants()}>
            <Plus />
            New Item
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        enableSelection
        searchPlaceholder="Search items by name or code…"
        toolbar={
          <FilterPanel
            groups={[
              {
                id: 'category',
                label: 'Category',
                value: category,
                onChange: setCategory,
                options: [{ label: 'All', value: 'all' }, ...categoryOptions],
              },
            ]}
          />
        }
      />
    </div>
  )
}
