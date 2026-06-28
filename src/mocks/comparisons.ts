import { ApprovalStatus, UserRole, type Comparison } from '@/types'

export const comparisons: Comparison[] = [
  {
    id: 'CMP-0001',
    compNo: 'SH-26-CP-GEN-2026',
    date: '2026-05-08',
    storeName: 'General Store',
    vendors: ['AIM Safety India', 'B. M Enterprises', 'Taheri Enterprises'],
    recommendedVendor: 'AIM Safety India',
    status: ApprovalStatus.Pending,
    remark: 'Lowest quote from AIM Safety, proven quality.',
    rows: [
      {
        itemName: 'Safety Helmet Yellow - Karam Make',
        unit: 'pcs',
        quantity: 50,
        rates: { 'AIM Safety India': 225, 'B. M Enterprises': 240, 'Taheri Enterprises': 235 },
        recommendedVendor: 'AIM Safety India',
      },
    ],
    approvals: [{ role: UserRole.HOD, approverName: 'Mr. Faizan Ali', status: ApprovalStatus.Pending }],
  },
  {
    id: 'CMP-0002',
    compNo: 'SH-27-CP-LAB-2026',
    date: '2026-06-19',
    storeName: 'Lab Store',
    vendors: ['OSB Agencies Pvt Ltd', 'Cell Marque Distributors'],
    recommendedVendor: 'OSB Agencies Pvt Ltd',
    status: ApprovalStatus.Approved,
    remark: 'OSB lower and faster lead time.',
    rows: [
      {
        itemName: 'CD68 KP 1-1ML Cat No 168M-97 Cell Marque',
        unit: 'vial',
        quantity: 2,
        rates: { 'OSB Agencies Pvt Ltd': 19800, 'Cell Marque Distributors': 20100 },
        recommendedVendor: 'OSB Agencies Pvt Ltd',
      },
      {
        itemName: 'GFAP EP672Y 1ML Cat No 258R-17 Cell Marque',
        unit: 'vial',
        quantity: 1,
        rates: { 'OSB Agencies Pvt Ltd': 23040, 'Cell Marque Distributors': 23500 },
        recommendedVendor: 'OSB Agencies Pvt Ltd',
      },
    ],
    approvals: [
      { role: UserRole.HOD, approverName: 'Dr. Ashvini Natu', status: ApprovalStatus.Approved, remark: 'Agreed', actedOn: '2026-06-20' },
      { role: UserRole.CEO, approverName: 'Dr. Huzaifa Shehabi', status: ApprovalStatus.Approved, remark: 'Approved', actedOn: '2026-06-21' },
    ],
  },
]
