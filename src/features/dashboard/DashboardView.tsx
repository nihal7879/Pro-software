import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ClipboardCheck,
  ClipboardList,
  FileSpreadsheet,
  GitCompareArrows,
  PackagePlus,
  ReceiptText,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { KpiCard } from '@/components/common/KpiCard'
import { ChartCard } from '@/components/charts/ChartCard'
import {
  ApprovalStatusChart,
  CategorySpendChart,
  MonthlySpendChart,
  PurchaseTrendChart,
} from '@/components/charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { ApprovalStatusBadge } from '@/components/common/StatusBadge'
import { PageLoader } from '@/components/common/Loader'
import { useActivities, useDashboard } from '@/hooks/useProcurement'
import { formatRelative } from '@/lib/format'
import { paths } from '@/routes/paths'
import { UserRole } from '@/types'

const quickActionsByRole: Record<UserRole, { label: string; to: string; icon: typeof ClipboardList }[]> = {
  [UserRole.Purchase]: [
    { label: 'New Material Request', to: paths.materialRequestCreate, icon: ClipboardList },
    { label: 'Create RFQ', to: paths.rfqCreate, icon: PackagePlus },
    { label: 'New Comparison', to: paths.comparisonWorksheet, icon: GitCompareArrows },
    { label: 'Create PO', to: paths.poCreate, icon: FileSpreadsheet },
  ],
  [UserRole.HOD]: [
    { label: 'Material Requests', to: paths.materialRequestApproval, icon: ClipboardCheck },
    { label: 'Comparison Approvals', to: paths.comparisonApproval, icon: GitCompareArrows },
    { label: 'New Material Review', to: paths.hodReview, icon: PackagePlus },
    { label: 'Rate Revisions', to: paths.rateRevisionApproval, icon: ReceiptText },
  ],
  [UserRole.CEO]: [
    { label: 'Comparison Approvals', to: paths.comparisonApproval, icon: GitCompareArrows },
    { label: 'New Material Approvals', to: paths.ceoApproval, icon: PackagePlus },
    { label: 'Rate Revisions', to: paths.rateRevisionApproval, icon: ReceiptText },
    { label: 'PO Approvals', to: paths.poApproval, icon: FileSpreadsheet },
  ],
}

interface DashboardViewProps {
  role: UserRole
  title: string
  description: string
}

export function DashboardView({ role, title, description }: DashboardViewProps) {
  const { data, isLoading } = useDashboard(role)
  const { data: activities } = useActivities()
  const quickActions = quickActionsByRole[role] ?? []
  const isPurchase = role === UserRole.Purchase

  if (isLoading || !data) return <PageLoader />

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[{ label: 'Home', to: paths.root }, { label: 'Dashboard' }]}
        actions={
          isPurchase ? (
            <Link to={paths.materialRequestCreate} className={buttonVariants()}>
              New Request <ArrowRight className="size-4" />
            </Link>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((metric, i) => (
          <KpiCard key={metric.id} metric={metric} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Purchase vs Budget" description="Spend trajectory across the fiscal year">
            <MonthlySpendChart data={data.monthlySpend} />
          </ChartCard>
        </div>
        <ChartCard title="Category Spend" description="Distribution by category">
          <CategorySpendChart data={data.categorySpend} />
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Approval Status" description="Documents by stage">
          <ApprovalStatusChart data={data.approvalStatus} />
        </ChartCard>
        <ChartCard title="Purchase Trend" description="Weekly order volume">
          <PurchaseTrendChart data={data.purchaseTrend} />
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>{isPurchase ? 'Quick Actions' : 'Pending Approvals'}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div key={action.to} whileHover={{ y: -3 }}>
                  <Link
                    to={action.to}
                    className="flex h-full flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    <Icon className="size-5 text-primary" />
                    <span className="text-sm font-medium leading-snug">{action.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recent Activity</CardTitle>
            <Link to={paths.auditLog} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              View audit log
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {activities?.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
              >
                <Avatar name={a.actor} size="sm" />
                <div className="flex-1 text-sm">
                  <span className="font-medium">{a.actor}</span>{' '}
                  <span className="text-muted-foreground">{a.action}</span>{' '}
                  <span className="font-medium">{a.target}</span>
                </div>
                <ApprovalStatusBadge status={a.status} />
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {formatRelative(a.timestamp)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
