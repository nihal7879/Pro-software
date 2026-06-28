import { forwardRef } from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

export type DatePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

/** Styled native date input — accessible, no extra dependency. */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="date"
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
)
DatePicker.displayName = 'DatePicker'
