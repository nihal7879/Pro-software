import { Award, Check, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ApprovalActions } from '@/components/common/ApprovalActions'
import { useComparisons, useVendors } from '@/hooks/useProcurement'
import { formatCurrency } from '@/lib/format'
import { paths } from '@/routes/paths'
import { PageLoader } from '@/components/common/Loader'

export default function VendorRecommendation() {
  const { data: comparisons, isLoading } = useComparisons()
  const { data: vendors } = useVendors()

  if (isLoading || !comparisons) return <PageLoader />
  const comp = comparisons[0]
  const recommended = vendors?.find((v) => v.name === comp.recommendedVendor)

  return (
    <div>
      <PageHeader
        title="Vendor Recommendation"
        description="Recommended vendor based on comparison analysis."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'Comparison', to: paths.comparisonList }, { label: 'Recommendation' }]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recommendation Summary — {comp.compNo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-success/40 bg-success/5 p-4">
              <Avatar name={comp.recommendedVendor} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{comp.recommendedVendor}</p>
                  <Badge tone="success"><Award className="size-3" /> Recommended</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{comp.remark}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {comp.vendors.map((v) => {
                const total = comp.rows.reduce((s, r) => s + r.rates[v] * r.quantity, 0)
                const best = v === comp.recommendedVendor
                return (
                  <div key={v} className={best ? 'rounded-xl border border-success/40 bg-success/5 p-3' : 'rounded-xl border border-border p-3'}>
                    <p className="text-sm font-medium">{v}</p>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(total)}</p>
                    {best && <span className="mt-1 inline-flex items-center gap-1 text-xs text-success"><Check className="size-3" /> Lowest</span>}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingDown className="size-4 text-success" /> Estimated Savings
              </div>
              <p className="text-2xl font-bold text-success">{formatCurrency(750)}</p>
              <p className="text-xs text-muted-foreground">vs highest quote across all line items.</p>
            </CardContent>
          </Card>

          {recommended && (
            <Card>
              <CardContent className="space-y-2 p-5 text-sm">
                <p className="font-semibold">Vendor Snapshot</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span>{recommended.rating.toFixed(1)} ★</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">On-time</span><span>{recommended.onTimeDeliveryRate}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Lead time</span><span>{recommended.leadTimeDays} days</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Terms</span><span>{recommended.paymentTerms}</span></div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold">Approve Recommendation</p>
              <ApprovalActions reference={comp.compNo} size="sm" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
