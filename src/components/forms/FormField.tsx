import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

export function FormField({ label, htmlFor, required, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}
