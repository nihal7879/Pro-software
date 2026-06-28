/** Core procurement domain models. Fully typed API contracts. */
import type { ID, ISODateString } from './common'
import type {
  ApprovalStatus,
  ChargeableFlag,
  DocumentStatus,
  NotificationType,
  PriorityLevel,
  SpendCategory,
  UserRole,
  VendorStatus,
} from './enums'

export interface User {
  id: ID
  name: string
  email: string
  role: UserRole
  department: string
  avatarUrl?: string
  designation: string
  phone?: string
}

export interface Department {
  id: ID
  code: string
  name: string
  hodName: string
  costCenter: string
  active: boolean
}

export interface Store {
  id: ID
  code: string
  name: string
  location: string
  inchargeName: string
  active: boolean
}

export interface Vendor {
  id: ID
  code: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  city: string
  gstin: string
  category: SpendCategory[]
  status: VendorStatus
  rating: number
  onTimeDeliveryRate: number
  totalOrders: number
  totalSpend: number
  paymentTerms: string
  leadTimeDays: number
  createdAt: ISODateString
}

export interface Item {
  id: ID
  code: string
  name: string
  category: SpendCategory
  unit: string
  brand?: string
  store: string
  currentRate: number
  mrp: number
  gstPercent: number
  annualConsumption: number
  reorderLevel: number
  lastRateRevisedOn?: ISODateString
  active: boolean
}

export interface ApprovalStep {
  role: UserRole
  approverName: string
  status: ApprovalStatus
  remark?: string
  actedOn?: ISODateString
}

export interface MaterialRequestLine {
  id: ID
  itemCode: string
  itemName: string
  unit: string
  quantity: number
  estimatedRate: number
}

export interface MaterialRequest {
  id: ID
  mrNo: string
  date: ISODateString
  department: string
  store: string
  requestedBy: string
  priority: PriorityLevel
  status: ApprovalStatus
  lines: MaterialRequestLine[]
  totalEstimate: number
  remark?: string
  approvals: ApprovalStep[]
}

export interface RfqVendorQuote {
  vendorId: ID
  vendorName: string
  rate: number
  responded: boolean
}

export interface RfqLine {
  itemCode: string
  itemName: string
  unit: string
  quantity: number
  quotes: RfqVendorQuote[]
}

export interface Rfq {
  id: ID
  rfqNo: string
  date: ISODateString
  store: string
  status: DocumentStatus
  dueDate: ISODateString
  vendorIds: ID[]
  lines: RfqLine[]
  createdBy: string
}

export interface ComparisonRow {
  itemName: string
  unit: string
  quantity: number
  rates: Record<string, number> // vendorName -> rate
  recommendedVendor: string
}

export interface Comparison {
  id: ID
  compNo: string
  date: ISODateString
  storeName: string
  vendors: string[]
  rows: ComparisonRow[]
  status: ApprovalStatus
  remark?: string
  recommendedVendor: string
  approvals: ApprovalStep[]
}

export interface NewMaterialLine {
  itemName: string
  unit: string
  packSize: string
  brand: string
  quantity: number
  consumption?: number
  quoteRate: number
  negotiatedRate: number
  mrp: number
  gstPercent: number
}

export interface NewMaterialRequest {
  id: ID
  formNo: string
  refNo: string
  date: ISODateString
  supplierName: string
  supplierAddress: string
  department: string
  requestedBy: string
  leadTime: string
  chargeable: ChargeableFlag
  remark?: string
  lines: NewMaterialLine[]
  status: ApprovalStatus
  approvals: ApprovalStep[]
}

export interface RateRevision {
  id: ID
  formNo: string
  date: ISODateString
  supplier: string
  brandName: string
  userDepartment: string
  chargeable: ChargeableFlag
  reason: string
  remark?: string
  preparedBy: string
  preparedDepartment: string
  itemCode: string
  itemName: string
  existingRate: number
  quotedRate: number
  revisedCostPrice: number
  differenceRatePercent: number
  existingMrp: number
  revisedMrp: number
  differenceMrpPercent: number
  lastRateRevisedOn: ISODateString
  annualConsumption: number
  status: ApprovalStatus
  approvals: ApprovalStep[]
}

export interface PurchaseOrderLine {
  itemCode: string
  itemName: string
  unit: string
  quantity: number
  rate: number
  gstPercent: number
  amount: number
}

export interface PurchaseOrder {
  id: ID
  poNo: string
  date: ISODateString
  vendorId: ID
  vendorName: string
  store: string
  department: string
  status: ApprovalStatus
  deliveryStatus: DocumentStatus
  expectedDelivery: ISODateString
  lines: PurchaseOrderLine[]
  subTotal: number
  taxTotal: number
  grandTotal: number
  terms: string
  approvals: ApprovalStep[]
}

export interface AppNotification {
  id: ID
  type: NotificationType
  title: string
  message: string
  createdAt: ISODateString
  read: boolean
  link?: string
  actor: string
}

export interface AuditLogEntry {
  id: ID
  timestamp: ISODateString
  actor: string
  role: UserRole
  action: string
  entity: string
  entityRef: string
  details: string
  ip: string
}

export interface ActivityItem {
  id: ID
  actor: string
  action: string
  target: string
  timestamp: ISODateString
  status: ApprovalStatus
}
