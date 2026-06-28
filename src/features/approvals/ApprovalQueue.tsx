import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import type { Crumb } from '@/components/layout/Breadcrumbs'
import { DataTable } from '@/components/tables/DataTable'
import { RowActions } from '@/components/tables/RowActions'
import { Modal } from '@/components/ui/modal'
import { ApprovalStatusBadge } from '@/components/common/StatusBadge'
import { ApprovalActions } from '@/components/common/ApprovalActions'
import { ApprovalTimeline } from '@/components/common/Timeline'
import { ApprovalStatus, type ApprovalStep } from '@/types'

export interface ApprovalRecord {
  id: string
  reference: string
  primary: string
  secondary: string
  amount?: string
  status: ApprovalStatus
  approvals: ApprovalStep[]
  detail: React.ReactNode
}

interface ApprovalQueueProps {
  title: string
  description: string
  breadcrumbs: Crumb[]
  records: ApprovalRecord[]
  isLoading?: boolean
  referenceLabel?: string
  primaryLabel?: string
}

export function ApprovalQueue({
  title,
  description,
  breadcrumbs,
  records,
  isLoading,
  referenceLabel = 'Reference',
  primaryLabel = 'Subject',
}: ApprovalQueueProps) {
  const [selected, setSelected] = useState<ApprovalRecord | null>(null)

  const pending = records.filter(
    (r) => r.status === ApprovalStatus.Pending || r.status === ApprovalStatus.HodApproved,
  ).length

  const columns = useMemo<ColumnDef<ApprovalRecord>[]>(
    () => [
      { accessorKey: 'reference', header: referenceLabel, cell: ({ row }) => <span className="font-medium">{row.original.reference}</span> },
      { accessorKey: 'primary', header: primaryLabel },
      { accessorKey: 'secondary', header: 'Details', cell: ({ row }) => <span className="text-muted-foreground">{row.original.secondary}</span> },
      {
        accessorKey: 'amount',
        header: 'Value',
        cell: ({ row }) => row.original.amount ?? '—',
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <ApprovalStatusBadge status={row.original.status} /> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions actions={[{ label: 'Review', icon: <Eye />, onClick: () => setSelected(row.original) }]} />
        ),
      },
    ],
    [referenceLabel, primaryLabel],
  )

  const isOpen = selected?.status === ApprovalStatus.Pending || selected?.status === ApprovalStatus.HodApproved

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={
          <span className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
            {pending} awaiting action
          </span>
        }
      />
      <DataTable columns={columns} data={records} isLoading={isLoading} searchPlaceholder="Search queue…" />

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.reference}
        description={selected ? `${selected.primary} · ${selected.secondary}` : ''}
        size="lg"
        footer={
          isOpen && selected ? (
            <ApprovalActions reference={selected.reference} onApprove={() => setSelected(null)} onReject={() => setSelected(null)} />
          ) : undefined
        }
      >
        {selected && (
          <div className="space-y-5">
            {selected.detail}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Approval Trail</h4>
              <ApprovalTimeline steps={selected.approvals} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
