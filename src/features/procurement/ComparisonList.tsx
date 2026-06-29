import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, FileSpreadsheet, Plus } from 'lucide-react'
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
import { toast } from '@/store/toast.store'
import { usePoStore } from '@/store/po.store'
import { vendors } from '@/mocks/vendors'
import { departmentStoreMap } from '@/lib/options'
import { ApprovalStatus, DocumentStatus, UserRole, type Comparison, type PurchaseOrder } from '@/types'

export default function ComparisonList() {
  const navigate = useNavigate()
  const { data, isLoading } = useComparisons()
  const addPo = usePoStore((s) => s.add)
  const [selected, setSelected] = useState<Comparison | null>(null)

  const buildPo = (c: Comparison) => {
    const vendorName = c.recommendedVendor
    const vendor = vendors.find((v) => v.name === vendorName)
    const department = Object.entries(departmentStoreMap).find(([, store]) => store === c.storeName)?.[0] ?? c.storeName
    const lines = c.rows.map((r) => {
      const rate = r.rates[vendorName] ?? Object.values(r.rates)[0] ?? 0
      const gstPercent = 18
      return { itemCode: '', itemName: r.itemName, unit: r.unit, quantity: r.quantity, rate, gstPercent, amount: r.quantity * rate * (1 + gstPercent / 100) }
    })
    const subTotal = lines.reduce((s, l) => s + l.quantity * l.rate, 0)
    const taxTotal = lines.reduce((s, l) => s + l.quantity * l.rate * (l.gstPercent / 100), 0)
    const po: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      poNo: c.compNo.replace('-CP-', '-PO-'),
      date: new Date().toISOString().slice(0, 10),
      vendorId: vendor?.id ?? '',
      vendorName,
      store: c.storeName,
      department,
      status: ApprovalStatus.Pending,
      deliveryStatus: DocumentStatus.Open,
      expectedDelivery: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
      lines,
      subTotal,
      taxTotal,
      grandTotal: subTotal + taxTotal,
      terms: 'Payment Net 30. Delivery within agreed lead time.',
      approvals: [{ role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Pending }],
    }
    addPo(po)
    toast.success('Purchase Order created', `${po.poNo} → ${vendorName}, sent for CEO approval.`)
    navigate(paths.poList)
  }

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
        cell: ({ row }) => (
          <RowActions
            actions={[
              { label: 'View worksheet', icon: <Eye />, onClick: () => setSelected(row.original) },
              ...(row.original.status === ApprovalStatus.Approved
                ? [{ label: 'Build PO', icon: <FileSpreadsheet />, onClick: () => buildPo(row.original) }]
                : []),
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
