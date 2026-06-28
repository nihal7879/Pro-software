import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepperProps {
  steps: string[]
  current: number
  className?: string
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn('flex w-full items-center', className)}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        const last = i === steps.length - 1
        return (
          <li key={step} className={cn('flex items-center', !last && 'flex-1')}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  active && 'border-primary bg-accent text-primary',
                  !done && !active && 'border-border bg-card text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn('text-xs font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
                {step}
              </span>
            </div>
            {!last && <span className={cn('mx-2 h-0.5 flex-1 rounded', done ? 'bg-primary' : 'bg-border')} />}
          </li>
        )
      })}
    </ol>
  )
}
