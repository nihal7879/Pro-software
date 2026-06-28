import { UserRole } from '@/types'
import { DashboardView } from './DashboardView'

export default function DashboardHod() {
  return (
    <DashboardView
      role={UserRole.HOD}
      title="HOD Dashboard"
      description="Department-level approvals, spend and team requests."
    />
  )
}
