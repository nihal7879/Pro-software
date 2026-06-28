import { Badge } from '@/components/ui/badge'
import {
  approvalStatusMeta,
  documentStatusMeta,
  priorityMeta,
  vendorStatusMeta,
} from '@/lib/status'
import {
  ApprovalStatus,
  DocumentStatus,
  PriorityLevel,
  VendorStatus,
} from '@/types'

export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const meta = approvalStatusMeta[status]
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  )
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const meta = documentStatusMeta[status]
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  )
}

export function VendorStatusBadge({ status }: { status: VendorStatus }) {
  const meta = vendorStatusMeta[status]
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  const meta = priorityMeta[priority]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}
