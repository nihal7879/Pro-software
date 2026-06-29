import { UserRole, type User } from '@/types'

export const users: User[] = [
  {
    id: 'USR-0001',
    name: 'Kamruddin Patel',
    email: 'kamruddin@saifeehospital.in',
    role: UserRole.Purchase,
    department: 'Purchase Department',
    designation: 'Procurement Officer',
    phone: '+91 98200 11223',
  },
  {
    id: 'USR-0002',
    name: 'Dr. Ashvini Natu',
    email: 'ashvini.natu@saifeehospital.in',
    role: UserRole.HOD,
    department: 'Histopathology',
    designation: 'Head of Department',
    phone: '+91 98200 44556',
  },
  {
    id: 'USR-0003',
    name: 'Dr. Huzaifa Shehabi',
    email: 'ceo@saifeehospital.in',
    role: UserRole.CEO,
    department: 'Executive Office',
    designation: 'Chief Executive Officer',
    phone: '+91 98200 77889',
  },
  {
    id: 'USR-0004',
    name: 'Dr. Shanawaz Kazi',
    email: 'shanawaz.kazi@saifeehospital.in',
    role: UserRole.HOD,
    department: 'Operation Theatre',
    designation: 'Head of Department',
    phone: '+91 98200 22334',
  },
  {
    id: 'USR-0005',
    name: 'Mr. Imran Shaikh',
    email: 'imran.shaikh@saifeehospital.in',
    role: UserRole.HOD,
    department: 'Kitchen',
    designation: 'Head of Department',
    phone: '+91 98200 33445',
  },
  {
    id: 'USR-0006',
    name: 'Mr. Faizan Ali',
    email: 'faizan.ali@saifeehospital.in',
    role: UserRole.HOD,
    department: 'General Stores',
    designation: 'Head of Department',
    phone: '+91 98200 55667',
  },
  {
    id: 'USR-0007',
    name: 'Mr. Yusuf Khan',
    email: 'yusuf.khan@saifeehospital.in',
    role: UserRole.HOD,
    department: 'Pharmacy',
    designation: 'Head of Department',
    phone: '+91 98200 66778',
  },
]

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Purchase]: 'Purchase',
  [UserRole.HOD]: 'HOD',
  [UserRole.CEO]: 'CEO',
}
