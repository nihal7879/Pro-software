import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useAuditLog } from '@/hooks/useProcurement'
import { formatDate } from '@/lib/format'
import { roleLabels } from '@/mocks/users'
import type { AuditLogEntry } from '@/types'
import type { BadgeTone } from '@/lib/status'

const actionTone: Record<string, BadgeTone> = {
  APPROVE: 'success',
  REJECT: 'danger',
  CREATE: 'info',
  SUBMIT: 'warning',
  LOGIN: 'neutral',
}

export default function AuditLog() {
  const { data, isLoading } = useAuditLog()

  const columns = useMemo<ColumnDef<AuditLogEntry>[]>(
    () => [
      { accessorKey: 'timestamp', header: 'Timestamp', cell: ({ row }) => <span className="font-mono text-xs">{formatDate(row.original.timestamp, 'dd MMM yyyy, HH:mm')}</span> },
      {
        accessorKey: 'actor',
        header: 'Actor',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar name={row.original.actor} size="sm" />
            <div>
              <p className="font-medium">{row.original.actor}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[row.original.role]}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'action', header: 'Action', cell: ({ row }) => <Badge tone={actionTone[row.original.action] ?? 'neutral'}>{row.original.action}</Badge> },
      { accessorKey: 'entity', header: 'Entity' },
      { accessorKey: 'entityRef', header: 'Reference', cell: ({ row }) => <span className="font-mono text-xs">{row.original.entityRef}</span> },
      { accessorKey: 'details', header: 'Details', cell: ({ row }) => <span className="text-muted-foreground">{row.original.details}</span> },
      { accessorKey: 'ip', header: 'IP', cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.ip}</span> },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        title="Audit Log"
        description="Immutable record of all procurement activity."
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Audit Log' }]}
      />
      <DataTable columns={columns} data={data ?? []} isLoading={isLoading} searchPlaceholder="Search audit log…" pageSize={10} />
    </div>
  )
}
