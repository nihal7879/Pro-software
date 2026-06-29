import { createCrudStore } from './createCrudStore'
import { items } from '@/mocks/items'
import { vendors } from '@/mocks/vendors'
import { departments, stores } from '@/mocks/departments'
import type { Department, Item, Store, Vendor } from '@/types'

export const useItemStore = createCrudStore<Item>('procura.items', items)
export const useVendorStore = createCrudStore<Vendor>('procura.vendors', vendors)
export const useDepartmentStore = createCrudStore<Department>('procura.departments', departments)
export const useStoreStore = createCrudStore<Store>('procura.stores', stores)
