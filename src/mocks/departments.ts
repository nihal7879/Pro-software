import type { Department, Store } from '@/types'

export const departments: Department[] = [
  { id: 'DEP-0001', code: 'HISTO', name: 'Histopathology', hodName: 'Dr. Ashvini Natu', costCenter: 'CC-101', active: true },
  { id: 'DEP-0002', code: 'OT', name: 'Operation Theatre', hodName: 'Dr. Shanawaz Kazi', costCenter: 'CC-102', active: true },
  { id: 'DEP-0003', code: 'KIT', name: 'Kitchen', hodName: 'Mr. Imran Shaikh', costCenter: 'CC-103', active: true },
  { id: 'DEP-0004', code: 'GEN', name: 'General Stores', hodName: 'Mr. Faizan Ali', costCenter: 'CC-104', active: true },
  { id: 'DEP-0005', code: 'LAB', name: 'Laboratory', hodName: 'Dr. Nida Sheikh', costCenter: 'CC-105', active: true },
  { id: 'DEP-0006', code: 'PHAR', name: 'Pharmacy', hodName: 'Mr. Yusuf Khan', costCenter: 'CC-106', active: true },
  { id: 'DEP-0007', code: 'RADIO', name: 'Radiology', hodName: 'Dr. Anjali Rao', costCenter: 'CC-107', active: false },
  { id: 'DEP-0008', code: 'MAINT', name: 'Maintenance', hodName: 'Mr. Ravi Kumar', costCenter: 'CC-108', active: true },
]

export const stores: Store[] = [
  { id: 'STR-0001', code: 'GEN', name: 'General Store', location: 'Ground Floor, Block A', inchargeName: 'Mr. Faizan Ali', active: true },
  { id: 'STR-0002', code: 'PHAR', name: 'Pharmacy Store', location: '1st Floor, Block B', inchargeName: 'Mr. Yusuf Khan', active: true },
  { id: 'STR-0003', code: 'SURG', name: 'Surgical Store', location: '2nd Floor, OT Wing', inchargeName: 'Sr. Maria Dsouza', active: true },
  { id: 'STR-0004', code: 'KIT', name: 'Kitchen Store', location: 'Basement, Block C', inchargeName: 'Mr. Imran Shaikh', active: true },
  { id: 'STR-0005', code: 'LAB', name: 'Lab Store', location: '1st Floor, Diagnostics', inchargeName: 'Dr. Nida Sheikh', active: true },
]
