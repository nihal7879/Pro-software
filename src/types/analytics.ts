/** Analytics & dashboard data shapes. */
import type { TrendValue } from './common'

export interface KpiMetric {
  id: string
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  trend: TrendValue
  icon: string
}

export interface MonthlySpendPoint {
  month: string
  purchase: number
  budget: number
}

export interface CategorySpendPoint {
  category: string
  value: number
}

export interface ApprovalStatusPoint {
  status: string
  count: number
}

export interface VendorPerformancePoint {
  vendor: string
  onTime: number
  quality: number
  spend: number
}

export interface PurchaseTrendPoint {
  date: string
  orders: number
  value: number
}

export interface DashboardData {
  kpis: KpiMetric[]
  monthlySpend: MonthlySpendPoint[]
  categorySpend: CategorySpendPoint[]
  approvalStatus: ApprovalStatusPoint[]
  vendorPerformance: VendorPerformancePoint[]
  purchaseTrend: PurchaseTrendPoint[]
}
