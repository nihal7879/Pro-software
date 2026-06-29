import { departments, stores } from '@/mocks/departments'
import { items } from '@/mocks/items'
import { vendors } from '@/mocks/vendors'
import { ChargeableFlag, PriorityLevel, SpendCategory, type SelectOption } from '@/types'

export const departmentOptions: SelectOption[] = departments.map((d) => ({ label: d.name, value: d.name }))
export const storeOptions: SelectOption[] = stores.map((s) => ({ label: s.name, value: s.name }))
export const vendorOptions: SelectOption[] = vendors.map((v) => ({
  label: v.name,
  value: v.id,
  description: `${v.city} · ${v.code}`,
}))
export const itemOptions: SelectOption[] = items.map((i) => ({
  label: i.name,
  value: i.name,
  description: i.code,
}))

/** Which store serves each department — used for cascading dropdowns. */
export const departmentStoreMap: Record<string, string> = {
  Histopathology: 'Lab Store',
  'Operation Theatre': 'Surgical Store',
  Kitchen: 'Kitchen Store',
  'General Stores': 'General Store',
  Laboratory: 'Lab Store',
  Pharmacy: 'Pharmacy Store',
  Radiology: 'General Store',
  Maintenance: 'General Store',
}

/** Stores available for a department (falls back to all stores if unmapped). */
export function storeOptionsForDepartment(department: string): SelectOption[] {
  const store = departmentStoreMap[department]
  return store ? storeOptions.filter((o) => o.value === store) : storeOptions
}

/** Items stocked in a given store (falls back to all items if no store chosen). */
export function itemOptionsForStore(store: string): SelectOption[] {
  if (!store) return itemOptions
  return items
    .filter((i) => i.store === store)
    .map((i) => ({ label: i.name, value: i.name, description: i.code }))
}

export const categoryOptions: SelectOption[] = Object.values(SpendCategory).map((c) => ({
  label: c
    .toLowerCase()
    .replace('_', ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase()),
  value: c,
}))

export const unitOptions: SelectOption[] = [
  'pcs',
  'box',
  'vial',
  'pack',
  'pouch',
  'bag',
  'strip',
  'pc',
  'litre',
  'kg',
].map((u) => ({ label: u, value: u }))

export const priorityOptions: SelectOption[] = Object.values(PriorityLevel).map((p) => ({
  label: p.charAt(0) + p.slice(1).toLowerCase(),
  value: p,
}))

export const chargeableOptions: SelectOption[] = [
  { label: 'Chargeable', value: ChargeableFlag.Chargeable },
  { label: 'Non Chargeable', value: ChargeableFlag.NonChargeable },
  { label: 'Charges in Package', value: ChargeableFlag.ChargesInPackage },
]
