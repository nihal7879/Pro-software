import { createCrudStore } from './createCrudStore'
import { rfqs } from '@/mocks/rfqs'
import type { Rfq } from '@/types'

export const useRfqStore = createCrudStore<Rfq>('procura.rfqs', rfqs)
