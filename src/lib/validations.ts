import { z } from 'zod'
import { ChargeableFlag, PriorityLevel, SpendCategory, VendorStatus } from '@/types'

export const itemSchema = z.object({
  code: z.string().min(2, 'Item code is required'),
  name: z.string().min(3, 'Item name must be at least 3 characters'),
  category: z.nativeEnum(SpendCategory, { message: 'Select a category' }),
  unit: z.string().min(1, 'Unit is required'),
  brand: z.string().optional(),
  store: z.string().min(1, 'Select a store'),
  currentRate: z.coerce.number().min(0, 'Rate must be positive'),
  mrp: z.coerce.number().min(0, 'MRP must be positive'),
  gstPercent: z.coerce.number().min(0).max(28, 'GST cannot exceed 28%'),
  annualConsumption: z.coerce.number().min(0),
  reorderLevel: z.coerce.number().min(0),
})
export type ItemFormValues = z.infer<typeof itemSchema>

export const vendorSchema = z.object({
  name: z.string().min(3, 'Vendor name is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  gstin: z.string().length(15, 'GSTIN must be 15 characters'),
  category: z.array(z.nativeEnum(SpendCategory)).min(1, 'Select at least one category'),
  status: z.nativeEnum(VendorStatus),
  paymentTerms: z.string().min(1, 'Payment terms required'),
  leadTimeDays: z.coerce.number().min(0),
})
export type VendorFormValues = z.infer<typeof vendorSchema>

const lineSchema = z.object({
  itemName: z.string().min(1, 'Item is required'),
  unit: z.string().min(1, 'Unit'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  estimatedRate: z.coerce.number().min(0, 'Rate'),
})

export const materialRequestSchema = z.object({
  department: z.string().min(1, 'Select a department'),
  store: z.string().min(1, 'Select a store'),
  requestedBy: z.string().min(2, 'Requester is required'),
  priority: z.nativeEnum(PriorityLevel),
  date: z.string().min(1, 'Date is required'),
  remark: z.string().optional(),
  lines: z.array(lineSchema).min(1, 'Add at least one item'),
})
export type MaterialRequestFormValues = z.infer<typeof materialRequestSchema>

export const rfqSchema = z.object({
  store: z.string().min(1, 'Select a store'),
  date: z.string().min(1, 'Date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  vendorIds: z.array(z.string()).min(1, 'Select at least one vendor'),
  notes: z.string().optional(),
})
export type RfqFormValues = z.infer<typeof rfqSchema>

const newMaterialLineSchema = z.object({
  itemName: z.string().min(1, 'Item name required'),
  unit: z.string().min(1, 'Unit'),
  packSize: z.string().min(1, 'Pack size'),
  brand: z.string().min(1, 'Brand'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  quoteRate: z.coerce.number().min(0),
  negotiatedRate: z.coerce.number().min(0),
  mrp: z.coerce.number().min(0),
  gstPercent: z.coerce.number().min(0).max(28),
})

export const newMaterialSchema = z.object({
  supplierName: z.string().min(2, 'Supplier name required'),
  supplierAddress: z.string().min(5, 'Supplier address required'),
  department: z.string().min(1, 'Select a department'),
  requestedBy: z.string().min(2, 'Requested by required'),
  leadTime: z.string().min(1, 'Lead time required'),
  chargeable: z.nativeEnum(ChargeableFlag),
  date: z.string().min(1, 'Date is required'),
  remark: z.string().optional(),
  lines: z.array(newMaterialLineSchema).min(1, 'Add at least one item'),
})
export type NewMaterialFormValues = z.infer<typeof newMaterialSchema>

export const rateRevisionSchema = z
  .object({
    supplier: z.string().min(2, 'Supplier required'),
    brandName: z.string().min(1, 'Brand name required'),
    userDepartment: z.string().min(1, 'Department required'),
    chargeable: z.nativeEnum(ChargeableFlag),
    date: z.string().min(1, 'Date is required'),
    itemCode: z.string().min(1, 'Item code required'),
    itemName: z.string().min(2, 'Item name required'),
    existingRate: z.coerce.number().min(0),
    quotedRate: z.coerce.number().min(0),
    existingMrp: z.coerce.number().min(0),
    revisedMrp: z.coerce.number().min(0),
    annualConsumption: z.coerce.number().min(0),
    reason: z.string().min(5, 'Reason is required'),
    remark: z.string().optional(),
  })
  .refine((d) => d.quotedRate >= d.existingRate, {
    message: 'Quoted rate should not be lower than existing rate',
    path: ['quotedRate'],
  })
export type RateRevisionFormValues = z.infer<typeof rateRevisionSchema>

const poLineSchema = z.object({
  itemName: z.string().min(1, 'Item required'),
  unit: z.string().min(1, 'Unit'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  rate: z.coerce.number().min(0),
  gstPercent: z.coerce.number().min(0).max(28),
})

export const purchaseOrderSchema = z.object({
  vendorId: z.string().min(1, 'Select a vendor'),
  store: z.string().min(1, 'Select a store'),
  department: z.string().min(1, 'Select a department'),
  date: z.string().min(1, 'Date is required'),
  expectedDelivery: z.string().min(1, 'Expected delivery required'),
  terms: z.string().min(1, 'Terms required'),
  lines: z.array(poLineSchema).min(1, 'Add at least one item'),
})
export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>
