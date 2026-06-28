import { UserRole, type AuditLogEntry } from '@/types'

export const auditLog: AuditLogEntry[] = [
  { id: 'AUD-0001', timestamp: '2026-06-27T09:40:12Z', actor: 'Dr. Huzaifa Shehabi', role: UserRole.CEO, action: 'APPROVE', entity: 'PurchaseOrder', entityRef: 'SH-PO-GEN-2026-0198', details: 'Approved PO worth ₹13,275', ip: '10.0.4.21' },
  { id: 'AUD-0002', timestamp: '2026-06-27T08:51:03Z', actor: 'Kamruddin Patel', role: UserRole.Purchase, action: 'CREATE', entity: 'RFQ', entityRef: 'SH-RFQ-KIT-2026-021', details: 'Created RFQ with 1 vendor', ip: '10.0.2.11' },
  { id: 'AUD-0003', timestamp: '2026-06-26T17:10:44Z', actor: 'Dr. Ashvini Natu', role: UserRole.HOD, action: 'APPROVE', entity: 'MaterialRequest', entityRef: 'SH-MR-HISTO-0231', details: 'HOD approval granted', ip: '10.0.3.07' },
  { id: 'AUD-0004', timestamp: '2026-06-26T14:40:18Z', actor: 'Dr. Shanawaz Kazi', role: UserRole.HOD, action: 'REJECT', entity: 'NewMaterial', entityRef: 'SH-33-CP-GEN-2026', details: 'Rejected: Not Approved', ip: '10.0.3.09' },
  { id: 'AUD-0005', timestamp: '2026-06-25T12:00:55Z', actor: 'Kamruddin Patel', role: UserRole.Purchase, action: 'SUBMIT', entity: 'RateRevision', entityRef: 'SH-68-RR-GEN-2026', details: 'Submitted for approval (9.09% increase)', ip: '10.0.2.11' },
  { id: 'AUD-0006', timestamp: '2026-06-24T10:30:31Z', actor: 'Mr. Faizan Ali', role: UserRole.Purchase, action: 'CREATE', entity: 'MaterialRequest', entityRef: 'SH-MR-GEN-1042', details: 'Created MR with 2 lines', ip: '10.0.2.18' },
  { id: 'AUD-0007', timestamp: '2026-06-23T16:22:09Z', actor: 'Kamruddin Patel', role: UserRole.Purchase, action: 'LOGIN', entity: 'Session', entityRef: '-', details: 'User signed in', ip: '10.0.2.11' },
  { id: 'AUD-0008', timestamp: '2026-06-21T10:01:40Z', actor: 'Dr. Huzaifa Shehabi', role: UserRole.CEO, action: 'APPROVE', entity: 'Comparison', entityRef: 'SH-27-CP-LAB-2026', details: 'Final approval', ip: '10.0.4.21' },
]
