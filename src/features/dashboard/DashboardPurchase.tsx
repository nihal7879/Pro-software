import { UserRole } from '@/types'
import { DashboardView } from './DashboardView'

export default function DashboardPurchase() {
  return (
    <DashboardView
      role={UserRole.Purchase}
      title="Purchase Dashboard"
      description="Operational overview of procurement activity and pending work."
    />
  )
}
