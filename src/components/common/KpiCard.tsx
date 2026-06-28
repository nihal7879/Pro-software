import { motion } from 'framer-motion'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  IndianRupee,
  type LucideIcon,
  Minus,
  ShieldCheck,
  Stamp,
  Timer,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import type { KpiMetric } from '@/types'

function renderValue(metric: KpiMetric): string {
  switch (metric.format) {
    case 'currency':
      return formatCurrency(metric.value, metric.value >= 100000)
    case 'percent':
      return formatPercent(metric.value)
    default:
      return formatNumber(metric.value)
  }
}

const iconRegistry: Record<string, LucideIcon> = {
  IndianRupee,
  FileText,
  Clock,
  Building2,
  ClipboardCheck,
  CheckCircle2,
  Timer,
  Stamp,
  TrendingDown,
  ShieldCheck,
}

export function KpiCard({ metric, index = 0 }: { metric: KpiMetric; index?: number }) {
  const Icon = iconRegistry[metric.icon] ?? Activity
  const { direction, delta } = metric.trend
  const TrendIcon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus
  const positive = direction === 'up'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent">
              <Icon className="size-5 text-accent-foreground" />
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
              )}
            >
              <TrendIcon className="size-3" />
              {Math.abs(delta)}%
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{renderValue(metric)}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
