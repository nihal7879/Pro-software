import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  side?: 'left' | 'right'
  widthClass?: string
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  side = 'right',
  widthClass = 'w-full max-w-md',
}: DrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={cn(
              'absolute top-0 flex h-full flex-col border-border bg-card shadow-popover',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              widthClass,
            )}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 border-b border-border p-5">
                <div>
                  {title && <h2 className="text-base font-semibold">{title}</h2>}
                  {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
                </div>
                <Button variant="ghost" size="icon" className="-mr-2 -mt-2" onClick={onClose}>
                  <X />
                </Button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
