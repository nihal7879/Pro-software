import { NotificationType, type AppNotification, type ActivityItem, ApprovalStatus } from '@/types'

export const notifications: AppNotification[] = [
  { id: 'NTF-0001', type: NotificationType.Approval, title: 'MR awaiting your approval', message: 'SH-MR-GEN-1042 from General Stores needs HOD review.', createdAt: '2026-06-27T09:20:00Z', read: false, link: '/approvals/material-requests', actor: 'Mr. Faizan Ali' },
  { id: 'NTF-0002', type: NotificationType.Approval, title: 'PO pending CEO approval', message: 'SH-PO-LAB-2026-0231 (₹64,890) awaiting final sign-off.', createdAt: '2026-06-27T08:05:00Z', read: false, link: '/procurement/purchase-orders', actor: 'Kamruddin Patel' },
  { id: 'NTF-0003', type: NotificationType.Rejection, title: 'New Material rejected', message: 'SH-33-CP-GEN-2026 was not approved by HOD.', createdAt: '2026-06-26T14:40:00Z', read: false, link: '/procurement/new-material', actor: 'Dr. Shanawaz Kazi' },
  { id: 'NTF-0004', type: NotificationType.Info, title: 'RFQ responses received', message: '3 of 3 vendors responded to SH-RFQ-GEN-2026-014.', createdAt: '2026-06-26T11:15:00Z', read: true, link: '/procurement/rfq', actor: 'System' },
  { id: 'NTF-0005', type: NotificationType.Warning, title: 'Rate revision > 8%', message: 'Air Freshener revision is 9.09% — flag for review.', createdAt: '2026-06-25T16:30:00Z', read: true, link: '/procurement/rate-revision', actor: 'System' },
  { id: 'NTF-0006', type: NotificationType.Approval, title: 'Comparison approved', message: 'SH-27-CP-LAB-2026 approved by CEO.', createdAt: '2026-06-21T10:00:00Z', read: true, link: '/procurement/comparison', actor: 'Dr. Huzaifa Shehabi' },
  { id: 'NTF-0007', type: NotificationType.Mention, title: 'You were mentioned', message: 'Kamruddin mentioned you in a remark on MR-0002.', createdAt: '2026-06-20T13:25:00Z', read: true, link: '/procurement/material-requests', actor: 'Kamruddin Patel' },
]

export const activities: ActivityItem[] = [
  { id: 'ACT-0001', actor: 'Dr. Huzaifa Shehabi', action: 'approved', target: 'PO SH-PO-GEN-2026-0198', timestamp: '2026-06-27T09:40:00Z', status: ApprovalStatus.Approved },
  { id: 'ACT-0002', actor: 'Kamruddin Patel', action: 'created', target: 'RFQ SH-RFQ-KIT-2026-021', timestamp: '2026-06-27T08:50:00Z', status: ApprovalStatus.Draft },
  { id: 'ACT-0003', actor: 'Dr. Ashvini Natu', action: 'approved', target: 'MR SH-MR-HISTO-0231', timestamp: '2026-06-26T17:10:00Z', status: ApprovalStatus.HodApproved },
  { id: 'ACT-0004', actor: 'Dr. Shanawaz Kazi', action: 'rejected', target: 'New Material SH-33-CP-GEN-2026', timestamp: '2026-06-26T14:40:00Z', status: ApprovalStatus.Rejected },
  { id: 'ACT-0005', actor: 'Kamruddin Patel', action: 'submitted', target: 'Rate Revision SH-68-RR-GEN-2026', timestamp: '2026-06-25T12:00:00Z', status: ApprovalStatus.Pending },
  { id: 'ACT-0006', actor: 'Mr. Faizan Ali', action: 'created', target: 'MR SH-MR-GEN-1042', timestamp: '2026-06-24T10:30:00Z', status: ApprovalStatus.Pending },
]
