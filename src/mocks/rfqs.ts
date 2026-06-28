import { DocumentStatus, type Rfq } from '@/types'

export const rfqs: Rfq[] = [
  {
    id: 'RFQ-0001',
    rfqNo: 'SH-RFQ-GEN-2026-014',
    date: '2026-06-21',
    store: 'General Store',
    status: DocumentStatus.InProgress,
    dueDate: '2026-06-28',
    vendorIds: ['VEN-0005', 'VEN-0006', 'VEN-0007'],
    createdBy: 'Kamruddin Patel',
    lines: [
      {
        itemCode: 'GENSHLM01',
        itemName: 'Safety Helmet Yellow - Karam Make',
        unit: 'pcs',
        quantity: 50,
        quotes: [
          { vendorId: 'VEN-0005', vendorName: 'AIM Safety India', rate: 225, responded: true },
          { vendorId: 'VEN-0006', vendorName: 'B. M Enterprises', rate: 240, responded: true },
          { vendorId: 'VEN-0007', vendorName: 'Taheri Enterprises', rate: 235, responded: true },
        ],
      },
    ],
  },
  {
    id: 'RFQ-0002',
    rfqNo: 'SH-RFQ-LAB-2026-008',
    date: '2026-06-19',
    store: 'Lab Store',
    status: DocumentStatus.Completed,
    dueDate: '2026-06-25',
    vendorIds: ['VEN-0002', 'VEN-0008'],
    createdBy: 'Kamruddin Patel',
    lines: [
      {
        itemCode: 'LABCD68M97',
        itemName: 'CD68 KP 1-1ML Cat No 168M-97 Cell Marque',
        unit: 'vial',
        quantity: 2,
        quotes: [
          { vendorId: 'VEN-0002', vendorName: 'OSB Agencies Pvt Ltd', rate: 19800, responded: true },
          { vendorId: 'VEN-0008', vendorName: 'Cell Marque Distributors', rate: 20100, responded: true },
        ],
      },
    ],
  },
  {
    id: 'RFQ-0003',
    rfqNo: 'SH-RFQ-KIT-2026-021',
    date: '2026-06-23',
    store: 'Kitchen Store',
    status: DocumentStatus.Open,
    dueDate: '2026-06-30',
    vendorIds: ['VEN-0004'],
    createdBy: 'Kamruddin Patel',
    lines: [
      {
        itemCode: 'KITCCPG012',
        itemName: 'Ghee Pure Amul Pouch 1 LTR',
        unit: 'pouch',
        quantity: 40,
        quotes: [{ vendorId: 'VEN-0004', vendorName: 'Manoj Enterprises', rate: 590.86, responded: false }],
      },
    ],
  },
]
