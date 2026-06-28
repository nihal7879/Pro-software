import { Check, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ApprovalStatus, type ApprovalStep } from '@/types'
import { formatDate } from '@/lib/format'

const stepConfig = (status: ApprovalStatus) => {
  if (status === ApprovalStatus.Approved || status === ApprovalStatus.CeoApproved || status === ApprovalStatus.HodApproved)
    return { icon: Check, ring: 'bg-success text-success-foreground' }
  if (status === ApprovalStatus.Rejected) return { icon: X, ring: 'bg-destructive text-destructive-foreground' }
  return { icon: Clock, ring: 'bg-warning text-warning-foreground' }
}

export function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  if (steps.length === 0) {
    return <p className="text-sm text-muted-foreground">No approval activity yet.</p>
  }
  return (
    <ol className="relative space-y-6">
      {steps.map((step, i) => {
        const { icon: Icon, ring } = stepConfig(step.status)
        const last = i === steps.length - 1
        return (
          <li key={`${step.role}-${i}`} className="relative flex gap-4">
            {!last && <span className="absolute left-[15px] top-8 h-[calc(100%+8px)] w-px bg-border" />}
            <span className={cn('z-10 flex size-8 shrink-0 items-center justify-center rounded-full', ring)}>
              <Icon className="size-4" strokeWidth={2.5} />
            </span>
            <div className="pb-1">
              <p className="text-sm font-medium">
                {step.role} · {step.approverName}
              </p>
              <p className="text-xs text-muted-foreground">
                {step.actedOn ? formatDate(step.actedOn, 'dd MMM yyyy') : 'Awaiting action'}
              </p>
              {step.remark && <p className="mt-1 text-sm text-foreground">“{step.remark}”</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
