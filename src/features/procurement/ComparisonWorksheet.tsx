import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Plus, Save, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { useComparisonStore } from '@/store/comparison.store'
import { useAuthStore } from '@/store/auth.store'
import { ApprovalStatus, UserRole, type Comparison } from '@/types'

interface Row {
  item: string
  unit: string
  qty: number
  rates: number[] // aligned to vendors[]
}

export default function ComparisonWorksheet() {
  const navigate = useNavigate()
  const addComparison = useComparisonStore((s) => s.add)
  const approverName = useAuthStore((s) => s.currentUser?.name ?? 'Department HOD')

  const [store, setStore] = useState('General Store')
  const [vendors, setVendors] = useState<string[]>(['Vendor A', 'Vendor B', 'Vendor C'])
  const [rows, setRows] = useState<Row[]>([
    { item: '', unit: 'pcs', qty: 1, rates: [0, 0, 0] },
  ])

  const setVendor = (vi: number, name: string) => setVendors((p) => p.map((v, i) => (i === vi ? name : v)))
  const setRowField = (ri: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, i) => (i === ri ? { ...r, ...patch } : r)))
  const setRate = (ri: number, vi: number, value: number) =>
    setRows((prev) => prev.map((r, i) => (i === ri ? { ...r, rates: r.rates.map((x, j) => (j === vi ? value : x)) } : r)))
  const addRow = () => setRows((p) => [...p, { item: '', unit: 'pcs', qty: 1, rates: vendors.map(() => 0) }])
  const removeRow = (ri: number) => setRows((p) => (p.length > 1 ? p.filter((_, i) => i !== ri) : p))

  const lowestIdx = (r: Row) => {
    const valid = r.rates.map((v, i) => ({ v, i })).filter((x) => x.v > 0)
    if (valid.length === 0) return -1
    return valid.reduce((best, x) => (x.v < best.v ? x : best)).i
  }

  const totals = useMemo(
    () => vendors.map((_, vi) => rows.reduce((s, r) => s + (r.rates[vi] || 0) * r.qty, 0)),
    [vendors, rows],
  )
  const winnerIdx = totals.reduce((best, t, i) => (t > 0 && (totals[best] === 0 || t < totals[best]) ? i : best), 0)

  const save = () => {
    if (rows.some((r) => !r.item.trim())) {
      toast.error('Incomplete', 'Every row needs an item name.')
      return
    }
    const comparisonRows = rows.map((r) => {
      const rates: Record<string, number> = {}
      vendors.forEach((v, vi) => { if (r.rates[vi] > 0) rates[v] = r.rates[vi] })
      const li = lowestIdx(r)
      return { itemName: r.item, unit: r.unit, quantity: r.qty, rates, recommendedVendor: li >= 0 ? vendors[li] : vendors[0] }
    })
    const comparison: Comparison = {
      id: `CMP-${Date.now()}`,
      compNo: `SH-CP-NEW-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      storeName: store,
      vendors: [...vendors],
      recommendedVendor: vendors[winnerIdx],
      status: ApprovalStatus.Pending,
      remark: `Recommended ${vendors[winnerIdx]} (lowest total).`,
      rows: comparisonRows,
      approvals: [
        { role: UserRole.HOD, approverName, status: ApprovalStatus.Pending },
        { role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Pending },
      ],
    }
    addComparison(comparison)
    toast.success('Comparison saved', `${comparison.compNo} · recommended ${vendors[winnerIdx]}`)
    navigate(paths.comparisonList)
  }

  return (
    <div>
      <PageHeader
        title="Comparison Worksheet"
        description="Enter and compare vendor quotes to find the best price."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Comparison', to: paths.comparisonList }, { label: 'Worksheet' }]}
        actions={
          <Button onClick={save}>
            <Save />
            Save & Recommend
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <span>New Comparison ·</span>
              <Input value={store} onChange={(e) => setStore(e.target.value)} className="h-9 w-48" placeholder="Store" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-2 py-2 font-semibold">Item</th>
                  <th className="px-2 py-2 font-semibold">Qty</th>
                  <th className="px-2 py-2 font-semibold">Unit</th>
                  {vendors.map((v, vi) => (
                    <th key={vi} className="px-2 py-2 font-semibold">
                      <Input value={v} onChange={(e) => setVendor(vi, e.target.value)} className="h-8 w-32" />
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const lowest = lowestIdx(row)
                  return (
                    <tr key={ri} className="border-b border-border">
                      <td className="px-2 py-2">
                        <Input value={row.item} onChange={(e) => setRowField(ri, { item: e.target.value })} className="h-9 w-48" placeholder="Item name" />
                      </td>
                      <td className="px-2 py-2">
                        <Input type="number" value={row.qty} onChange={(e) => setRowField(ri, { qty: Number(e.target.value) })} className="h-9 w-20" />
                      </td>
                      <td className="px-2 py-2">
                        <Input value={row.unit} onChange={(e) => setRowField(ri, { unit: e.target.value })} className="h-9 w-20" />
                      </td>
                      {vendors.map((_, vi) => (
                        <td key={vi} className="px-2 py-2">
                          <Input
                            type="number"
                            value={row.rates[vi] || ''}
                            placeholder="₹"
                            onChange={(e) => setRate(ri, vi, Number(e.target.value))}
                            className={cn('h-9 w-24', lowest === vi && 'border-success bg-success/5 font-semibold text-success')}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2">
                        <Button type="button" variant="ghost" size="icon" disabled={rows.length === 1} onClick={() => removeRow(ri)}>
                          <Trash2 className="text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40">
                  <td className="px-2 py-3 font-semibold" colSpan={3}>Total</td>
                  {vendors.map((_, vi) => (
                    <td key={vi} className="px-2 py-3">
                      <span className={cn('font-semibold', winnerIdx === vi && totals[vi] > 0 && 'text-success')}>
                        {formatCurrency(totals[vi])}
                        {winnerIdx === vi && totals[vi] > 0 && (
                          <Badge tone="success" className="ml-2"><Award className="size-3" /> Best</Badge>
                        )}
                      </span>
                    </td>
                  ))}
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addRow}>
            <Plus />
            Add Item
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
