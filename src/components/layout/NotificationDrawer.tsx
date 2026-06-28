import { useNavigate } from 'react-router-dom'
import { AlertTriangle, AtSign, Bell, CheckCircle2, Info, XCircle } from 'lucide-react'
import { Drawer } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { useUiStore } from '@/store/ui.store'
import { useNotifications } from '@/hooks/useProcurement'
import { formatRelative } from '@/lib/format'
import { NotificationType, type AppNotification } from '@/types'
import { cn } from '@/lib/utils'

const iconFor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Approval:
      return { Icon: CheckCircle2, className: 'text-success' }
    case NotificationType.Rejection:
      return { Icon: XCircle, className: 'text-destructive' }
    case NotificationType.Warning:
      return { Icon: AlertTriangle, className: 'text-warning' }
    case NotificationType.Mention:
      return { Icon: AtSign, className: 'text-primary' }
    default:
      return { Icon: Info, className: 'text-muted-foreground' }
  }
}

function Row({ n, onClick }: { n: AppNotification; onClick: () => void }) {
  const { Icon, className } = iconFor(n.type)
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-muted/40',
        !n.read && 'bg-accent/30',
      )}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', className)} />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{n.title}</p>
          {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          {n.actor} · {formatRelative(n.createdAt)}
        </p>
      </div>
    </button>
  )
}

export function NotificationDrawer() {
  const navigate = useNavigate()
  const { notificationsOpen, setNotifications } = useUiStore()
  const { data } = useNotifications()
  const unread = data?.filter((n) => !n.read).length ?? 0

  return (
    <Drawer
      open={notificationsOpen}
      onClose={() => setNotifications(false)}
      title="Notifications"
      description={unread > 0 ? `${unread} unread` : 'All caught up'}
    >
      {!data || data.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <>
          <div className="flex justify-end px-5 py-2">
            <Button variant="ghost" size="sm">
              Mark all as read
            </Button>
          </div>
          <div>
            {data.map((n) => (
              <Row
                key={n.id}
                n={n}
                onClick={() => {
                  if (n.link) navigate(n.link)
                  setNotifications(false)
                }}
              />
            ))}
          </div>
        </>
      )}
    </Drawer>
  )
}
