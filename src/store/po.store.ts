import { createCrudStore } from './createCrudStore'
import { purchaseOrders } from '@/mocks/purchaseOrders'
import type { PurchaseOrder } from '@/types'

export const usePoStore = createCrudStore<PurchaseOrder>('procura.purchaseOrders', purchaseOrders)
