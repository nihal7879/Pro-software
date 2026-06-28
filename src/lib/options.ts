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
