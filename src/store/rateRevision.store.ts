import { createCrudStore } from './createCrudStore'
import { rateRevisions } from '@/mocks/rateRevisions'
import type { RateRevision } from '@/types'

export const useRateRevisionStore = createCrudStore<RateRevision>('procura.rateRevisions', rateRevisions)
