import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, History, Pencil, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { FilterPanel } from '@/components/common/FilterPanel'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { buttonVariants } from '@/components/ui/button'
import { DetailModal, EditModal, ConfirmDialog, type FieldConfig } from '@/components/common/CrudDialogs'
import { useItems } from '@/hooks/useProcurement'
import { useItemStore } from '@/store/masters.store'
import { categoryOptions, unitOptions, storeOptions } from '@/lib/options'
import { formatCurrency, formatDate } from '@/lib/format'
import { rateRevisions } from '@/mocks/rateRevisions'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import type { Item } from '@/types'

const editFields: FieldConfig[] = [
  { key: 'name', label: 'Item Name', full: true },
  { key: 'code', label: 'Item Code' },
  { key: 'category', label: 'Category', type: 'select', options: categoryOptions },
  { key: 'unit', label: 'Unit', type: 'select', options: unitOptions },
  { key: 'store', label: 'Store', type: 'select', options: storeOptions },
  { key: 'currentRate', label: 'Current Rate (₹)', type: 'number' },
  { key: 'mrp', label: 'MRP (₹)', type: 'number' },
  { key: 'gstPercent', label: 'GST (%)', type: 'number' },
  { key: 'annualConsumption', label: 'Annual Consumption', type: 'number' },
  { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
  { key: 'active', label: 'Status', type: 'toggle' },
]

export default function ItemMaster() {
  const { data, isLoading } = useItems()
  const { update, remove } = useItemStore()
  const [category, setCategory] = useState('all')
  const [view, setView] = useState<Item | null>(null)
  const [edit, setEdit] = useState<Item | null>(null)
  const [del, setDel] = useState<Item | null>(null)
  const [history, setHistory] = useState<Item | null>(null)

  const filtered = useMemo(
    () => (data ?? []).filter((i) => category === 'all' || i.category === category),
    [data, category],
  )

  const historyRows = useMemo(
    () => (history ? rateRevisions.filter((r) => r.itemCode === history.code || r.itemName === history.name) : []),
    [history],
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
      { accessorKey: 'currentRate', header: 'Rate', cell: ({ row }) => formatCurrency(row.original.currentRate) },
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
              { label: 'View', icon: <Eye />, onClick: () => setView(row.original) },
              { label: 'Edit', icon: <Pencil />, onClick: () => setEdit(row.original) },
              { label: 'Rate history', icon: <History />, onClick: () => setHistory(row.original) },
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
    [],
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

      {/* View */}
      <DetailModal
        open={view !== null}
        onClose={() => setView(null)}
        title={view?.name}
        rows={
          view
            ? [
                { label: 'Item Code', value: view.code },
                { label: 'Category', value: view.category.replace('_', ' ') },
                { label: 'Brand', value: view.brand ?? '—' },
                { label: 'Store', value: view.store },
                { label: 'Unit', value: view.unit },
                { label: 'Current Rate', value: formatCurrency(view.currentRate) },
                { label: 'MRP', value: formatCurrency(view.mrp) },
                { label: 'GST', value: `${view.gstPercent}%` },
                { label: 'Annual Consumption', value: view.annualConsumption.toLocaleString('en-IN') },
                { label: 'Reorder Level', value: view.reorderLevel.toLocaleString('en-IN') },
                { label: 'Last Revised', value: view.lastRateRevisedOn ? formatDate(view.lastRateRevisedOn) : '—' },
                { label: 'Status', value: view.active ? 'Active' : 'Inactive' },
              ]
            : []
        }
      />

      {/* Edit */}
      {edit && (
        <EditModal
          key={edit.id}
          open
          onClose={() => setEdit(null)}
          title={`Edit · ${edit.name}`}
          fields={editFields}
          initial={edit as unknown as Record<string, unknown>}
          onSave={(values) => {
            update(edit.id, values as Partial<Item>)
            toast.success('Item updated', `${String(values.name)} saved.`)
            setEdit(null)
          }}
        />
      )}

      {/* Delete */}
      <ConfirmDialog
        open={del !== null}
        onClose={() => setDel(null)}
        title="Delete item"
        message={<>Remove <b>{del?.name}</b> from the catalogue? This cannot be undone.</>}
        onConfirm={() => {
          if (del) {
            remove(del.id)
            toast.error('Item deleted', del.name)
          }
          setDel(null)
        }}
      />

      {/* Rate history */}
      <Modal open={history !== null} onClose={() => setHistory(null)} title={`Rate History · ${history?.name ?? ''}`} size="lg">
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
            Current rate: <span className="font-semibold">{history ? formatCurrency(history.currentRate) : '—'}</span>
            {history?.lastRateRevisedOn && <span className="ml-2 text-muted-foreground">· last revised {formatDate(history.lastRateRevisedOn)}</span>}
          </div>
          {historyRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No rate revisions recorded for this item.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Existing</th>
                    <th className="px-3 py-2 font-semibold">Revised</th>
                    <th className="px-3 py-2 font-semibold">Change</th>
                    <th className="px-3 py-2 font-semibold">Supplier</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-3 py-2">{formatDate(r.date)}</td>
                      <td className="px-3 py-2">{formatCurrency(r.existingRate)}</td>
                      <td className="px-3 py-2">{formatCurrency(r.quotedRate)}</td>
                      <td className="px-3 py-2 text-warning">+{r.differenceRatePercent}%</td>
                      <td className="px-3 py-2">{r.supplier}</td>
                      <td className="px-3 py-2">{r.status.replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
