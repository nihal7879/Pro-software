import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Star } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChartCard } from '@/components/charts/ChartCard'
import { VendorPerformanceChart } from '@/components/charts'
import { DataTable } from '@/components/tables/DataTable'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/common/Loader'
import { useDashboard, useVendors } from '@/hooks/useProcurement'
import { formatCurrency, formatPercent } from '@/lib/format'
import { UserRole, type Vendor } from '@/types'

export default function VendorPerformance() {
  const { data: dash, isLoading } = useDashboard(UserRole.CEO)
  const { data: vendors } = useVendors()

  const columns = useMemo<ColumnDef<Vendor>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Vendor',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar name={row.original.name} size="sm" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-warning text-warning" />{row.original.rating.toFixed(1)}</span>
        ),
      },
      { accessorKey: 'onTimeDeliveryRate', header: 'On-Time', cell: ({ row }) => formatPercent(row.original.onTimeDeliveryRate) },
      { accessorKey: 'totalOrders', header: 'Orders', cell: ({ row }) => row.original.totalOrders },
      { accessorKey: 'totalSpend', header: 'Spend', cell: ({ row }) => formatCurrency(row.original.totalSpend, true) },
      {
        id: 'score',
        header: 'Grade',
        cell: ({ row }) => {
          const score = row.original.rating
          const tone = score >= 4.5 ? 'success' : score >= 4 ? 'info' : score >= 3 ? 'warning' : 'danger'
          const label = score >= 4.5 ? 'A+' : score >= 4 ? 'A' : score >= 3 ? 'B' : 'C'
          return <Badge tone={tone}>{label}</Badge>
        },
      },
    ],
    [],
  )

  if (isLoading || !dash) return <PageLoader />

  return (
    <div>
      <PageHeader
        title="Vendor Performance"
        description="Delivery reliability, quality and spend by vendor."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Vendor Performance' }]}
      />

      <ChartCard title="On-Time vs Quality" description="Top vendors by performance score">
        <VendorPerformanceChart data={dash.vendorPerformance} />
      </ChartCard>

      <div className="mt-6">
        <DataTable columns={columns} data={vendors ?? []} searchPlaceholder="Search vendors…" />
      </div>
    </div>
  )
}
