import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Save } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'

interface Row {
  item: string
  unit: string
  qty: number
  rates: Record<string, number>
}

const VENDORS = ['AIM Safety', 'B. M Enterprises', 'Taheri Enterprises']

const initialRows: Row[] = [
  { item: 'Safety Helmet Yellow - Karam Make', unit: 'pcs', qty: 50, rates: { 'AIM Safety': 225, 'B. M Enterprises': 240, 'Taheri Enterprises': 235 } },
  { item: 'Nitrile Gloves (Box 100)', unit: 'box', qty: 60, rates: { 'AIM Safety': 320, 'B. M Enterprises': 332, 'Taheri Enterprises': 318 } },
]

export default function ComparisonWorksheet() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Row[]>(initialRows)

  const setRate = (ri: number, vendor: string, value: number) =>
    setRows((prev) => prev.map((r, i) => (i === ri ? { ...r, rates: { ...r.rates, [vendor]: value } } : r)))

  const lowestFor = (row: Row) =>
    VENDORS.reduce((best, v) => (row.rates[v] < row.rates[best] ? v : best), VENDORS[0])

  const totals = useMemo(
    () =>
      Object.fromEntries(
        VENDORS.map((v) => [v, rows.reduce((s, r) => s + (r.rates[v] || 0) * r.qty, 0)]),
      ),
    [rows],
  )
  const winner = VENDORS.reduce((best, v) => (totals[v] < totals[best] ? v : best), VENDORS[0])

  return (
    <div>
      <PageHeader
        title="Comparison Worksheet"
        description="Enter and compare vendor quotes to find the best price."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Comparison', to: paths.comparisonList }, { label: 'Worksheet' }]}
        actions={
          <Button onClick={() => { toast.success('Comparison saved', `Recommended: ${winner}`); navigate(paths.comparisonList) }}>
            <Save />
            Save & Recommend
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>SH-CP-GEN-2026 · General Store</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 font-semibold">Qty</th>
                  {VENDORS.map((v) => (
                    <th key={v} className="px-3 py-2 font-semibold">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const lowest = lowestFor(row)
                  return (
                    <tr key={row.item} className="border-b border-border">
                      <td className="px-3 py-2.5 font-medium">{row.item}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{row.qty} {row.unit}</td>
                      {VENDORS.map((v) => (
                        <td key={v} className="px-3 py-2.5">
                          <Input
                            type="number"
                            value={row.rates[v]}
                            onChange={(e) => setRate(ri, v, Number(e.target.value))}
                            className={cn('h-9 w-24', lowest === v && 'border-success bg-success/5 font-semibold text-success')}
                          />
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/40">
                  <td className="px-3 py-3 font-semibold" colSpan={2}>Total</td>
                  {VENDORS.map((v) => (
                    <td key={v} className="px-3 py-3">
                      <span className={cn('font-semibold', winner === v && 'text-success')}>
                        {formatCurrency(totals[v])}
                        {winner === v && (
                          <Badge tone="success" className="ml-2">
                            <Award className="size-3" /> Best
                          </Badge>
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
