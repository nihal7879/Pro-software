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
import { paths } from './paths'

export interface NavItem {
  label: string
  to: string
  icon?: LucideIcon
  badge?: string
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
      { label: 'Purchase', to: paths.dashboardPurchase },
      { label: 'HOD', to: paths.dashboardHod },
      { label: 'CEO', to: paths.dashboardCeo },
    ],
  },
  {
    title: 'Master Data',
    icon: Boxes,
    items: [
      { label: 'Item Master', to: paths.itemMaster, icon: Archive },
      { label: 'Vendor Directory', to: paths.vendorDirectory, icon: Building2 },
      { label: 'Department Master', to: paths.departmentMaster, icon: Users },
      { label: 'Store Master', to: paths.storeMaster, icon: Store },
    ],
  },
  {
    title: 'Procurement',
    icon: ClipboardList,
    items: [
      { label: 'Material Requests', to: paths.materialRequestList, icon: ClipboardList },
      { label: 'RFQ', to: paths.rfqList, icon: FileStack },
      { label: 'Comparison', to: paths.comparisonList, icon: GitCompareArrows },
      { label: 'New Material', to: paths.newMaterialList, icon: PackagePlus },
      { label: 'Rate Revision', to: paths.rateRevisionList, icon: ReceiptText },
      { label: 'Purchase Orders', to: paths.poList, icon: FileSpreadsheet },
    ],
  },
  {
    title: 'Approvals',
    icon: ClipboardCheck,
    items: [
      { label: 'Material Requests', to: paths.materialRequestApproval },
      { label: 'Comparison', to: paths.comparisonApproval },
      { label: 'New Material — HOD', to: paths.hodReview },
      { label: 'New Material — CEO', to: paths.ceoApproval },
      { label: 'Rate Revision', to: paths.rateRevisionApproval },
      { label: 'Purchase Orders', to: paths.poApproval },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      { label: 'Spend Analytics', to: paths.spendAnalytics, icon: TrendingUp },
      { label: 'Vendor Performance', to: paths.vendorPerformance, icon: Building2 },
      { label: 'Procurement KPI', to: paths.procurementKpi, icon: BarChart3 },
      { label: 'Audit Log', to: paths.auditLog, icon: ScrollText },
    ],
  },
]
