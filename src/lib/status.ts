import {
  ApprovalStatus,
  DocumentStatus,
  PriorityLevel,
  VendorStatus,
} from '@/types'

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary'

interface StatusMeta {
  label: string
  tone: BadgeTone
}

export const approvalStatusMeta: Record<ApprovalStatus, StatusMeta> = {
  [ApprovalStatus.Draft]: { label: 'Draft', tone: 'neutral' },
  [ApprovalStatus.Pending]: { label: 'Pending', tone: 'warning' },
  [ApprovalStatus.HodApproved]: { label: 'HOD Approved', tone: 'info' },
  [ApprovalStatus.CeoApproved]: { label: 'CEO Approved', tone: 'primary' },
  [ApprovalStatus.Approved]: { label: 'Approved', tone: 'success' },
  [ApprovalStatus.Rejected]: { label: 'Rejected', tone: 'danger' },
}

export const documentStatusMeta: Record<DocumentStatus, StatusMeta> = {
  [DocumentStatus.Open]: { label: 'Open', tone: 'info' },
  [DocumentStatus.InProgress]: { label: 'In Progress', tone: 'warning' },
  [DocumentStatus.Completed]: { label: 'Completed', tone: 'success' },
  [DocumentStatus.Cancelled]: { label: 'Cancelled', tone: 'danger' },
  [DocumentStatus.OnHold]: { label: 'On Hold', tone: 'neutral' },
}

export const vendorStatusMeta: Record<VendorStatus, StatusMeta> = {
  [VendorStatus.Active]: { label: 'Active', tone: 'success' },
  [VendorStatus.Inactive]: { label: 'Inactive', tone: 'neutral' },
  [VendorStatus.Blacklisted]: { label: 'Blacklisted', tone: 'danger' },
  [VendorStatus.Pending]: { label: 'Pending', tone: 'warning' },
}

export const priorityMeta: Record<PriorityLevel, StatusMeta> = {
  [PriorityLevel.Low]: { label: 'Low', tone: 'neutral' },
  [PriorityLevel.Medium]: { label: 'Medium', tone: 'info' },
  [PriorityLevel.High]: { label: 'High', tone: 'warning' },
  [PriorityLevel.Urgent]: { label: 'Urgent', tone: 'danger' },
}
