import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useToastStore, type ToastVariant } from '@/store/toast.store'
import { cn } from '@/lib/utils'

const config: Record<ToastVariant, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: 'text-success' },
  error: { icon: XCircle, className: 'text-destructive' },
  info: { icon: Info, className: 'text-primary' },
  warning: { icon: AlertTriangle, className: 'text-warning' },
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const { icon: Icon, className } = config[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-popover"
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', className)} />
              <div className="flex-1">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{toast.description}</p>
                )}
              </div>
              <button onClick={() => dismiss(toast.id)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
