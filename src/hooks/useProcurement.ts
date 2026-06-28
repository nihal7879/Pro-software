import { useQuery } from '@tanstack/react-query'
import { procurementService } from '@/services/procurement.service'
import { queryKeys } from './queryKeys'
import type { UserRole } from '@/types'

export const useVendors = () =>
  useQuery({ queryKey: queryKeys.vendors, queryFn: procurementService.getVendors })
export const useVendor = (id: string) =>
  useQuery({ queryKey: queryKeys.vendor(id), queryFn: () => procurementService.getVendor(id) })

export const useItems = () =>
  useQuery({ queryKey: queryKeys.items, queryFn: procurementService.getItems })
export const useItem = (id: string) =>
  useQuery({ queryKey: queryKeys.item(id), queryFn: () => procurementService.getItem(id) })

export const useDepartments = () =>
  useQuery({ queryKey: queryKeys.departments, queryFn: procurementService.getDepartments })
export const useStores = () =>
  useQuery({ queryKey: queryKeys.stores, queryFn: procurementService.getStores })

export const useMaterialRequests = () =>
  useQuery({ queryKey: queryKeys.materialRequests, queryFn: procurementService.getMaterialRequests })
export const useMaterialRequest = (id: string) =>
  useQuery({ queryKey: queryKeys.materialRequest(id), queryFn: () => procurementService.getMaterialRequest(id) })

export const useRfqs = () =>
  useQuery({ queryKey: queryKeys.rfqs, queryFn: procurementService.getRfqs })
export const useRfq = (id: string) =>
  useQuery({ queryKey: queryKeys.rfq(id), queryFn: () => procurementService.getRfq(id) })

export const useComparisons = () =>
  useQuery({ queryKey: queryKeys.comparisons, queryFn: procurementService.getComparisons })
export const useComparison = (id: string) =>
  useQuery({ queryKey: queryKeys.comparison(id), queryFn: () => procurementService.getComparison(id) })

export const useNewMaterials = () =>
  useQuery({ queryKey: queryKeys.newMaterials, queryFn: procurementService.getNewMaterials })
export const useNewMaterial = (id: string) =>
  useQuery({ queryKey: queryKeys.newMaterial(id), queryFn: () => procurementService.getNewMaterial(id) })

export const useRateRevisions = () =>
  useQuery({ queryKey: queryKeys.rateRevisions, queryFn: procurementService.getRateRevisions })
export const useRateRevision = (id: string) =>
  useQuery({ queryKey: queryKeys.rateRevision(id), queryFn: () => procurementService.getRateRevision(id) })

export const usePurchaseOrders = () =>
  useQuery({ queryKey: queryKeys.purchaseOrders, queryFn: procurementService.getPurchaseOrders })
export const usePurchaseOrder = (id: string) =>
  useQuery({ queryKey: queryKeys.purchaseOrder(id), queryFn: () => procurementService.getPurchaseOrder(id) })

export const useNotifications = () =>
  useQuery({ queryKey: queryKeys.notifications, queryFn: procurementService.getNotifications })
export const useActivities = () =>
  useQuery({ queryKey: queryKeys.activities, queryFn: procurementService.getActivities })
export const useAuditLog = () =>
  useQuery({ queryKey: queryKeys.auditLog, queryFn: procurementService.getAuditLog })

export const useDashboard = (role: UserRole) =>
  useQuery({ queryKey: queryKeys.dashboard(role), queryFn: () => procurementService.getDashboard(role) })
