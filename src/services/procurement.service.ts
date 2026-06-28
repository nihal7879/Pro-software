/**
 * Mock service layer. Mimics async REST calls so the UI is wired exactly as it
 * would be against a real backend. Swap these bodies for `api.get(...)` calls
 * (see src/lib/axios.ts) when the backend is ready.
 */
import { delay } from '@/lib/utils'
import { vendors } from '@/mocks/vendors'
import { items } from '@/mocks/items'
import { departments, stores } from '@/mocks/departments'
import { materialRequests } from '@/mocks/materialRequests'
import { rfqs } from '@/mocks/rfqs'
import { comparisons } from '@/mocks/comparisons'
import { newMaterials } from '@/mocks/newMaterials'
import { rateRevisions } from '@/mocks/rateRevisions'
import { purchaseOrders } from '@/mocks/purchaseOrders'
import { notifications, activities } from '@/mocks/notifications'
import { auditLog } from '@/mocks/auditLog'
import { dashboardByRole } from '@/mocks/analytics'
import { users } from '@/mocks/users'
import type {
  AppNotification,
  AuditLogEntry,
  Comparison,
  DashboardData,
  Department,
  Item,
  MaterialRequest,
  NewMaterialRequest,
  PurchaseOrder,
  RateRevision,
  Rfq,
  Store,
  UserRole,
  Vendor,
} from '@/types'

async function ok<T>(data: T, ms = 350): Promise<T> {
  await delay(ms)
  return data
}

function byId<T extends { id: string }>(list: T[], id: string): T | undefined {
  return list.find((entry) => entry.id === id)
}

export const procurementService = {
  getVendors: () => ok<Vendor[]>(vendors),
  getVendor: (id: string) => ok<Vendor | undefined>(byId(vendors, id)),

  getItems: () => ok<Item[]>(items),
  getItem: (id: string) => ok<Item | undefined>(byId(items, id)),

  getDepartments: () => ok<Department[]>(departments),
  getStores: () => ok<Store[]>(stores),

  getMaterialRequests: () => ok<MaterialRequest[]>(materialRequests),
  getMaterialRequest: (id: string) => ok<MaterialRequest | undefined>(byId(materialRequests, id)),

  getRfqs: () => ok<Rfq[]>(rfqs),
  getRfq: (id: string) => ok<Rfq | undefined>(byId(rfqs, id)),

  getComparisons: () => ok<Comparison[]>(comparisons),
  getComparison: (id: string) => ok<Comparison | undefined>(byId(comparisons, id)),

  getNewMaterials: () => ok<NewMaterialRequest[]>(newMaterials),
  getNewMaterial: (id: string) => ok<NewMaterialRequest | undefined>(byId(newMaterials, id)),

  getRateRevisions: () => ok<RateRevision[]>(rateRevisions),
  getRateRevision: (id: string) => ok<RateRevision | undefined>(byId(rateRevisions, id)),

  getPurchaseOrders: () => ok<PurchaseOrder[]>(purchaseOrders),
  getPurchaseOrder: (id: string) => ok<PurchaseOrder | undefined>(byId(purchaseOrders, id)),

  getNotifications: () => ok<AppNotification[]>(notifications),
  getActivities: () => ok(activities),
  getAuditLog: () => ok<AuditLogEntry[]>(auditLog),
  getUsers: () => ok(users),

  getDashboard: (role: UserRole) => ok<DashboardData>(dashboardByRole[role]),
}
