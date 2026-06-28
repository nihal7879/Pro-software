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
]

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Purchase]: 'Purchase',
  [UserRole.HOD]: 'HOD',
  [UserRole.CEO]: 'CEO',
}
