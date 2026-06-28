import { PageHeader } from '@/components/layout/PageHeader'
import { KpiCard } from '@/components/common/KpiCard'
import { ChartCard } from '@/components/charts/ChartCard'
import { ApprovalStatusChart, PurchaseTrendChart } from '@/components/charts'
import { Card, CardContent } from '@/components/ui/card'
import { PageLoader } from '@/components/common/Loader'
import { useDashboard } from '@/hooks/useProcurement'
import { formatPercent } from '@/lib/format'
import { UserRole } from '@/types'

const cycleMetrics = [
  { label: 'MR → PO Cycle Time', value: '6.2 days', target: '7 days', progress: 88 },
  { label: 'RFQ Response Rate', value: '92%', target: '90%', progress: 92 },
  { label: 'On-Time Delivery', value: '90%', target: '95%', progress: 90 },
  { label: 'Budget Adherence', value: '97%', target: '100%', progress: 97 },
  { label: 'Approval SLA Met', value: '85%', target: '90%', progress: 85 },
]

export default function ProcurementKpi() {
  const { data, isLoading } = useDashboard(UserRole.Purchase)
  if (isLoading || !data) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Procurement KPI"
        description="Key performance indicators for the procurement function."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'KPI' }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((m, i) => (
          <KpiCard key={m.id} metric={m} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 p-6">
            <h3 className="text-sm font-semibold">Efficiency Metrics</h3>
            {cycleMetrics.map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{m.label}</span>
                  <span className="font-medium">
                    {m.value} <span className="text-xs text-muted-foreground">/ {m.target}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: formatPercent(m.progress) }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <ChartCard title="Approval Pipeline" description="Documents by stage">
            <ApprovalStatusChart data={data.approvalStatus} />
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <ChartCard title="Order Trend" description="Weekly purchase order volume">
          <PurchaseTrendChart data={data.purchaseTrend} />
        </ChartCard>
      </div>
    </div>
  )
}
