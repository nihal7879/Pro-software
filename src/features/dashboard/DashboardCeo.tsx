import { UserRole } from '@/types'
import { DashboardView } from './DashboardView'

export default function DashboardCeo() {
  return (
    <DashboardView
      role={UserRole.CEO}
      title="CEO Dashboard"
      description="Organisation-wide spend, savings and executive sign-offs."
    />
  )
}
