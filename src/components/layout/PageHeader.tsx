import { motion } from 'framer-motion'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Crumb[]
  actions?: React.ReactNode
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="space-y-2">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </motion.div>
  )
}
