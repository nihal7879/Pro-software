import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: React.ReactNode
  children: (close: () => void) => React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

interface MenuPos {
  top: number
  left: number
  origin: 'top' | 'bottom'
}

const MENU_WIDTH = 192 // 12rem

export function Dropdown({ trigger, children, align = 'end', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<MenuPos>({ top: 0, left: 0, origin: 'top' })

  // Position the portalled menu against the trigger, flipping up near the bottom.
  const place = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const menuH = menuRef.current?.offsetHeight ?? 0
    const spaceBelow = window.innerHeight - r.bottom
    const flip = menuH > 0 && spaceBelow < menuH + 12
    const left = align === 'end' ? r.right - MENU_WIDTH : r.left
    setPos({
      top: flip ? r.top - menuH - 8 : r.bottom + 8,
      left: Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8)),
      origin: flip ? 'bottom' : 'top',
    })
  }

  useLayoutEffect(() => {
    if (open) place()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !menuRef.current?.contains(t)) setOpen(false)
    }
    const onScroll = () => place()
    document.addEventListener('mousedown', onClick)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onClick)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      <div ref={triggerRef} className="inline-flex" onClick={() => setOpen((v) => !v)}>
        {trigger}
      </div>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: pos.top, left: pos.left, transformOrigin: pos.origin }}
              className={cn(
                'z-[60] min-w-[12rem] overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-popover',
                className,
              )}
            >
              {children(() => setOpen(false))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export function DropdownItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:size-4 [&_svg]:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground">{children}</div>
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />
}
