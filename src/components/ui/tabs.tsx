import { createContext, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
  id: string
}
const TabsContext = createContext<TabsContextValue | null>(null)

export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string
  children: React.ReactNode
  className?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const id = `tabs-${defaultValue}`
  return (
    <TabsContext.Provider value={{ value, setValue, id }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-xl bg-muted p-1', className)}>{children}</div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be inside Tabs')
  const active = ctx.value === value
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        'relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {active && (
        <motion.span
          layoutId={ctx.id}
          className="absolute inset-0 rounded-lg bg-card shadow-soft"
          transition={{ type: 'spring', duration: 0.3 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = useContext(TabsContext)
  if (!ctx || ctx.value !== value) return null
  return <div className={cn('mt-4', className)}>{children}</div>
}
