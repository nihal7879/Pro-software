import {
  Archive,
  BarChart3,
  Boxes,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileSpreadsheet,
  FileStack,
  GitCompareArrows,
  LayoutDashboard,
  PackagePlus,
  ReceiptText,
  ScrollText,
  Store,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { UserRole } from '@/types'
import { paths } from './paths'

const ALL: UserRole[] = [UserRole.Purchase, UserRole.HOD, UserRole.CEO]

export interface NavItem {
  label: string
  to: string
  icon?: LucideIcon
  badge?: string
  roles: UserRole[]
}

export interface NavSection {
  title: string
  icon: LucideIcon
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    title: 'Dashboards',
    icon: LayoutDashboard,
    items: [
      { label: 'Purchase', to: paths.dashboardPurchase, roles: [UserRole.Purchase] },
      { label: 'HOD', to: paths.dashboardHod, roles: [UserRole.HOD] },
      { label: 'CEO', to: paths.dashboardCeo, roles: [UserRole.CEO] },
    ],
  },
  {
    title: 'Master Data',
    icon: Boxes,
    items: [
      { label: 'Item Master', to: paths.itemMaster, icon: Archive, roles: [UserRole.Purchase] },
      { label: 'Vendor Directory', to: paths.vendorDirectory, icon: Building2, roles: [UserRole.Purchase, UserRole.CEO] },
      { label: 'Department Master', to: paths.departmentMaster, icon: Users, roles: [UserRole.Purchase] },
      { label: 'Store Master', to: paths.storeMaster, icon: Store, roles: [UserRole.Purchase] },
    ],
  },
  {
    title: 'Procurement',
    icon: ClipboardList,
    items: [
      { label: 'Material Requests', to: paths.materialRequestList, icon: ClipboardList, roles: [UserRole.Purchase, UserRole.HOD] },
      { label: 'RFQ', to: paths.rfqList, icon: FileStack, roles: [UserRole.Purchase] },
      { label: 'Comparison', to: paths.comparisonList, icon: GitCompareArrows, roles: [UserRole.Purchase, UserRole.HOD] },
      { label: 'New Material', to: paths.newMaterialList, icon: PackagePlus, roles: ALL },
      { label: 'Rate Revision', to: paths.rateRevisionList, icon: ReceiptText, roles: ALL },
      { label: 'Purchase Orders', to: paths.poList, icon: FileSpreadsheet, roles: [UserRole.Purchase, UserRole.CEO] },
    ],
  },
  {
    title: 'Approvals',
    icon: ClipboardCheck,
    items: [
      { label: 'Material Requests', to: paths.materialRequestApproval, roles: [UserRole.HOD] },
      { label: 'Comparison', to: paths.comparisonApproval, roles: [UserRole.HOD, UserRole.CEO] },
      { label: 'New Material — HOD', to: paths.hodReview, roles: [UserRole.HOD] },
      { label: 'New Material — CEO', to: paths.ceoApproval, roles: [UserRole.CEO] },
      { label: 'Rate Revision', to: paths.rateRevisionApproval, roles: [UserRole.HOD, UserRole.CEO] },
      { label: 'Purchase Orders', to: paths.poApproval, roles: [UserRole.CEO] },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      { label: 'Spend Analytics', to: paths.spendAnalytics, icon: TrendingUp, roles: [UserRole.Purchase, UserRole.CEO] },
      { label: 'Vendor Performance', to: paths.vendorPerformance, icon: Building2, roles: [UserRole.Purchase, UserRole.CEO] },
      { label: 'Procurement KPI', to: paths.procurementKpi, icon: BarChart3, roles: [UserRole.Purchase, UserRole.CEO] },
      { label: 'Audit Log', to: paths.auditLog, icon: ScrollText, roles: [UserRole.Purchase, UserRole.CEO] },
    ],
  },
]
