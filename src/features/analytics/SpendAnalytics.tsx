import { PageHeader } from '@/components/layout/PageHeader'
import { KpiCard } from '@/components/common/KpiCard'
import { ChartCard } from '@/components/charts/ChartCard'
import { CategorySpendChart, MonthlySpendChart, PurchaseTrendChart } from '@/components/charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLoader } from '@/components/common/Loader'
import { useDashboard } from '@/hooks/useProcurement'
import { formatCurrency } from '@/lib/format'
import { UserRole } from '@/types'

export default function SpendAnalytics() {
  const { data, isLoading } = useDashboard(UserRole.CEO)
  if (isLoading || !data) return <PageLoader />

  const totalCategory = data.categorySpend.reduce((s, c) => s + c.value, 0)

  return (
    <div>
      <PageHeader
        title="Spend Analytics"
        description="Analyse procurement spend across time and category."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Spend' }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((m, i) => (
          <KpiCard key={m.id} metric={m} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Spend vs Budget" description="Fiscal year tracking">
            <MonthlySpendChart data={data.monthlySpend} />
          </ChartCard>
        </div>
        <ChartCard title="Category Split" description="Share of spend by category">
          <CategorySpendChart data={data.categorySpend} />
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Purchase Trend" description="Weekly order volume">
            <PurchaseTrendChart data={data.purchaseTrend} />
          </ChartCard>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.categorySpend.map((c) => {
              const pct = (c.value / totalCategory) * 100
              return (
                <div key={c.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{c.category}</span>
                    <span className="font-medium">{formatCurrency(c.value, true)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
