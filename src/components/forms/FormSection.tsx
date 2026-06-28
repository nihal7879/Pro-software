import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className="grid gap-6 border-b border-border py-6 first:pt-0 last:border-0 md:grid-cols-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('md:col-span-2', className)}>{children}</div>
    </div>
  )
}
