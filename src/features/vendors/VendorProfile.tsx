import { Link, useParams } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Star,
  Truck,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { VendorStatusBadge } from '@/components/common/StatusBadge'
import { ChartCard } from '@/components/charts/ChartCard'
import { VendorPerformanceChart } from '@/components/charts'
import { PageLoader } from '@/components/common/Loader'
import { EmptyState } from '@/components/common/EmptyState'
import { useVendor } from '@/hooks/useProcurement'
import { formatCurrency, formatDate, formatPercent } from '@/lib/format'
import { paths } from '@/routes/paths'

function Stat({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-accent">
        <Icon className="size-4 text-accent-foreground" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function VendorProfile() {
  const { id = '' } = useParams()
  const { data: vendor, isLoading } = useVendor(id)

  if (isLoading) return <PageLoader />
  if (!vendor)
    return (
      <EmptyState
        title="Vendor not found"
        description="This vendor may have been removed."
        action={
          <Link to={paths.vendorDirectory} className={buttonVariants({ variant: 'outline' })}>
            Back to directory
          </Link>
        }
      />
    )

  const perf = [
    { vendor: vendor.name, onTime: vendor.onTimeDeliveryRate, quality: Math.round(vendor.rating * 20), spend: vendor.totalSpend },
  ]

  return (
    <div>
      <PageHeader
        title={vendor.name}
        description={`Vendor code ${vendor.code}`}
        breadcrumbs={[{ label: 'Vendors', to: paths.vendorDirectory }, { label: vendor.name }]}
        actions={<VendorStatusBadge status={vendor.status} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar name={vendor.name} size="lg" />
              <h2 className="mt-3 text-lg font-semibold">{vendor.name}</h2>
              <p className="text-sm text-muted-foreground">{vendor.contactPerson}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium">
                <Star className="size-4 fill-warning text-warning" />
                {vendor.rating.toFixed(1)} rating
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {vendor.category.map((c) => (
                  <Badge key={c} tone="primary">
                    {c.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-4 border-t border-border pt-6">
              <Stat icon={Mail} label="Email" value={vendor.email} />
              <Stat icon={Phone} label="Phone" value={vendor.phone} />
              <Stat icon={MapPin} label="Address" value={`${vendor.address}, ${vendor.city}`} />
              <Stat icon={Building2} label="GSTIN" value={vendor.gstin} />
              <Stat icon={CreditCard} label="Payment Terms" value={vendor.paymentTerms} />
              <Stat icon={Truck} label="Lead Time" value={`${vendor.leadTimeDays} days`} />
              <Stat icon={CalendarClock} label="Onboarded" value={formatDate(vendor.createdAt)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Total Orders', value: vendor.totalOrders.toString() },
              { label: 'Total Spend', value: formatCurrency(vendor.totalSpend, true) },
              { label: 'On-Time Delivery', value: formatPercent(vendor.onTimeDeliveryRate) },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <ChartCard title="Performance Snapshot" description="On-time vs quality scores">
            <VendorPerformanceChart data={perf} />
          </ChartCard>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['GST Certificate', 'PAN Card', 'MSME Registration', 'Cancelled Cheque'].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm"
                >
                  <span>{doc}</span>
                  <Badge tone="success">Verified</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
