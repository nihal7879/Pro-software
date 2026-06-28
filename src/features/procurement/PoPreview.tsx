import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ApprovalStatusBadge } from '@/components/common/StatusBadge'
import { ApprovalTimeline } from '@/components/common/Timeline'
import { PageLoader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { usePurchaseOrder, useVendor } from '@/hooks/useProcurement'
import { formatCurrency, formatDate } from '@/lib/format'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'

export default function PoPreview() {
  const { id = '' } = useParams()
  const { data: po, isLoading } = usePurchaseOrder(id)
  const { data: vendor } = useVendor(po?.vendorId ?? '')

  if (isLoading) return <PageLoader />
  if (!po)
    return (
      <EmptyState
        title="Purchase order not found"
        action={<Link to={paths.poList} className={buttonVariants({ variant: 'outline' })}>Back to list</Link>}
      />
    )

  return (
    <div>
      <PageHeader
        title="Purchase Order Preview"
        description={po.poNo}
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Purchase Orders', to: paths.poList }, { label: 'Preview' }]}
        actions={
          <>
            <Link to={paths.poList} className={buttonVariants({ variant: 'outline' })}>
              <ArrowLeft />
              Back
            </Link>
            <Button variant="outline" onClick={() => toast.info('Print', 'Print dialog would open')}>
              <Printer />
              Print
            </Button>
            <Button onClick={() => toast.success('Downloaded', `${po.poNo}.pdf`)}>
              <Download />
              Download PDF
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">P</span>
                  <span className="text-lg font-bold">Saifee Hospital</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Purchase Department</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">PURCHASE ORDER</h2>
                <p className="text-sm text-muted-foreground">{po.poNo}</p>
                <p className="text-sm text-muted-foreground">{formatDate(po.date)}</p>
                <div className="mt-2 flex justify-end"><ApprovalStatusBadge status={po.status} /></div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="mb-1 font-semibold text-muted-foreground">Vendor</p>
                <p className="font-medium">{po.vendorName}</p>
                {vendor && (
                  <>
                    <p className="text-muted-foreground">{vendor.address}, {vendor.city}</p>
                    <p className="text-muted-foreground">GSTIN: {vendor.gstin}</p>
                    <p className="text-muted-foreground">{vendor.phone}</p>
                  </>
                )}
              </div>
              <div>
                <p className="mb-1 font-semibold text-muted-foreground">Ship To</p>
                <p className="font-medium">{po.store}</p>
                <p className="text-muted-foreground">Department: {po.department}</p>
                <p className="text-muted-foreground">Expected: {formatDate(po.expectedDelivery)}</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Item</th>
                    <th className="px-3 py-2 font-semibold">Qty</th>
                    <th className="px-3 py-2 font-semibold">Rate</th>
                    <th className="px-3 py-2 font-semibold">GST</th>
                    <th className="px-3 py-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {po.lines.map((l, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2">{l.itemName}</td>
                      <td className="px-3 py-2">{l.quantity} {l.unit}</td>
                      <td className="px-3 py-2">{formatCurrency(l.rate)}</td>
                      <td className="px-3 py-2">{l.gstPercent}%</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(l.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="w-56 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Sub Total</span><span>{formatCurrency(po.subTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(po.taxTotal)}</span></div>
                <Separator className="my-1" />
                <div className="flex justify-between text-base font-semibold"><span>Grand Total</span><span>{formatCurrency(po.grandTotal)}</span></div>
              </div>
            </div>

            <Separator className="my-6" />
            <p className="text-xs text-muted-foreground"><span className="font-semibold">Terms:</span> {po.terms}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold">Approval Status</h3>
            <ApprovalTimeline steps={po.approvals} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
