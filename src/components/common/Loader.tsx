import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Loader({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-12 text-muted-foreground', className)}>
      <Loader2 className="size-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader label="Loading…" />
    </div>
  )
}
