import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, GitCompareArrows, Plus, Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { DocumentStatusBadge } from '@/components/common/StatusBadge'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { useRfqs } from '@/hooks/useProcurement'
import { useRfqStore } from '@/store/rfq.store'
import { useComparisonStore } from '@/store/comparison.store'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { ApprovalStatus, DocumentStatus, UserRole, type Comparison, type Rfq, type RfqLine } from '@/types'

/** Derive RFQ status from how many vendor quotes have been recorded. */
function statusFromQuotes(lines: RfqLine[]): DocumentStatus {
  const quotes = lines.flatMap((l) => l.quotes)
  if (quotes.length === 0) return DocumentStatus.Open
  if (quotes.every((q) => q.responded)) return DocumentStatus.Completed
  if (quotes.some((q) => q.responded)) return DocumentStatus.InProgress
  return DocumentStatus.Open
}

export default function RfqList() {
  const navigate = useNavigate()
  const { data } = useRfqs()
  const updateRfq = useRfqStore((s) => s.update)
  const addComparison = useComparisonStore((s) => s.add)
  const approverDept = useAuthStore((s) => s.currentUser?.name ?? 'Department HOD')

  const [selected, setSelected] = useState<Rfq | null>(null)
  const [quoting, setQuoting] = useState<Rfq | null>(null)
  const [draft, setDraft] = useState<RfqLine[]>([])

  const openQuoteEntry = (rfq: Rfq) => {
    setQuoting(rfq)
    setDraft(rfq.lines.map((l) => ({ ...l, quotes: l.quotes.map((q) => ({ ...q })) })))
  }

  const setRate = (lineIdx: number, vendorIdx: number, value: number) => {
    setDraft((prev) =>
      prev.map((l, li) =>
        li !== lineIdx
          ? l
          : {
              ...l,
              quotes: l.quotes.map((q, qi) =>
                qi !== vendorIdx ? q : { ...q, rate: value, responded: value > 0 },
              ),
            },
      ),
    )
  }

  const saveQuotes = () => {
    if (!quoting) return
    const status = statusFromQuotes(draft)
    updateRfq(quoting.id, { lines: draft, status })
    toast.success('Quotes recorded', `${quoting.rfqNo} is now ${status.replace('_', ' ').toLowerCase()}.`)
    setQuoting(null)
  }

  const buildComparison = (rfq: Rfq) => {
    const vendorNames = Array.from(
      new Set(rfq.lines.flatMap((l) => l.quotes.filter((q) => q.responded).map((q) => q.vendorName))),
    )
    const rows = rfq.lines.map((l) => {
      const rates: Record<string, number> = {}
      l.quotes.filter((q) => q.responded).forEach((q) => (rates[q.vendorName] = q.rate))
      const cheapest = Object.entries(rates).sort((a, b) => a[1] - b[1])[0]?.[0] ?? vendorNames[0]
      return { itemName: l.itemName, unit: l.unit, quantity: l.quantity, rates, recommendedVendor: cheapest }
    })
    // Overall recommendation: vendor with the lowest total across all lines.
    const totals: Record<string, number> = {}
    rows.forEach((r) => Object.entries(r.rates).forEach(([v, rate]) => (totals[v] = (totals[v] ?? 0) + rate * r.quantity)))
    const recommendedVendor = Object.entries(totals).sort((a, b) => a[1] - b[1])[0]?.[0] ?? vendorNames[0]

    const comparison: Comparison = {
      id: `CMP-${Date.now()}`,
      compNo: `SH-CP-NEW-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      storeName: rfq.store,
      vendors: vendorNames,
      recommendedVendor,
      status: ApprovalStatus.Pending,
      remark: `Built from ${rfq.rfqNo}. Lowest total: ${recommendedVendor}.`,
      rows,
      approvals: [
        { role: UserRole.HOD, approverName: approverDept, status: ApprovalStatus.Pending },
        { role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Pending },
      ],
    }
    addComparison(comparison)
    toast.success('Comparison created', `${comparison.compNo} ready for approval.`)
    navigate(paths.comparisonList)
  }

  const columns = useMemo<ColumnDef<Rfq>[]>(
    () => [
      { accessorKey: 'rfqNo', header: 'RFQ No', cell: ({ row }) => <span className="font-medium">{row.original.rfqNo}</span> },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'store', header: 'Store' },
      { accessorKey: 'dueDate', header: 'Due', cell: ({ row }) => formatDate(row.original.dueDate) },
      {
        id: 'vendors',
        header: 'Quotes',
        cell: ({ row }) => {
          const quotes = row.original.lines.flatMap((l) => l.quotes)
          const got = quotes.filter((q) => q.responded).length
          return <Badge tone="primary">{got}/{quotes.length}</Badge>
        },
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <DocumentStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const completed = row.original.status === DocumentStatus.Completed
          return (
            <RowActions
              actions={[
                { label: 'View quotes', icon: <Eye />, onClick: () => setSelected(row.original) },
                ...(completed
                  ? [{ label: 'Build Comparison', icon: <GitCompareArrows />, onClick: () => buildComparison(row.original) }]
                  : [{ label: 'Record quotes', icon: <Send />, onClick: () => openQuoteEntry(row.original) }]),
              ]}
            />
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <div>
      <PageHeader
        title="Request for Quotation"
        description="Solicit and track price quotes from vendors."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'RFQ' }]}
        actions={
          <Link to={paths.rfqCreate} className={buttonVariants()}>
            <Plus />
            New RFQ
          </Link>
        }
      />
      <DataTable columns={columns} data={data ?? []} enableSelection searchPlaceholder="Search RFQs…" />

      {/* View quotes */}
      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.rfqNo} description={`${selected?.store}`} size="lg">
        {selected && (
          <div className="space-y-4">
            {selected.lines.map((line) => (
              <div key={line.itemCode} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">{line.itemName}</p>
                  <span className="text-sm text-muted-foreground">Qty: {line.quantity} {line.unit}</span>
                </div>
                <div className="space-y-2">
                  {line.quotes.map((q) => (
                    <div key={q.vendorId} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                      <span>{q.vendorName}</span>
                      {q.responded ? <span className="font-semibold">{formatCurrency(q.rate)}</span> : <Badge tone="warning">Awaiting</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Record quotes */}
      <Modal
        open={quoting !== null}
        onClose={() => setQuoting(null)}
        title={`Record Quotes · ${quoting?.rfqNo ?? ''}`}
        description="Enter each vendor's quoted rate. Leave 0 for vendors yet to respond."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setQuoting(null)}>Cancel</Button>
            <Button onClick={saveQuotes}>Save quotes</Button>
          </>
        }
      >
        <div className="space-y-4">
          {draft.map((line, li) => (
            <div key={line.itemCode} className="rounded-xl border border-border p-4">
              <p className="mb-3 font-medium">{line.itemName} <span className="text-sm text-muted-foreground">· {line.quantity} {line.unit}</span></p>
              <div className="space-y-2">
                {line.quotes.map((q, qi) => (
                  <div key={q.vendorId} className="flex items-center gap-3">
                    <span className="flex-1 text-sm">{q.vendorName}</span>
                    <div className="w-40">
                      <Input
                        type="number"
                        step="0.01"
                        value={q.rate || ''}
                        placeholder="Rate ₹"
                        onChange={(e) => setRate(li, qi, Number(e.target.value))}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
