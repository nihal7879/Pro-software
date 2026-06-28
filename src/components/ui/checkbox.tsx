import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, ...props }, ref) => (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <span className="relative inline-flex">
        <input ref={ref} type="checkbox" checked={checked} className="peer sr-only" {...props} />
        <span
          className={cn(
            'flex size-4 items-center justify-center rounded border border-input bg-card transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
            className,
          )}
        >
          {checked && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
        </span>
      </span>
      {label && <span className="select-none">{label}</span>}
    </label>
  ),
)
Checkbox.displayName = 'Checkbox'
