import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, AtSign, Bell, CheckCircle2, Info, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/common/EmptyState'
import { PageLoader } from '@/components/common/Loader'
import { useNotifications } from '@/hooks/useProcurement'
import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'
import { NotificationType, type AppNotification } from '@/types'

const iconFor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Approval: return { Icon: CheckCircle2, className: 'text-success' }
    case NotificationType.Rejection: return { Icon: XCircle, className: 'text-destructive' }
    case NotificationType.Warning: return { Icon: AlertTriangle, className: 'text-warning' }
    case NotificationType.Mention: return { Icon: AtSign, className: 'text-primary' }
    default: return { Icon: Info, className: 'text-muted-foreground' }
  }
}

function List({ items, onOpen }: { items: AppNotification[]; onOpen: (n: AppNotification) => void }) {
  if (items.length === 0) return <EmptyState icon={Bell} title="Nothing here" description="No notifications in this view." />
  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {items.map((n) => {
          const { Icon, className } = iconFor(n.type)
          return (
            <button key={n.id} onClick={() => onOpen(n)} className={cn('flex w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40', !n.read && 'bg-accent/20')}>
              <Icon className={cn('mt-0.5 size-5 shrink-0', className)} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read && <span className="size-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{n.actor} · {formatRelative(n.createdAt)}</p>
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default function Notifications() {
  const navigate = useNavigate()
  const { data, isLoading } = useNotifications()
  const [filter] = useState('')
  void filter

  if (isLoading || !data) return <PageLoader />
  const unread = data.filter((n) => !n.read)
  const open = (n: AppNotification) => n.link && navigate(n.link)

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="All your alerts, approvals and mentions."
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={<Button variant="outline">Mark all as read</Button>}
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({data.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><List items={data} onOpen={open} /></TabsContent>
        <TabsContent value="unread"><List items={unread} onOpen={open} /></TabsContent>
      </Tabs>
    </div>
  )
}
