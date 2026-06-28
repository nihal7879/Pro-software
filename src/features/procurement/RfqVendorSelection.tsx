import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Truck } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { VendorStatusBadge } from '@/components/common/StatusBadge'
import { useVendors } from '@/hooks/useProcurement'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'
import { VendorStatus } from '@/types'

export default function RfqVendorSelection() {
  const { data } = useVendors()
  const [selected, setSelected] = useState<string[]>([])
  const eligible = (data ?? []).filter((v) => v.status === VendorStatus.Active)

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <div>
      <PageHeader
        title="RFQ Vendor Selection"
        description="Pick eligible vendors to invite for this RFQ."
        breadcrumbs={[{ label: 'Procurement' }, { label: 'RFQ', to: paths.rfqList }, { label: 'Vendor Selection' }]}
        actions={
          <Button disabled={selected.length === 0} onClick={() => toast.success('Vendors selected', `${selected.length} added to RFQ.`)}>
            Add {selected.length > 0 ? `${selected.length} ` : ''}to RFQ
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eligible.map((v) => {
          const active = selected.includes(v.id)
          return (
            <motion.div key={v.id} whileHover={{ y: -4 }}>
              <Card
                onClick={() => toggle(v.id)}
                className={cn('cursor-pointer transition-all', active && 'ring-2 ring-primary')}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={v.name} />
                      <div>
                        <p className="font-medium leading-tight">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.city}</p>
                      </div>
                    </div>
                    {active && (
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-4" />
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-warning text-warning" />
                      {v.rating.toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Truck className="size-3.5" />
                      {v.leadTimeDays}d
                    </span>
                    <VendorStatusBadge status={v.status} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Total spend {formatCurrency(v.totalSpend, true)} · {v.onTimeDeliveryRate}% on-time
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
