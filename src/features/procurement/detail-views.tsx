import { formatCurrency, formatDate, formatPercent } from '@/lib/format'
import { chargeableOptions } from '@/lib/options'
import type { Comparison, NewMaterialRequest, RateRevision } from '@/types'

function field(label: string, value: React.ReactNode) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

const chargeLabel = (v: string) => chargeableOptions.find((o) => o.value === v)?.label ?? v

export function NewMaterialDetail({ record }: { record: NewMaterialRequest }) {
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {field('Form No', record.formNo)}
        {field('Date', formatDate(record.date))}
        {field('Department', record.department)}
        {field('Supplier', record.supplierName)}
        {field('Requested By', record.requestedBy)}
        {field('Lead Time', record.leadTime)}
        {field('Chargeable', chargeLabel(record.chargeable))}
      </dl>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Brand</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
              <th className="px-3 py-2 font-semibold">Quote</th>
              <th className="px-3 py-2 font-semibold">Negotiated</th>
              <th className="px-3 py-2 font-semibold">GST</th>
            </tr>
          </thead>
          <tbody>
            {record.lines.map((l, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-3 py-2">{l.itemName}</td>
                <td className="px-3 py-2">{l.brand}</td>
                <td className="px-3 py-2">{l.quantity} {l.unit}</td>
                <td className="px-3 py-2">{formatCurrency(l.quoteRate)}</td>
                <td className="px-3 py-2 font-medium text-success">{formatCurrency(l.negotiatedRate)}</td>
                <td className="px-3 py-2">{l.gstPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {record.remark && <p className="text-sm text-muted-foreground">Remark: {record.remark}</p>}
    </div>
  )
}

export function ComparisonDetail({ record }: { record: Comparison }) {
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {field('Comp No', record.compNo)}
        {field('Date', formatDate(record.date))}
        {field('Store', record.storeName)}
        {field('Recommended', <span className="text-primary">{record.recommendedVendor}</span>)}
      </dl>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
              {record.vendors.map((v) => (
                <th key={v} className="px-3 py-2 font-semibold">{v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {record.rows.map((row, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-3 py-2">{row.itemName}</td>
                <td className="px-3 py-2">{row.quantity} {row.unit}</td>
                {record.vendors.map((v) => {
                  const best = row.recommendedVendor === v
                  return (
                    <td key={v} className={best ? 'px-3 py-2 font-semibold text-success' : 'px-3 py-2'}>
                      {formatCurrency(row.rates[v])}
                      {best && <span className="ml-1 text-xs">✓</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {record.remark && <p className="text-sm text-muted-foreground">Remark: {record.remark}</p>}
    </div>
  )
}

export function RateRevisionDetail({ record }: { record: RateRevision }) {
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {field('Form No', record.formNo)}
        {field('Date', formatDate(record.date))}
        {field('Supplier', record.supplier)}
        {field('Brand', record.brandName)}
        {field('Department', record.userDepartment)}
        {field('Chargeable', chargeLabel(record.chargeable))}
      </dl>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border p-3">
          <p className="text-xs text-muted-foreground">Existing Rate</p>
          <p className="text-lg font-semibold">{formatCurrency(record.existingRate)}</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-xs text-muted-foreground">Revised Rate</p>
          <p className="text-lg font-semibold text-warning">{formatCurrency(record.revisedCostPrice)}</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-xs text-muted-foreground">Rate Δ</p>
          <p className="text-lg font-semibold">{formatPercent(record.differenceRatePercent)}</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-xs text-muted-foreground">MRP Δ</p>
          <p className="text-lg font-semibold">{formatPercent(record.differenceMrpPercent)}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">Reason: {record.reason}</p>
    </div>
  )
}
