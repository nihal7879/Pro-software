import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { BadgeTone } from '@/lib/status'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      tone: {
        neutral: 'border-transparent bg-muted text-muted-foreground',
        primary: 'border-transparent bg-accent text-accent-foreground',
        success: 'border-transparent bg-success/10 text-success',
        warning: 'border-transparent bg-warning/10 text-warning',
        danger: 'border-transparent bg-destructive/10 text-destructive',
        info: 'border-transparent bg-primary/10 text-primary',
      } satisfies Record<BadgeTone, string>,
    },
    defaultVariants: { tone: 'neutral' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
