import { UserRole, type DashboardData } from '@/types'

const monthlySpend = [
  { month: 'Jan', purchase: 3820000, budget: 4000000 },
  { month: 'Feb', purchase: 4120000, budget: 4000000 },
  { month: 'Mar', purchase: 3650000, budget: 4200000 },
  { month: 'Apr', purchase: 4480000, budget: 4200000 },
  { month: 'May', purchase: 4210000, budget: 4400000 },
  { month: 'Jun', purchase: 3980000, budget: 4400000 },
]

const categorySpend = [
  { category: 'Pharmacy', value: 8120000 },
  { category: 'Laboratory', value: 6240000 },
  { category: 'Surgical', value: 4380000 },
  { category: 'Kitchen', value: 3120000 },
  { category: 'General Store', value: 2480000 },
  { category: 'Maintenance', value: 1340000 },
]

const purchaseTrend = [
  { date: 'Wk 1', orders: 42, value: 980000 },
  { date: 'Wk 2', orders: 38, value: 870000 },
  { date: 'Wk 3', orders: 51, value: 1240000 },
  { date: 'Wk 4', orders: 47, value: 1110000 },
]

const vendorPerformance = [
  { vendor: 'A-1 Enterprise', onTime: 94, quality: 92, spend: 4820000 },
  { vendor: 'OSB Agencies', onTime: 88, quality: 90, spend: 6210000 },
  { vendor: 'Manoj Ent.', onTime: 91, quality: 88, spend: 5380000 },
  { vendor: 'AIM Safety', onTime: 96, quality: 95, spend: 1980000 },
  { vendor: 'Cell Marque', onTime: 90, quality: 93, spend: 8120000 },
]

const base: DashboardData = {
  kpis: [
    { id: 'spend', label: 'Total Spend (YTD)', value: 25700000, format: 'currency', trend: { value: 25700000, delta: 8.4, direction: 'up' }, icon: 'IndianRupee' },
    { id: 'pos', label: 'Purchase Orders', value: 1284, format: 'number', trend: { value: 1284, delta: 4.2, direction: 'up' }, icon: 'FileText' },
    { id: 'pending', label: 'Pending Approvals', value: 18, format: 'number', trend: { value: 18, delta: -12.5, direction: 'down' }, icon: 'Clock' },
    { id: 'vendors', label: 'Active Vendors', value: 86, format: 'number', trend: { value: 86, delta: 2.1, direction: 'up' }, icon: 'Building2' },
  ],
  monthlySpend,
  categorySpend,
  approvalStatus: [
    { status: 'Approved', count: 142 },
    { status: 'Pending', count: 18 },
    { status: 'HOD Approved', count: 11 },
    { status: 'Rejected', count: 7 },
    { status: 'Draft', count: 9 },
  ],
  vendorPerformance,
  purchaseTrend,
}

const hod: DashboardData = {
  ...base,
  kpis: [
    { id: 'review', label: 'Awaiting My Review', value: 6, format: 'number', trend: { value: 6, delta: 1, direction: 'up' }, icon: 'ClipboardCheck' },
    { id: 'deptspend', label: 'Dept Spend (MTD)', value: 1840000, format: 'currency', trend: { value: 1840000, delta: 3.6, direction: 'up' }, icon: 'IndianRupee' },
    { id: 'approved', label: 'Approved This Month', value: 24, format: 'number', trend: { value: 24, delta: 6.0, direction: 'up' }, icon: 'CheckCircle2' },
    { id: 'avgtime', label: 'Avg Approval Time', value: 7, format: 'number', trend: { value: 7, delta: -8.0, direction: 'down' }, icon: 'Timer' },
  ],
}

const ceo: DashboardData = {
  ...base,
  kpis: [
    { id: 'finalspend', label: 'Org Spend (YTD)', value: 25700000, format: 'currency', trend: { value: 25700000, delta: 8.4, direction: 'up' }, icon: 'IndianRupee' },
    { id: 'finalapprovals', label: 'Awaiting CEO Sign-off', value: 9, format: 'number', trend: { value: 9, delta: -3, direction: 'down' }, icon: 'Stamp' },
    { id: 'savings', label: 'Negotiated Savings', value: 2140000, format: 'currency', trend: { value: 2140000, delta: 14.2, direction: 'up' }, icon: 'TrendingDown' },
    { id: 'compliance', label: 'Process Compliance', value: 97, format: 'percent', trend: { value: 97, delta: 1.5, direction: 'up' }, icon: 'ShieldCheck' },
  ],
}

export const dashboardByRole: Record<UserRole, DashboardData> = {
  [UserRole.Purchase]: base,
  [UserRole.HOD]: hod,
  [UserRole.CEO]: ceo,
}
