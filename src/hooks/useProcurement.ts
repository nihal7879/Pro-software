import { useQuery } from '@tanstack/react-query'
import { procurementService } from '@/services/procurement.service'
import { useDepartmentScope } from '@/lib/scope'
import { useMaterialRequestStore } from '@/store/materialRequest.store'
import {
  useDepartmentStore,
  useItemStore,
  useStoreStore,
  useVendorStore,
} from '@/store/masters.store'
import { useRfqStore } from '@/store/rfq.store'
import { useComparisonStore } from '@/store/comparison.store'
import { usePoStore } from '@/store/po.store'
import { queryKeys } from './queryKeys'
import type { UserRole } from '@/types'

// Master data is served from live client stores so view/edit/delete persist.
export const useVendors = () => {
  const items = useVendorStore((s) => s.items)
  return { data: items, isLoading: false }
}
export const useVendor = (id: string) => {
  const items = useVendorStore((s) => s.items)
  return { data: items.find((v) => v.id === id), isLoading: false }
}

export const useItems = () => {
  const items = useItemStore((s) => s.items)
  return { data: items, isLoading: false }
}
export const useItem = (id: string) => {
  const items = useItemStore((s) => s.items)
  return { data: items.find((i) => i.id === id), isLoading: false }
}

export const useDepartments = () => {
  const items = useDepartmentStore((s) => s.items)
  return { data: items, isLoading: false }
}
export const useStores = () => {
  const items = useStoreStore((s) => s.items)
  return { data: items, isLoading: false }
}

// Material Requests are served from a live client store so the demo flow
// (create → HOD approve) actually mutates and persists.
export const useMaterialRequests = () => {
  const scope = useDepartmentScope()
  const requests = useMaterialRequestStore((s) => s.requests)
  return { data: scope(requests, (r) => r.department), isLoading: false }
}
export const useMaterialRequest = (id: string) => {
  const requests = useMaterialRequestStore((s) => s.requests)
  return { data: requests.find((r) => r.id === id), isLoading: false }
}

export const useRfqs = () => {
  const items = useRfqStore((s) => s.items)
  return { data: items, isLoading: false }
}
export const useRfq = (id: string) => {
  const items = useRfqStore((s) => s.items)
  return { data: items.find((r) => r.id === id), isLoading: false }
}

export const useComparisons = () => {
  const items = useComparisonStore((s) => s.items)
  return { data: items, isLoading: false }
}
export const useComparison = (id: string) => {
  const items = useComparisonStore((s) => s.items)
  return { data: items.find((c) => c.id === id), isLoading: false }
}

export const useNewMaterials = () => {
  const scope = useDepartmentScope()
  return useQuery({
    queryKey: queryKeys.newMaterials,
    queryFn: procurementService.getNewMaterials,
    select: (rows) => scope(rows, (r) => r.department),
  })
}
export const useNewMaterial = (id: string) =>
  useQuery({ queryKey: queryKeys.newMaterial(id), queryFn: () => procurementService.getNewMaterial(id) })

export const useRateRevisions = () => {
  const scope = useDepartmentScope()
  return useQuery({
    queryKey: queryKeys.rateRevisions,
    queryFn: procurementService.getRateRevisions,
    select: (rows) => scope(rows, (r) => r.userDepartment),
  })
}
export const useRateRevision = (id: string) =>
  useQuery({ queryKey: queryKeys.rateRevision(id), queryFn: () => procurementService.getRateRevision(id) })

export const usePurchaseOrders = () => {
  const scope = useDepartmentScope()
  const items = usePoStore((s) => s.items)
  return { data: scope(items, (r) => r.department), isLoading: false }
}
export const usePurchaseOrder = (id: string) => {
  const items = usePoStore((s) => s.items)
  return { data: items.find((p) => p.id === id), isLoading: false }
}

export const useNotifications = () =>
  useQuery({ queryKey: queryKeys.notifications, queryFn: procurementService.getNotifications })
export const useActivities = () =>
  useQuery({ queryKey: queryKeys.activities, queryFn: procurementService.getActivities })
export const useAuditLog = () =>
  useQuery({ queryKey: queryKeys.auditLog, queryFn: procurementService.getAuditLog })

export const useDashboard = (role: UserRole) =>
  useQuery({ queryKey: queryKeys.dashboard(role), queryFn: () => procurementService.getDashboard(role) })
