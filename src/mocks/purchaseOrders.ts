import {
  ApprovalStatus,
  DocumentStatus,
  UserRole,
  type PurchaseOrder,
  type PurchaseOrderLine,
} from '@/types'

function withAmount(line: Omit<PurchaseOrderLine, 'amount'>): PurchaseOrderLine {
  return { ...line, amount: line.quantity * line.rate * (1 + line.gstPercent / 100) }
}

function totals(lines: PurchaseOrderLine[]) {
  const subTotal = lines.reduce((s, l) => s + l.quantity * l.rate, 0)
  const taxTotal = lines.reduce((s, l) => s + l.quantity * l.rate * (l.gstPercent / 100), 0)
  return { subTotal, taxTotal, grandTotal: subTotal + taxTotal }
}

const po1Lines = [
  withAmount({ itemCode: 'LABCD68M97', itemName: 'CD68 KP 1-1ML Cell Marque', unit: 'vial', quantity: 2, rate: 19800, gstPercent: 5 }),
  withAmount({ itemCode: 'LABGFAP258', itemName: 'GFAP EP672Y 1ML Cell Marque', unit: 'vial', quantity: 1, rate: 23040, gstPercent: 5 }),
]
const po2Lines = [
  withAmount({ itemCode: 'GENSHLM01', itemName: 'Safety Helmet Yellow - Karam', unit: 'pcs', quantity: 50, rate: 225, gstPercent: 18 }),
]
const po3Lines = [
  withAmount({ itemCode: 'KITCCPG012', itemName: 'Ghee Pure Amul Pouch 1 LTR', unit: 'pouch', quantity: 40, rate: 572.95, gstPercent: 5 }),
  withAmount({ itemCode: 'KITRICE25', itemName: 'Basmati Rice 25kg Bag', unit: 'bag', quantity: 20, rate: 2150, gstPercent: 5 }),
]

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-0001',
    poNo: 'SH-PO-LAB-2026-0231',
    date: '2026-06-22',
    vendorId: 'VEN-0002',
    vendorName: 'OSB Agencies Pvt Ltd',
    store: 'Lab Store',
    department: 'Histopathology',
    status: ApprovalStatus.Pending,
    deliveryStatus: DocumentStatus.Open,
    expectedDelivery: '2026-06-29',
    lines: po1Lines,
    ...totals(po1Lines),
    terms: 'Payment Net 45. Delivery within 7 working days. Cold chain maintained.',
    approvals: [{ role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Pending }],
  },
  {
    id: 'PO-0002',
    poNo: 'SH-PO-GEN-2026-0198',
    date: '2026-06-15',
    vendorId: 'VEN-0005',
    vendorName: 'AIM Safety India',
    store: 'General Store',
    department: 'General Stores',
    status: ApprovalStatus.Approved,
    deliveryStatus: DocumentStatus.InProgress,
    expectedDelivery: '2026-06-25',
    lines: po2Lines,
    ...totals(po2Lines),
    terms: 'Payment Net 30. Delivery FOB warehouse.',
    approvals: [{ role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Approved, remark: 'Approved', actedOn: '2026-06-16' }],
  },
  {
    id: 'PO-0003',
    poNo: 'SH-PO-KIT-2026-0176',
    date: '2026-06-10',
    vendorId: 'VEN-0004',
    vendorName: 'Manoj Enterprises',
    store: 'Kitchen Store',
    department: 'Kitchen',
    status: ApprovalStatus.Approved,
    deliveryStatus: DocumentStatus.Completed,
    expectedDelivery: '2026-06-12',
    lines: po3Lines,
    ...totals(po3Lines),
    terms: 'Payment Net 15. Daily fresh delivery.',
    approvals: [{ role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Approved, remark: 'Approved', actedOn: '2026-06-11' }],
  },
  {
    id: 'PO-0004',
    poNo: 'SH-PO-GEN-2026-0205',
    date: '2026-06-24',
    vendorId: 'VEN-0007',
    vendorName: 'Taheri Enterprises',
    store: 'General Store',
    department: 'Maintenance',
    status: ApprovalStatus.Draft,
    deliveryStatus: DocumentStatus.OnHold,
    expectedDelivery: '2026-07-01',
    lines: po2Lines,
    ...totals(po2Lines),
    terms: 'Draft purchase order.',
    approvals: [],
  },
]
